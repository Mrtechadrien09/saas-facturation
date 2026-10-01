import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../models/User.js';

// --- STRATÉGIE GOOGLE ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: 'https://saas-facturation-backend-hb6b.onrender.com/api/auth/google/callback'
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

      if (!email) {
        return done(new Error("Aucun email associé à ce compte Google"), undefined);
      }

      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.findOne({ email: email });
      }

      if (user) {
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      user = await User.create({
        name: profile.displayName || 'Utilisateur Google',
        email: email,
        googleId: profile.id,
        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
        emailVerified: true
      });

      return done(null, user);
    } catch (error) {
      return done(error, undefined);
    }
  }
));

// --- STRATÉGIE GITHUB ---
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackURL: 'https://saas-facturation-backend-hb6b.onrender.com/api/auth/github/callback'
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      
      if (!email) {
        // CORRECTION COMPLÈTE : Plus de symboles parasites, une simple addition de texte
        const username = profile.username || profile.id;
        email = username + '@://simplifact.com';
      }

      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        user = await User.findOne({ email: email });
      }

      if (user) {
        if (!user.githubId) {
          user.githubId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      user = await User.create({
        name: profile.displayName || profile.username || 'Utilisateur GitHub',
        email: email,
        githubId: profile.id,
        avatar: profile._json && profile._json.avatar_url ? profile._json.avatar_url : '',
        emailVerified: true
      });

      return done(null, user);
    } catch (error) {
      return done(error, undefined);
    }
  }
));

export default passport;