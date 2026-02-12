import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { db } from '../database';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.oauthId, profile.id))
          .limit(1);

        if (existingUser) {
          // Update user's access token and last login
          await db
            .update(users)
            .set({ 
              lastLoginAt: new Date(),
              updatedAt: new Date()
            })
            .where(eq(users.id, existingUser.id));
            
          return done(null, existingUser);
        }

        // Create new user
        const [newUser] = await db
          .insert(users)
          .values({
            username: profile.displayName || profile.id,
            email: profile.emails?.[0]?.value || '',
            avatar: profile.photos?.[0]?.value,
            oauthProvider: 'google',
            oauthId: profile.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return done(null, newUser);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

// Discord OAuth Strategy
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      callbackURL: '/api/auth/discord/callback',
      scope: ['identify', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.oauthId, profile.id))
          .limit(1);

        if (existingUser) {
          // Update user's access token and last login
          await db
            .update(users)
            .set({ 
              lastLoginAt: new Date(),
              updatedAt: new Date()
            })
            .where(eq(users.id, existingUser.id));
            
          return done(null, existingUser);
        }

        // Create new user
        const [newUser] = await db
          .insert(users)
          .values({
            username: profile.username || profile.id,
            email: profile.email || '',
            avatar: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : '',
            oauthProvider: 'discord',
            oauthId: profile.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return done(null, newUser);
      } catch (error) {
        console.error('Discord OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;