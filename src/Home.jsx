import sheetdb from "sheetdb-node";
import styled from "styled-components";
import * as React from "react";
import Button from "./Button";
import Circle from "./Circle";

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

function getTime(index) {
  return `${Math.floor(index / 2)}:${index % 2 === 0 ? "00" : "30"}`;
}
function constructOutput(m, name) {
  const output = [];
  let start = 0;
  const time = new Date().toLocaleString("en-US", "America/Los_Angeles")
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 49; j++) {
      if (m[i][j] === 2) start = j;
      if (m[i][j] === 3) {
        output.push({
          name: name,
          date: "$" + day2date[i + 1],
          time: time,
          from: start,
          to: j,
        });
      }
    }
  }
  return output;
}

const Home = () => {
  const [timeRanges, setTimeRanges] = React.useState(
    new Array(7).fill(0).map((e, i) => new Array(49).fill(0))
  );
  const [select, setSelect] = React.useState(-1);
  const chooseTime = (date, time) => {
    const num = date * 49 + time;
    const prevDate = Math.floor(select / 49);
    const prevTime = select % 49;
    if (select < 0) {
      setSelect(num);
    } else {
      if (prevDate === date) {
        if (prevTime < time) {
          const e = [...timeRanges];
          let flag = e[date][prevTime] === 2 && e[date][time] === 3;
          for (let i = prevTime + 1; i < time; i++) {
            flag &= e[date][i] === 1;
          }
          if (flag) {
            for (let i = prevTime; i <= time; i++) {
              e[date][i] = 0;
            }
            setTimeRanges(e);
            setSelect(-1);
            return true;
          }
          if (e[date][prevTime] === 3) {
            e[date][prevTime] = 1;
          }
          if (e[date][prevTime] === 0) {
            e[date][prevTime] = 2;
          }
          for (let i = prevTime + 1; i < time; i++) {
            e[date][i] = 1;
          }
          if (e[date][time] === 0) {
            e[date][time] = 3;
          }
          if (e[date][time] === 2) {
            e[date][time] = 1;
          }
          setTimeRanges(e);
          setSelect(-1);
        } else if (prevTime === time) {
          setSelect(-1);
        } else {
          setSelect(num);
        }
      } else {
        setSelect(num);
      }
    }
    return true;
  };

  const submitSchedule = (name) => {
    let rows = constructOutput(timeRanges, name);
    if (rows.length===0) {
        alert("Please select available time interval!!!")
        return
    }
    console.log(rows);
    client.create(rows).then(
      function (data) {
        console.log(data);
        setSelect(-1)
        setTimeRanges(new Array(7).fill(0).map((e, i) => new Array(49).fill(0)))
      },
      function (err) {
        console.log(err);
      }
    );
  };

  return (
    <MainContainer>
      <DAYS ranges={timeRanges} setRange={setTimeRanges} />
      <TIME ranges={timeRanges} select={select} chooseTime={chooseTime} />
      <SUBMIT submitSchedule={submitSchedule} />
    </MainContainer>
  );
};

const SUBMIT = ({ submitSchedule }) => {
  const [name, setName] = React.useState("");

  const handleChange = (event) => {
    setName(event.target.value);
  };
  return (
    <SubmitContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginRight: "1vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            fontWeight: "bold",
            color: "#c2e97b",
            zIndex: 2,
          }}
        >
          Name
        </div>
        <Circle />
      </div>

      <SubmitInput onChange={handleChange} name={name} />
      <Button
        onClick={() => {
          if (name.length > 0) {
            submitSchedule(name);
          }
          else {
            alert("Please enter your name!!!")
          }
        }}
      >
        SUBMIT
      </Button>
    </SubmitContainer>
  );
};
const SubmitContainer = styled.div`
  height: 10vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SubmitInput = styled.input`
  background-color: ${props=>props.name.length>0?"#6aa675":"#c65757"};
  height: 4vh;
  outline: none;
  border: none;
  width: 20vh;
  padding-left: 2vh;
  font-size: large;
  border-radius: 2vh;
  font-weight: bold;
  box-shadow: ${props=>props.name.length>0?"0 0 0 green":"0 0 2vh red"};
  :focus {
    box-shadow: ${props=>props.name.length>0?"0 0 2vh green":"0 0 2vh red"};
  }
  :hover {
    box-shadow: ${props=>props.name.length>0?"0 0 2vh green":"0 0 2vh red"};
  }
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const DAYS = ({ setRange, ranges }) => {
  const days = [7];
  for (let i = 0; i < 7; i++) {
    days.push((day + i) % 7);
  }
  return (
    <DaysContainer>
      {days.map((e, i) => (
        <DayItem key={i} e={e} i={i} setRange={setRange} ranges={ranges} />
      ))}
    </DaysContainer>
  );
};

