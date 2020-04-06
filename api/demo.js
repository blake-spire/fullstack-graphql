const gql = require("graphql-tag");
const { ApolloServer } = require("apollo-server");

const typeDefs = gql`
  """
  this is how you would make a
  multi-line comment
  """
  enum ShoeType {
    JORDAN
    NIKE
    ADIDAS
    ALLBIRDS
    BERKENSTOCKS
  }

  type User {
    email: String!
    avatar: String
    friends: [User]!
  }

  interface Shoe {
    brand: ShoeType!
    size: Int!
  }

  type Sneaker implements Shoe {
    brand: ShoeType!
    size: Int!
    color: String
  }

  type FlipFlop implements Shoe {
    brand: ShoeType!
    size: Int!
    hasHeelStrap: Boolean
  }

  input ShoeInput {
    brand: ShoeType
    size: Int
  }

  input NewShoeInput {
    brand: ShoeType!
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
        friends: [],
      };
    },

    shoes(_initialValue, arguments, _context) {
      const { input } = arguments;

      return [
        { brand: "NIKE", size: 8, color: "red" },
        { brand: "ALLBIRDS", size: 9, color: "black" },
        { brand: "BERKENSTOCKS", size: 10, hasHeelStrap: false },
      ];
    },
  },

  Mutation: {
    newShoe(_initialValue, args) {
      return args.input;
    },
  },
  Shoe: {
    __resolveType(shoe) {
      if (shoe.hasOwnProperty("hasHeelStrap")) return "FlipFlop";
      else return "Sneaker";
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(4000).then(() => console.log("listening on port 4000"));
