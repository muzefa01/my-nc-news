const express = require("express")
const app = express()
const {getApi, getTopics, getArticleById} = require("./controllers/api.controller")

app.get("/api", getApi)
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById)


app.all("*",(req, res, ) => {
   res.status(404).send({ msg: "not found" });
  });

  
/// POSTSQL ERROR
app.use((err, req, res, next) => {
  if (err.code === "22P02"){
      res.status(400).send({msg: "Bad request" })
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