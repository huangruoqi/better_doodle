import styled from "styled-components";
const StyledLoading = styled.div`
  z-index:1;
  position: relative;
  width: 6vh;
  height:5.5vh;
  border-radius: 50%;
  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: inherit;
  }
  &::before {
    width:100%;
    height:100%;
    background-image: linear-gradient(
      0deg,#00ff48 0%,
      #337799 100%
    );
    animation: spin 1.5s infinite linear;
  }
  &::after {
    width:85%;
    height: 85%;
    background-color: #282c34;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
  }
  @keyframes spin {
    to {
      transform: rotate(360deg)
    }
  }

`;

export default function() { 
  return <StyledLoading></StyledLoading> 
}