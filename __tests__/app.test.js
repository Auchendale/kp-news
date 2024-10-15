const app = require("../app.js")
const request = require("supertest")
const db = require("../db/connection.js")
const { topicData, articleData, userData, commentData } = require("../db/data/test-data/index.js")
const seed = require("../db/seeds/seed.js")

beforeEach(() => seed({ topicData, articleData, userData, commentData }))
afterAll(() => db.end())

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
    test("200 - returns documentation on available endpoints", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                const endpoints = Object.entries(body.endpoints)
                endpoints.forEach((endpoint) => {
                    const apiRegex = /\/api/
                    expect(apiRegex.test(endpoint[0])).toBe(true) 
                    if(endpoint[1].description){
                        expect(typeof endpoint[1].description).toBe("string")
                    }
                    if(endpoint[1].queries){
                        expect(typeof endpoint[1].queries).toBe("object")
                    }
                    if(endpoint[1].exampleResponse){
                        expect(typeof endpoint[1].exampleResponse).toBe("object")
                    }
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