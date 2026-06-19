const app = require("./src/app");
const config = require("./src/config/index");

app.listen(config.port, () => {
  console.log(`The app listening on port ${config.port}`);
});
