const app = require("express")();
const bodyParser = require("body-parser");
var db = require("./utils/firebase");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", require("./routes/auth"));
app.use("/item", require("./routes/items"));
app.use("/order", require("./routes/order"));
app.use("/delivery", require("./routes/delivery"));
app.use("/admin", require("./routes/admin"));

app.get("/", (req, res) => {
  res.send("Server has started");
});

var PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running at " + PORT);
});
