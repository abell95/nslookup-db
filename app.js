const express = require("express");
const app = express();
const fs = require("fs");

const PORT = 5000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/fetch_data", (req, res) => {
  let data = fs.readFileSync(__dirname + "/posts.json", "utf8");
  res.status(200).send(data);
});

app.post("/post_data", (req, res) => {
  const newPost = req.query;
  console.log(newPost.title);
  let rawData = fs.readFileSync(__dirname + "/posts.json", "utf8");
  let posts = JSON.parse(rawData);
  console.log(posts);
  posts[newPost.title] = newPost.text;
  fs.writeFileSync(__dirname + "/posts.json");
  res.status(201).send(posts);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
