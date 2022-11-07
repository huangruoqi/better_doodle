import sheetdb from "sheetdb-node";
import styled from "styled-components";
import * as React from "react";
import Button from "./Button";
import Circle from "./Circle";

var config = {
  address: "ju33yniko75pk",
};
var client = sheetdb(config);

const mock = [
    {name: "Ruoqi Huang", ranges:[{date:0,time:[[0,10],[20,40]]}, {date:2, time:[[10,30]]}, {date:3, time:[[0,10]]}]},
    {name: "Bryant D", ranges:[{date:0,time:[[2,5],[31,44]]}, {date:1, time:[[10,30]]}, {date:2, time:[[0,10]]}]},
]

const date = new Date();
const day = date.getDay();
const day2name = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT", "Time"];
const day2date = [""];
const current = new Date();
for (let i = 0; i < 7; i++) {
  day2date.push(current.toLocaleDateString("en-US", "America/Los_Angeles"));
  current.setDate(current.getDate() + 1);
}

function getTime(index) {
  return `${Math.floor(index / 2)}:${index % 2 === 0 ? "00" : "30"}`;
}

const Admin = () => {
  return (
    <MainContainer>
      <DAYS />
      <TIME data={mock}/>
      <h1>THIS IS MOCK DATA</h1>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const DAYS = () => {
  const days = [7];
  for (let i = 0; i < 7; i++) {
    days.push((day + i) % 7);
  }
  return (
    <DaysContainer>
      {days.map((e, i) => (
        <DayItem key={i} e={e} i={i} />
      ))}
    </DaysContainer>
  );
};

const TIME = ({data}) => {
  return (
    <TimeContainer>
      {data.map((e, i) => (
        <TimeRow key={i} ranges={e.ranges} name={e.name}>
        </TimeRow>
      ))}
    </TimeContainer>
  );
};

const TimeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimeRowDIV = styled.div`
  width: 100%;
  height: 3.5vh;
  display: flex;
  justify-content: center;
`;

const TimeLabel = styled.div`
  width: 10vh;
  height: 90%;
  margin: 0.5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    width: 100%;
    height: 100%;
    border-top-right-radius: 50%;
    border-bottom-left-radius: 50%;
    font-size: 1.5vh;
    font-weight: bold;
    background-color: #44a37a;
    justify-content: center;
    align-items: center;
    display: flex;
    box-shadow: 0 0 0.7vh #55987c;
  }
`;

const TimeItemDIV = styled.div`
  width: 10vh;
  padding-left: 0.5vh;
  padding-right: 0.5vh;
  height: 90%;
  display: flex;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  justify-content: center;
  align-items: center;
  background-color: #afbcb730;
`;
const TimeItem = ({time}) => {
    const m = new Array(48).fill(false)
    for (let i = 0; i < time.length; i++) {
        for (let j = time[i][0]; j < time[i][1]; j++) { m[j] = true }
    }
    return (
        <TimeItemDIV>
            {m.map((e, i)=><TimeSegment key={i} available={e} />)}
        </TimeItemDIV>
    )
}

const TimeSegment = ({available}) => (
    <div style={{
        flex:1, backgroundColor:available?'#44a37a51':'transparent',height:"100%"
    }} ></div>
)

const TimeRow = ({name, ranges}) => {
    const output = new Array(8).fill(0).map((e, i)=>([]))
    for (let i = 0; i < ranges.length; i++) { output[ranges[i].date] = [...ranges[i].time] }
    return (
        <TimeRowDIV>
            {output.map((e, i) =>
            i === 0 ? (
                <TimeLabel key={i}><div>{name}</div></TimeLabel>
            ) : (
                <TimeItem key={i} time={e} />
            )
            )}
        </TimeRowDIV>
  );
};

const DaysContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const DayItem = ({ e, i }) => {
  if (i === 0) return <EmptyContainer />;
  return (
    <ItemContainer>
      <DayContainer> {day2name[e]} </DayContainer>
      <DateContainer> {day2date[i]} </DateContainer>
    </ItemContainer>
  );
};

const ItemContainer = styled.div`
  width: 10vh;
  height: 10vh;
  background-color: dodgerblue;
  margin: 0.5vh;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 0 1vh dodgerblue;
  cursor: pointer;
  :hover {
    box-shadow: 0 0 3vh dodgerblue;
    transition: 0.5s;
  }
`;

const EmptyContainer = styled.div`
  width: 10vh;
  height: 10vh;
  margin: 0.5vh;
`;

const DateContainer = styled.div`
  font-size: small;
`;
const DayContainer = styled.div`
  font-weight: bold;
  font-size: x-large;
`;

export default Admin;
