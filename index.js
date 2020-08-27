// express 모듈 가져오기
const express = require("express");
// 새로운 express 앱을 만든다.
const app = express();
// 사용할 port 지정
const port = 5000;

// mongoDB 연결
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://icji:mongodb@cluster0.hvlr3.gcp.mongodb.net/boilerPlate?retryWrites=true&w=majority",
    {
      // error 방지를 위해 작성해야 하는 것들
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB Connected...!!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!~~안녕하세요~~"));

app.listen(port, () => console.log(`Example app listening on port ${port}`));
