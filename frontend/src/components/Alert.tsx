import { useState, useEffect } from "react";
import styled from "styled-components";

export default function Alert({
  message,
  type,
}: {
  message: string;
  type: string;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [visible]);
  return (
    <>
      {visible && (
        <ToastContainer>
          <ToastMessage $type={type}>
            <p>{message}</p>
            <CloseButton>&times;</CloseButton>
          </ToastMessage>
        </ToastContainer>
      )}
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
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
`;
