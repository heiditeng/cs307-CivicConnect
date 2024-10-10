const {app, signupUser, loginUser, users} = require('../server');
// mock data for google authentication
const request = require('supertest');
const sinon = require('sinon');
const passport = require('passport');
const {sendOTPEmail} = require('../messages.js');
const bcrypt = require('bcrypt');


describe('Google OAuth Authentication', () => {
    beforeEach(() => {
        users.length = 0; // clear users array
    });

    // mock passport.js Google OAuth Strategy
    beforeEach(() => {
        sinon.stub(passport, 'authenticate').callsFake((strategy) => {
            if (strategy === 'google') {
                return (req, res, next) => {
                    if (req.url.includes('/auth/google/callback')) {
                        // simulate google user with fake info
                        req.user = {
                            googleId: 'testGoogleId123',
                            username: 'Test Google User',
                            email: 'testuser@gmail.com'
                        };
                        users.push(req.user);
                        return res.redirect('http://localhost:3000'); // simulate redirect to the home page after successful login
                    } else {
                        // simulate redirect to Google login page
                        res.redirect('https://accounts.google.com/o/oauth2/v2/auth');
                    }
                };
            }
        });
    });

    afterEach(() => {
        sinon.restore(); // restore original passport authenticate function after each test
    });

    it('should redirect to Google login page', async () => {
        const response = await request(app).get('/auth/google');
        expect(response.statusCode).toBe(302); // expect a 302 redirect (send user to diff page)
        expect(response.headers.location).toContain('accounts.google.com'); // check redirection to google login
    });
});

describe('MFA Login Tests', () => {
    let otpStore = {};

    beforeEach(() => {
        users.length = 0; 
        otpStore = {}; // clear OTP store
    });

    beforeEach(async () => {
        // ensure user creation with correct data
        const hashedPassword = await bcrypt.hash('testPassword123', 10);
        users.push({
            username: 'testUser',
            password: hashedPassword, 
            email: 'test@example.com',
            enableMFA: true, 
        });
    });

    beforeEach(() => {
        sinon.stub(sendOTPEmail).callsFake((email, otp) => {
            otpStore[email] = otp; 
            return Promise.resolve(); // simulate success
        });
    });

    afterEach(() => {
        sinon.restore(); 
    });

    it('should send OTP when MFA login is initiated', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: 'testUser', password: 'testPassword123' });
    
        console.log('Response body:', response.body); 
        console.log('OTP Store after login:', otpStore); 
    
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('OTP sent to your email.');
    });
});

describe('loginUser', () => {
    beforeEach(() => {
        users.length = 0;
    });

    // register before start
    beforeEach(async () => {
        await signupUser('testUser', 'testPassword123', 'testPassword123', 'test@example.com', '4857489257483957');
    });

    // checks if login fails when the username is not found
    it('should throw an error when username is not found', async () => {
        await expect(loginUser('heiditeng', 'testPass1234123454')).rejects.toThrow('Invalid username or password.');
    });

    // Checks if login fails when the password is incorrect
    it('should throw an error when password is incorrect', async () => {
        await expect(loginUser('testUser', 'testPass12321421413432432')).rejects.toThrow('Invalid username or password.');
    });

    // Checks if login is successful when correct credentials are provided
    it('should successfully log in when correct credentials are provided', async () => {
        const result = await loginUser('testUser', 'testPassword123');
        expect(result.message).toBe('Login successful.');
        expect(result.token).toBeDefined();
    });
});
