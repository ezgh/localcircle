import styled from "styled-components";
import moment from "moment";
import { Link } from "react-router-dom";

type userType = {
  first_name: string;
  last_name: string;
  id: number;
};

type ListingType = {
  id: number;
  created_at: Date | null;
  title: string;
  description: string;
  is_live: boolean;
  user: userType;
  category: number;
  area: number;
};

type ListingProps = {
  listing: ListingType;
  authUserId: number | null;
};

export default function Listing({ listing, authUserId }: ListingProps) {
  //update date format
  const formattedDate = moment(listing.created_at).fromNow();
  const username = listing.user.first_name + " " + listing.user.last_name;

  return (
    <>
      <Post>
        <Info>
          <div className="start">
            <img src="https://picsum.photos/id/22/60/60" alt="" />
            <Link to={`/profile/${listing.user.id}`}>
              <Name>{username}</Name>
            </Link>
          </div>
          <div className="end">
            <Date>{formattedDate}</Date>
          </div>
        </Info>
        <Content>
          <Link to={`/listing/${listing.id}`}>
            <h2>{listing.title}</h2>
          </Link>
          {authUserId !== null && listing.user.id === authUserId ? (
            <Buttons>
              <SaveButton>Delete</SaveButton>
              <MessageButton>Edit</MessageButton>
            </Buttons>
          ) : (
            <Buttons>
              <SaveButton>Save</SaveButton>
              <MessageButton>Message</MessageButton>
            </Buttons>
          )}
        </Content>
      </Post>
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

  a {
    text-decoration: none;
    color: black;
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
