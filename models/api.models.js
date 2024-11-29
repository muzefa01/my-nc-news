const db = require("../db/connection");


exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows: topics }) => {
    return topics;
  });
};

exports.fetchArticleById = (article_id) =>{
  return db
  .query(`
    SELECT * FROM articles
    WHERE article_id = $1;
  `,[article_id])
.then((result)=> {
  if(result.rows.length === 0){
return Promise.reject({status: 404, msg: "not found" })
  }
 return result.rows[0]
  
})
}
exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortBy = ["created_at", "title", "votes", "author", "topic"];
  const validOrder = ["asc", "desc"];

  
  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by field" });
  }
  if (!validOrder.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order value" });
  }

  const queryValues = []
  let queryStr = `
    SELECT 
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
  `;
  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order.toUpperCase()}
    ;`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0 && topic) {
      return Promise.reject({ status: 404, msg: "Topic not found" });
    }
    return rows;
  });
};

exports.fetchCommentsByArticleId = (article_id) => {
  const queryStr = `
    SELECT 
      comment_id, 
      votes, 
      created_at, 
      author, 
      body, 
      article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
  `;

  return db.query(queryStr, [article_id]).then(({ rows }) => {
    if(rows.length === 0){
      return Promise.reject({status: 404, msg: "not found" })
        }
    return rows; 
  });
};



exports.addCommentToArticle = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "not found" })
  }

  const queryStr = `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  return db
  .query(queryStr, [article_id, username, body])
  .then(({ rows }) => {
  return rows[0]}); 
};


exports.updateArticleVotes = (article_id, inc_votes) => {
  if (!inc_votes || typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid or missing inc_votes value" })
  }
  const queryStr = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
  `;

  return db.query(queryStr, [inc_votes, article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    return rows[0]; 
  });
};

exports.deleteCommentById = (comment_id) => {
  const queryStr = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
  `;

  return db.query(queryStr, [comment_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Comment not found" });
    }
  });
};

exports.fetchAllUsers = () => {
  const queryStr = `
    SELECT*
    FROM users;
  `;

  return db.query(queryStr).then(({ rows }) => {
    return rows; 
  });
};