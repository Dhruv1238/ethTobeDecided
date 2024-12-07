import { gql } from "@apollo/client";

export const LEADERBOARD = gql`
  query LeaderBoard {
    transfers {
      blockTimestamp
      blockNumber
      from
      id
      tokenId
      transactionHash
      to
    }
  }
`;