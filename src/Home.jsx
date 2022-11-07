import sheetdb from 'sheetdb-node';
import styled from 'styled-components';
import * as React from 'react';

var config = {
    address: 'ju33yniko75pk',
};
var client = sheetdb(config);

const date = new Date()
const day = date.getDay()
const day2name = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT", "Time"]
const day2date = [""]
const current = new Date()
for (let i = 0; i < 7; i++) {
    day2date.push(current.toLocaleDateString('en-US', 'America/Los_Angeles'))
    current.setDate(current.getDate()+1)
}

function getTime(index) {
    return `${Math.floor(index/2)}:${index%2===0?"00":"30"}`
}

const Home = () => {
    const [timeRanges, setTimeRanges] = React.useState(new Array(7).fill(0).map((e,i)=>new Array(49).fill(0)))
    const [select, setSelect] = React.useState(-1)
    const chooseTime = (date, time) => {
        const num = date*49+time
        const prevDate = Math.floor(select/49)
        const prevTime = select%49
        if (select<0) {
            setSelect(num)
        }
        else{
            if (prevDate === date) {
                if (prevTime < time) {
                    setTimeRanges(e=>{
                        for (let i = prevTime; i <= time ;i++){
                            e[date][i] = 1
                        }
                        return e
                    })
                    setSelect(-1)
                } else if (prevTime === time){
                    setSelect(-1)
                }
                else {
                    setSelect(num)
                }
            }
            else {
                setSelect(num)
            }
        }
        return true
    }


    return (
        <MainContainer>
            <DAYS ranges={timeRanges} setRange={setTimeRanges}/>
            <TIME ranges={timeRanges} select={select} chooseTime={chooseTime} />
            <button onClick={() => console.log(JSON.parse(JSON.stringify(timeRanges)))}>alkdjfsd</button>
        </MainContainer>
    )
}

{/* <button onClick={() => {
    let rows = [
        { name: "Ruoqi Huang", date: "11/04/2022", from: 1, to: 20 },
        { name: "Ruoqi Huang", date: "11/05/2022", from: 10, to: 30 },
    ]
    // client.create(rows).then(function (data) {
    //     console.log(data);
    // }, function (err) {
    //     console.log(err);
    // });
}}>submit</button> */}

const MainContainer = styled.div`
  width:100%;
  height:100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-bottom: 10vh;
`

const DAYS = ({setRange, ranges}) => {
    const days = [7]
    for (let i = 0; i < 7; i++) {
        days.push((day+i)%7)
    }
    return (
        <DaysContainer>
            {
                days.map((e, i) => <DayItem key={i} e={e} i={i} setRange={setRange} ranges={ranges} />)
            }
        </DaysContainer>
    )
    
}

const TIME = ({select, ranges, chooseTime}) => {

    return (
        <TimeContainer>
            {new Array(49).fill(0).map((e1, i1) => (
                <TimeRow key={i1}> { new Array(8).fill(0).map((e2, i2) => 
                    i2===0?<TimeLabel key={i2} index={i1}><div >{getTime(i1)}</div></TimeLabel>
                    :<TimeItem 
                    key={i2} index={i1}><div style={{
                        boxShadow: `0 0 ${(i1+(i2-1)*49)===select?2:0.5}vh green`,
                        backgroundColor: (i1+(i2-1)*49)===select||ranges[i2-1][i1]>0?'#53c996a0':'#44a37a51'
                    }} onClick={
                        () => chooseTime(i2-1, i1)
                    }></div></TimeItem>
                )}</TimeRow>
            ))}
        </TimeContainer>
    )
}

const TimeContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const TimeRow = styled.div`
    width:100%;
    height:3.5vh;
    display: flex;
    justify-content: center;
`

const TimeLabel = styled.div`
    width:10vh;
    height:90%;
    margin: 0.5vh;
    display: flex;
    justify-content: center;
    align-items: center;
    div{
        width:100%;
        height:100%;
        border-top-right-radius: 100%;
        border-bottom-left-radius: 100%;
        font-size: 1.5vh;
        background-color: #44a37a;
        justify-content: center;
        align-items: center;
        display: flex;
        box-shadow: 0 0 0.7vh #55987c ;
    }
`

const TimeItem = styled.div`
    width:10vh;
    height:90%;
    display: flex;
    margin: 0.5vh;
    justify-content: center;
    align-items: center;
    div{
        width:2vh;
        height:2vh;
        display: flex;
        background-color: #44a37a51;
        border-radius: 50%;
    }
    div:hover{
        cursor: pointer;
    }
`

const DaysContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`

const DayItem = ({e,i, ranges, setRange}) => {
    return (
        <ItemContainer onClick={() => {
                let s = 0
                const m = [...ranges]
                const col = i - 1
                for (let k = 0; k < 49; k++) {
                    if (m[col][k]>0) s++
                }
                for (let k = 0; k < 49; k++) {
                    if (s==49) {
                        m[col][k] = 0
                    }
                    else{
                        m[col][k] = 1
                    }
                }
                setRange(m)
            }}>
            <DayContainer> {day2name[e]} </DayContainer>
            <DateContainer> {day2date[i]} </DateContainer>
        </ItemContainer>
    )
}

const ItemContainer = styled.div`
    width:10vh;
    height:10vh;
    background-color: dodgerblue;
    margin: 0.5vh;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    box-shadow: 0 0 1vh dodgerblue;
    cursor: pointer;
`

const DateContainer = styled.div`
    font-size: small;
`
const DayContainer = styled.div`
    font-weight: bold;
    font-size: x-large;
`



export default Home