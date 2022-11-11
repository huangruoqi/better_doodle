import sheetdb from "sheetdb-node";
import './App.css';
import styled from "styled-components";
import {
  BrowserRouter as Router, Routes,
  Route, Link
} from "react-router-dom";
import Home from './Home'
import Admin from './Admin'
import * as React from "react";
import { mobile } from './utils'

var config = {
  address: "ju33yniko75pk",
};
var client = sheetdb(config);

function getDate(date) {
  const current = new Date();
  for (let i = 0; i < 7; i++) {
    const s = current.toLocaleDateString("en-US", "America/Los_Angeles")
    if (s === date.substring(1)) {
      return i + 1
    }
    current.setDate(current.getDate() + 1);
  }
  return 0
}

function App() {

  const [data, setData] = React.useState([])


  const refresh = () => {
    client.read().then(function (res) {
      const table = {}
      res = JSON.parse(res)
      for (let i = 0; i < res.length; i++) { if (table[res[i]["name"]] === undefined) table[res[i]["name"]] = {} }
      for (let i = 0; i < res.length; i++) { if (table[res[i]["name"]][res[i]["time"]] === undefined) table[res[i]["name"]][res[i]["time"]] = {} }
      for (let i = 0; i < res.length; i++) { if (table[res[i]["name"]][res[i]["time"]][res[i]["date"]] === undefined) table[res[i]["name"]][res[i]["time"]][res[i]["date"]] = [] }
      for (let i = 0; i < res.length; i++) { table[res[i]["name"]][res[i]["time"]][res[i]["date"]].push([res[i]["from"], res[i]["to"]]) }

      const output = {}

      for (const name in table) {
        for (const time in table[name]) {
          const ranges = []
          for (const date in table[name][time]) {
            const d = getDate(date)
            if (d > 0) ranges.push({ date: d, time: table[name][time][date] })
          }
          if (output[name] === undefined) { output[name] = [] }
          output[name].push({ time: time, name: name, ranges: ranges })
        }
      }
      const final = []
      for (const name in output) {
        output[name].sort((a, b) => Date.parse(b.time) - Date.parse(a.time))
        final.push(output[name][0])
      }
      setData(final)
    }, function (error) {
      console.log(error);
    });
  }
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
            <Route path="/better_doodle/admin" element={<Admin data={data} refresh={refresh} />} />
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
    display: flex;
    justify-content: center;
    align-items: center; 
    flex-direction: column;
    width: 80%;
    @media ${mobile} {
        width:90%;
    }
`
const Title = styled.h1`
  font-size: 8vh;
  color: #fff;
    @media ${mobile} {
        font-size: 6vw;
    }
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
  font-size: 2vh;
@media ${mobile} {
    padding-top: 0;
    padding-left: 10vw;
  font-size: 2.7vw;
}
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

export default App;
