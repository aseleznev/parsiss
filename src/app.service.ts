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
        await this.issueService.save(issues);

        return Promise.resolve(JSON.stringify(issues));
    }

    receiveData(name: string, owner: string): Promise<Issue[]> {
        const beforeIssue = '';
        const beforeComment = '';

        const query = `
          query parssis($name: String!, $owner: String!) {
            repository(name: $name, owner: $owner) {
              issues(last: 50, ${beforeIssue}) {
                edges {
                  cursor
                }
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
                const authorEntity = await this.authorService.create(issue.author);
                const issueEntity = await this.issueService.create(issue);
                issueEntity.author = authorEntity;
                return issueEntity;
            })
        );
    }
}
