const db = require("../db/connection")

exports.selectCommentByID = (comment_id) => {
    return db
        .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
        .then(({ rows }) => {
            if(rows.length === 0){
                return Promise.reject({status: 404, msg: "Comment does not exist"})
            }
            else{
                return rows
            }
        })
}

exports.removeCommentByID = (comment_id) => {
    return db
        .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
}

exports.updateComment = (comment_id, inc_votes) => {
    return db
        .query(`
            UPDATE comments
            SET votes = votes + $2
            WHERE comment_id = $1
            RETURNING *
            `, [comment_id, inc_votes])
        .then(({ rows }) => {
            return rows[0]
        })
}