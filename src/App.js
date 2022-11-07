import './App.css';
import styled from "styled-components";
import {
    BrowserRouter as Router, Routes,
    Route, Link
} from "react-router-dom";
import Home from './Home'
import * as React from "react";


function App() {
    return (
        <Background>
            <Router>
                <NavContainer>
                    <Title>Better Doodle</Title>
                    <Layout />
                </NavContainer>
                <MainContainer>
                    <Routes>
                        <Route path="/better_doodle" element={<Home />} />
                        <Route path="/better_doodle/admin" element={<Admin />} />
                        <Route path="*" element={<NoMatch />} />
                    </Routes>
                </MainContainer>
            </Router>
        </Background>
    );
}

const Background = styled.div`
  position: absolute;
  top:0;
  left:0;
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 101vh;
  background-color: #282c34;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const MainContainer = styled.div`
  width:80%;
  height:85%;
  display: flex;
  justify-content: center;
  align-items: center; 
  flex-direction: column;
`
const Title = styled.h1`
  font-size: 8vh;
  color: #fff;
`

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const Navbar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2.5vh;
  padding-left: 10vh;
`
const NavItem = styled.div`
  margin: 5px;
  padding: 5px;
  background-color: beige;
  border-radius: 5px;
  :hover {
    opacity: 0.35;
    transition: 0.5s;
  }
  transition: 1s;
`

function Layout() {
    return (
        <Navbar>
            <Link to="/better_doodle" style={{ fontWeight: 'bold', textDecoration: 'none', color: "black" }}><NavItem >Home</NavItem></Link>
            <Link to="/better_doodle/admin" style={{ fontWeight: 'bold', textDecoration: 'none', color: "black" }}><NavItem >Admin</NavItem></Link>
        </Navbar>
    );
}

function NoMatch() {
    return (
        <div>
            <h2>Nothing to see here!</h2>
            <p>
                <Link to="/better_doodle">Go to the home page</Link>
            </p>
        </div>
    );
}

function Admin() {
    return (
        <div>
            <h2>Admin</h2>
        </div>
    );
}

export default App;
