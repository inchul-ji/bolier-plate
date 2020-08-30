// express 모듈 가져오기
const express = require("express");
// 새로운 express 앱을 만든다.
const app = express();
// 사용할 port 지정
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
// 인증 처리를 위한 용도
const { auth } = require("./middleware/auth");
// User Model 가져오기
const { User } = require("./models/User");

// application/x-www-form-urlencoded 부분을 분석해서 가져온다.
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 타입을 분석해서 가져오기 위해 필요
app.use(bodyParser.json());
app.use(cookieParser());

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

app.get("/api/hello", (req, res) => {
  res.send("안녕하세요~");
});

app.post("/api/users/register", (req, res) => {
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

app.post("/api/users/login", (req, res) => {
  // 요청된 email을 데이터베이스에서 존재하는지 확인
  // findOne() : mongodb에서 제공하는 메서드
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    // 요청된 email이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }
      // 비밀번호까지 맞다면 token 생성하기
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // token을 저장한다. 어디에? 쿠키, 로컬스토리지 등 저장 가능
        // 쿠키에 저장하겠다.
        // npm install cookie-parser --save
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

// auth : middleware
app.get("/api/users/auth", auth, (req, res) => {
  // 여기의 소스코드가 진행된다는 것은 middleware를 통과해 왔다는 애기이며, Authentication이 True라는 의미이다.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));
