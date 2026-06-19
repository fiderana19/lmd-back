const express = require("express");
const cors = require("cors");
const config = require("./src/config/index");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

const authRouter = require("./src/routes/auth");
const resultRouter = require("./src/routes/result");
const resultNiveauRouter = require("./src/routes/resultNiveau");
const anneeRouter = require("./src/routes/annee");
const ueRouter = require("./src/routes/ue");
const noteRouter = require("./src/routes/note");
const etudiantRouter = require("./src/routes/etudiant");
const ecRouter = require("./src/routes/ec");
const niveauRouter = require("./src/routes/niveau");

app.use("/result/etudiant", resultRouter);
app.use("/result/niveau", resultNiveauRouter);
app.use("/annee", anneeRouter);
app.use("/ue", ueRouter);
app.use("/note", noteRouter);
app.use("/etudiant", etudiantRouter);
app.use("/ec", ecRouter);
app.use("/niveau", niveauRouter);
app.use("/auth", authRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`The app listening on port ${config.port}`);
});
