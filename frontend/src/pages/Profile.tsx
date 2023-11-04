import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import styled from "styled-components";
import moment from "moment";

import { ListingType, userType } from "../types/types";

import Listing from "../components/Listing";

export default function Profile() {
  const [authUserId, setAuthUserId] = useState<number | null>(null);
  const [user, setUser] = useState<userType>({
    first_name: "",
    id: 0,
    last_name: "",
    get_full_name: "",
  });

  const [listings, setListings] = useState<ListingType[]>([]);
  const [lastPostedDate, setLastPostedDate] = useState<Date | string>();

  const accessToken = Cookies.get("accessToken");
  const { id } = useParams();

  useEffect(() => {
    //get the user with the given id
    fetch(`http://127.0.0.1:8000/api/user_info/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching auth user:", error);
      });

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
        if (data.results.length > 0) {
          const lastListing = data.results[data.results.length - 1];
          const lastListingDate = lastListing.created_at;
          setLastPostedDate(
            moment(lastListingDate).subtract(10, "days").calendar()
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching user listings:", error);
      });
  }, [id, accessToken]);

  return (
    <>
      <ProfileDiv>
        <img src="https://picsum.photos/id/62/80/80" alt="" />
        <h2>{user.get_full_name} </h2>
        <p>
          {lastPostedDate
            ? "Last posted on " + lastPostedDate.toString()
            : "Hasn't posted anything yet."}
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
