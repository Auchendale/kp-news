const db = require("../db/connection")
const { selectTopics } = require("../models/topics.models.js")

exports.selectArticleByID = (article_id) => {
    return db
        .query(`
            SELECT articles.*, COUNT(comment_id)::INT AS comment_count
            FROM articles
            LEFT JOIN comments ON comments.article_id = articles.article_id
            WHERE articles.article_id = $1
            GROUP BY articles.article_id;`
            , [article_id])
        .then(({ rows }) => {
            if(rows.length === 0){
                return Promise.reject({status: 404, msg: "Article does not exist"})
            }
            else{
                return rows
            }
        })
}

exports.selectArticles = (sort_by = "created_at", order = "desc", topic, validTopic) => {
    const validSortBy = ["author", "title", "article_id", "topic", "created_at", "votes", "comment_count"]
    const validOrder = ["asc", "desc"]
    
    if(!validSortBy.includes(sort_by) || !validOrder.includes(order)){
        return Promise.reject({ status: 400, msg: "Invalid query"})
    }

    if(topic && !validTopic.includes(topic)){
        return Promise.reject({ status: 404, msg: "Topic does not exist"})
    }

    let queryString = `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`
    
    const queryVal = []

    if(topic){
        queryString += ` WHERE topic = $1`
        queryVal.push(topic)
    }

    return db
        .query(`${queryString} GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order};`, queryVal)
        .then(({ rows }) => {
            return rows
        })
}

exports.selectComments = (article_id) => {
    return db
        .query(`
            SELECT * FROM comments WHERE article_id = $1
            ORDER BY created_at DESC;`, [article_id])
        .then(({ rows }) => {
            return rows
        })
}

exports.insertComment = ({username, body, article_id}) => {
    if(username && body && article_id){
        return db
            .query(`
                INSERT INTO comments 
                    (author, body, article_id)
                VALUES 
                    ($1, $2, $3)
                RETURNING *;
                `, [username, body, article_id])
            .then(({ rows } ) => {
                return rows
            })
    }
    else{
        return Promise.reject({status: 400, msg: "Bad request"})
    }
}

exports.updateArticle = ({article_id, inc_votes}) => {
    if(article_id && inc_votes){
        return db
            .query(`
                UPDATE articles
                SET votes = votes + $2
                WHERE article_id = $1
                RETURNING *;
                `, [article_id, inc_votes])
            .then(({ rows }) => {
                return rows
            })
    }
    else{
        return Promise.reject({status: 400, msg: "Bad request"})
    }
}