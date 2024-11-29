const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const app  = require ("../app")
const request = require("supertest")
const testData = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
const { getArticles } = require("../controllers/api.controller");

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
  describe("GET /api/articles", () => {
    test("200: Responds with an array of article objects sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
  
          expect(articles).toHaveLength(articles.length); 
  
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String),
              })
            );
          });
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("200: Responds with an array of comments for the given article_id", () => {
      return request(app)
        .get("/api/articles/1/comments") 
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(11); 
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: 1,
              })
            );
          });
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("400: Responds with an error for invalid article_id (not a number)", () => {
      return request(app)
        .get("/api/articles/not-a-number/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("404: Responds with an error when article_id does not exist", () => {
      return request(app)
        .get("/api/articles/9999/comments") 
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    test("201: Responds with the newly added comment", () => {
      const newComment = {
        username: "butter_bridge",
        body: "This is a great article!"
      };
      return request(app)
        .post("/api/articles/1/comments") 
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              article_id: 1,
              author: "butter_bridge",
              body: "This is a great article!",
              votes: 0,
              created_at: expect.any(String)
            })
          );
        });
    });

    test("400: Responds with an error when required fields are missing", () => {
      const incompleteComment = {
        body: "Missing username"
      };
  
      return request(app)
        .post("/api/articles/1/comments")
        .send(incompleteComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  
    test("404: Responds with an error when article_id does not exist", () => {
      const newComment = {
        username: "butter_bridge",
        body: "This is a great article!"
      };
  
      return request(app)
        .post("/api/articles/9999/comments") 
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
    test("404: Responds with an error when the username does not exist", () => {
      const newComment = {
        username: "nonexistent_user", 
        body: "This is a great article!"
      };
  
      return request(app)
        .post("/api/articles/1/comments") 
        .send(newComment) 
        .expect(404) 
        .then(({ body }) => {
          expect(body.msg).toBe("not found"); 
        });
    });
  });
  
  describe("PATCH /api/articles/:article_id", () => {
    test("200: Updates the votes and responds with the updated article", () => {
      const update = { inc_votes: 5 };
  
      return request(app)
        .patch("/api/articles/1")
        .send(update)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual(
            expect.objectContaining({
              article_id: 1,
              votes: expect.any(Number), 
            })
          );
          expect(body.article.votes).toBeGreaterThan(0); 
        });
    });
  
    test("400: Responds with error if inc_votes is missing", () => {
      const update = {};
  
      return request(app)
        .patch("/api/articles/1")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid or missing inc_votes value");
        });
    });
  
    test("400: Responds with error if inc_votes is not a number", () => {
      const update = { inc_votes: "invalid" };
  
      return request(app)
        .patch("/api/articles/1")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid or missing inc_votes value");
        });
    });
  
    test("400: Responds with error for invalid article_id", () => {
      const update = { inc_votes: 1 };
  
      return request(app)
        .patch("/api/articles/invalid_id")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  
    test("404: Responds with error for non-existent article_id", () => {
      const update = { inc_votes: 1 };
  
      return request(app)
        .patch("/api/articles/9999")
        .send(update)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
  });
  
  describe("DELETE /api/comments/:comment_id", () => {
    test("204: Deletes the given comment and responds with no content", () => {
      return request(app)
        .delete("/api/comments/1") 
        .expect(204);
    });
  
    test("404: Responds with error if comment_id does not exist", () => {
      return request(app)
        .delete("/api/comments/9999") 
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment not found");
        });
    });
  
    test("400: Responds with error for invalid comment_id", () => {
      return request(app)
        .delete("/api/comments/not-a-number")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });

  describe("GET /api/users", () => {
    test("200: Responds with an array of user objects, each having username, name, and avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toBeInstanceOf(Array);
          expect(body.users.length).toBeGreaterThan(0);
  
          body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  
    test("404: Responds with error if the endpoint is incorrect", () => {
      return request(app)
        .get("/api/invalid_endpoint")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });
  

  describe("GET can sort by different fields", () => {
    test("200: Responds with articles sorted by a valid field specified in sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("title", { descending: true, coerce: true });
        });
    });
    test("200: /api/treasures?sort_by=author", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("author",{descending: true ,coerce: true,});
        });
    });
    test("200: Responds with articles sorted by 'votes' in ascending order when order=asc is specified", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          
          expect(articles).toBeSortedBy("votes", { ascending: true, coerce: true });
        });
    });
    test("400: Responds with error for an invalid sort_by field", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid_field")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid sort_by field");
        });
    });
  
  });
  
  describe("GET /api/articles (topic query)", () => {
    test("200: Responds with articles filtered by the specified topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
  
    test("200: Responds with all articles if no topic is specified", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBeGreaterThan(0);
        });
    });
  
    test("404: Responds with error when topic does not exist", () => {
      return request(app)
        .get("/api/articles?topic=nonexistent_topic")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Topic not found");
        });
    });
  
    test("400: Responds with error for invalid sort_by field", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid_field")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid sort_by field");
        });
    });
  
    test("400: Responds with error for invalid order value", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&order=invalid")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid order value");
        });
    });
  });
  
  describe("GET /api/articles/:article_id", () => {
    test("200: Responds with the article including a comment_count", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String), 
          });
          expect(Number(article.comment_count)).toBe(11); 
        });
    });
    test("400: Responds with error when article_id is invalid", () => {
      return request(app)
        .get("/api/articles/not-a-valid-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  