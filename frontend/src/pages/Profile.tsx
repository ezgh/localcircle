import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import styled from "styled-components";
import moment from "moment";

import { ListingType } from "../types/types";

import Listing from "../components/Listing";

export default function Profile() {
  const [username, setUsername] = useState<string>("");
  const [authUserId, setAuthUserId] = useState<number | null>(null);
  const [listings, setListings] = useState<ListingType[]>([]);
  const [lastPostedDate, setLastPostedDate] = useState<Date | string>();

  const accessToken = Cookies.get("accessToken");
  const { id } = useParams();

  useEffect(() => {
    //get the authenticated user's info
    fetch(`http://127.0.0.1:8000/auth/users/me/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAuthUserId(data.id);
      })
      .catch((error) => {
        console.error("Error fetching auth user:", error);
      });
    //get listings with the given userid
    fetch(`http://127.0.0.1:8000/api/user_listings/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setListings(data.results);
        console.log(data);
        setUsername(
          data.results[0].user.first_name + " " + data.results[0].user.last_name
        );

        console.log(data.results);
        if (data.results.length > 0) {
          const lastListing = data.results[data.results.length - 1];
          const lastListingDate = lastListing.created_at;
          setLastPostedDate(
            moment(lastListingDate).subtract(10, "days").calendar()
          );
        }

        console.log(data.results);
      })
      .catch((error) => {
        console.error("Error fetching user listings:", error);
      });
  }, [id, accessToken]);

  return (
    <>
      <ProfileDiv>
        <img src="https://picsum.photos/id/62/80/80" alt="" />
        <h2> {username}</h2>
        <p>
          last posted on {lastPostedDate ? lastPostedDate.toString() : "N/A"}
        </p>
      </ProfileDiv>

      {listings.map((listing) => (
        <Listing authUserId={authUserId} listing={listing} />
      ))}
    </>
  );
}

const ProfileDiv = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 7rem;
  margin-bottom: 3rem;

  img {
    border-radius: 100%;
  }
  h2 {
    font-weight: 400;
    margin-bottom: 0.5rem;
  }
  p {
    font-weight: 200;
    font-size: 0.8rem;
  }
  @media (max-width: 425px) {
    padding: 1rem;
    margin-top: 1rem;
  }
`;
