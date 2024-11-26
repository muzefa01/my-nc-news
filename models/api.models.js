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

