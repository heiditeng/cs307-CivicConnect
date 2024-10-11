const { app, signupUser, loginUser, users } = require('../server');
const request = require('supertest');
const sinon = require('sinon');
const passport = require('passport');
const { sendOTPEmail } = require('../messages.js');
const bcrypt = require('bcrypt');

// Mock OTP Store
let otpStore = {};

describe('Google OAuth Authentication', () => {
    beforeEach(() => {
        users.length = 0; // clear users array before each test
    });

    // mock passport.js Google OAuth Strategy
    beforeEach(() => {
        sinon.stub(passport, 'authenticate').callsFake((strategy) => {
            if (strategy === 'google') {
                return (req, res, next) => {
                    if (req.url.includes('/auth/google/callback')) {
                        req.user = {
                            googleId: 'testGoogleId123',
                            username: 'Test Google User',
                            email: 'testuser@gmail.com',
                        };
                        users.push(req.user);
                        return res.redirect('http://localhost:3000'); // simulate redirect
                    } else {
                        res.redirect('https://accounts.google.com/o/oauth2/v2/auth');
                    }
                };
            }
        });
    });

    afterEach(() => {
        sinon.restore(); // restore passport.authenticate after each test
    });

    it('should redirect to Google login page', async () => {
        const response = await request(app).get('/auth/google');
        expect(response.statusCode).toBe(302); // expect a 302 redirect
        expect(response.headers.location).toContain('accounts.google.com'); // check redirection to Google
    });
});

describe('MFA Login Tests', () => {
    beforeEach(() => {
        users.length = 0;
        otpStore = {}; // clear OTP store before each test
    });

    beforeEach(async () => {
        // ensure user creation with correct data
        const hashedPassword = await bcrypt.hash('testPassword123', 10);
        users.push({
            username: 'testUser',
            password: hashedPassword,
            email: 'test@example.com',
            enableMFAEmail: true, // enable MFA
        });
    });

    beforeEach(() => {
        sinon.stub(sendOTPEmail).callsFake((email, otp) => {
            otpStore[email] = otp; 
            return Promise.resolve(); // simulate success
        });
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs after each test
    });

    it('should send OTP when MFA login is initiated', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: 'testUser', password: 'testPassword123' });

        console.log('Response body:', response.body); 
        console.log('OTP Store after login:', otpStore); 

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('OTP sent to your email.');
    }, 10000); // Increased timeout for this test
});