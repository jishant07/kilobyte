const app = require("express")();
const bodyParser = require("body-parser");
var db = require("./utils/firebase");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", require("./routes/auth"));
app.get("/", (req, res) => {
  res.send("Server has started");
});

var PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running at " + PORT);
});
