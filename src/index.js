import dotenv from 'dotenv';
import { DateTime } from 'luxon';

dotenv.config();

import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

async function main() {
  const { data: { login: username } } = await octokit.rest.users.getAuthenticated();

  console.log(`Hello ${username}!`);

  const searchQuery = `author:${username} committer-date:>${DateTime.now().minus({ days: 1 }).toISODate()}`;

  console.log(`Search: ${searchQuery}`);

  const { data: { items: search } } = await octokit.rest.search.commits({
    q: searchQuery,
    sort: 'committer-date',
    order: 'desc',
    headers: {
      accept: 'application/vnd.github.cloak-preview'
    }
  })
  for (const item of search) {
    console.log(`${item.author.login} - ${item.commit.author.date} - ${item.repository.name} - ${item.commit.message}`);
  }
}

main();