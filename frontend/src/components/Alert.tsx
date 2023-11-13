import styled from "styled-components";

import { BsCheckCircle, BsXCircle } from "react-icons/bs";

export default function Alert({
  message,
  type,
}: {
  message: string;
  type: string;
}) {
  return (
    <>
      <ToastContainer>
        <ToastMessage $type={type}>
          <div className="icon">
            {type === "success" ? (
              <BsCheckCircle />
            ) : type === "fail" ? (
              <BsXCircle />
            ) : (
              ""
            )}
          </div>
          <p>{message}</p>
        </ToastMessage>
      </ToastContainer>
    </>
  );
}

const ToastMessage = styled.div<{ $type?: string }>`
  background-color: ${(props) =>
    props.$type === "success"
      ? "green"
      : props.$type === "fail"
      ? "red"
      : "gray"};

  color: white;
  padding: 5px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .icon {
    margin-right: 7px;
    font-size: 18px;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;
