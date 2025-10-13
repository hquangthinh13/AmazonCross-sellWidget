import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(5001, () => {
  console.log("Server started on PORT: 5001");
});
