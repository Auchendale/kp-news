const apiRouter = require("express").Router();
const fs = require("fs/promises")

apiRouter.get("/", (req, res) => {
    fs.readFile("./endpoints.json", "utf-8").then((availableEndpoints) => {
        const parsedEndpoints = JSON.parse(availableEndpoints)
        res.status(200).send({endpoints: parsedEndpoints})
    })
})

module.exports = apiRouter