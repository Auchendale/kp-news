const { removeCommentByID, selectCommentByID, updateComment } = require("../models/comments.models")

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

exports.patchComment = (req, res) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    updateComment(comment_id, inc_votes).then((comment) => {
        res.status(200).send({ comment })
    })
}