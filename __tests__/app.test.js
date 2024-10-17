const app = require("../app.js")
const request = require("supertest")
const db = require("../db/connection.js")
const { topicData, articleData, userData, commentData } = require("../db/data/test-data/index.js")
const seed = require("../db/seeds/seed.js")
const endpointsJSON = require("../endpoints.json")

beforeEach(() => seed({ topicData, articleData, userData, commentData }))
afterAll(() => db.end())

describe("GET /api", () => {
    test("200 - returns documentation on available endpoints", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                expect(body.endpoints).toEqual(endpointsJSON)
            })
    })
})

describe("GET /api/topics", () => {
    test("200 - returns an array of topics", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                body.topics.forEach((topic) => {
                    expect(typeof topic.slug).toBe("string")
                    expect(typeof topic.description).toBe("string")
                })
            })
    })
})

describe("GET /api/articles", () => {
    test("200 - returns an array of article objects which is sorted by date", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy("created_at", {descending: true})
                body.articles.forEach((article) => {
                    expect(typeof article.author).toBe("string")
                    expect(typeof article.title).toBe("string")
                    expect(typeof article.article_id).toBe("number")
                    expect(typeof article.topic).toBe("string")
                    expect(typeof article.created_at).toBe("string")
                    expect(typeof article.votes).toBe("number")
                    expect(typeof article.article_img_url).toBe("string")
                    expect(typeof article.comment_count).toBe("number")
                    expect(article).not.toHaveProperty("body")
                })
            })
    })
    test("200 - returns a sorted array when a query and order are provided", () => {
        return request(app)
            .get("/api/articles?sort_by=author&order=asc")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy("author", {descending: false})
            })
            .then(() => {
                return request(app)
            .get("/api/articles?&order=asc")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy("created_at", {descending: false})
            })
            })
    })
    test("400 - returns an error message when an invalid query is provided", () => {
        return request(app)
            .get("/api/articles?sort_by=ouagadougou")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid query")
            })
            .then(() => {
                return request(app)
                .get("/api/articles?order=ASC")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid query")
                })  
            })
    })
})

describe("GET /api/articles/:article_id", () => {
    test("200 - returns an object of the specified article", () => {
        return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then(({ body }) => {
                expect(body.article[0].article_id).toBe(2)
                expect(body.article[0].title).toBe('Sony Vaio; or, The Laptop')
                expect(body.article[0].topic).toBe('mitch')
                expect(body.article[0].author).toBe('icellusedkars')
                expect(body.article[0].body).toBe('Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.')
                expect(body.article[0].created_at).toBe('2020-10-16T05:03:00.000Z')
                expect(body.article[0].votes).toBe(0)
                expect(body.article[0].article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
            })
    })
    test("400 - returns an error message when given an invalid id", () => { 
        return request(app)
            .get("/api/articles/flatPackGallows")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request")
            })
    })
    test("404 - returns an error message when given a valid but non existent id", () => {
        return request(app)
            .get("/api/articles/11032001")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article does not exist")
            })
    })
})

describe("GET /api/articles/:article_id/comments", () => {
    test("200 - returns an array of comment objects of a specified article", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toBeSortedBy("created_at", {descending: true})
                body.comments.forEach((comment) => {
                    expect(typeof comment.comment_id).toBe("number")
                    expect(typeof comment.votes).toBe("number")
                    expect(typeof comment.created_at).toBe("string")
                    expect(typeof comment.author).toBe("string")
                    expect(typeof comment.body).toBe("string")
                    expect(typeof comment.article_id).toBe("number")
                })
            })
    })
    test("200 - returns an empty array when there are no comments on given article", () => {
        return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toHaveLength(0)
            })
    })
    test("400 - returns an error message when given an invalid id", () => {
        return request(app)
            .get("/api/articles/flatPackGallows/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request")
            })
    })
    test("404 - returns an error message when given a valid but non existent id", () => {
        return request(app)
            .get("/api/articles/11032001/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article does not exist")
            })
    })
})

