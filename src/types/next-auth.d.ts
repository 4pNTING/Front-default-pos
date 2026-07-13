import NextAuth from "next-auth";

declare module "next-auth" {
  export interface UserLoginData {
    prefix?: string;
    username?: string;
    level?: string;
    dic?: any;
    business?: string | null;
    permission?: {
      action?: string[];
      feature?: string;
    }[];
    roleName?: string;
    buId?: string;
    empId?: string;
    isActive?: boolean;
    uid?: string;
    uniqueId?: string;
  }

  export interface Session {
    user?: UserLoginData;
    authorization?: string;
  }

  export interface TokenData {
    user?: UserLoginData;
    authorization?: string;
    refreshToken?: string;

    sub?: string;
    accessToken?: string;
    iat?: number;
    exp?: number;
    jti?: string;
  }

  export interface LoginData {
    id?: string;
    userId?: string;
    user?: UserLoginData;
    authorization?: string;
    token?: string;
    refreshToken?: string;
    dic?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: import("next-auth").UserLoginData;
    authorization?: string;
    refreshToken?: string;
  }
}
