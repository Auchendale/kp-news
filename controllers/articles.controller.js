const { selectArticleByID, selectArticles, selectComments, insertComment } = require("../models/articles.models")

exports.getArticle = (req, res, next) => {
    const { article_id } = req.params
    selectArticleByID(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({ articles })
    })
}

exports.getComments = (req, res, next) => {
    const { article_id } = req.params
    const commentPromises = [selectComments(article_id)]
    if(article_id){
        commentPromises.push(selectArticleByID(article_id))
    }
    Promise.all(commentPromises)
        .then((results) => {
            const comments = results[0]
            res.status(200).send({ comments })

        })
        .catch(next)
}

exports.postComment = (req, res, next) => {
    const {article_id} = req.params
    const {username, body} = req.body
    selectArticleByID(article_id)
        .then(() => {
            return insertComment({username, body, article_id}) 
        })
        .then((comment) => {
            res.status(201).send({ comment })
        })
        .catch(next)
}