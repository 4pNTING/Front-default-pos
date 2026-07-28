# Front-default-pos - รายละเอียดเทคนิคและโครงสร้างโปรเจกต์

เอกสารนี้สรุปภาพรวมทางเทคนิคของโปรเจกต์ `Front-default-pos` สำหรับใช้อ้างอิงเวลาพัฒนา แก้ไข deploy หรือส่งต่อให้ทีมอื่นดูแลต่อ

## ภาพรวมโปรเจกต์

`Front-default-pos` เป็น frontend web application สำหรับระบบ POS / management dashboard พัฒนาด้วย Next.js App Router ใช้ React, Material UI, Apollo GraphQL, NextAuth และ Zustand/Redux สำหรับ state management บางส่วน

ระบบรองรับหลายภาษา โดย route หลักจะอยู่ภายใต้ locale เช่น:

- `/la/dashboard`
- `/la/customer`
- `/la/category`
- `/la/zone`
- `/en/dashboard`

## Tech Stack

### Framework และ Runtime

- Next.js `14.2.35`
- React `18.3.1`
- TypeScript `5.4.5`
- Node.js `20` สำหรับ Docker runtime

### UI และ Styling

- Material UI `@mui/material`
- MUI Data Grid
- Tailwind CSS
- Emotion
- Template base: Vuexy MUI Next.js Admin Template
- Icon system: Tabler/Iconify CSS bundle

### Authentication

- NextAuth `4.24.15`
- Credentials Provider
- Google Provider ถูก config ไว้ แต่ต้องมี `GOOGLE_CLIENT_ID` และ `GOOGLE_CLIENT_SECRET`
- Session strategy: JWT
- Auth payload หลักเก็บใน `session.user` และ `session.authorization`

### API และ Data Layer

- Apollo Client
- GraphQL Code Generator
- Backend endpoint อ่านจาก:
  - Server side: `API_URL`
  - Client side: `NEXT_PUBLIC_API_URL`
- Upload/download file ผ่าน proxy route ภายในแอป:
  - `POST /api/upload`
  - `GET /api/upload?url=...`

### State Management

- Zustand ใช้ใน feature store เช่น customer, category, zone, role
- Redux Toolkit ยังมีอยู่สำหรับ slice template เช่น calendar/chat/email/kanban

### Database / Prisma

- Prisma ถูก config ไว้ที่ `src/prisma/schema.prisma`
- มี SQLite dev database ที่ `src/prisma/dev.db`
- NextAuth Prisma adapter ถูกติดตั้งไว้ แต่โปรเจกต์ปัจจุบันใช้ JWT session เป็นหลัก

### Build และ Deploy

- Dockerfile ใช้ `node:20`
- Nginx reverse proxy อยู่ใน `nginx.conf`
- Docker Compose service หลัก:
  - `frontend-pos`
  - `frontend-pos-nginx`

## Scripts สำคัญ

อยู่ใน `package.json`

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run gen-code
npm run build:icons
npm run prisma-generate
```

### คำอธิบายสั้น ๆ

- `dev`: เปิด dev server port `9882`
- `build`: build production ด้วย Next.js
- `start`: build แล้ว start production server ที่ port `9064`
- `lint`: ตรวจ lint ด้วย Next lint
- `gen-code`: generate GraphQL types/documents
- `build:icons`: build Iconify CSS bundle
- `prisma-generate`: generate Prisma client จาก schema

## Environment Variables

ตัวอย่างอยู่ที่ `.env.example`

```env
BASEPATH=
NEXT_PUBLIC_APP_URL=http://localhost:3000${BASEPATH}
NEXT_PUBLIC_DOCS_URL=https://demos.pixinvent.com/vuexy-nextjs-admin-template/documentation

NEXTAUTH_BASEPATH=${BASEPATH}/api/auth
NEXTAUTH_URL=http://localhost:3000${BASEPATH}/api/auth
NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DATABASE_URL=

API_URL=http://192.168.100.35:20184/api-gateway
NEXT_PUBLIC_API_URL=${API_URL}

