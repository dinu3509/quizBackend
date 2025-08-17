const router = require('express').Router();
const ensureAuthenticated = require('../Middlewares/Auth')
const HistoryController = require('../Controllers/HistoryController')
router.get('/',ensureAuthenticated,HistoryController)
module.exports = router