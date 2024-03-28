import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

const port = 3000;
const app = express();

app.use(express.static("public"));

app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/random-post", (req, res) => {
  res.redirect("/post");
});

app.get("/post", (req, res) => {
  res.render("post.ejs");
});

app.get("/new-post", (req, res) => {
  res.render("newPost.ejs");
});
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});
app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
