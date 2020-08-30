const { User } = require("../models/User");

// 인증 처리를 하는 곳
let auth = (req, res, next) => {
  // 클라이언트 Cookie에서 token을 가져온다.
  let token = req.cookies.x_auth;
  console.log("auth.token: ", token);
  // Token을 복호화(decode) 한후 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, err: true });

    req.token = token;
    req.user = user;
    next(); // middleward 작업 후 다음 작업이 진행될 수 있도록 하기 위해 사용
  });
  // 유저가 있으면 인증 Okay
  // 유저가 없으면 인증 No!
};

module.exports = { auth };
