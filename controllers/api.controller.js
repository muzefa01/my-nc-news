const endpointsJson = require("../endpoints.json")
const { fetchTopics, fetchArticleById } = require("../models/api.models");

exports.getApi = (req, res) => {
    res.status(200).send({ endpoints: endpointsJson  });
}

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next)
};

exports.getArticleById = (req, res, next) => {
  const {article_id} = req.params;

  fetchArticleById(article_id).then((article)=>{
    res.status(200).send({ article })
  })
  .catch((err)=>{
    next(err)
  })
}

