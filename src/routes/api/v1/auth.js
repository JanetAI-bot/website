const { Router } = require('express');
const passport = require('passport');
const router = Router();
require(`${basedir}/src/auth/discord.js`);

router.get('/discord', passport.authenticate('discord'), (req, res) => {
    res.send(200);
});

router.get('/discord/redirect', passport.authenticate('discord'), (req, res) => {
    res.send(200);
});

module.exports = router;