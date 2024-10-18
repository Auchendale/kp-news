const express = require('express')
const app = express()
const apiRouter = require("./subrouters/api.router.js")
const articleRouter = require("./subrouters/articles.router.js");
const usersRouter = require("./subrouters/users.router.js")
const commentsRouter = require("./subrouters/comments.router.js")

const { getTopics} = require("./controllers/topics.controller.js")

app.use(express.json());

app.use('/api', apiRouter);

app.get("/api/topics", getTopics)

apiRouter.use('/articles', articleRouter)

apiRouter.use('/users', usersRouter)

apiRouter.use('/comments', commentsRouter)

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