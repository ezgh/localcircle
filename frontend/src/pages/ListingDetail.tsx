import { useState, useEffect } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import { useParams, Link } from "react-router-dom";
import moment from "moment";

type ListingType = {
  id: number;
  created_at: Date;
  title: string;
  description: string;
  is_live: boolean;
  user: number;
  category: number;
  area: number;
};

export default function ListingDetail() {
  const [listing, setListing] = useState<ListingType[]>([]);
  const [username, setUsername] = useState<string>("");

  const { id } = useParams();
  const accessToken = Cookies.get("accessToken");
  const formattedDate = moment(listing.created_at).fromNow();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/listings/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setListing(data);
        } else {
          console.error("Error fetching listings");
        }
      } catch (error) {
        console.error("Error fetching listings: ", error);
      }
    };
    fetchListings();
    fetch(`http://127.0.0.1:8000/auth/users/${listing.user}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsername(data.first_name + " " + data.last_name);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching user name: ", error));
  }, [id, accessToken, listing]);
  return (
    <>
      {listing && (
        <Post>
          <Info>
            <div className="start">
              <img src="https://picsum.photos/id/22/60/60" alt="" />
              <Name>{username} </Name>
            </div>
            <div className="end">
              <Date>{formattedDate}</Date>
            </div>
          </Info>
          <Content>
            <Link to={`/listing/${listing.id}`}>
              <h2>{listing.title}</h2>
              <p>{listing.description}</p>
            </Link>
            <Buttons>
              <SaveButton>Save</SaveButton>
              <MessageButton>Message</MessageButton>
            </Buttons>
          </Content>
        </Post>
      )}
    </>
  );
}

const Post = styled.div`
  padding: 1rem;
  border: 1px solid #f2f2f2;
  width: 35rem;
  margin-bottom: 1rem;
  @media (max-width: 425px) {
    padding: 1rem;
    width: 15rem;
  }
  @media (min-width: 426px) and (max-width: 768px) {
    width: 20rem;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .start {
    display: flex;
    flex-direction: row;
  }

  img {
    border-radius: 100%;
    margin-right: 1rem;

    @media (max-width: 425px) {
      height: 60px;
      width: 60px;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column-reverse;
  }
`;

const Name = styled.p`
  font-size: 1.1em;
  font-weight: 500;
`;

const Date = styled.p`
  font-weight: 200;
  @media (max-width: 425px) {
    font-size: 0.8em;
  }
`;

const Content = styled.div`
  margin-left: 4.7rem;

  h2 {
    overflow-wrap: break-word;
  }

  p {
    overflow-wrap: break-word;
  }

  a {
    text-decoration: none;
    color: black;
  }

  @media (max-width: 768px) {
    margin: 0;
  }
`;
const Buttons = styled.div``;

const SaveButton = styled.button`
  margin: 1rem 1rem 0.5rem 0;
  padding: 1.5% 1%;
  width: 5rem;
  font-size: 1rem;
  border: none;
  border-radius: 1.375rem;
  background: #e73213;
  color: white;
  cursor: pointer;

  &:hover {
    background: #ba2207;
  }

  @media (max-width: 425px) {
    padding: 4%;
    width: 40%;
  }
`;

const MessageButton = styled(SaveButton)`
  background: #9dbeb7;

  &:hover {
    background: #81a79f;
  }
`;