const TIME = ({ select, ranges, chooseTime }) => {
  return (
    <TimeContainer>
      {new Array(49).fill(0).map((e1, i1) => (
        <TimeRow key={i1}>
          {" "}
          {new Array(8).fill(0).map((e2, i2) =>
            i2 === 0 ? (
              <TimeLabel key={i2} index={i1}>
                <div>{getTime(i1)}</div>
              </TimeLabel>
            ) : (
              <TimeItem
                key={i2}
                date={i2}
                time={i1}
                content={getTime(i1)}
                select={select}
                ranges={ranges}
                chooseTime={chooseTime}
              />
            )
          )}
        </TimeRow>
      ))}
    </TimeContainer>
  );
};

const TimeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimeRow = styled.div`
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
    border-top-right-radius: 100%;
    border-bottom-left-radius: 100%;
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
  height: 90%;
  display: flex;
  margin: 0.5vh;
  justify-content: center;
  align-items: center;
  .time_div {
    width: 2vh;
    height: 2vh;
    display: flex;
    background-color: #44a37a51;
  }
  .time_div:hover {
    cursor: pointer;
  }
`;
const TimeItem = ({ date, time, select, ranges, chooseTime }) => {
  const i2 = date;
  const i1 = time;
  const [hovered, setHovered] = React.useState(false);
  const status = ranges[i2 - 1][i1];
  const index = i1 + (i2 - 1) * 49;
  return (
    <TimeItemDIV>
      <div
        className="time_div"
        style={{
          boxShadow: `0 0 ${index === select ? 2 : 0.5}vh green`,
          backgroundColor:
            index === select
              ? "#00fa1d9f"
              : status > 0
              ? "#53c996a0"
              : "#44a37a51",
          borderRadius:
            status === 0 || index === select
              ? "50%"
              : status === 1
              ? "0"
              : status === 2
              ? "50% 0 50% 0"
              : "0 50% 0 50%",
        }}
        onClick={() => chooseTime(i2 - 1, i1)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {(hovered || index === select || status > 1) && (
          <TimeStamp>{getTime(i1)}</TimeStamp>
        )}
      </div>
    </TimeItemDIV>
  );
};

const TimeStamp = styled.div`
  position: absolute;
  width: 5vh;
  height: 3vh;
  background-color: #57a9e86d;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1vh;
  font-size: 1.3vh;
  font-weight: 900;
  transform: translate(2.7vh, -0.5vh);
`;

const DaysContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const DayItem = ({ e, i, ranges, setRange }) => {
  if (i === 0) return <EmptyContainer />;
  return (
    <ItemContainer
      onClick={() => {
        let s = 0;
        const m = [...ranges];
        const col = i - 1;
        for (let k = 0; k < 49; k++) {
          if (m[col][k] > 0) s++;
        }
        if (s === 49) {
          for (let k = 0; k < 49; k++) m[col][k] = 0;
        } else {
          m[col][0] = 2;
          m[col][48] = 3;
          for (let k = 1; k < 48; k++) m[col][k] = 1;
        }
        setRange(m);
      }}
    >
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

export default Home;
