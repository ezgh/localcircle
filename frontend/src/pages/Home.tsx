import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import styled from "styled-components";

import { ListingType, Category } from "../types/types";
import {
  getAuthenticatedUser,
  getCategories,
  getListings,
  deleteListing,
  createListing,
} from "../api/api";

import Listing from "../components/Listing";
import Modal from "../components/Modal";
import Alert from "../components/Alert";

export default function Home() {
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [listings, setListings] = useState<ListingType[]>([]);
  const [filterOptions, setFilterOptions] = useState({
    categoryId: "",
  });
  const [area, setArea] = useState();

  const [categories, setCategories] = useState<Category[]>([]);
  const [authUserId, setAuthUserId] = useState<number | null>(null);
  const [next, setNext] = useState(null);

  const nextUrl = useRef("");

  const accessToken = Cookies.get("accessToken");

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions({
      ...filterOptions,
      [event.target.name]: event.target.value,
    });
  };

  //delete listing
  const handleDeleteListing = async (listingId: number) => {
    try {
      await deleteListing(accessToken, listingId);
      setListings(listings.filter((listing) => listing.id !== listingId));
    } catch (error) {
      console.error("Error deleting listing: ", error);
    }
  };

  //create listing
  const handleCreateListing = async (
    title: string,
    description: string,
    category: string | number,
    area: number,
    user: number | null,
    image: File | string
  ) => {
    if (user !== null) {
      try {
        const formData = new FormData();
        formData.append("area", String(area));
        formData.append("user", String(user));
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", String(category));
        if (image) {
          formData.append("image", image);
        }

        const data = await createListing(accessToken, formData);
        setListings((prevListings) => [data, ...prevListings]);
        setSuccessMessage("Listing Published!");
      } catch (error) {
        setFailMessage(
          "Failed to post listing. Make sure all required fields are filled out correctly and retry."
        );
        console.error(error);
      }
    } else {
      console.error("Invalid authUserId");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const authUserData = await getAuthenticatedUser(accessToken);
        const categoriesData = await getCategories(accessToken);
        setArea(authUserData.area);
        setAuthUserId(authUserData.id);
        setCategories(categoriesData);
        const listingsData = await getListings(
          accessToken,
          `http://127.0.0.1:8000/api/listings/?areaId=${authUserData.area}`,
          filterOptions.categoryId
        );
        setListings(listingsData.results);

        setNext(listingsData.next);
        nextUrl.current = listingsData.next;
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    fetchData();
  }, [filterOptions, accessToken]);

  const loadMore = async () => {
    try {
      const listingsData = await getListings(
        accessToken,
        nextUrl.current,
        filterOptions.categoryId
      );
      console.log(listingsData.results);
      setListings([...listings, ...listingsData.results]);
      nextUrl.current = listingsData.next;
      setNext(listingsData.next);
    } catch (error) {
      console.error("Error fetching listings: ", error);
    }
  };

  return (
    <>
      <Share>
        <ShareButton onClick={() => setIsOpen(true)}>
          What do you want to share?
        </ShareButton>
        {isOpen && (
          <Modal
            setIsOpen={setIsOpen}
            authUserId={authUserId}
            categories={categories}
            onCreateListing={handleCreateListing}
          />
        )}
      </Share>
      <Listings>
        <Filter>
          <select
            name="categoryId"
            value={filterOptions.categoryId}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Filter>

        {listings.map((listing) => (
          <Listing
            key={listing.id}
            isDetail={false}
            authUserId={authUserId}
            listing={listing}
            isOpen={false}
            listingId={listing.id}
            onDelete={handleDeleteListing}
            accessToken={accessToken}
          />
        ))}
      </Listings>
      {next && next !== null && (
        <LoadButton onClick={loadMore}>Load More</LoadButton>
      )}
      {successMessage && <Alert message={successMessage} type="success" />}
      {failMessage && <Alert message={failMessage} type="fail" />}
    </>
  );
}

const Share = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ShareButton = styled.button`
  margin: 1rem 0 0.5rem 0;
  padding: 1.5% 5%;
  width: auto;
  font-size: 1.2rem;
  font-family: Montserrat;
  font-weight: 400;
  text-align: start;
  border: none;
  border-radius: 3.125rem;
  background: #f5f5f5;
  color: black;
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 4%;
    font-size: 1.2rem;
  }
`;

const Listings = styled.div`
  margin: 1rem;
  max-width: 50rem;

  @media (max-width: 425px) {
    margin-top: 2rem;
  }
`;
const Filter = styled.div`
  margin-bottom: 0.5rem;
  select {
    padding: 10px;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    background: #1a1c25;
    color: white;
  }
  ::placeholder {
    font-weight: 200;
  }
`;

const LoadButton = styled.button`
  margin-bottom: 0.5rem;
  padding: 10px;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  background: #1a1c25;
  color: white;
  ::placeholder {
    font-weight: 200;
  }
`;
