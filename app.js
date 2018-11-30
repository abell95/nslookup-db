const express = require("express");
const app = express();
const { exec } = require("child_process");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const PORT = 5000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/post_data", (req, res) => {
  const newPost = Object.keys(req.body);
  console.log(newPost);
  res.status(200).send();
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  exec("nslookup www.google.com", (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("stdout: ", stdout);
  });
});
