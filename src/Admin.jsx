import sheetdb from "sheetdb-node";
import styled from "styled-components";
import * as React from "react";
import Button from "./Button";

var config = {
  address: "ju33yniko75pk",
};
var client = sheetdb(config);

const date = new Date();
const day = date.getDay();
const day2name = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT", "Time"];
const day2date = [""];
const current = new Date();
for (let i = 0; i < 7; i++) {
  day2date.push(current.toLocaleDateString("en-US", "America/Los_Angeles"));
  current.setDate(current.getDate() + 1);
}

function getDate(date) {
  const current = new Date();
  for (let i = 0; i < 7; i++) {
    const s = current.toLocaleDateString("en-US", "America/Los_Angeles")
    if (s===date.substring(1)) {
      return i+1
    }
    current.setDate(current.getDate() + 1);
  }
  return 0
}

const Admin = () => {
  const [data, setData] = React.useState([])

  const refresh = () => {
    client.read().then(function (res) {
      const table = {}
      res = JSON.parse(res)
      for (let i = 0 ; i < res.length; i++) { if (table[res[i]["name"]]===undefined) table[res[i]["name"]] = {} }
      for (let i = 0 ; i < res.length; i++) { if (table[res[i]["name"]][res[i]["time"]]===undefined) table[res[i]["name"]][res[i]["time"]] = {} }
      for (let i = 0 ; i < res.length; i++) { if (table[res[i]["name"]][res[i]["time"]][res[i]["date"]]===undefined) table[res[i]["name"]][res[i]["time"]][res[i]["date"]] = []}
      for (let i = 0 ; i < res.length; i++) { table[res[i]["name"]][res[i]["time"]][res[i]["date"]].push([res[i]["from"], res[i]["to"]]) }

      const output = {}

      for (const name in table) {
        for (const time in table[name]) {
          const ranges = []
          for (const date in table[name][time]) {
            const d = getDate(date)
            if (d>0) ranges.push({date: d, time: table[name][time][date]})
          }
          if (output[name]===undefined) { output[name] = [] }
          output[name].push({time: time, name: name, ranges: ranges})
        }
      }
      const final = []
      for (const name in output) {
        output[name].sort((a,b) => Date.parse(b.time) - Date.parse(a.time))
        final.push(output[name][0])
      }
      setData(final)
    }, function (error) {
      console.log(error);
    });
  }

  return (
    <MainContainer>
      <DAYS />
      <TIME data={data} />
      <div style={{paddingTop:"2vh"}}>
      <Button
        onClick={refresh}
        text="↺"
      >
      </Button>
      </div>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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

const TIME = ({ data }) => {
  const table = new Array(data.length).fill(0).map(()=>new Array(8).fill(0).map(()=>new Array(48).fill(0)))
  for (let i = 0; i < data.length; i++) {
    const output = new Array(8).fill(0).map(() => ([]))
    const ranges = data[i].ranges
    for (let j = 0; j < ranges.length; j++) { output[ranges[j].date] = [...ranges[j].time] }
    for (let j = 0; j < output.length; j++) {
      const time = output[j]
      for (let t = 0; t < time.length; t++) {
        for (let k = parseInt(time[t][0]); k < parseInt(time[t][1]); k++) { table[i][j][k] = 1 }
      }
    }
  }

  if (data.length!==0) {
    const summary = new Array(8).fill(0).map(()=>new Array(48).fill(1))
    for (let i = 0; i < table.length; i++) {
      for (let j = 0; j < 8; j++) {
        for (let k = 0; k < 48; k++) {
          if (table[i][j][k]===0) summary[j][k]=0
        }
      }
    }
    table.push(summary)
  }

  return (
    <TimeContainer>
      {table.map((e, i) => (
        <TimeRow key={i} index={i} table={e} name={data[i]?.name||"SUMMARY"} />
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

const TimeRow = ({ name, table }) => {
  return (
    <TimeRowDIV>
      {table.map((e, i) =>
        i === 0 ? (
          <TimeLabel key={i}><div>{name}</div></TimeLabel>
        ) : (
          <TimeItem table={e} key={i} />
        )
      )}
    </TimeRowDIV>
  );
};

const TimeItemDIV = styled.div`
  width: 11vh;
  height: 90%;
  display: flex;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  justify-content: center;
  align-items: center;
  background-color: #afbcb730;
`;
const TimeItem = ({ table }) => {
  return (
    <TimeItemDIV>
      {table.map((e, i) => <TimeSegment key={i} available={e} />)}
    </TimeItemDIV>
  )
}

const TimeSegment = ({ available }) => {
    return(
    <div style={{
      flex: 1, backgroundColor: available ? '#44a37a51' : 'transparent', height: "100%"
    }} ></div>
  )
}


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
