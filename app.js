const express = require('express')
const app = express()
const fs = require("fs/promises")

const { getTopics} = require("./controllers/topics.controller.js")
const { getArticle, getArticles, getComments, postComment, patchArticle } = require("./controllers/articles.controller.js")
const { deleteCommentByID } = require("./controllers/comments.controller.js")
const { getUsers } = require("./controllers/users.controller.js")

app.use(express.json());

app.get("/api", (req, res) => {
    fs.readFile("./endpoints.json", "utf-8").then((availableEndpoints) => {
        const parsedEndpoints = JSON.parse(availableEndpoints)
        res.status(200).send({endpoints: parsedEndpoints})
    })
})

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticle)

app.get("/api/articles/:article_id/comments", getComments)

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", patchArticle)

app.delete("/api/comments/:comment_id", deleteCommentByID)

app.get("/api/users", getUsers)


app.all("*", (req, res, next) => {
    res.status(404).send({ msg: `${req.originalUrl} is an invalid endpoint` }
    )
})

app.use((err, req, res, next) => {
    if(err.code === "22P02"){
        res.status(400).send({ msg: "Bad request"})
    }
    else next(err)
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