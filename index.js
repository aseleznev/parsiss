var fetch = require("node-fetch");

// получи на github->settings->developer settings->personal access tokens->generate (без галочек)
var accessToken = "";

var name = "typeorm";
var owner = "typeorm";

var query = `
query parssis($name: String!, $owner: String!) {
  repository(name: $name, owner: $owner) {
    issues(last: 1) {
      nodes {
        bodyHTML
      }
    }
  }
}
`;

extract();

function extract() {
  fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: query,
      variables: {
        name: name,
        owner: owner
      }
    }),
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })
    .then(res => res.json())
    .then(body => saveIssues(body))
    .catch(error => console.error(error));
}

function saveIssues(body) {

  console.log(body.data.repository.issues.nodes[0]);
}
