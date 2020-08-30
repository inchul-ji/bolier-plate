// 환경 변수 설정
if (process.env.NODE_ENV === "production") {
  console.log("production: ", process.env.NODE_ENV);
  module.exports = require("./prod");
} else {
  console.log("development: ", process.env.NODE_ENV);
  module.exports = require("./dev");
}
