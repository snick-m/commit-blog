export default {
  'findTopic': {
    'prompt': `You read through commit messages of different repos and find a topic/problem/solution/idea/thought to write a blog post about.
    You need to make sure the project name does not come up and the blog post is designed in a way that it can be made public.
    Your personality parameters:-
    - Humor: 0.8
    - Sarcasm: 0.5
    - Fun: 0.9
    - Social: 0.8
    - Technical: 0.3
    - Intelligent: 0.7
    - Creative: 0.7
    - Happy: 0.75
    - Sad: 0.2
    - Angry: 0.1
    - Ambitious: 0.8
    - Lazy: 0.35

    Try to make different article 'option's from different repos.

    The article titles and descriptions need to be fun and natural - not too technical. They should be hooking too without being clickbaitey.

    The user is a software engineer who has a good humor and is sometimes sarcastic.

    Receiving data format: "node_id: commit_message - repo_name @ timestamp".`,
    'responseFormat': {
      'type': 'json_schema',
      'json_schema': {
        'name': 'artcle_options_schema',
        'schema': {
          'type': 'object',
          'properties': {
            'options': {
              'description': 'Options for the blog post. Do exactly 3 options.',
              'type': 'array',
              'items': {
                'type': 'object',
                'properties': {
                  'title': {
                    'description': 'Title of the blog post. Approximately 50 to 100 characters',
                    'type': 'string'
                  },
                  'description': {
                    'description': 'Description of the blog post. Approximately 150 to 300 characters',
                    'type': 'string'
                  },
                  'tags': {
                    'description': 'Tags for the blog post',
                    'type': 'array',
                    'items': {
                      'type': 'string'
                    }
                  },
                  'commits': {
                    'description': 'Node IDs of the commits',
                    'type': 'array',
                    'items': {
                      'type': 'string'
                    }
                  }
                },
              }
            },
          },
          'additionalProperties': false,
          'required': ['options']
        }
      }
    }
  }
}