const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// 암호화할 때 몇자리로 보이는 녀석(salt)으로 암호화할지 정한다.
// 즉, 암호화하면 10자리의 값으로 보인다.
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //빈칸을 삭제하는 역할
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number, // 1: 관리자, 0: 일반사용자
    default: 0,
  },
  image: String,
  token: {
    // 유효성 검사 용도, 로그인 시 갖게 되는 데이터
    type: String,
  },
  tokenExp: {
    // token 만료 기간
    type: Number,
  },
});

// pre(): mongoose 에서 가져온 메서드
userSchema.pre("save", function (next) {
  var user = this;

  // 비밀번호를 암호화 시킨다.
  // 비밀번호를 작성하거나 수정할 때만 실행하도록 ㅈ거을 준다.
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      // hash : 암호화된 비밀번호가 들어간다.
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword : 암호화 전 - 1234567 암호화 후 - $2b$10$Y3IwmNSJYL35iIsJQaX0CeyOTfKBZliz0HEHKX7.wBRNB1ubuC.qO
  // 두 개를 비교하기 위해 로그인할 때 입력한 Password를 암호화하여 같은지 비교한다.
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  // json web token을 이용해서 token을 생성하기
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  // user_.id + 'secretToken' = token
  // 두 개를 합쳐 token을 만들고 추후
  // "secretToken"을 넣으면 user_.id를 알수있는 구조

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  // 토큰을 decode 한다.
  jwt.verify(token, "secretToken", function (err, decoded) {
    // User ID를 이용해서 유저를 찾으 다음 클라이언트에서 가져온 token과 db에 보관된 token이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
