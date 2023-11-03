import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import styled from "styled-components";
import moment from "moment";

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
    <>
      <ProfileDiv>
        <img src="https://picsum.photos/id/62/80/80" alt="" />
        <h2> {user.first_name + " " + user.last_name}</h2>
        <p>
          last posted on {lastPostedDate ? lastPostedDate.toString() : "N/A"}
        </p>
      </ProfileDiv>
      <div>
        {listings.map((listing) => (
          <Post>
            <Info>
              <div className="start">
                <img src="https://picsum.photos/id/22/60/60" alt="" />
                <Name>{user.first_name + " " + user.last_name} </Name>
              </div>
              <div className="end">
                <Date>{moment(listing.created_at).fromNow()}</Date>
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
        ))}
      </div>
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
    text-decoration: underline;
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
