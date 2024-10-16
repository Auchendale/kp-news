const { removeCommentByID, selectCommentByID } = require("../models/comments.models")

exports.deleteCommentByID = (req, res, next) => {
    const { comment_id } = req.params
    selectCommentByID(comment_id)
        .then(() => {
            return removeCommentByID(comment_id)
        })
        .then(() => {
            res.status(204).send()
        })
        .catch(next)
}