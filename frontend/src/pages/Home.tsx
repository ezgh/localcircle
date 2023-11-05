import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import styled from "styled-components";

import { ListingType, Category } from "../types/types";
import { getAuthenticatedUser, getCategories, getListings } from "../api/api";

import Listing from "../components/Listing";
import Modal from "../components/Modal";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [listings, setListings] = useState<ListingType[]>([]);
  const [filterOptions, setFilterOptions] = useState({
    categoryId: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [authUserId, setAuthUserId] = useState<number | null>(null);

  const nextUrl = useRef("");

  const accessToken = Cookies.get("accessToken");

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions({
      ...filterOptions,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const authUserData = await getAuthenticatedUser(accessToken);
        console.log(authUserData);
        setAuthUserId(authUserData.id);

        const categoriesData = await getCategories(accessToken);
        console.log("Fetched categories:", categoriesData);
        setCategories(categoriesData);

        const listingsData = await getListings(
          accessToken,
          "http://127.0.0.1:8000/api/listings",
          filterOptions.categoryId
        );
        console.log(listingsData.results);
        setListings(listingsData.results);
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
        {isOpen && <Modal setIsOpen={setIsOpen} />}
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
            isDetail={false}
            authUserId={authUserId}
            listing={listing}
            key={listing.id}
            isOpen={false}
          />
        ))}
      </Listings>
      <LoadButton onClick={loadMore}>Load More</LoadButton>
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
