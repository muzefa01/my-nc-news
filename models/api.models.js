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

