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