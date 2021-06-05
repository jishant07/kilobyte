var admin = require("firebase-admin");

var serviceAccount =
  require("./creds.json") || JSON.parse(process.env.GOOGLE_CREDS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

dbref = admin.firestore();

module.exports = dbref;
