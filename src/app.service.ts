import { Injectable } from '@nestjs/common';
import { InjectConfig } from 'nestjs-config';
import { Issue } from './issue/issue.entity';
import { Comment } from './comment/comment.entity';
import { IssueService } from './issue/issue.service';
import { AuthorService } from './author/author.service';
import { CommentService } from './comment/comment.service';

const fetch = require('node-fetch');

@Injectable()
export class AppService {
    constructor(
        @InjectConfig() private readonly config,
        private readonly issueService: IssueService,
        private readonly authorService: AuthorService,
        private readonly commentService: CommentService
    ) {
        this.config = config;
    }

    parse(): Promise<string> {
        const frameworks = [{ name: 'typeorm', owner: 'typeorm' }];
        let beforeIssue = '';
        frameworks.forEach(async framework => {
            await this.parseFramework(framework.name, framework.owner, beforeIssue);
        });

        return Promise.resolve(JSON.stringify(beforeIssue));
    }

    async parseFramework(name: string, owner: string, beforeIssue: string) {
        const body: any = await this.receiveData(name, owner, beforeIssue);

        let nextBeforeIssue = await this.saveIssues(body.data.repository.issues);

        if (beforeIssue !== nextBeforeIssue) {
            await this.parseFramework(name, owner, nextBeforeIssue);
        }
    }

    async receiveData(name: string, owner: string, beforeIssue: string): Promise<string> {
        let beforeIssueString: string = '';

        if (beforeIssue) {
            beforeIssueString = 'before: "' + beforeIssue + '"';
        }

        const query = `
          query parssis($name: String!, $owner: String!) {
            repository(name: $name, owner: $owner) {
              issues(last: 100, ${beforeIssueString}) {
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

    async saveIssues(issues: any): Promise<string> {
        const issuesEntity = await this.mapIssues(issues.nodes);

        await this.issueService.save(issuesEntity);

        return issues.edges[0].cursor;
    }

    async mapIssues(issues: any[]): Promise<Issue[]> {
        return Promise.all(
            issues.map(async issue => {
                const issueEntity = await this.issueService.create(issue);

                issueEntity.author = await this.authorService.create(issue.author);
                issueEntity.commentsCount = issue.comments.totalCount;
                issueEntity.comments = await this.mapComments(issue.comments.nodes);

                return issueEntity;
            })
        );
    }

    async mapComments(comments: any[]): Promise<Comment[]> {
        return Promise.all(
            comments.map(async comment => {
                const authorEntity = await this.authorService.create(comment.author);
                const commentEntity = await this.commentService.create(comment);

                commentEntity.author = authorEntity;

                return commentEntity;
            })
        );
    }
}
