import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($input: AuthLoginArgs!) {
    login(loginData: $input) {
      _id
      username
      role
      isActive
      token
      refreshToken
    }
  }
`;