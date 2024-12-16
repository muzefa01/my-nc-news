const express = require("express");
const cors = require('cors');
const app = express();



const {getApi, getTopics, getArticleById, getArticles, getCommentsByArticleId, postCommentToArticle, patchArticleVotes, deleteComment,getAllUsers} = require("./controllers/api.controller")
app.use(cors({
   origin: "http://127.0.0.1:5173"
}));
app.use(express.json())


app.get("/api", getApi)
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.post("/api/articles/:article_id/comments", postCommentToArticle)
app.patch("/api/articles/:article_id", patchArticleVotes)
app.delete("/api/comments/:comment_id", deleteComment)
app.get("/api/users", getAllUsers)

app.all("*",(req, res, ) => {
   res.status(404).send({ msg: "not found" });
  });

  
/// POSTSQL ERROR
app.use((err, req, res, next) => {
  if (err.code === "22P02" ){
      res.status(400).send({msg: "Bad request" })
   } else if (err.code === "23503"){
    res.status(404).send({ msg: "not found" })
  } else{
    next(err)
}})
 /// CUSTOM ERROR
app.use((err, req, res, next) => {
  if (err.status && err.msg){
     res.status(err.status).send({msg: err.msg})
  } else{
    next(err)
}})



app.use((err, req, res, next) => {
    const { status = 500, msg = "Internal Server Error" } = err;
    res.status(status).send({ msg });
  });





module.exports = app