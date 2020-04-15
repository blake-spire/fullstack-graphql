import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PetsList from "../components/PetsList";
import NewPetModal from "../components/NewPetModal";
import Loader from "../components/Loader";

const PET_FIELDS = gql`
  fragment PetFields on Pet {
    id
    name
    type
    img
    vaccinated @client
    owner {
      id
      username
      age @client
    }
  }
`;

const ALL_PETS = gql`
  query AllPets {
    pets {
      ...PetFields
    }
  }
  ${PET_FIELDS}
`;

const ADD_PET = gql`
  mutation CreatePet($newPet: NewPetInput!) {
    addPet(input: $newPet) {
      ...PetFields
    }
  }
  ${PET_FIELDS}
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const { data, loading, error } = useQuery(ALL_PETS);
  const [createPet, newPet] = useMutation(ADD_PET, {
    update(cache, response) {
      const { data } = response; // {addPet: Object}

      const cachedData = cache.readQuery({ query: ALL_PETS }); // {pets: Object}

      cache.writeQuery({
        query: ALL_PETS,
        data: { pets: [data.addPet, ...cachedData.pets] },
      });
    },
    // global for all responses
    optimisticResponse: {
      __typename: "Mutation",
      // name of mutation
      addPet: {
        __typename: "Pet",
        id: Date.now() + "",
        name: "PET NAME FROM `useMutation` WILL BE OVERRIDDEN",
        type: "CAT",
        img: "https://via.placeholder.com/300",
        owner: {
          id: Date.now() + "",
          username: "USERNAME FROM `useMutation` WILL BE OVERRIDDEN",
          age: 100,
        },
      },
    },
  });

  console.log("data: ", data);

  const onSubmit = input => {
    createPet({
      variables: { newPet: input },
      // for single responses
      optimisticResponse: {
        __typename: "Mutation",
        // name of mutation
        addPet: {
          __typename: "Pet",
          id: Date.now() + "",
          name: input.name,
          type: input.type,
          img: "https://via.placeholder.com/300",
          owner: {
            id: Date.now() + "",
            username: "USERNAME FROM `onSubmit`",
            age: 100,
          },
        },
      },
    });
    setModal(false);
  };

  if (error || newPet.error) {
    return (
      <section>
        <h1>Dang an error!</h1>
        <pre>{error ? error.message : newPet.error.message}</pre>
      </section>
    );
  }

  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />;
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row between-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>{loading ? <Loader /> : <PetsList pets={data.pets} />}</section>
    </div>
  );
}