FILE_SERVICE_BASE_URL=https://files.laoworld.la
UPLOAD_BACKEND_KEY=
UPLOAD_PLATFORM_KEY=
```

### หมายเหตุเรื่อง Upload Key

ไม่ควรใช้ key ผ่าน `NEXT_PUBLIC_UPLOAD_BACKEND_KEY` หรือ `NEXT_PUBLIC_UPLOAD_PLATFORM_KEY` ใน client อีกต่อไป เพราะตัวแปรที่ขึ้นต้นด้วย `NEXT_PUBLIC_` จะถูก bundle ไปที่ browser ได้

ให้ใช้:

- `UPLOAD_BACKEND_KEY`
- `UPLOAD_PLATFORM_KEY`
- `FILE_SERVICE_BASE_URL`

แล้วให้ client เรียกผ่าน `/api/upload` เท่านั้น

## Authentication Flow

ไฟล์หลัก:

- `src/libs/auth.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/hocs/AuthGuard.tsx`
- `src/hocs/GuestOnlyRoute.tsx`
- `src/views/Login.tsx`

### Flow โดยรวม

1. ผู้ใช้กรอก username/password ที่หน้า login
2. `signIn("credentials")` เรียก NextAuth
3. `src/libs/auth.ts` ส่ง GraphQL `LOGIN_MUTATION` ไป backend
4. backend ส่ง user data, token, refreshToken กลับมา
5. NextAuth เก็บ token ใน JWT session
6. Private layout ใช้ `AuthGuard` ตรวจ session
7. Apollo Client แนบ `Authorization: Bearer <token>` ให้ request GraphQL

## Upload / Download Flow

ไฟล์หลัก:

- `src/app/api/upload/route.ts`
- `src/utils/fileUploadService.ts`
- `src/@core/components/custom-inputs/UploadFile.tsx`
- `src/@core/components/custom-inputs/Attachment.tsx`

### Upload

Client เรียก helper:

```ts
const fileUrl = await uploadFile({
  file,
  ownerId,
  ownerType,
  uploadType: getFileUploadType(file),
  dic,
})
```

helper จะยิงไป:

```http
POST /api/upload
```

จากนั้น route ฝั่ง server จะอ่าน:

- session token จาก NextAuth
- `UPLOAD_BACKEND_KEY`
- `UPLOAD_PLATFORM_KEY`
- `FILE_SERVICE_BASE_URL`

แล้วค่อยส่งต่อไป file service จริง

### Download

Client เรียก:

```ts
fetch(`/api/upload?url=${encodeURIComponent(fileUrl)}`)
```

หรือใช้ `Attachment` component เดิมได้เลย เพราะ component ถูกแก้ให้เรียก proxy route แล้ว

## Route Structure

โปรเจกต์ใช้ Next.js App Router ภายใต้ `src/app`

```text
src/app
├── [lang]
│   ├── layout.tsx
│   ├── [...not-found]
│   │   └── page.tsx
│   ├── (dashboard)
│   │   └── (private)
│   │       ├── layout.tsx
│   │       ├── dashboard
│   │       │   └── page.tsx
│   │       ├── customer
│   │       │   └── page.tsx
│   │       ├── category
│   │       │   └── page.tsx
│   │       ├── zone
│   │       │   └── page.tsx
│   │       ├── home
│   │       │   └── page.tsx
│   │       └── language
│   │           └── page.tsx
│   └── (blank-layout-pages)
│       ├── layout.tsx
│       └── (guest-only)
│           ├── layout.tsx
│           ├── login
│           │   └── page.tsx
│           ├── register
│           │   └── page.tsx
│           └── forgot-password
│               └── page.tsx
├── api
│   ├── auth
│   │   └── [...nextauth]
│   │       └── route.ts
│   ├── upload
│   │   └── route.ts
│   ├── login
│   │   └── route.ts
│   ├── apps
│   └── pages
├── globals.css
└── favicon.ico
```

## Project Folder Structure

```text
src
├── @core
│   ├── components
│   ├── contexts
│   ├── hooks
│   ├── styles
│   ├── svg
│   ├── tailwind
│   ├── theme
│   ├── types.ts
│   └── utils
├── @layouts
│   ├── components
│   ├── styles
│   ├── utils
│   ├── BlankLayout.tsx
│   ├── LayoutWrapper.tsx
│   └── VerticalLayout.tsx
├── @menu
│   ├── components
│   ├── contexts
│   ├── hooks
│   ├── styles
│   ├── svg
│   ├── utils
│   └── vertical-menu
├── app
│   ├── [lang]
│   ├── api
│   ├── globals.css
│   └── server
├── assets
│   ├── iconify-icons
│   └── svg
├── components
│   ├── alert
│   ├── card-statistics
│   ├── common
│   ├── dialogs
│   ├── layout
│   ├── loading
│   ├── pricing
│   └── theme
├── configs
│   ├── app-routes.config.ts
│   ├── i18n.ts
│   ├── primaryColorConfig.ts
│   └── themeConfig.ts
├── contexts
├── data
│   ├── dictionaries
│   ├── kpi
│   ├── mockup
│   └── navigation
├── fake-db
├── gql
│   ├── ApolloWrapper.tsx
│   ├── models
│   └── queries
├── hocs
├── hooks
├── libs
├── modal
├── prisma
├── redux-store
├── remove-translation-scripts
├── types
├── utils
└── views
    ├── category
    ├── customer
    ├── dashboard
    ├── home
    ├── language
    ├── role
    └── zone
```

## Feature Structure Pattern

Feature หลักส่วนใหญ่จัดแบบนี้:

```text
src/views/<feature>
├── list
│   ├── components
│   │   ├── header.component.tsx
│   │   ├── table.component.tsx
│   │   ├── formCreate.component.tsx
│   │   ├── formUpdate.component.tsx
│   │   └── btnOption.tsx
│   ├── <feature>List.tsx
│   └── index.tsx
├── store
│   └── <feature>Store.ts
└── type
    └── <feature>Type.ts
