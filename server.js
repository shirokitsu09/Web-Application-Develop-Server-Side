const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

const bodyParser = require('body-parser')
const { default: axios } = require('axios')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let result;
let max_peed;

const fetchData = async (id) => {
    await axios.get('https://script.googleusercontent.com/macros/echo?user_content_key=QnyNOZiOExrgANGZFGiMez5CmpjG9oeRhCWt9JaIclevjaUed4NrfsaWJq2eFAvg84QIk-kkKcHp96RWcl9X9Y6NW_5wd5tmm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnOQwROx_Wq-O5wsPy5w5JUsdPdcpj8TWgjjVAuN4sDTiMrnThHKU7n7LmNcslGllO5_ldGegmAJuXjfvqC1tFaecv-CYmXuM6Nz9Jw9Md8uu&lib=M9_yccKOaZVEQaYjEvK1gClQlFAuFWsxN')
        .then(res => {
            res.data.data.map(item => {
                if (id == item.drone_id) {
                    result = item
                }
            })
        })
}

const fetchLogs = async () => {
    await axios.get('https://app-tracking.pockethost.io/api/collections/drone_logs/records').then(res => {
        // console.log(res.data)
        result = res.data;
    })
}

app.get('/configs/:id', async (req, res) => {
    try {
        await fetchData(req.params.id).then(res => {
            if (result.max_peed == null) {
                max_peed = 100
            }
            if (result.max_speed > 110) {
                max_peed = 110
            }
            return payload = {
                drone_id: result.drone_id,
                drone_name: result.drone_name,
                light: result.light,
                country: result.country,
                max_peed: max_peed
            }
        })
        res.send({ result: payload })
    } catch (err) {
        console.log(err);
    }
})

app.get('/status/:id', async (req, res) => {
    try {
        await fetchData(req.params.id).then(res => {
            return payload = result.condition
        })
        res.send({ condition: payload })
    } catch (err) {
        console.log(err);
    }
})

app.get('/logs', async (req, res) => {
    try {
        let results;
        await fetchLogs().then(async res => {
            // console.log(result)
            results = result.items.map(result => {
                const payload = {
                    drone_id: result.drone_id,
                    drone_name: result.drone_name,
                    created: result.created,
                    light: result.light,
                    country: result.country,
                    celsius: result.celsius
                }
                return payload
            })
        })
        res.send({ result: results })
    } catch (err) {
        console.log(err);
    }
})

app.post('/logs', async (req, res) => {
    try {
        let data = {
            celsius: req.body.celsius,
            country: 'Indonesia',
            drone_id: '65010413',
            drone_name: 'Thanapol Somrit'
        }
        // const data = req.body
        await axios("https://app-tracking.pockethost.io/api/collections/drone_logs/records",
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                // body: JSON.stringify(data)
                // data
            }, data).then(res => {
                res.status(200).json({
                    status: "success",
                    message: "add logs successful",
                    data: data,
                });
            }).catch(e => {
                res.status(500).json({
                    status: "fail",
                    message: e.message,
                    data: data,
                })
            })
    }
    catch (err) {
        console.log(err)
        res.status(500).send('server error try to find by id')
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port`, port)
})