const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

const authRouter = require("./routes/auth");
const resultRouter = require("./routes/result");
const resultNiveauRouter = require("./routes/resultNiveau");
const anneeRouter = require("./routes/annee");
const ueRouter = require("./routes/ue");
const noteRouter = require("./routes/note");
const etudiantRouter = require("./routes/etudiant");
const ecRouter = require("./routes/ec");
const niveauRouter = require("./routes/niveau");

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

module.exports = app;
