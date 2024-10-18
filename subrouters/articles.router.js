const articleRouter = require("express").Router();
const { getArticle, getArticles, getComments, postComment, patchArticle } = require("../controllers/articles.controller.js")

articleRouter.get("/", getArticles)

articleRouter.get("/:article_id", getArticle)

articleRouter.get("/:article_id/comments", getComments)

articleRouter.post("/:article_id/comments", postComment)

articleRouter.patch("/:article_id", patchArticle)

module.exports = articleRouter