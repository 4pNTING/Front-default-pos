// // Third-party Imports
// import CredentialProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";
// import type { LoginData, TokenData, NextAuthOptions, UserLoginData, } from "next-auth";
// import type { Adapter } from "next-auth/adapters";

// import { MMS_AUTHORIZATION } from "@/gql/queries/auth";
// const prisma = new PrismaClient();
// // API Configuration with fallback
// const urlLaoWorld = process.env.NEXT_PUBLIC_API_URL;

// const loginQuery = `
//   query Login($input: LoginDto!) {
//     login(input: $input) {
//       _id
//       token
//       refreshToken
//     }
//   }
// `;

// // Old queries - ไม่ใช้แล้ว
// // const loadUserDetailQuery = `...`;
// // const loginMutation = `...`;

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma) as Adapter,
//   providers: [
//     CredentialProvider({
//       name: "Credentials",
//       type: "credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         const { username, password } = credentials as {
//           username: string;
//           password: string;
//         };
//         // console.log(`---, username`, username);
//         // console.log(`--- password`, password);
//         // console.log(`API URL::`, urlLaoWorld);

//         if (!urlLaoWorld) {
//           throw new Error("API URL is not configured");
//         }

//         try {
//           console.log(`:::::`, urlLaoWorld)
//           const t = {
//             input: {
//               userName: username,
//               password: password,
//             }
//           }
//           console.log(`:::::`, t)
//           // Step 1: Login with new Login query
//           let response = await fetch(urlLaoWorld, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               platform: "mms_svc",
//             },
//             body: JSON.stringify({
//               query: loginQuery,
//               variables: {
//                 input: {
//                   userName: username,
//                   password: password,
//                 },
//               },
//             }),
//           });

//           let result = await response.json();
//           console.log(`:::: login`, result);

//           // ตรวจสอบว่า login สำเร็จและได้ token
//           if (!result.data?.login?.token)
//             throw new Error("Invalid credentials");

//           const { _id, token, refreshToken } = result.data.login;
//           console.log(`Login successful:`, { _id, token, refreshToken });

//           // Return user data with new token format
//           return {
//             id: _id || username,
//             user: {
//               prefix: username,
//               username: username,
//               fNameLa: "",
//               lNameLa: "",
//               fNameEn: "",
//               lNameEn: "",
//               level: "",
//               business: null,
//             },
//             authorization: token,
//             token: token,
//             refreshToken: refreshToken,
//             userId: _id,
//           };
//         } catch (e: any) {
//           throw new Error(e.message);
//         }
//       },
//     }),

//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // ** 30 days
//   },

//   pages: {
//     signIn: "/login",
//   },

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         var usrs: LoginData = user as LoginData;
//         token.user = usrs.user;
//         token.authorization = usrs.authorization;

//         if (urlLaoWorld && usrs.authorization) {
//           try {
//             const authRes = await fetch(urlLaoWorld, {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 platform: "mms_svc",
//                 Authorization: `Bearer ${usrs.authorization}`,
//               },
//               body: JSON.stringify({
//                 query: MMS_AUTHORIZATION,
//               }),
//             });

//             const authResult = await authRes.json();
//             const userData = authResult?.data?.mmsAuthorization?.user;

//             if (userData) {
//               if (token.user) {
//                 // Map level from mmsAuthorization
//                 if (userData.level) {
//                   token.user.buId = userData.buId;
//                   token.user.empId = userData.empId;
//                   token.user.level = userData.level;
//                 }

//                 console.log("::: User Level Fetched & Assigned :::", {
//                   level: userData.level,
//                 });
//               }
//             }
//           } catch (error) {
//             console.log("Error fetching user level:", error);
//           }
//         }
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       var tkn: TokenData = token as TokenData;
//       session.user = tkn.user;
//       session.authorization = tkn.authorization;

//       return session;
//     },
//   },
// };
