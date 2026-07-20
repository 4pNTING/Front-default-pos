import type { CodegenConfig } from '@graphql-codegen/cli';

/**
 * GraphQL Code Generator Configuration
 *
 * อ่าน GraphQL Schema จาก API Gateway (introspection)
 * แล้ว generate TypeScript types + React hooks จาก query/mutation files
 * ที่อยู่ใน src/gql/queries/
 *
 * Output จะถูกวางไว้ที่ src/gql/models/
 *
 * วิธีรัน: npm run gen-code
 * (ต้องรัน dev server ให้ API Gateway พร้อมก่อน)
 */

const config: CodegenConfig = {
  // ══════════════════════════════════════════════════
  // Schema: อ่าน schema จาก GraphQL endpoint ที่รันอยู่
  // ══════════════════════════════════════════════════
  schema: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api-gateway',

  // ══════════════════════════════════════════════════
  // Documents: ไฟล์ที่มี query/mutation ที่จะ gen types
  // ══════════════════════════════════════════════════
  documents: ['src/gql/queries/**/*.ts', 'src/gql/queries/**/*.tsx'],

  // ══════════════════════════════════════════════════
  // Generate: ตั้งค่า output
  // ══════════════════════════════════════════════════
  generates: {
    './src/gql/models/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },

  // ไม่ throw error ถ้าไม่มี document files
  ignoreNoDocuments: true,

  // Overwrite ไฟล์เดิมทุกครั้งที่ generate
  overwrite: true,
};

export default config;