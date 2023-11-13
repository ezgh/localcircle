import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getAuthenticatedUser, getUserBookmarks } from "../api/api";
import { ListingType } from "../types/types";
import styled from "styled-components";
import Listing from "../components/Listing";

export default function Bookmarks() {
  const [authUserId, setAuthUserId] = useState(null);
  const [listings, setListings] = useState<ListingType[]>([]);

  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchAuthUserInfo = async () => {
      try {
        const authUserData = await getAuthenticatedUser(accessToken);
        setAuthUserId(authUserData.id);
      } catch (error) {
        console.error("Error fetching auth user:", error);
      }
    };

    const fetchUserBookmarks = async () => {
      try {
        const data = await getUserBookmarks(accessToken, authUserId);
        setListings(data);
      } catch (error) {
        console.error("Error fetching user listings:", error);
      }
    };

    fetchAuthUserInfo();
    fetchUserBookmarks();
  }, [authUserId, accessToken]);

  return (
    <>
      <BookmarksDiv>
        <div className="title">
          <h1>Bookmarks</h1>
        </div>
        <Listings>
          {listings.map((listing) => (
            <Listing
              key={listing.id}
              isDetail={false}
              authUserId={authUserId}
              listing={listing}
              isOpen={false}
              listingId={listing.id}
              onDelete={() => {}}
              accessToken={accessToken}
            />
          ))}
        </Listings>
      </BookmarksDiv>
    </>
  );
}

const BookmarksDiv = styled.div`
  align-self: left;
`;

const Listings = styled.div``;
