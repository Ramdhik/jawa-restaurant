const express = require('express');
const router = express.Router();
const User = require('../user');
const session = require('express-session');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middlewares');

// Middleware
router.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

router.use(passport.initialize());
router.use(passport.session());

// Google authentication
passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
}, async (accessToken, refreshToken, profile, done) => { 
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            user.namaLengkap = profile.displayName;
            user.email = profile.emails && profile.emails[0] ? profile.emails[0].value : user.email;
            await user.save();
            return done(null, user);
        } else {
            const newUser = new User({
                googleId: profile.id,
                username: profile.emails && profile.emails[0] ? profile.emails[0].value.split('@')[0] : profile.id,
                namaLengkap: profile.displayName,
                email: profile.emails && profile.emails[0] ? profile.emails[0].value : 'no-email@example.com',
                role: 'Pelayan',
            });
            await newUser.save();
            return done(null, newUser);
        }
    } catch (err) {
        console.error('Error in Google OAuth strategy callback:', err);
        return done(err);
    }
}));

// Serialize user ke session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user dari session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        console.error('Error deserializing user:', err);
        done(err, null);
    }
});

// Router untuk login menggunakan Google
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// Router untuk callback setelah login menggunakan Google
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
    async (req, res) => {
        if (!req.user) {
            return res.status(500).json({ message: 'Login berhasil, tetapi data pengguna tidak ditemukan.' });
        }

        const user = req.user;

        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            namaLengkap: user.namaLengkap
        };

        console.log('Payload OAuth:', payload);

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Kirim JWT ke frontend (via cookie atau JSON)
        res.cookie('jwt', token, {
            secure: false,
            sameSite: 'Lax',
            maxAge: 3600000 // 1 jam
        });

        console.log('Token OAuth:', token);

        if (!user.isProfileComplete) {
            // Redirect ke halaman pendaftaran frontend
            return res.redirect(`http://localhost:5500/Frontend/register2.html?userId=${user._id}`);
        } else {
            // Redirect ke halaman profil atau dashboard utama jika sudah lengkap
            if (user.role === 'Pelayan') {
                return res.redirect(`http://localhost:5500/Frontend/dashboardpelayan.html?userId=${user._id}`); // Atau ke URL dashboard frontend Anda
            } else if (user.role === 'Chef') {
                return res.redirect(`http://localhost:5500/Frontend/dashboardchef.html?userId=${user._id}`); // Atau ke URL dashboard frontend Anda
            }
        }
    }
);

// Router untuk login gagal
router.get('/google/failure', (req, res) => {
    res.status(401).send('Login dengan Google gagal. Silakan coba lagi.');
});

// Route untuk menampilkan profil pengguna setelah login
router.get('/profile', (req, res) => {

    if (!req.isAuthenticated()) {
        return res.redirect('/auth/google');
    }
    
    res.json({
        message: `Hello, ${req.user.namaLengkap || req.user.username}!`,
        user: {
            id: req.user._id,
            namaLengkap: req.user.namaLengkap,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
        }
    });
});

// POST complete profile
router.post('/complete-profile', authenticateJWT, async (req, res) => {
    try {
        const { namaLengkap, username, telepon, role } = req.body;
        const userId = req.user.id; // ID pengguna dari JWT yang sudah didecode

        if (!namaLengkap || !username || !telepon || !role) {
            return res.status(400).json({ message: 'Semua field wajib diisi.' });
        }

        // Cek apakah username sudah ada (kecuali untuk user yang sedang diupdate)
        const existingUserWithUsername = await User.findOne({ username: username, _id: { $ne: userId } });
        if (existingUserWithUsername) {
            return res.status(400).json({ message: 'Username sudah digunakan.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        // Update data user
        user.namaLengkap = namaLengkap;
        user.username = username;
        user.telepon = telepon;
        user.role = role;
        user.isProfileComplete = true; // Set flag menjadi true setelah data lengkap

        await user.save();

        // Regenerate JWT karena role dan informasi lain mungkin berubah
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            namaLengkap: user.namaLengkap
        };

        console.log('Payload Complete-User:', payload);

        const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('New Token Complete-User:', newToken);

        // Kirim JWT baru ke frontend (via cookie atau JSON)
        res.cookie('jwt', newToken, {
            secure: false,
            sameSite: 'Lax',
            maxAge: 3600000
        });

        res.status(200).json({ message: 'Profil berhasil dilengkapi!', user: user.toObject({ getters: true }), token: newToken })
    } catch (error) {
        console.error('Error completing profile:', error);
        res.status(500).json({ message: 'Gagal melengkapi profil.', error: error.message });
    }
});

module.exports = router;