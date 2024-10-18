const commentsRouter = require("express").Router();
const { deleteCommentByID, patchComment } = require("../controllers/comments.controller.js")

commentsRouter.delete("/:comment_id", deleteCommentByID)

commentsRouter.patch("/:comment_id", patchComment)

module.exports = commentsRouter