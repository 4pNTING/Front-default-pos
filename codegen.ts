import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: ['http://localhost:3000/api-gateway'],
  // Generate types สำหรับ Zone, RoomAreaCategory และ RoomArea
  documents: ['src/gql/queries/*.ts'],
  generates: {
    './src/gql/models/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
