// express 모듈 가져오기
const express = require("express");
// 새로운 express 앱을 만든다.
const app = express();
// 사용할 port 지정
const port = 5000;
const bodyParser = require("body-parser");

const config = require("./config/key");

// User Model 가져오기
const { User } = require("./models/User");

// application/x-www-form-urlencoded 부분을 분석해서 가져온다.
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 타입을 분석해서 가져오기 위해 필요
app.use(bodyParser.json());

// mongoDB 연결
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    // error 방지를 위해 작성해야 하는 것들
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected...!!"))
  .catch((err) => console.log(err));

// route
app.get("/", (req, res) => res.send("Hi! Hello World!~~안녕하세요~~"));

app.post("/register", (req, res) => {
  // 회원가입할 때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣는다.
  /* req.body에는
    {
        id: "hello",
        password: "123"
    } 
    같은 데이터가 들어온다.
  */
  const user = new User(req.body);

  // save() : MongoDB에서 제공하는 메서드
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));
