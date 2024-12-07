import { gql } from "@apollo/client";

export const LEADERBOARD = gql`
  query LeaderBoard {
    userStakes(orderBy: totalStaked, orderDirection: desc) {
      user
      totalStaked
      id
    }
  }
`;
