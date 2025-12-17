import {defineConfig} from 'orval';

export default defineConfig({
  bucket: {
    input: {
      target: `https://dev-bucket-admin.mjkompany.com/api-docs/api`,
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/generated',
      schemas: 'src/api/models',
      client: 'react-query',
      mock: false,
      httpClient: 'fetch',
      override: {
        mutator: {
          path: './src/api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
  },
});

