import { Injectable } from '@nestjs/common';
import { InjectConfig } from 'nestjs-config';
import { Issue } from './issue/issue.entity';
import { Comment } from './comment/comment.entity';
import { IssueService } from './issue/issue.service';
import { AuthorService } from './author/author.service';
import { CommentService } from './comment/comment.service';
import { Author } from './author/author.entity';
import { RepoService } from './repo/repo.service';
import { RepoOwnerService } from './repo-owner/repo-owner.service';
import to from 'await-to-js';

const fetch = require('node-fetch');
const translate = require('@vitalets/google-translate-api');

@Injectable()
export class AppService {
    constructor(
        @InjectConfig() private readonly config,
        private readonly issueService: IssueService,
        private readonly authorService: AuthorService,
        private readonly commentService: CommentService,
        private readonly repoService: RepoService,
        private readonly repoOwnerService: RepoOwnerService
    ) {
        this.config = config;
    }

    parse(): Promise<string> {
        const frameworks = [{ name: 'typeorm', owner: 'typeorm' }];
        let beforeIssue = '';
        frameworks.forEach(async framework => {
            await this.parseFramework(framework.name, framework.owner, beforeIssue);
        });

        return Promise.resolve('done');
    }

    async translate(): Promise<string> {
        const issues = await this.issueService.findUntranslated(10);

        let titleString = '';
        issues.forEach(x => {
            titleString += x.title + ' *$^$* ';
        });

        let bodyString = '';
        issues.forEach(x => {
            bodyString += x.bodyHTML + ' *$^$* ';
        });

        let commentsString = '';
        issues.forEach(issue => {
            issue.comments.forEach(x => {
                commentsString += x.bodyHTML + ' *$#$* ';
            });
            commentsString += ' *$^$* ';
        });

        const ruTitles = await this.translateString(titleString);
        const ruBodies = await this.translateString(bodyString);
        const ruCommentsBodies = await this.translateString(commentsString);

        const ruTitlesAr = ruTitles.split('* $ ^ $ *');
        const ruBodiesAr = ruBodies.split('* $ ^ $ *');
        const ruComments = ruCommentsBodies.split('* $ ^ $ *');
        const ruCommentsAr = ruComments.map(issue => {
            return issue.split('* $ # $ *');
        });

        const translatedIssues = Promise.all(
            issues.map(async (issue, IssueIndex) => {
                issue.titleRu = ruTitlesAr[IssueIndex];
                issue.bodyHTMLRu = ruBodiesAr[IssueIndex];
                const comments = await this.commentService.findAllByIssue(issue);
                issue.comments = comments.map((comment, commentIndex) => {
                    comment.bodyHTMLRu = ruCommentsAr[IssueIndex][commentIndex];
                    return comment;
                });
                return issue;
            })
        );

        //const translatedIssues = await this.translateIssues(issues);

        await this.issueService.save(translatedIssues);

        return Promise.resolve('done');
    }

    async translateString(issues: string): Promise<string> {
        let err, res;
        [err, res] = await to(translate(issues, { from: 'en', to: 'ru' }));
        if (!err) {
            console.log(res.text);
            return res.text;
        } else {
            console.error(err);
            throw err;
        }
    }

    async translateIssues(issues: Issue[]): Promise<Issue[]> {
        let err, res;
        return Promise.all(
            issues.map(async issue => {
                [err, res] = await to(translate(issue.title, { from: 'en', to: 'ru' }));
                if (!err) {
                    console.log(res.text);
                    issue.titleRu = res.text;
                    issue.translated = true;
                } else {
                    console.error(err);
                }
                return issue;
            })
        );
    }

    async parseFramework(name: string, owner: string, beforeIssue: string) {
        const body: any = await this.receiveData(name, owner, beforeIssue);

        let nextBeforeIssue = await this.saveIssues(body.data.repository);

        if (nextBeforeIssue && beforeIssue !== nextBeforeIssue) {
            //setTimeout(async () => {
            await this.parseFramework(name, owner, nextBeforeIssue);
            //}, 10000);
        }
    }

    async receiveData(name: string, owner: string, beforeIssue: string): Promise<string> {
        let beforeIssueString: string = '';

        if (beforeIssue) {
            beforeIssueString = 'before: "' + beforeIssue + '",';
        }

        const query = `
          query parssis($name: String!, $owner: String!) {
            repository(name: $name, owner: $owner) {
             createdAt
             description
             descriptionHTML
             homepageUrl
             id
             name
             nameWithOwner
             openGraphImageUrl
             url
             updatedAt
             owner{
               id
               login
             }
             issues(last: 100, ${beforeIssueString} orderBy: {field: CREATED_AT, direction: ASC}) {
                edges {
                  cursor
                }
                totalCount
                nodes {
                  id
                  createdAt
                  closedAt
                  closed
                  lastEditedAt
                  updatedAt
                  author {
                    ...authorFields
                  }
                  state
                  title
                  bodyHTML
                  comments(last: 100) {
                    edges {
                      cursor
                    }
                    totalCount
                    nodes {
                      id
                      createdAt
                      lastEditedAt
                      updatedAt
                      author {
                        ...authorFields
                      }
                      bodyHTML
                    }
                  }
                }
              }
            }
          }
          fragment authorFields on Actor {
            login
            typename: __typename
            avatarUrl
            resourcePath
            url
          }
        `;

        return fetch('https://api.github.com/graphql', {
            method: 'POST',
            body: JSON.stringify({
                query: query,
                variables: {
                    name: name,
                    owner: owner
                }
            }),
            headers: {
                Authorization: `Bearer ${this.config.get('app.accessToken')}`
            }
        }).then(res => res.json());
    }

    async saveIssues(repository: any): Promise<string> {
        const repo = await this.repoService.create(repository);
        const repoOwner = await this.repoOwnerService.create(repository.owner);
        repo.owner = repoOwner;

        if (repository.issues.nodes.length) {
            const issuesEntity = await this.mapIssues(repository.issues.nodes, repo);

            await this.issueService.save(issuesEntity);

            return repository.issues.edges[0].cursor;
        }
        return null;
    }

    async mapIssues(issues: any[], repo): Promise<Issue[]> {
        return Promise.all(
            issues.map(async issue => {
                const issueEntity = await this.issueService.create(issue);

                if (issue.author) {
                    issueEntity.author = await this.authorService.create(issue.author);
                } else {
                    issueEntity.author = new Author().returnGhost();
                }
                issueEntity.commentsCount = issue.comments.totalCount;
                issueEntity.repo = repo;

                if (issue.comments.nodes.length) {
                    issueEntity.comments = await this.mapComments(issue.comments.nodes);
                }

                return issueEntity;
            })
        );
    }

    async mapComments(comments: any[]): Promise<Comment[]> {
        return Promise.all(
            comments.map(async comment => {
                const commentEntity = await this.commentService.create(comment);

                if (comment.author) {
                    commentEntity.author = await this.authorService.create(comment.author);
                } else {
                    commentEntity.author = new Author().returnGhost();
                }

                return commentEntity;
            })
        );
    }
}
