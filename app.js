const express = require("express");
const app = express();
const { exec } = require("child_process");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = 5000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/post_data", (req, res) => {
  const url = req.body.url;
  if (!url) {
    res.status(400).send();
    return;
  }
  exec(`nslookup ${url}`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      console.log("stderr: ", stderr);
      res.status(400).send();
      return;
    }
    res.status(200).send(JSON.stringify({ data: stdout }));
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
