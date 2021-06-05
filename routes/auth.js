const { login, signup } = require("../utils/auth_functions");
const { success, fail } = require("../utils/messages");
var auth_router = require("express").Router();

function signup_route(collection, req, res) {
  if (
    req.body.phone_number !== "" &&
    req.body.password !== "" &&
    req.body.phone_number !== undefined &&
    req.body.password != undefined
  ) {
    signup(collection, req.body.phone_number, req.body.password)
      .then((data) => {
        res.json(success("User added successfully", data));
      })
      .catch((err) => {
        res.json(fail(err, ""));
      });
  } else {
    res.json(fail("Incomplete Request", ""));
  }
}

function login_route(collection, req, res) {
  if (
    req.body.phone_number !== "" &&
    req.body.password !== "" &&
    req.body.phone_number !== undefined &&
    req.body.password != undefined
  ) {
    login(collection, req.body.phone_number, req.body.password)
      .then((token) => {
        res.send(success("User logged in successfully", token));
      })
      .catch((err) => {
        res.json(fail("Credential error", err));
      });
  } else {
    res.json(fail("Incomplete Request", ""));
  }
}

auth_router.post("/customer_login", (req, res) => {
  login_route("customer", req, res);
});

auth_router.post("/customer_signup", (req, res) => {
  signup_route("customer", req, res);
});

auth_router.post("/delivery_login", (req, res) => {
  login_route("delivery", req, res);
});

auth_router.post("/delivery_signup", (req, res) => {
  signup_route("delivery", req, res);
});

auth_router.post("/admin_signup", (req, res) => {
  signup_route("admin", req, res);
});

auth_router.post("/admin_login", (req, res) => {
  login_route("admin", req, res);
});

module.exports = auth_router;
