import styled from "styled-components";

import { RiCloseLine } from "react-icons/ri";
import { GoTrash } from "react-icons/go";

export default function DeleteUserModal({
  setIsModalOpen,
  onDeleteUser,
  authUser,
}: {
  onDeleteUser: (authUser: number) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
  authUser: number;
}) {
  const handleDelete = () => {
    setIsModalOpen(false);
    onDeleteUser(authUser);
  };
  return (
    <>
      <DarkBackground onClick={() => setIsModalOpen(false)} />
      <Centered>
        <ModalDiv>
          <ModalBody>
            <ModalHeader>
              <GoTrash style={{ fontSize: "3em" }} />
              <p style={{ color: "black" }}>
                Please enter your password to delete your account.
              </p>
              <p>This action can not be undone.</p>
            </ModalHeader>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </CloseButton>
            <ModalContent>
              <Buttons>
                <CancelButton>Cancel</CancelButton>
                <SubmitButton onClick={handleDelete}>Delete</SubmitButton>
              </Buttons>
              <p>It's sad to see you go.</p>
            </ModalContent>
          </ModalBody>
        </ModalDiv>
      </Centered>
    </>
  );
}

const DarkBackground = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  width: 100vw;
  height: 1000vh;
  z-index: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
`;

const Centered = styled.div`
  position: fixed;
  top: 50%;
  width: 25%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: 1024px) {
    width: 50%;
  }
  @media (max-width: 768px) {
    width: 80%;
  }
  @media (max-width: 425px) {
    width: 98%;
  }
`;

const ModalDiv = styled.div`
  background: white;
  color: white;
  z-index: 10;
  border-radius: 1.25rem;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.04);
  padding: 20px;
`;

const ModalBody = styled.div`
  padding: 20px;
  background: #f1f1f1;
  color: white;
  z-index: 10;
  border-radius: 1.25rem;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.04);
`;
const ModalContent = styled.div`
  p {
    text-align: center;
    color: black;
  }
`;

const ModalHeader = styled.div`
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const CloseButton = styled.button`
  cursor: pointer;
  border: none;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 18px;
  color: #2c3e50;
  background: white;
  transition: all 0.25s ease;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.06);
  position: absolute;
  right: 0;
  top: 0;
  align-self: flex-end;
  margin-top: -7px;
  margin-right: -7px;
`;

const SubmitButton = styled.button`
  padding: 1.8% 1%;
  width: 7rem;
  font-size: 1rem;
  border: none;
  border-radius: 1.375rem;
  background: #e73213;
  border: 1px solid #e73213;
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

const CancelButton = styled(SubmitButton)`
  margin-right: 10px;
  background-color: #f1f1f1;
  border: solid 1px gray;
  color: black;

  &:hover {
    background: gray;
  }
`;

const Buttons = styled.div`
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
