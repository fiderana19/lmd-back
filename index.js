const express = require('express');
const app = express();
const port = 3002;
const cors = require('cors');
//Using CORS
app.use(cors());
app.use(express.json());
//Requiring all files
const resultRouter = require('./src/result');
const resultNiveauRouter = require('./src/resultniveau');
const anneeRouter = require('./src/annee');
const ueRouter = require('./src/ue');
const noteRouter = require('./src/note');
const etudiantRouter = require('./src/etudiant');
const ecRouter = require('./src/ec');
const niveauRouter = require('./src/niveau');
//Routing the endpoint
app.use('/result/etudiant', resultRouter);
app.use('/result/niveau', resultNiveauRouter);
app.use('/annee', anneeRouter);
app.use('/ue', ueRouter);
app.use('/note', noteRouter);
app.use('/etudiant', etudiantRouter);
app.use('/ec', ecRouter);
app.use('/niveau', niveauRouter);
//Listening to port
app.listen(port , () => {
    console.log(`The app listening on port ${port}`);
})