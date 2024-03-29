import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import fs from "fs";
import path from "path";

const port = 3000;
const app = express();

app.use(express.static("public"));

app.use(morgan("tiny"));

app.use(bodyParser.urlencoded({ extended: true }));

// Gets
app.get("/", (req, res) => {
  fs.readdir("public/assets/posts", (err, files) => {
    if (err) throw err;
    var filteredFiles = files.filter((e) => {
      return path.extname(e).toLowerCase() === ".txt";
    });
    var newFiles = [];
    filteredFiles.forEach((element) => {
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
  const postName = arr1[1].replace(/%20/g, " ");
  fs.readFile(
    "public/assets/posts/" + postName + ".txt",
    "utf-8",
    (err, data) => {
      if (err) throw err;
      res.render("post.ejs", {
        postName: postName,
        postText: data,
      });
    }
  );
});

app.get("/editor", (req, res) => {
  const link = req.url.split("?");

  if (link[1]) {
    const postName = link[1].replace(/%20/g, " ");
    fs.readFile(
      "public/assets/posts/" + postName + ".txt",
      "utf-8",
      (err, data) => {
        if (err) throw err;

        res.render("newPost.ejs", {
          postName: postName,
          postText: data,
        });
      }
    );
  } else {
    res.render("newPost.ejs");
  }
});
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

// Posts

app.post("/save", (req, res) => {
  if (req.body["_METHOD"] === "POST") {
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
  } else if (req.body["_METHOD"] === "PUT") {
    res.send("<h1> put request</h1>");
  }
});

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
