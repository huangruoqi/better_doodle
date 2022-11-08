import styled from "styled-components";
import * as React from "react";
import Button from "./Button";
import { mobile, getTime } from "./utils";

const date = new Date();
const day = date.getDay();
const day2name = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT", "Time"];
const day2date = [""];
const current = new Date();
for (let i = 0; i < 7; i++) {
  day2date.push(current.toLocaleDateString("en-US", "America/Los_Angeles"));
  current.setDate(current.getDate() + 1);
}
function getName(n) {
  if (n.length>12) {
    return n.substring(0, 9)+'...'
  }
  return n
}

const Admin = ({data, refresh}) => {

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
  if (data.length!==0 && table.length===data.length) {
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
    <MainContainer>
      <DAYS />
      <TIME table={table} data={data} />
      <div style={{padding:"2vh", alignSelf:'center'}}>
      <Button
        onClick={refresh}
        text="↺"
      >
      </Button>
      </div>
      <SUMMARY table={table} data={data} />
    </MainContainer>
  );
};

const SummaryContainer = styled.div`
  width: 90vh;
  height: 28vh;
  display: flex;
  background-color: #aaaaaa4b;
  border-radius: 3vh;
  flex-direction: column;
  align-self:center;
  @media ${mobile} {
    width: 90vw;
    height: 40vw;
  border-radius: 3vw;
  }
`

const SummaryRow = styled.div`
  font-size: 2vh;
  width: 100%;
  height: 3vh;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  border-radius: 0.8vh;
  display: flex;
  @media ${mobile} {
    height: 5vw;
    margin-top: 0.5vw;
    margin-bottom: 0.5vw;
    border-radius: 0.8vw;
    font-size: 3vw;
  }
`
const SummaryItem = styled.div`
  width: 12vh;
  margin-right: 0.5vh;
  background-color: #2c7fa8;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1vh;
  font-size: 2vh;
  @media ${mobile} {
    width: 15vw;
    font-size: 2.4vw;
    margin-right: 1vw;
    border-radius: 1vw;
  }
`

const SUMMARY = ({table, data}) => {
  if (table.length === data.length) {
    return <></>
  }
  const summary = table[table.length-1]

  const constructRanges = m => {
    const ranges = []
    let left = -1
    for (let i = 0 ; i < m.length; i++) {
      if (left<0 && m[i]===1) { left = i }
      else if (left>=0 && m[i]===0) {
        ranges.push([left, i])
        left = -1
      }
      if (i===m.length-1&&m[i]===1){
        ranges.push([left, 48])
      }
    }
    return ranges
  }
  
  return (
    <SummaryContainer key={-1}>
      {summary.map((e1, i1) => {
        const ranges = constructRanges(e1)
        return (
          i1===0?<div key={1000}></div>:
          <SummaryRow key={i1}>
            <div 
              style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#52cf67ba',
              width: '12vh',
              borderRadius: '2vh',
              marginLeft: '1vh',
              marginRight: '1vh'
            }} >{day2date[i1]}</div>
            {ranges.map((e2, i2) => <SummaryItem key={i1*7+i2}>{getTime(e2[0])+'~'+getTime(e2[1])}</SummaryItem>)}
          </SummaryRow>
          )}
      )}
    </SummaryContainer>
  )
}

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

const TIME = ({ table, data }) => {

  return (
    <TimeContainer>
      {table.map((e, i) => (
        <TimeRow key={i} index={i} table={e} name={getName(data[i]?.name||"SUMMARY")} />
      ))}
    </TimeContainer>
  );
};

const TimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width:88vh;
  @media ${mobile} {
    width: 88vw;
  }
  align-self: center;
`;

const TimeRowDIV = styled.div`
  width: 100%;
  height: 3.5vh;
  display: flex;
  justify-content: center;
  @media ${mobile} {
    height: 12vw;
  }
`;

const TimeLabel = styled.div`
  width: 10vh;
  height: 90%;
  margin: 0.5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    position: absolute;
    width: 10vh;
    height: 3vh;
    border-top-right-radius: 50%;
    border-bottom-left-radius: 50%;
    font-size: 1.5vh;
    font-weight: bold;
    background-color: ${props=>props.color};
    justify-content: center;
    align-items: center;
    display: flex;
    box-shadow: 0 0 0.7vh #55987c;

    
@media ${mobile} {
    border-top-right-radius: 0;
    border-bottom-left-radius: 0;
    border-radius: 10px;
    font-size: 2.n2vw;
    width: 16vw;

    height: 10vw;
    transform: translate(-3vw);
}

  }
@media ${mobile} {
  margin: 1vw;
  min-width: 10vw;
}
`;

const TimeRow = ({ name, table }) => {
  return (
    <TimeRowDIV>
      {table.map((e, i) =>
        i === 0 ? (
          <TimeLabel key={i} color={name==="SUMMARY"?"#2e99c0":"#44a37a"}><div>{name}</div></TimeLabel>
        ) : (
          <TimeItem table={e} key={i} color={name==="SUMMARY"?"#2e99c0":"#44a37aa1"} />
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
const TimeItem = ({ table, color }) => {
  return (
    <TimeItemDIV>
      {table.map((e, i) => <TimeSegment color={color} key={i} available={e} />)}
    </TimeItemDIV>
  )
}

const TimeSegment = ({ available, color }) => {
    return(
    <div style={{
      flex: 1, backgroundColor: available ? color : 'transparent', height: "100%"
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
  min-width: 10vh;
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

@media ${mobile} {
  min-width: 10vw;
  height: 10vw;
  margin: 0.5vw;
}
`;

const EmptyContainer = styled.div`
  min-width: 10vh;
  height: 10vh;
  margin: 0.5vh;
@media ${mobile} {
  min-width: 10vw;
  height: 10vw;
}
`;

const DateContainer = styled.div`
  font-size: 1.4vh;
@media ${mobile} {
    font-size: 1.5vw;
}

`;
const DayContainer = styled.div`
  font-weight: bold;
  font-size: 3vh;
@media ${mobile} {
    font-size: 3vw;
}
`;

export default Admin;

