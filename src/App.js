import './App.css';
import styled from "styled-components";
import { 
    BrowserRouter as Router, Routes,
    Route, Outlet, Link } from "react-router-dom";
import Home from './Home'
import * as React from "react";




const Background = styled.div`
    position: absolute;
    top:0;
    left:0;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    background-color: #282c34;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Container = styled.div`
    width:80%;
    height:80%;
    display: flex;
    justify-content: center;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`
const Title = styled.h1`
    color: #fff;
`


function App() {
    return (
        <Background>
            <Title>Better Doodle</Title>
            <Router>
                <Layout />
                <Container>
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="*" element={<NoMatch />} />
                    </Routes> 
                </Container>
            </Router>
        </Background>
    );
}

const Navbar = styled.div`
    display: flex;
    
`

function Layout() {
  return (
    <>
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
    </>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
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
