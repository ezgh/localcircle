import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { ListingType } from "../types/types";
import {
  getListingById,
  getAuthenticatedUser,
  deleteListing,
  updateListing,
  getCategories,
} from "../api/api";

import { Category } from "../types/types";

import Listing from "../components/Listing";
import EditModal from "../components/EditModal";
import Alert from "../components/Alert";

export default function ListingDetail() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");
  const [listing, setListing] = useState<ListingType>({
    id: 0,
    created_at: null,
    title: "",
    description: "",
    is_live: false,
    user: 0,
    category: 0,
    image: "",
    area: 0,
    owner_name: "",
    isBookmarked: false,
  });
  const [authUserId, setAuthUserId] = useState<number | null>(null);
  const [isDetail] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = Cookies.get("accessToken");

  //delete listing
  const handleDeleteListing = async (listingId: number) => {
    try {
      await deleteListing(accessToken, listingId);
      navigate("/home");
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
        console.log(listingData);
        setListing(listingData);
        const categoriesData = await getCategories(accessToken);
        setCategories(categoriesData);

        listing.isBookmarked = listingData.isBookmarked;
      } catch (error) {
        console.error("Error fetching listing: ", error);
      }
    };
    fetchData();
  }, [id, accessToken]);

  //update listing
  const handleUpdateListing = async (
    title: string,
    description: string,
    category: string | number,
    area: number,
    user: number | null,
    image: File | string
  ) => {
    if (user !== null) {
      try {
        const imageChanged =
          typeof image !== "string" &&
          (image as File).name !== (listing.image as File).name;

        const formData = new FormData();
        formData.append("area", String(area));
        formData.append("user", String(user));
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", String(category));
        if (imageChanged) {
          formData.append("image", image);
        }

        await updateListing(accessToken, formData, id);
        //fetch listings again to show update
        const listingData = await getListingById(accessToken, id);
        setListing(listingData);

        setSuccessMessage("Listing Updated!");
      } catch (error) {
        setFailMessage(
          "Failed to update listing. Make sure fields are filled out correctly and retry."
        );
        console.error(error);
      }
    }
  };

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
          setIsEditOpen={setIsEditOpen}
        />
      )}
      {listing && isEditOpen && (
        <EditModal
          listing={listing}
          setIsEditOpen={setIsEditOpen}
          authUserId={authUserId}
          categories={categories}
          onUpdateListing={handleUpdateListing}
        />
      )}
      {successMessage && <Alert message={successMessage} type="success" />}
      {failMessage && <Alert message={failMessage} type="fail" />}
    </>
  );
}
