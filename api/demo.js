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
    BIRKENSTOCK
  }

  type User {
    email: String!
    avatar: String
    friends: [User]!
    shoes: [Shoe!]
  }

  interface Shoe {
    brand: ShoeType!
    size: Int!
    user: User!
  }

  type Sneaker implements Shoe {
    brand: ShoeType!
    size: Int!
    user: User!
    color: String
  }

  type FlipFlop implements Shoe {
    brand: ShoeType!
    size: Int!
    user: User!
    hasHeelStrap: Boolean
  }

  union Footwear = Sneaker | FlipFlop

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

const userModel = {
  id: 1,
  email: "yoda@gmail.com",
  avatar: "http://yoda.png",
  friends: [],
  shoes: [],
};

const shoeModels = [
  { brand: "NIKE", size: 8, color: "red", user: 1 },
  { brand: "ALLBIRDS", size: 9, color: "black", user: 1 },
  { brand: "BIRKENSTOCK", size: 10, hasHeelStrap: false, user: 1 },
];

const resolvers = {
  Query: {
    me() {
      return userModel;
    },

    shoes(_initialValue, arguments, _context) {
      const { input } = arguments;

      return shoeModels;
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
    user(shoe) {
      return userModel;
    },
  },

  // Interface resolvers
  User: {
    shoes(user) {
      return shoeModels;
    },
  },
  Sneaker: {
    user(shoe) {
      return userModel;
    },
  },
  FlipFlop: {
    user(shoe) {
      return userModel;
    },
  },

  // Union resolver
  Footwear: {
    __resolveType(shoe) {
      if (shoe.hasOwnProperty("hasHeelStrap")) return "FlipFlop";
      else return "Sneaker";
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context({ req }) {},
});

server.listen(4000).then(() => console.log("listening on port 4000"));
