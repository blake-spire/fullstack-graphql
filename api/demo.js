const gql = require("graphql-tag");
const { ApolloServer } = require("apollo-server");

const typeDefs = gql`
  type User {
    email: String!
    avatar: String
    friends: [User]!
  }
  type Shoe {
    brand: String!
    size: Int!
  }

  input ShoeInput {
    brand: String
    size: Int
  }

  input NewShoeInput {
    brand: String!
    size: Int!
  }

  type Query {
    me: User!
    shoes(input: ShoeInput): [Shoe]
  }

  type Mutation {
    newShoe(input: NewShoeInput): Shoe!
  }
`;

const resolvers = {
  Query: {
    me() {
      return {
        email: "yoda@gmail.com",
        avatar: "http://yoda.png",
        friends: []
      };
    },

    shoes(_initialValue, arguments, _context) {
      const { input } = arguments;

      return [
        { brand: "Nike", size: 8 },
        { brand: "Allbirds", size: 9 }
      ].filter(shoe => shoe.brand === input.brand);
    }
  },

  Mutation: {
    newShoe(_initialValue, args) {
      return args.input;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen(4000).then(() => console.log("listening on port 4000"));
