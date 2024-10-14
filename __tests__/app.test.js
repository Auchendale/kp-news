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