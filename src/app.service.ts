import { Injectable } from '@nestjs/common';
import { InjectConfig } from 'nestjs-config';
import { Issue } from './issue/issue.entity';
import { IssueService } from './issue/issue.service';

const fetch = require('node-fetch');

@Injectable()
export class AppService {
  constructor(@InjectConfig() private readonly config, private readonly issueService: IssueService) {
    this.config = config;
  }

  async parse(): Promise<string> {
    const issues = await this.receiveData();
    const savedEntities = this.issueService.save(issues);
    return Promise.resolve(JSON.stringify(savedEntities));
  }

  receiveData(): Promise<Issue[]> {
    const beforeIssue = '';
    const beforeComment = '';
    const name = 'typeorm';
    const owner = 'typeorm';
    const accessToken = this.config.get('app.accessToken');

    const query = `
          query parssis($name: String!, $owner: String!) {
            repository(name: $name, owner: $owner) {
              issues(last: 100, ${beforeIssue}) {
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
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(res => res.json())
      .then(body => this.mapData(body.data.repository.issues.nodes));
  }

  mapData(issues: Issue[]): Promise<Issue[]> {
    return Promise.all(
      issues.map(issue => {
        const issueEntity = new Issue();
        issueEntity.id = issue.id;
        issueEntity.title = issue.title;
        issueEntity.state = issue.state;
        console.log(issueEntity);
        return issueEntity;
      })
    );
  }
}
