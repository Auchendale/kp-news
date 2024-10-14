const express = require('express')
const app = express()

//---Controller Functions---
//Topics controllers
const { getTopics } = require("./controllers/topics.controller.js")

//--Endpoints--
app.get("/api/topics", getTopics)


//--Errors--
app.all("*", (req, res, next) => {
    res.status(404).send({ msg: `${req.originalUrl} is an invalid endpoint` }
    )
})

app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    else next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: "Server Error!"})
})

module.exports = app;