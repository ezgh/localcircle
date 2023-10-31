import { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import Listing from "./Listing";
import Modal from "./Modal";

type ListingType = {
  id: number;
  title: string;
  description: string;
  created_at: Date;
};

type Category = {
  id: number;
  name: string;
};

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [listings, setListings] = useState<ListingType[]>([]);
  const [filterOptions, setFilterOptions] = useState({
    categoryId: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);


  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions({
      ...filterOptions,
      [event.target.name]: event.target.value,
    });
  };


  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxMjQ5MDQwLCJpYXQiOjE2OTg2NTcwNDAsImp0aSI6ImRlZjJlZTFjMjgzZDRhZTI4YzhhZWRiZDU4Nzg5N2QxIiwidXNlcl9pZCI6Mn0.retgww9rF0vTw5KvPusH8GX5t9rjTQO8ugdaCruzRPc",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched categories:", data.results); 
        setCategories(data.results);
      })
      .catch((error) => console.error("Error fetching categories: ", error));
  }, []);


  useEffect(() => {
    const fetchListings = async () => {
      const url = new URL("http://127.0.0.1:8000/api/listings");
      url.searchParams.append("categoryId", filterOptions.categoryId);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxMjQ5MDQwLCJpYXQiOjE2OTg2NTcwNDAsImp0aSI6ImRlZjJlZTFjMjgzZDRhZTI4YzhhZWRiZDU4Nzg5N2QxIiwidXNlcl9pZCI6Mn0.retgww9rF0vTw5KvPusH8GX5t9rjTQO8ugdaCruzRPc",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setListings(data.results);
          console.log(data.results);
        } else {
          console.error("Error fetching listings");
        }
      } catch (error) {
        console.error("Error fetching listings: ", error);
      }
    };

    fetchListings();
  }, [filterOptions]);
  return (
    <>
      <Navbar />
      <Main>
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
            <Listing listing={listing} key={listing.id} />
          ))}
        </Listings>
        
      </Main>
    </>
  );
}

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
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

margin-bottom:0.5rem;
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
