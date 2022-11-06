import sheetdb from 'sheetdb-node';
import styled from 'styled-components';
var config = {
    address: 'ju33yniko75pk',
};
var client = sheetdb(config);

const date = new Date()
const day = date.getDate()

const Home = () => (
    <Container>
        <DAYS />
        <button onClick={() => {
            let rows = [
                { name: "Ruoqi Huang", date: "11/04/2022", from: 1, to: 20 },
                { name: "Ruoqi Huang", date: "11/05/2022", from: 10, to: 30 },
            ]
            // client.create(rows).then(function (data) {
            //     console.log(data);
            // }, function (err) {
            //     console.log(err);
            // });
        }}>submit</button>
    </Container>
)

const Container = styled.div`
  width:100%;
  height:100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`

const DAYS = () => {
    const text = date.toLocaleDateString()
    const days = []
    for (let i = 0; i < 7; i++) {
        days.push((day+i)%7)
    }

    return (
        <DayContainer>
            {
                days.map((e, i) => <DayItem key={i} index={e} />)
            }
        </DayContainer>
    )
    
}

const DayContainer = styled.div`
    display: flex;
    flex-direction: row;
`
const ItemContainer = styled.div`
    width:10vh;
    height:10vh;
    background-color: dodgerblue;
    margin: 5px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
`
const DayItem = ({index}) => {
    const day2name = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    return (
        <ItemContainer>{day2name[index]}</ItemContainer>
    )
}
export default Home