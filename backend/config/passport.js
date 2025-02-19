const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { name, email } = profile._json;
      let user = await User.findOne({ email });

      if (!user) {
        user = new User({ name, email, googleId: profile.id, role: "user" });
        await user.save();
      }
      done(null, user);
    }
  )
);
