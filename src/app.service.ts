import { Injectable } from '@nestjs/common';
import { InjectConfig } from 'nestjs-config';
import { Issue } from './issue/issue.entity';
import { IssueService } from './issue/issue.service';
import { Author } from './author/author.entity';
import { AuthorService } from './author/author.service';

const fetch = require('node-fetch');

@Injectable()
export class AppService {
    constructor(
        @InjectConfig() private readonly config,
        private readonly issueService: IssueService,
        private readonly authorService: AuthorService
    ) {
        this.config = config;
    }

    async parse(): Promise<string> {
        const issues = await this.receiveData('typeorm', 'typeorm');

        return Promise.resolve(JSON.stringify(issues));
    }

    receiveData(name: string, owner: string): Promise<Issue[]> {
        const beforeIssue = '';
        const beforeComment = '';

        const query = `
          query parssis($name: String!, $owner: String!) {
            repository(name: $name, owner: $owner) {
              issues(last: 1, ${beforeIssue}) {
                edges {
                  cursor
                }
                nodes {
                  id
                  createdAt
                  closedAt
                  closed
                  lastEditedAt
                  author {
                    login
                    __typename
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
                        login
                        __typename
                      }
                      bodyHTML
                    }
                  }
                }
              }
            }
          }`;

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
        })
            .then(res => res.json())
            .then(body => this.mapData(body.data.repository.issues.nodes));
    }

    mapData(issues: Issue[]): Promise<Issue[]> {
        return Promise.all(
            issues.map(async issue => {
                const issueEntity = new Issue();

                //const authorEntity = new Author();
                // authorEntity.avatarUrl = issue.author.avatarUrl;
                // authorEntity.login = issue.author.login;
                // authorEntity.resourcePath = issue.author.resourcePath;
                // authorEntity.typename = issue.author.typename;
                //authorEntity.url = issue.author.url;
                const authorEntity = await this.authorService.create(issue.author);

                await this.authorService.save(authorEntity);

                issueEntity.id = issue.id;
                issueEntity.title = issue.title;
                issueEntity.state = issue.state;
                issueEntity.createdAt = issue.createdAt;
                issueEntity.closedAt = issue.closedAt;
                issueEntity.closed = issue.closed;
                issueEntity.lastEditedAt = issue.lastEditedAt;

                issueEntity.author = authorEntity;

                await this.issueService.save(issueEntity);

                console.log(issueEntity);

                return issueEntity;
            })
        );
    }
}
