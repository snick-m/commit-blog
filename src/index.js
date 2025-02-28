import dotenv from 'dotenv';

dotenv.config();

import { DateTime } from 'luxon';
import { Octokit } from 'octokit';
import { inspect } from 'util';

import OpenAI from 'openai';

import actions from './actions.js';

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

const gpt = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function main() {
  const { data: { login: username } } = await octokit.rest.users.getAuthenticated();
  const searchQuery = `author:${username} committer-date:>${DateTime.now().minus({ days: 5 }).toISODate()}`;

  console.log(`Hello ${username} 👋`);
  console.log(`🔎 Searching with: ${searchQuery}`);

  const { data: { items: search } } = await octokit.rest.search.commits({
    q: searchQuery,
    sort: 'committer-date',
    order: 'desc',
    headers: {
      accept: 'application/vnd.github.cloak-preview'
    }
  })

  let userPrompt = search.map(item => `${item.node_id}: ${item.commit.message} - ${item.repository.full_name} @ ${item.commit.author.date}`).join('\n');
  const action = actions.findTopic;

  console.log("\n👤 User Prompt:-");
  console.log(userPrompt);

  console.log("\n🔗 Querying GPT-4o for response...");

  const completion = await gpt.chat.completions.create({
    model: "gpt-4o-2024-11-20",
    messages: [
      { role: "developer", content: action.prompt },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    response_format: action.responseFormat,
    store: true,
  });

  console.log("\n1️⃣ Completions First Choice (often the only one):-")
  console.log(inspect(JSON.parse(completion.choices[0].message.content), false, null, true));

  console.log("\n🙋‍♂️ Aight, bye!");
}

main();