import { Injectable } from '@nestjs/common';
import { InjectConfig } from 'nestjs-config';
import { Issue } from './issue/issue.entity';
import { IssueService } from './issue/issue.service';
import { Author } from './author/author.entity';
import { AuthorService } from './author/author.service';
import { CommentService } from './comment/comment.service';
import { Comment } from './comment/comment.entity';

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

    async parse(): Promise<string> {
        const body: any = await this.receiveData('typeorm', 'typeorm');
        const beforeIssue = this.saveIssues(body.data.repository.issues);

        return Promise.resolve(JSON.stringify(beforeIssue));
    }

    async receiveData(name: string, owner: string): Promise<string> {
        const beforeIssue = '';
        const beforeComment = '';

        const query = `
          query parssis($name: String!, $owner: String!) {
            repository(name: $name, owner: $owner) {
              issues(last: 100, ${beforeIssue}) {
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
                  comments(last: 100, ${beforeComment}) {
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

        return await fetch('https://api.github.com/graphql', {
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

        const beforeIssue = issues.edges[0];

        return beforeIssue;
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
