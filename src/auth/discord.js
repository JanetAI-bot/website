const passport = require('passport');
const { Strategy } = require('passport-discord');

passport.use(new Strategy({
    clientID: config.discord.clientID,
    clientSecret: config.discord.clientSecret,
    callbackURL: 'http://localhost:5656/api/v1/auth/discord/redirect',
    scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    
    
    return done(null, profile);
}));