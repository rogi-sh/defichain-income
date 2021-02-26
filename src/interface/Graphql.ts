import {gql} from 'apollo-angular';

export const GEN_AUTH_KEY = gql`
  query { getAuthKey
  }
`;
