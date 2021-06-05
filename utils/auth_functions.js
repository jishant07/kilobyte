const db = require("./firebase");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const { fail } = require("./messages");

/* Functions Login - Signup */

var secret_key = "secret_key";

function login(collection, phone_number, password) {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .where("phone_number", "==", phone_number)
      .where("password", "==", md5(password))
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          reject("User not found");
        } else {
          snapshot.forEach((snap) => {
            resolve(
              jwt.sign(
                {
                  userId: snap.id,
                  phone_number: snap.data().phone_number,
                },
                secret_key
              )
            );
          });
        }
      });
  });
}

function signup(collection, phone_number, password) {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .where("phone_number", "==", phone_number)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          db.collection(collection)
            .add({ phone_number, password: md5(password) })
            .then((data) => {
              resolve(data.id);
            });
        } else {
          reject("User already exists");
        }
      });
  });
}

function checkCustomer(userId) {
  return new Promise((resolve, reject) => {
    db.collection("customer")
      .doc(userId)
      .get()
      .then((snapshot) => {
        if (!snapshot.exists) {
          reject("User not a customer");
        }
        resolve(true);
      });
  });
}

function checkDelivery(userId) {
  return new Promise((resolve, reject) => {
    db.collection("delivery")
      .doc(userId)
      .get()
      .then((snapshot) => {
        if (!snapshot.exists) {
          reject("User not a delivery person");
        }
        resolve(true);
      });
  });
}

function verifyCustomer(req, res, next) {
  var bearerHeader = req.headers["authorization"];
  if (bearerHeader === undefined) {
    res.sendStatus(403);
  } else {
    var token = bearerHeader.split(" ")[1];
    jwt.verify(token, secret_key, (err, data) => {
      checkCustomer(data.userId)
        .then(() => {
          req.userData = data;
          next();
        })
        .catch((msg) => {
          console.log(msg);
          res.sendStatus(403);
        });
    });
  }
}

function verifyDelivery(req, res, next) {
  var bearerHeader = req.headers["authorization"];
  if (bearerHeader === undefined) {
    res.sendStatus(403);
  } else {
    var token = bearerHeader.split(" ")[1];
    jwt.verify(token, secret_key, (err, data) => {
      checkDelivery(data.userId)
        .then(() => {
          next();
        })
        .catch((err) => {
          console.log(err);
          res.sendStatus(403);
        });
    });
  }
}

module.exports = { login, signup, verifyCustomer, verifyDelivery };
