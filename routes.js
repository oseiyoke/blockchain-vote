const routes = require("next-routes")();

routes
  .add("/polls/new", "/polls/new")
  .add("/polls/:address", "/polls/view")
  .add("/polls/:address/candidates/new", "/polls/candidates/new")
  .add("/polls/:address/voter/new", "/polls/voter/new");

module.exports = routes;
