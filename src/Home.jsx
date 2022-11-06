import sheetdb from 'sheetdb-node';
var config = {
    address: 'ju33yniko75pk',
};
var client = sheetdb(config);
const Home = () => (
    <div>
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
        }}>acb</button>
    </div>
)

export default Home