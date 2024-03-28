import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import fs from "fs";

const port = 3000;
const app = express();

app.use(express.static("public"));

app.use(morgan("tiny"));

app.use(bodyParser.urlencoded({ extended: true }));

// Gets
app.get("/", (req, res) => {
  fs.readdir("public/assets/posts", (err, files) => {
    if (err) throw err;
    var newFiles = [];
    files.forEach((element) => {
      newFiles.push(element.slice(0, -4));
    });
    console.log(newFiles);
    res.render("index.ejs", {
      posts: newFiles,
    });
  });
});

app.get("/random-post", (req, res) => {
  res.redirect("/post");
});

app.get("/post", (req, res) => {
  const arr1 = req.url.split("?");
  console.log(arr1[1].replace(/%20/g, " "));
  fs.readFile(
    "public/assets/posts/" + arr1[1].replace(/%20/g, " ") + ".txt",
    "utf-8",
    (err, data) => {
      if (err) throw err;
      console.log(data);
    }
  );
  res.render("post.ejs");
});

app.get("/new-post", (req, res) => {
  res.render("newPost.ejs");
});
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

// Posts

app.post("/save", (req, res) => {
  let postTitle = req.body["title"];
  let postText = req.body["postText"];
  fs.writeFile(
    `public/assets/posts/${postTitle.trimEnd()}.txt`,
    postText,
    "utf-8",
    (err) => {
      if (err) throw err;
      res.render("postSaved.ejs");
    }
  );
});

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
