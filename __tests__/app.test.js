const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const app  = require ("../app")
const request = require("supertest")
const testData = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")

/* Set up your beforeEach & afterAll functions here */
beforeEach(()=> {
  return seed(testData);
});

afterAll(()=> {
return db.end()
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topics, each having 'slug' and 'description'", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics.length).toBeGreaterThan(0)
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("404: Responds with an error for an invalid route", () => {
    return request(app)
      .get("/api/nonexistent")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
})
describe("GET /api/articles/:article_id", () => {
    test("200: Responds with an article object containing the correct properties", () => {
      return request(app)
        .get("/api/articles/1") 
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: 1,
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
          );
        });
    })
    test("404: Responds with an error when the article_id does not exist", () => {
      return request(app)
        .get("/api/articles/9999") 
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
    test("400: Responds with an error for invalid article_id (not a number)", () => {
      return request(app)
        .get("/api/articles/not-a-number")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  })