\c nc_news_test

-- SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comment_id)::INT AS comment_count
-- FROM articles
-- LEFT JOIN comments ON comments.article_id = articles.article_id
-- GROUP BY articles.article_id
-- ORDER BY articles.created_at DESC;

-- SELECT * FROM comments WHERE article_id = 2;

-- INSERT INTO comments 
--     (author, body, article_id)
-- VALUES 
--     ('icellusedkars', 'test', 2)
-- RETURNING *;

-- UPDATE articles
-- SET
-- votes = votes + 15
-- WHERE
-- article_id = 2
-- RETURNING *;

-- SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comment_id)::INT AS comment_count
-- FROM articles
-- LEFT JOIN comments ON comments.article_id = articles.article_id
-- WHERE topic = 'cats'
-- GROUP BY articles.article_id
-- ORDER BY articles.created_at DESC

SELECT articles.*, COUNT(comment_id)::INT AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
WHERE articles.article_id = 3
GROUP BY articles.article_id;

