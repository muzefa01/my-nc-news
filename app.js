const express = require("express")
const app = express()
const {getApi, getTopics} = require("./controllers/api.controller")

app.get("/api", getApi)
app.get("/api/topics", getTopics);


app.use((req, res, next) => {
    res.status(404).send({ msg: "not found" });
  });
  
  app.use((err, req, res, next) => {
    const { status = 500, msg = "Internal Server Error" } = err;
    res.status(status).send({ msg });
  });





module.exports = app