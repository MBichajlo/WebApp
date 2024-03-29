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
    var randomPosts = [];
    var rPost = "";
    if (newFiles.length > 4) {
      for (let i = 0; i < 4; i++) {
        do {
          rPost = newFiles[Math.floor(Math.random() * newFiles.length)];
        } while (randomPosts.includes(rPost));
        randomPosts.push(rPost);
      }
    } else {
      randomPosts = newFiles;
    }
    var posts = [];
    randomPosts.forEach((element) => {
      let newPost = {
        name: element,
        data:
          fs
            .readFileSync(`public/assets/posts/${element}.txt`, {
              encoding: "utf-8",
            })
            .substring(0, 500) + "...",
      };
      posts.push(newPost);
    });
    console.log(posts);
    res.render("index.ejs", {
      posts: newFiles,
      randomPosts: posts,
    });
  });
});

app.get("/random-post", (req, res) => {
  fs.readdir("public/assets/posts", (err, files) => {
    if (err) throw err;
    var fFiles = files.filter((e) => {
      return path.extname(e).toLowerCase() === ".txt";
    });
    let rFile = fFiles[Math.floor(Math.random() * fFiles.length)];
    fs.readFile(`public/assets/posts/${rFile}`, "utf-8", (err, data) => {
      if (err) throw err;
      res.render("post.ejs", {
        postName: rFile.slice(0, -4),
        postText: data,
      });
    });
  });
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
    let postNewTitle = req.body["postEditedTitle"];
    let postNewText = req.body["postEditedText"];
    let postOldTitle = req.body["_title"];
    let postOldText = req.body["_postText"];
    if (postNewTitle.trimEnd() === postOldTitle) {
      fs.writeFile(
        `public/assets/posts/${postOldTitle.trimEnd()}.txt`,
        postNewText,
        "utf-8",
        (err) => {
          if (err) throw err;
          res.render("postSaved.ejs");
        }
      );
    } else {
      fs.rename(
        `public/assets/posts/${postOldTitle}.txt`,
        `public/assets/posts/${postNewTitle}.txt`,
        () => {
          fs.writeFile(
            `public/assets/posts/${postNewTitle}.txt`,
            postNewText,
            "utf-8",
            (err) => {
              if (err) throw err;
              res.render("postSaved.ejs");
            }
          );
        }
      );
    }
  }
});

app.delete("/delete-post", (req, res) => {
  const link = req.url.split("?");

  if (link[1]) {
    const postName = link[1].replace(/%20/g, " ");
    fs.rm(`public/assets/posts/${postName}.txt`, (err) => {
      if (err) throw err;
    });
  }
  res.send("s");
});

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
