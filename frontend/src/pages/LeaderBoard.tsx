import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styled from "styled-components";

import { userType } from "../types/types";
import { getLeaderboardData } from "../api/api";
import { GoTrophy } from "react-icons/go";

export default function LeaderBoard() {
  const [leaderboardData, setLeaderboardData] = useState<userType[]>([]);

  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLeaderboardData(accessToken);
        setLeaderboardData(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <>
      <Title>
        <GoTrophy size={"1.4em"} />
        <h2>Leaderboard</h2>
      </Title>
      <LeaderBoardDiv>
        <div className="text">
          <h3>Our most helpful users.</h3>{" "}
          <p>Thank you for your contribution!</p>
        </div>
        {leaderboardData.length > 0 ? (
          leaderboardData.map((user, index) => (
            <User key={user.id}>
              <div className="nameAndIndex">
                <div className="index">{index + 1}</div>
                <div className="name"> {user.get_full_name} </div>
              </div>
              <div className="count"> {user.listing_count} listings</div>
            </User>
          ))
        ) : (
          <p>No leaderboard data available</p>
        )}
      </LeaderBoardDiv>
    </>
  );
}

const Title = styled.div`
  display: flex;
  flex-direction: row;
  color: black;
  text-align: left;
  align-items: center;

  svg {
    margin: 10px;
  }
`;

const LeaderBoardDiv = styled.div`
  background-color: #f9f9f9;
  padding: 20px;

  .text {
    text-align: center;

    p {
      font-weight: 300;
    }
  }
`;

const User = styled.div`
  display: flex;
  flex-direction: row;
  border-top: 1px solid #f1f1f1;
  padding: 30px 10px;
  justify-content: space-between;

  .nameAndIndex {
    display: flex;
    flex-direction: row;
  }

  .index {
    margin: 0 15px;
    font-weight: 800;
    color: #ba2207;
  }

  .count {
    float: right;
    margin-left: 100px;
    font-weight: 200;
  }
`;
