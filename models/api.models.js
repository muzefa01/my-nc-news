const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

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
exports.fetchArticles = () => {
  const queryStr = `
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
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
  `;
    return db.query(queryStr).then(({ rows }) => {
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
