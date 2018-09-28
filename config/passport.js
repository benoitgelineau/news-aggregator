const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

/** HELP SUPPORTING LOGIN SESSIONS */
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   Users.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

// passport.use(new LocalStrategy(
//   (username, password, done) => {
//     User.findOne({ username })
//       .then(user => {
//         if (!user) {
//           return done(null, false, { message: 'Incorrect username.' });
//         }
//         if (!user.validPassword(password)) {
//           return done(null, false, { message: 'Incorrect password.' });
//         }
//         return done(null, user, { message: `Welcome back ${user.username}!` });
//       })
//       .catch(err => done(err))
//   }
// ));

passport.use('signup', new LocalStrategy(
  async (username, password, done) => { // Handle username already taken in error
    try {
      const user = await User.create({ username, password });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.use('login', new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'User not found.' });
      }

      const validate = await user.isValidPassword(password);
      if (!validate) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user, { message: 'Successfully logged in!' });

    } catch (err) {
      return done(err);
    }
  }
));

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(new JWTstrategy({
  secretOrKey: process.env.SECRET_JWT,
  jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
  try {
    return done(null, token.user);
  } catch (err) {
    return done(err);
  }
}));