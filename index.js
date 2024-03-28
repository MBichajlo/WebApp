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

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
