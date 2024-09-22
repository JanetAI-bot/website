const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.send('This is the API for JanetAI');
});

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));


module.exports = router;