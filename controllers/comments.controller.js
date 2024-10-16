const { removeCommentByID } = require("../models/comments.models")

exports.deleteCommentByID = (req, res) => {
    removeCommentByID().then(() => {
        res.status(204).send()
    })
}