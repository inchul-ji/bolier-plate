const mongoose = require("mongoose");

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
    // 유효성 검사 용도
    type: String,
  },
  tokenExp: {
    // token 만료 기간
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
