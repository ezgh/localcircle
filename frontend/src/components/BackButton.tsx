import styled from "styled-components";

export const BackButton = styled.button<{ $mobile?: boolean }>`
  margin-top: 5px;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  border: none;
  padding-top: 5px;
  cursor: pointer;
  background-color: #f1f1f1;

  &:hover {
    background-color: #f9f9f9;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;
