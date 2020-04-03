const { gql } = require("apollo-server");

/**
 * Type Definitions for our Schema using the SDL.
 */
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type Pet {
    id: ID!
    createdAt: String!
    name: String!
    type: String!
    img: String
  }

  input PetInput {
    type: String
    name: String
  }

  input NewPetInput {
    type: String!
    name: String!
  }

  type Query {
    pets(input: PetInput): [Pet]!
    pet(id: String): Pet
  }

  type Mutation {
    newPet(input: NewPetInput!): Pet!
  }
`;

module.exports = typeDefs;
