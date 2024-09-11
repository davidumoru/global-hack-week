const express = require("express");
const { auth, requiresAuth } = require("express-openid-connect");
const app = express();
require("dotenv").config();

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.SECRET,
};

app.use(auth(config));

app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

app.listen(3000, function () {
  console.log("Listening on http://localhost:3000");
});
