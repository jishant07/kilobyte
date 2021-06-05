var order_router = require("express").Router();
var { verifyCustomer } = require("../utils/auth_functions");
var db = require("../utils/firebase");
const { success, fail } = require("../utils/messages");

order_router.post("/add_to_cart", verifyCustomer, (req, res) => {
  db.collection("cart")
    .where("userId", "==", req.userData.userId)
    .get()
    .then((snapshot) => {
      var orders = {};
      if (!snapshot.empty) {
        var cartData = [];
        snapshot.forEach((snap) => {
          cartData.push({ id: snap.id, data: snap.data() });
        });
        var cartId = cartData[0]["id"];
        orders = cartData[0]["data"]["orders"];
        orders[req.body.item_id] = req.body.quantity;
        db.collection("cart")
          .doc(cartId)
          .update({ orders })
          .then(() => {
            res.json(success("Cart Item Added Successfully", ""));
          })
          .catch((err) => {
            res.json(fail("Item Add to Cart Fail", ""));
          });
      } else {
        orders[req.body.item_id] = req.body.quantity;
        db.collection("cart")
          .add({ userId: req.userData.userId, orders })
          .then(() => {
            res.json(success("Cart Item Added Successfully", ""));
          });
      }
    });
});

order_router.get("/see_cart", verifyCustomer, (req, res) => {
  getItems.then((data) => {
    var itemDetails = data;
    db.collection("cart")
      .where("userId", "==", req.userData.userId)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          res.json(fail("Empty Cart", ""));
        } else {
          var cartData = [];
          snapshot.forEach((snap) => {
            cartData.push(snap.data());
          });
          finalCartData = [];
          cartData.map((cartitem) => {
            for (const itemId in cartitem.orders) {
              finalCartData.push({
                itemData: itemDetails[itemId],
                quantity: cartitem.orders[itemId],
              });
            }
          });
          res.send(success("Cart Data Fetched", finalCartData));
        }
      });
  });
});

order_router.post("/place_order", verifyCustomer, (req, res) => {
  var userId = req.userData.userId;
  var orderDetails = JSON.parse(req.body.order_details);
  var genOrderDetails = {};
  Promise.all([getItems, getDeliveryPersonIds]).then((data) => {
    var itemDetails = data[0];
    var deliveryPersons = data[1];
    var pickUpLocations = [];
    for (const order in orderDetails) {
      genOrderDetails[order] = {
        itemData: itemDetails[order].itemName,
        quantity: orderDetails[order],
      };
      pickUpLocations.push(
        itemDetails[order]["location"][
          Math.floor(Math.random() * itemDetails[order]["location"].length)
        ]
      );
    }
    db.collection("orders")
      .add({
        userId,
        pickUpLocations,
        deliveryId:
          deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)],
        order_details: genOrderDetails,
        orderStage: 1,
      })
      .then((data) => {
        res.json({
          orderId: data.id,
          userId,
          pickUpLocations,
          deliveryId:
            deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)],
          orderDetails: genOrderDetails,
          orderStage: 1,
        });
      });
  });
});

var getItems = new Promise((resolve, reject) => {
  db.collection("items")
    .get()
    .then((snapshot) => {
      var itemDetails = {};
      snapshot.forEach((snap) => {
        itemDetails[snap.id] = snap.data();
      });
      resolve(itemDetails);
    })
    .catch((err) => {
      reject(err);
    });
});

var getDeliveryPersonIds = new Promise((resolve, reject) => {
  db.collection("delivery")
    .get()
    .then((snapshot) => {
      deliveryPersonIds = [];
      snapshot.forEach((snap) => {
        deliveryPersonIds.push(snap.id);
      });
      resolve(deliveryPersonIds);
    })
    .catch((err) => {
      reject(err);
    });
});

module.exports = order_router;
