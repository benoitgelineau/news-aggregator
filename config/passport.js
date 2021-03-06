const fs = require('fs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use('signup', new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.create({ username, password });

      return done(null, user);

    } catch (err) {
      // Code for duplicate keys
      if (err.code === 11000) {
        return done(null, false, { message: `Username already taken` });
      }
      return done(err);
    }
  }
));

passport.use('login', new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      const validate = await user.isValidPassword(password);
      if (!validate) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);

    } catch (err) {
      return done(err);
    }
  }
));

const JWTstrategy = require('passport-jwt').Strategy;
const { cookieExtractor } = require('../_helpers/cookieHandler');
const { PUBLIC_KEY, APP_URL } = process.env;
const publicKey = fs.readFileSync('./public-key.pem', 'utf8');

passport.use(new JWTstrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: publicKey,
  issuer: 'Benoit G.',
  audience: APP_URL,
  algorithms: ['RS256']
}, async (jwt_payload, done) => {
  try {
    return done(null, jwt_payload);
  } catch (err) {
    return done(err);
  }
}));