```

ตัวอย่าง feature:

- `src/views/customer`
- `src/views/category`
- `src/views/zone`
- `src/views/home`

## GraphQL Structure

```text
src/gql
├── ApolloWrapper.tsx
├── queries
│   ├── auth.ts
│   ├── category.ts
│   ├── customer.ts
│   ├── home.ts
│   ├── roomArea.ts
│   ├── roomAreaCategory.ts
│   └── zone.ts
└── models
    ├── graphql.ts
    ├── gql.ts
    ├── index.ts
    └── fragment-masking.ts
```

### ApolloWrapper

`src/gql/ApolloWrapper.tsx` ทำหน้าที่:

- สร้าง Apollo Client
- ตั้ง GraphQL endpoint
- แนบ Authorization header
- ตั้ง timeout
- handle GraphQL/network error บางส่วน

## Layout และ Guard

### Private Layout

ไฟล์:

```text
src/app/[lang]/(dashboard)/(private)/layout.tsx
```

ใช้สำหรับหน้าที่ต้อง login:

- dashboard
- customer
- category
- zone
- home
- language

ภายในจะครอบด้วย:

- `Providers`
- `AuthGuard`
- `ApolloWrapper`
- `VerticalLayout`
- `Navigation`
- `Navbar`
- `GlobalModalWrapper`

### Guest Layout

ไฟล์:

```text
src/app/[lang]/(blank-layout-pages)/(guest-only)/layout.tsx
```

ใช้สำหรับหน้า:

- login
- register
- forgot-password

ครอบด้วย `GuestOnlyRoute` เพื่อกันผู้ใช้ที่ login แล้วกลับไปหน้า guest

## Docker / Nginx

### Dockerfile

ขั้นตอนหลัก:

1. ใช้ `node:20`
2. copy project เข้า `/app`
3. install dependencies ด้วย `npm install --legacy-peer-deps --ignore-scripts`
4. run Prisma generate
5. build icons
6. build Next.js
7. start ด้วย `next start --port 9064`

### docker-compose.yml

Services:

- `frontend-pos`
- `nginx`

Network:

- `share-container-network`

Nginx listen ภายในที่ port `8278` แล้ว map host port `9064`

## Public Assets

```text
public
├── fonts
├── images
├── printlogos
├── next.svg
└── vercel.svg
```

มีไฟล์ภาพจำนวนมากจาก template และ asset เฉพาะระบบ เช่น logo, auth image, ecommerce demo image, avatar, illustration

## Known Notes / สิ่งที่ควรระวัง

### 1. Dependency Vulnerabilities

หลังอัปเดตบางส่วนแล้ว build ผ่าน แต่ `npm audit --omit=dev` ยังเหลือ vulnerability บางตัวที่ต้อง migration แบบ breaking เช่น:

- `jspdf`
- `valibot`
- `react-quill`
- dependency chain ของ GraphQL Codegen บางส่วน
- Next.js audit บางรายการที่แนะนำขยับ major version

ไม่ควรใช้ `npm audit fix --force` ทันทีโดยไม่ test เพราะอาจเปลี่ยน major version และทำให้โค้ดแตก

### 2. Room Area

มีร่องรอย feature `roomArea` บางส่วน เช่น query และ dictionary แต่ route/view หลักถูกลบออกแล้ว ถ้า backend ส่งเมนู `/roomArea` มา ผู้ใช้อาจเจอ 404

### 3. Multiple Lockfiles

โปรเจกต์มีหลาย lockfile:

- `package-lock.json`
- `yarn.lock`
- `pnpm-lock.yaml`

ควรเลือก package manager หลักตัวเดียวเพื่อลด dependency drift

### 4. TypeScript Strictness

`tsconfig.json` ตั้ง `strict: false` แต่มี `strictNullChecks: true` มีการใช้ `any` หลายจุด โดยเฉพาะ store, table, GraphQL integration

### 5. Template Leftovers

ยังมี fake-db, template pages, pricing/dialog/demo components หลายส่วนจาก Vuexy template ถ้าไม่ใช้จริงควรค่อย ๆ ล้างออกเพื่อลด bundle และ maintenance cost

## Development Checklist

ก่อนส่งงานหรือ deploy ควรรัน:

```bash
npm run lint
npm run build
npm audit --omit=dev
```

ถ้ามีการแก้ GraphQL schema/query:

```bash
npm run gen-code
```

ถ้ามีการแก้ icon bundle:

```bash
npm run build:icons
```

## Production Checklist

- ตั้ง `NEXTAUTH_SECRET` เป็นค่าที่ strong และไม่ซ้ำกับ dev
- ตั้ง `NEXTAUTH_URL` ให้ตรง domain จริง
- ตั้ง `API_URL` สำหรับ server side
- ตั้ง `NEXT_PUBLIC_API_URL` เฉพาะ endpoint ที่ browser ต้องเรียกจริง
- ตั้ง `UPLOAD_BACKEND_KEY` และ `UPLOAD_PLATFORM_KEY` เป็น server-only env
- หลีกเลี่ยง `NEXT_PUBLIC_*` สำหรับ secret ทุกชนิด
- ตรวจว่า Docker Compose ไม่ mount source code ทับ production build
- ตรวจ Nginx upstream ให้ตรง container name และ port
- รัน `npm run build` ใน environment ใกล้เคียง production

