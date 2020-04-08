/**
 * Here are your Resolvers for your Schema. They must match
 * the type definitions in your schema
 */

module.exports = {
  Query: {
    pets(_initialValue, arguments, context) {
      const { models, db } = context;
      const { input } = arguments;

      return models.Pet.findMany(input);
    },
    pet(_initialValue, { id }, { models }) {
      return models.Pet.findOne({ id });
    },
  },
  Pet: {
    img(pet) {
      return pet.type === "DOG"
        ? "https://placedog.net/300/300"
        : "http://placekitten.com/300/300";
    },
    owner(pet, _arguments, { user }) {
      return user;
    },
  },
  User: {
    pets(user, __, { models }) {
      return models.Pet.findMany();
    },
  },
  Mutation: {
    newPet(_, { input }, { models }) {
      return models.Pet.create(input);
    },
  },
};
