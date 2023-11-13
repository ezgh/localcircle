import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { ListingType } from "../types/types";
import {
  getListingById,
  getAuthenticatedUser,
  deleteListing,
} from "../api/api";

import Listing from "../components/Listing";

export default function ListingDetail() {
  const [listing, setListing] = useState<ListingType>({
    id: 0,
    created_at: null,
    title: "",
    description: "",
    is_live: false,
    user: 0,
    category: 0,
    area: 0,
    owner_name: "",
    isBookmarked: false,
  });
  const [authUserId, setAuthUserId] = useState<number | null>(null);
  const [isDetail] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = Cookies.get("accessToken");

  //delete listing
  const handleDeleteListing = async (listingId: number) => {
    try {
      await deleteListing(accessToken, listingId);
      navigate("/");
    } catch (error) {
      console.error("Error deleting listing: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authUserData = await getAuthenticatedUser(accessToken);
        console.log(authUserData);
        setAuthUserId(authUserData.id);

        const listingData = await getListingById(accessToken, id);
        setListing(listingData);
        listing.isBookmarked = listingData.isBookmarked;
      } catch (error) {
        console.error("Error fetching listing: ", error);
      }
    };
    fetchData();
  }, [id, accessToken]);

  return (
    <>
      {listing && (
        <Listing
          key={listing.id}
          isDetail={isDetail}
          authUserId={authUserId}
          listing={listing}
          isOpen={false}
          listingId={listing.id}
          onDelete={handleDeleteListing}
          accessToken={accessToken}
        />
      )}
    </>
  );
}
