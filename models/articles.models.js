const db = require("../db/connection")

exports.selectArticleByID = (article_id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if(rows.length === 0){
                return Promise.reject({status: 404, msg: "Article does not exist"})
            }
            else{
                return rows
            }
        })
}

exports.selectArticles = () => {
    return db
        .query(`
            SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comment_id)::INT AS comment_count
            FROM articles
            LEFT JOIN comments ON comments.article_id = articles.article_id
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;
        `)
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