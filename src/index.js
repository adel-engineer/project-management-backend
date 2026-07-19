const app = require("./app.js")
const detenv = require("dotenv")
const connectDB = require("./db/index.js")
detenv.config({
    path: "./.env",
});
const port = process.env.PORT


connectDB()
  .then(
  app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
)
  .catch((err) => {
    console.error("MangoDB connection Error: ", err)
    process.exit(1)
  })