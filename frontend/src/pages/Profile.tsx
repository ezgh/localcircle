import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import styled from "styled-components";
import moment from "moment";

import Listing from "../components/Listing";

type User = {
  id: number;
  first_name: string;
  last_name: string;
};

type ListingType = {
  id: number;
  title: string;
  description: string;
  created_at: Date;
  user: string;
};

export default function Profile() {
  const [user, setUser] = useState<User>({
    id: 0,
    first_name: "",
    last_name: "",
  });
  const [listings, setListings] = useState<ListingType[]>([]);
  const [lastPostedDate, setLastPostedDate] = useState<Date | string>();

  const accessToken = Cookies.get("accessToken");
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/auth/users/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((user) => {
        setUser(user);
        console.log(user);
      })
      .catch((error) => {
        console.error("Error fetching user listings:", error);
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
    <div>
      <ProfileDiv>
        <img src="https://picsum.photos/id/62/80/80" alt="" />
        <h2> {user.first_name + " " + user.last_name}</h2>
        <p>
          last posted on {lastPostedDate ? lastPostedDate.toString() : "N/A"}
        </p>
      </ProfileDiv>
      {listings.map((listing) => (
        <Listing listing={listing} key={listing.id} />
      ))}
    </div>
  );
}

const ProfileDiv = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 6rem;
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
`;
