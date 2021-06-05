var delivery_router = require("express").Router();
const { verifyDelivery } = require("../utils/auth_functions");
var db = require("../utils/firebase");
const { success, fail } = require("../utils/messages");

delivery_router.get("/get_orders", verifyDelivery, (req, res) => {
  var delivery_id = req.userData.userId;
  db.collection("orders")
    .where("deliveryId", "==", delivery_id)
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        var orderDetails = {};
        snapshot.forEach((snap) => {
          if (snap.data().orderStage != 5 && snap.data().orderStage != -1) {
            orderDetails[snap.id] = snap.data();
          }
        });
        if (orderDetails.length === 0) {
          res.json(fail("No Order for this deliveryPersonId found", ""));
        } else {
          res.json(success("Order Details Fetched", orderDetails));
        }
      } else {
        res.json(fail("No Order for this deliveryPersonId found", ""));
      }
    });
});

delivery_router.post("/update_status", verifyDelivery, (req, res) => {
  var orderId = req.body.order_id;
  var orderStage = req.body.order_stage;
  if (orderStage < -1 || orderStage > 5) {
    res.json(fail("Incorrect Order Stage", ""));
  } else {
    db.collection("orders")
      .doc(orderId)
      .update({ orderStage })
      .then(() => {
        res.json(success("Order Status Updated Successfully", ""));
      })
      .catch((err) => {
        res.json(fail("Update Failed", ""));
      });
  }
});

module.exports = delivery_router;
