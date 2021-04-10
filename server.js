
const express = require('express');
const cors = require('cors');
const axios = require('axios')
const port = 8080

const baseUrl = "https://swapi.dev/api"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors());

app.get("/people", async (req, res) => {
    const { sortBy } = req.query

    try {

        resp = await axios.get(`${baseUrl}/people`)
        let people = resp.data.results
        if(['name', 'height', 'mass'].includes(sortBy)) {
            people.sort((a,b) => {
                return a[sortBy] - b[sortBy]
            })
        }
        res.json(people)
    } catch(e) {
        res.sendStatus(500)
    }
})

app.get("/planets", async (req, res) => {
    console.log("/planets")
    try {
        resp = await axios.get(`${baseUrl}/planets`)
        const planets = resp.data.results

        for(let i = 0; i < planets.length; i++) {
            planet = planets[i]
            planet.residents = await Promise.all(planet.residents.map(async resident => {
                console.log("resident: ", resident)
                const { data } = await axios.get(resident)
                return data.name
            }))
            console.log(planet.residents)
        }
        res.json(planets)
    } catch(e) {
        console.log("\n\nERROR!!!!!!!!:", e)
        res.sendStatus(500)
    }
})

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.listen(port, () => {
    console.log('server started on port ' + port);
});
