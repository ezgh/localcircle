import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";

import { GoTrash } from "react-icons/go";
import { HiOutlineEnvelope } from "react-icons/hi2";

import { getUserInfo, toggleBookmark } from "../api/api";
import { ListingProps } from "../types/types";

import DeleteModal from "./DeleteModal";

export default function Listing({
  listing,
  authUserId,
  isDetail,
  onDelete,
  accessToken,
  setIsEditOpen,
}: ListingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(listing.isBookmarked);

  //update date format
  const formattedDate = moment(listing.created_at).fromNow();

  const id = listing.user.toString();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getUserInfo(accessToken, id);
        setProfilePic(userData.profile_picture);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  });

  const handleBookmarkToggle = async () => {
    try {
      const success = await toggleBookmark(
        listing.id,
        authUserId,
        accessToken,
        isBookmarked
      );
      if (success) {
        setIsBookmarked((prevIsBookmarked) => !prevIsBookmarked);
        console.log("success");
      } else {
        console.error("Error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Post>
        <Info>
          <div className="personalInfo">
            <div className="start">
              <img src={profilePic} width={80} height={80} alt="" />
            </div>
            <div className="middle">
              <Link to={`/profile/${listing.user}`}>
                <Name>{listing.owner_name}</Name>
              </Link>
              <Date>{formattedDate}</Date>
            </div>
          </div>
          {listing.user !== authUserId && (
            <div className="end">
              <BookmarkDiv>
                <label className="ui-bookmark">
                  <input
                    type="checkbox"
                    checked={isBookmarked}
                    onChange={handleBookmarkToggle}
                  />

                  <div className="bookmark">
                    <svg viewBox="0 0 32 32">
                      <g>
                        <path d="M27 4v27a1 1 0 0 1-1.625.781L16 24.281l-9.375 7.5A1 1 0 0 1 5 31V4a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z"></path>
                      </g>
                    </svg>
                  </div>
                </label>
              </BookmarkDiv>
            </div>
          )}
        </Info>
        <Content>
          <Link to={`/listing/${listing.id}`}>
            <h2>{listing.title}</h2>
            {isDetail && <p>{listing.description}</p>}
          </Link>
          {isDetail && listing.image && <img src={listing.image} />}
          {authUserId !== null && listing.user === authUserId && !isDetail && (
            <Buttons>
              <DeleteButton onClick={() => setIsOpen(true)}>
                <GoTrash style={{ padding: "0 1px" }} />
                Delete
              </DeleteButton>
              {isOpen && (
                <DeleteModal
                  setIsOpen={setIsOpen}
                  listingId={listing.id}
                  onDelete={onDelete}
                />
              )}
            </Buttons>
          )}
          {authUserId !== null && listing.user === authUserId && isDetail && (
            <Buttons>
              <EditButton onClick={() => setIsEditOpen(true)}>Edit</EditButton>
              <DeleteButton onClick={() => setIsOpen(true)}>
                <GoTrash style={{ padding: "0 1px" }} />
                Delete
              </DeleteButton>
              {isOpen && (
                <DeleteModal
                  setIsOpen={setIsOpen}
                  listingId={listing.id}
                  onDelete={onDelete}
                />
              )}
            </Buttons>
          )}

          {listing.user !== authUserId && isDetail && (
            <Buttons>
              <MessageButton>
                <HiOutlineEnvelope />
                Message
              </MessageButton>
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
    margin-top: 2rem;
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
  align-items: center;

  img {
    border-radius: 100%;
    margin-right: 1rem;

    @media (max-width: 425px) {
      height: 60px;
      width: 60px;
    }
  }

  .end {
    margin-right: 7%;
    cursor: pointer;
  }

  .personalInfo {
    display: flex;
    flex-direction: row;
  }
`;

const Name = styled.p`
  font-size: 1.1em;
  font-weight: 500;
  margin: 10px 0;
`;

const Date = styled.p`
  font-weight: 200;
  font-size: 0.8em;
  margin: 0;

  @media (max-width: 425px) {
    font-size: 0.8em;
  }
`;

const Content = styled.div`
  margin-left: 4.7rem;

  h2 {
    overflow-wrap: break-word;
    margin-bottom: 0;
  }

  p {
    overflow-wrap: break-word;
  }

  img {
    margin-top: 10px;
    width: 80%;
  }

  @media (max-width: 768px) {
    margin: 0;
  }
`;
const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
`;

const DeleteButton = styled.button`
  margin: 1rem 1rem 0.5rem 0;
  padding: 1.5% 1%;
  width: 5.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 1.375rem;
  background: #e73213;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;

  svg {
    margin-right: 2px;
  }

  &:hover {
    background: #ba2207;
  }

  @media (max-width: 425px) {
    padding: 4%;
    width: 40%;
  }
`;

const MessageButton = styled(DeleteButton)`
  width: 7rem;
  justify-content: center;
`;

const EditButton = styled.a`
  cursor: pointer;
  text-decoration: underline !important;
  color: #e73213 !important ;
  margin-right: 2%;
`;

const BookmarkDiv = styled.div`
  .ui-bookmark {
    --icon-size: 20px;
    --icon-secondary-color: #9dbeb7;
    --icon-hover-color: #4c5062;
    --icon-primary-color: #21242f;
    --icon-circle-border: 1px solid var(--icon-primary-color);
    --icon-circle-size: 35px;
    --icon-anmt-duration: 0.3s;
  }

  .ui-bookmark input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: none;
  }

  .ui-bookmark .bookmark {
    width: var(--icon-size);
    height: auto;
    fill: var(--icon-secondary-color);
    cursor: pointer;
    -webkit-transition: 0.2s;
    -o-transition: 0.2s;
    transition: 0.2s;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    -webkit-transform-origin: top;
    -ms-transform-origin: top;
    transform-origin: top;
  }

  .bookmark::after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    -webkit-box-shadow: 0 30px 0 -4px var(--icon-primary-color),
      30px 0 0 -4px var(--icon-primary-color),
      0 -30px 0 -4px var(--icon-primary-color),
      -30px 0 0 -4px var(--icon-primary-color),
      -22px 22px 0 -4px var(--icon-primary-color),
      -22px -22px 0 -4px var(--icon-primary-color),
      22px -22px 0 -4px var(--icon-primary-color),
      22px 22px 0 -4px var(--icon-primary-color);
    box-shadow: 0 30px 0 -4px var(--icon-primary-color),
      30px 0 0 -4px var(--icon-primary-color),
      0 -30px 0 -4px var(--icon-primary-color),
      -30px 0 0 -4px var(--icon-primary-color),
      -22px 22px 0 -4px var(--icon-primary-color),
      -22px -22px 0 -4px var(--icon-primary-color),
      22px -22px 0 -4px var(--icon-primary-color),
      22px 22px 0 -4px var(--icon-primary-color);
    border-radius: 50%;
    -webkit-transform: scale(0);
    -ms-transform: scale(0);
    transform: scale(0);
  }

  .bookmark::before {
    content: "";
    position: absolute;
    border-radius: 50%;
    border: var(--icon-circle-border);
    opacity: 0;
  }

  /* actions */

  .ui-bookmark:hover .bookmark {
    fill: var(--icon-hover-color);
  }

  .ui-bookmark input:checked + .bookmark::after {
    -webkit-animation: circles var(--icon-anmt-duration)
      cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    animation: circles var(--icon-anmt-duration)
      cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    -webkit-animation-delay: var(--icon-anmt-duration);
    animation-delay: var(--icon-anmt-duration);
  }

  .ui-bookmark input:checked + .bookmark {
    fill: var(--icon-primary-color);
    -webkit-animation: bookmark var(--icon-anmt-duration) forwards;
    animation: bookmark var(--icon-anmt-duration) forwards;
    -webkit-transition-delay: 0.3s;
    -o-transition-delay: 0.3s;
    transition-delay: 0.3s;
  }

  .ui-bookmark input:checked + .bookmark::before {
    -webkit-animation: circle var(--icon-anmt-duration)
      cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    animation: circle var(--icon-anmt-duration)
      cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    -webkit-animation-delay: var(--icon-anmt-duration);
    animation-delay: var(--icon-anmt-duration);
  }

  @-webkit-keyframes bookmark {
    50% {
      -webkit-transform: scaleY(0.6);
      transform: scaleY(0.6);
    }

    100% {
      -webkit-transform: scaleY(1);
      transform: scaleY(1);
    }
  }

  @keyframes bookmark {
    50% {
      -webkit-transform: scaleY(0.6);
      transform: scaleY(0.6);
    }

    100% {
      -webkit-transform: scaleY(1);
      transform: scaleY(1);
    }
  }

  @-webkit-keyframes circle {
    from {
      width: 0;
      height: 0;
      opacity: 0;
    }

    90% {
      width: var(--icon-circle-size);
      height: var(--icon-circle-size);
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  @keyframes circle {
    from {
      width: 0;
      height: 0;
      opacity: 0;
    }

    90% {
      width: var(--icon-circle-size);
      height: var(--icon-circle-size);
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  @-webkit-keyframes circles {
    from {
      -webkit-transform: scale(0);
      transform: scale(0);
    }

    40% {
      opacity: 1;
    }

    to {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      opacity: 0;
    }
  }

  @keyframes circles {
    from {
      -webkit-transform: scale(0);
      transform: scale(0);
    }

    40% {
      opacity: 1;
    }

    to {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      opacity: 0;
    }
  }
`;
