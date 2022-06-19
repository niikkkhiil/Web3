var express = require('express');
var router = express.Router();

/* GET users listing. */
const api = require('../js/api');
router.get('/getPatient', api.getPatient);

router.post('/createPatientRecord', api.createPatientRecord );

router.post('/updatePatientReport', api.updatePatientReport);

module.exports = router;
