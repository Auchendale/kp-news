const { selectArticleByID, selectArticles, selectComments, insertComment, updateArticle } = require("../models/articles.models")
const { selectTopics } = require("../models/topics.models.js")

exports.getArticle = (req, res, next) => {
    const { article_id } = req.params
    selectArticleByID(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    const { sort_by, order, topic, limit} = req.query
    selectTopics()
        .then((topics) => {
            const validTopic = []
            for(const topicObj of topics){
                validTopic.push(topicObj.slug)
            }
            return validTopic
        })
        .then((validTopic) => {
            return selectArticles(sort_by, order, topic, validTopic, limit)
        })
        .then((articles) => {
            res.status(200).send({ articles })
        })
        .catch(next)
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
    const { username, body } = req.body
    selectArticleByID(article_id)
        .then(() => {
            return insertComment({username, body, article_id}) 
        })
        .then((comment) => {
            res.status(201).send({ comment })
        })
        .catch(next)
}

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    selectArticleByID(article_id)
        .then(() => {
            return updateArticle({article_id, inc_votes}) 
        })
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch(next)
}