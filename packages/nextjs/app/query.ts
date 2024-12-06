import { gql } from "@apollo/client";

export const GET_PROTOCOLS_AND_TRANSCODERS = gql`
  query GetProtocolsAndTranscoders {
    protocols(first: 5) {
      id
      inflation
      inflationChange
      numActiveTranscoders
    }
    transcoders(first: 5) {
      id
      activationRound
      deactivationRound
      lastActiveStakeUpdateRound
    }
  }
`;
