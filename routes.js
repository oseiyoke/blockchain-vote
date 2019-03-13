const routes = require("next-routes")();

routes
  .add("/polls/new", "/polls/new")
  .add("/polls/:address", "/polls/view")
  .add("/polls/:address/candidates/:id", "/polls/candidates/view")
  .add("/polls/:address/candidates/new", "/polls/candidates/new")
  .add("/voter/new", "/voter/new");

module.exports = routes;
