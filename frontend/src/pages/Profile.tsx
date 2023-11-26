import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import moment from "moment";
import styled from "styled-components";

import { ListingType, userType } from "../types/types";
import {
  getAuthenticatedUser,
  getUserListings,
  getUserInfo,
  deleteListing,
} from "../api/api";

import Listing from "../components/Listing";

export default function Profile() {
  const [authUserId, setAuthUserId] = useState<number | null>(null);
  const [user, setUser] = useState<userType>({
    first_name: "",
    id: 0,
    last_name: "",
    get_full_name: "",
    profile_picture: "",
    area: 0,
  });

  const [listings, setListings] = useState<ListingType[]>([]);
  const [lastPostedDate, setLastPostedDate] = useState<Date | string>();

  const accessToken = Cookies.get("accessToken");
  const { id } = useParams();

  //delete listing
  const handleDeleteListing = async (listingId: number) => {
    try {
      await deleteListing(accessToken, listingId);
      setListings(listings.filter((listing) => listing.id !== listingId));
    } catch (error) {
      console.error("Error deleting listing: ", error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getUserInfo(accessToken, id);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const fetchAuthUserInfo = async () => {
      try {
        const authUserData = await getAuthenticatedUser(accessToken);
        setAuthUserId(authUserData.id);
      } catch (error) {
        console.error("Error fetching auth user:", error);
      }
    };

    const fetchUserListings = async () => {
      try {
        const data = await getUserListings(accessToken, id);
        setListings(data.results);
        if (data.results.length > 0) {
          const lastListing = data.results[data.results.length - 1];
          const lastListingDate = lastListing.created_at;
          setLastPostedDate(moment(lastListingDate).calendar());
        }
      } catch (error) {
        console.error("Error fetching user listings:", error);
      }
    };

    fetchUserInfo();
    fetchAuthUserInfo();
    fetchUserListings();
  }, [id, accessToken]);
  return (
    <>
      <ProfileDiv>
        <img
          src={user.profile_picture}
          width={100}
          height={100}
          alt="user profile picture"
        />
        <h2>{user.get_full_name} </h2>
        <p>
          {lastPostedDate
            ? "Last posted on " + lastPostedDate.toString()
            : "Hasn't posted anything yet."}
        </p>
      </ProfileDiv>

      {listings.map((listing) => (
        <Listing
          setIsEditOpen={() => {}}
          authUserId={authUserId}
          listing={listing}
          isDetail={false}
          isOpen={false}
          listingId={listing.id}
          onDelete={handleDeleteListing}
          accessToken={accessToken}
        />
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
