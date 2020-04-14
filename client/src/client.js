import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import gql from "graphql-tag";

/**
 * add virtual property to User
 */
const typeDefs = gql`
  extend type User {
    age: Int
    vaccinated: Boolean
  }
`;

const resolvers = {
  User: {
    age(_user, _args, _context, _info) {
      return 35;
    },
    vaccinated() {
      return true;
    },
  },
};

const cache = new InMemoryCache();

/**
 * CREATE LINKS
 */
const localUri = "http://localhost:4000"; // server address
const rickAndMortyUri = "https://rickandmortyapi.com/graphql";
const httpLink = new HttpLink({ uri: localUri });

// create artificial delay (to demonstrate `optimisticResponse`)
const delay = setContext(
  req => new Promise(success => setTimeout(() => success(), 800))
);
// create 1 link from many
const link = ApolloLink.from([delay, httpLink]);

const client = new ApolloClient({
  link,
  cache,
  resolvers,
  typeDefs,
});

// const query = gql`
//   {
//     characters {
//       results {
//         id
//         name
//         __typename
//       }
//     }
//   }
// `;

// client.query({ query }).then(res => console.log(res));

export default client;
