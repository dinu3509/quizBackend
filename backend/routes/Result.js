const router = require('express').Router()
const ensureAuthenticated = require("../Middlewares/Auth")
const {getResultById} = require('../Controllers/ResultController')
router.get('/:id', ensureAuthenticated, getResultById);
module.exports = router;