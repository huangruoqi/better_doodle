import styled from "styled-components";
const StyledButton = styled.div`

box-shadow: 0 0 2vh green;
  text-decoration: none;
  font-size: 2vh;
  width:5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  color: #2abb62;
  padding: 0.3vh 2vh;
  padding-top: 0;
  border: 0.3vh solid #1fe88e;
  position: relative;
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 2vh;
    height: 2vh;
    border: inherit;
    transition: all .5s;
  }
  &::before {
    top:-1vh;
    left:-1vh;
    border-width: 3px 0 0 3px;
  }
  &::after {
    bottom: -1vh;
    right: -1vh;
    border-width: 0 3px 3px 0;
  }
  &:hover::before,
  &:hover::after {
    width: calc(100% + 1.65vh);
    height: calc(100% + 1.65vh);
    cursor: pointer;
  }
`;

export default function({onClick, text}) { 
  return <StyledButton onClick={onClick}>{text}</StyledButton> 
}