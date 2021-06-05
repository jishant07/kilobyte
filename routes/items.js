const item_router = require("express").Router();
const db = require("../utils/firebase");
const { verifyAdmin } = require("../utils/auth_functions");
const { success, fail } = require("../utils/messages");

item_router.post("/add_item", verifyAdmin, (req, res) => {
  db.collection("items")
    .add({
      userId: req.userData.userId,
      itemName: req.body.item_name,
      category: req.body.category,
    })
    .then((data) => {
      res.json(success("Item added Successfully", data.id));
    });
});
item_router.post("/add_location", verifyAdmin, (req, res) => {
  db.collection("items")
    .doc(req.body.item_id)
    .get()
    .then((snapshot) => {
      var locations = snapshot.data().location;
      if (locations === undefined) {
        var locations = [req.body.location];
      } else {
        locations.push(req.body.location);
      }
      db.collection("items")
        .doc(req.body.item_id)
        .update({ location: locations })
        .then(() => {
          res.send(success("Location added successfully", ""));
        });
    });
});

module.exports = item_router;
