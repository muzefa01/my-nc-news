const endpointsJson = require("../endpoints.json")
const { fetchTopics, fetchArticleById, fetchArticles, fetchCommentsByArticleId, addCommentToArticle, updateArticleVotes, deleteCommentById, fetchAllUsers} = require("../models/api.models");

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

exports.getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;

  fetchArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next); 
};


exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments }); 
    })
    .catch(next); 
};


exports.postCommentToArticle = (req, res, next) => {
  
  const { article_id } = req.params;
  const { username, body } = req.body;
 
  addCommentToArticle(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment }); 
    })
    .catch((err)=>{
     
      next(err)
    })
};



exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};



exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send(); 
    })
    .catch(next); 
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next); 
};
