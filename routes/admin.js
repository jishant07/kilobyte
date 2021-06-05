var { verifyAdmin } = require("../utils/auth_functions");
var db = require("../utils/firebase");
const { success, fail } = require("../utils/messages");
var admin_router = require("express").Router();

admin_router.get("/orders", verifyAdmin, (req, res) => {
  db.collection("orders")
    .get()
    .then((snapshot) => {
      var orderData = [];
      if (snapshot.exists) {
        snapshot.forEach((snap) => {
          orderData.push(snap.data());
        });
        res.json(success("All orders Successfully Fetched", orderData));
      } else {
        res.json(fail("No orders fetched", ""));
      }
    });
});

admin_router.get("/delivery_persons", verifyAdmin, (req, res) => {
  db.collection("delivery")
    .get()
    .then((snapshot) => {
      var delData = {};
      snapshot.forEach((snap) => {
        delData[snap.id] = snap.data();
      });
      res.json(success("Delivery People Fetched", delData));
    });
});

admin_router.post("/assign_delivery_to_order", verifyAdmin, (req, res) => {
  var orderId = req.body.order_id;
  var deliveryId = req.body.delivery_id;
  db.collection("orders")
    .doc(orderId)
    .update({ deliveryId: deliveryId })
    .then(() => {
      res.json(success("Delivery Person Assigned Successfully", ""));
    })
    .catch((err) =>
      res.json(fail("Some error Occuered", err.details.split(":")[0]))
    );
});

module.exports = admin_router;
