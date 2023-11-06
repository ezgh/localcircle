import { useState, ChangeEvent } from "react";
import styled from "styled-components";

export default function ToggleSwitch() {
  const [switchState, setSwitchState] = useState(false);
  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    console.log("---", e.target.checked);
    setSwitchState(!switchState);
  }
  return (
    <StyledLabel htmlFor="checkbox" checked={switchState}>
      <input
        id="checkbox"
        type="checkbox"
        checked={switchState}
        onChange={handleOnChange}
      />
    </StyledLabel>
  );
}

const StyledLabel = styled.label<{ checked: boolean }>`
  cursor: pointer;
  text-indent: -9999px;
  width: 62.5px;
  height: 31.75px;
  background: ${({ checked }) => (checked ? "#BA2207" : "#AAADBE")};
  display: block;
  border-radius: 100px;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    left: ${({ checked }) => (checked ? "calc(55% - 1.25px)" : "3.5px")};
    top: 3px;
    width: 25px;
    height: 25px;
    background: #fff;
    border-radius: 22.5px;
    transition: 0.3s;
  }
`;