describe("POST /api/articles/:article_id/comments", () => {
    test("201 - inserts a new comment to an article in the database", () => {
        const newComment = {
            username: "lurker",
            body: "imo mitch isn't even that good"
        }
        return request(app)
            .post("/api/articles/2/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment[0].comment_id).toBe(19)
                expect(body.comment[0].votes).toBe(0)
                expect(typeof body.comment[0].created_at).toBe("string")
                expect(body.comment[0].author).toBe("lurker")
                expect(body.comment[0].body).toBe("imo mitch isn't even that good")
                expect(body.comment[0].article_id).toBe(2)
            })
    })
    test("400 - returns an error message when given an invalid id", () => {
        const newComment = {
            username: "lurker",
            body: "imo mitch isn't even that good"
        }
        return request(app)
            .post("/api/articles/flatPackGallows/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request")
            })
    })
    test("400 - returns an error message when given a comment with no user", () => {
        const newComment = {
            body: "imo mitch isn't even that good"
        }
        return request(app)
            .post("/api/articles/2/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request")
            })
    })
    test("404 - returns an error message when given a valid but non existent id", () => {
        const newComment = {
            username: "lurker",
            body: "imo mitch isn't even that good"
        }
        return request(app)
            .post("/api/articles/11032001/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article does not exist")
            })
    })
})

describe("PATCH /api/articles/:article_id", () => {
    test("200 - updates the votes on an article then returns the updated article", () => {
        const newVotes = { inc_votes: 15}
        return request(app)
            .patch("/api/articles/2")
            .send(newVotes)
            .expect(200)
            .then(({ body }) => {
                expect(body.article[0].article_id).toBe(2)
                expect(body.article[0].title).toBe('Sony Vaio; or, The Laptop')
                expect(body.article[0].topic).toBe('mitch')
                expect(body.article[0].author).toBe('icellusedkars')
                expect(body.article[0].body).toBe('Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.')
                expect(body.article[0].created_at).toBe('2020-10-16T05:03:00.000Z')
                expect(body.article[0].votes).toBe(15)
                expect(body.article[0].article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')            
            })
    })
    test("200 - ignores unnecessary properties on sent object", () => { 
        const newVotes = {inc_votes: -17, catCount: 1}
        return request(app)
            .patch("/api/articles/1")
            .send(newVotes)
            .expect(200)
            .then(({ body }) => {
                expect(body.article[0].article_id).toBe(1)
                expect(body.article[0].author).toBe('butter_bridge')
                expect(body.article[0].title).toBe('Living in the shadow of a great man')
                expect(body.article[0].body).toBe('I find this existence challenging')
                expect(body.article[0].created_at).toBe('2020-07-09T20:11:00.000Z')
                expect(body.article[0].votes).toBe(83)

            })
    })
    test("400 - returns an error message when given an invalid id", () => {
        const newVotes = { inc_votes: 1103}
        return request(app)
            .patch("/api/articles/brat_365")
            .send(newVotes)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request")
            })
    })
    test("400 - returns an error message when given an object with no votes", () => {
        const newVotes = { clario_stan: true}
        return request(app)
            .patch("/api/articles/1")
            .send(newVotes)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request")
            })
    })
    test("404 - returns an error message when given a valid but non existent id", () => {
        const newVotes = { inc_votes: 15}
        return request(app)
            .patch("/api/articles/11032001")
            .send(newVotes)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article does not exist")
            })
    })
})

describe("DELETE /api/comments/comment_id", () => {
    test("204 - deletes the specified comment and sends no body back", () => {
        return request(app)
            .delete("/api/comments/17")
            .expect(204)
    })
    test("400 - returns an error message when given an invalid id", () => {
        return request(app)
            .delete("/api/comments/sisyphus")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request")
            })
    })
    test("404 - returns an error message when given a valid but non existent_id", () => {
        return request(app)
            .delete("/api/comments/11032001")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Comment does not exist")
            })
    })
})

describe("GET /api/users", () => {
    test("200 - returns an array of users", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                expect(body.users).not.toHaveLength(0)
                body.users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
    })
})

describe("General Error Handling", () => {
    test("404 - error when non existent endpoint is entered", () => {
        return request(app)
            .get("/api/oopsies")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("/api/oopsies is an invalid endpoint")
            })
    })
})