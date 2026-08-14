// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   basePath: process.env.BASEPATH,
//   redirects: async () => {
//     return [
//       {
//         source: '/',
//         destination: '/la/dashboard',
//         permanent: true,
//         locale: false
//       },
//       {
//         source: '/:lang(la|en)',
//         destination: '/:lang/dashboard',
//         permanent: true,
//         locale: false
//       },
//       {
//         source: '/((?!(?:en|fr|ar|front-pages|favicon.ico)\\b)):path',
//         destination: '/la/:path',
//         permanent: true,
//         locale: false
//       }
//     ]
//   }
// }

// export default nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.BASEPATH,
  env: {
    API_URL: process.env.API_URL,
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/la/dashboard",
        permanent: false,
        locale: false,
      },
      {
        source: "/:lang(la|en)",
        destination: "/:lang/dashboard",
        permanent: false,
        locale: false,
      },
      // {
      //   source: "/((?!(?:en|fr|ar|front-pages|favicon.ico)\\b)):path",
      //   destination: "/la/:path",
      //   permanent: true,
      //   locale: false,
      // },
      {
        source: "/((?!(?:en|fr|ar|front-pages|favicon.ico|wallet)\\b)):path",
        destination: "/la/:path",
        permanent: false,
        locale: false,
      },
    ];
  },
};

export default nextConfig;
