import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

import { ListingType } from "../types/types";
import { getListingById, getAuthenticatedUser } from "../api/api";

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
  });
  const [authUserId, setAuthUserId] = useState<number | null>(null);
  const [isDetail] = useState(true);

  const { id } = useParams();
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authUserData = await getAuthenticatedUser(accessToken);
        console.log(authUserData);
        setAuthUserId(authUserData.id);

        const listingData = await getListingById(accessToken, id);
        setListing(listingData);
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
          authUserId={authUserId}
          listing={listing}
          isDetail={isDetail}
        />
      )}
    </>
  );
}
