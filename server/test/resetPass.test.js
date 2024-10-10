const request = require('supertest');
const { app, signupUser, users } = require('../server'); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt');
const secretKey = 'key';
const {sendPasswordResetEmail} = require('../emailService'); // Import the email service


describe('Password Reset Routes', () => {
    beforeEach(() => {
        users.length = 0;
    });

    // requesting a password reset link
    it('should generate a password reset link for a valid email', async () => {
        await signupUser('heidiTeng', 'securePass123', 'securePass123', 'civicconnect075@gmail.com', '123456789');

        const response = await request(app)
            .post('/request-password-reset')
            .send({email: 'civicconnect075@gmail.com'});

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Password reset link sent successfully.');
    });

    // requesting a password reset link with an invalid email
    it('should return a success message but not generate a link for a non-existent email', async () => {
        const response = await request(app)
            .post('/request-password-reset')
            .send({ email: 'aysu@gmail.com' });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('If this email is registered, you will receive a password reset link.');
    });

    // valid token
    it('should reset the password successfully with a valid token', async () => {
        await signupUser('heidiTeng', 'securePass123', 'securePass123', 'heiditeng22@gmail.com', '123456789');

        const resetToken = jwt.sign({ email: 'heiditeng22@gmail.com' }, secretKey, { expiresIn: '1h' });

        const response = await request(app)
            .post('/reset-password')
            .send({ token: resetToken, newPassword: 'hihihi' });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Password has been reset successfully.');

        // verify that the password was updated
        const user = users.find(u => u.email === 'heiditeng22@gmail.com');
        const isPasswordCorrect = await bcrypt.compare('hihihi', user.password);
        expect(isPasswordCorrect).toBe(true);
    });

    // invalid token
    it('should return an error when using an invalid or expired token', async () => {
        const response = await request(app)
            .post('/reset-password')
            .send({ token: 'invalidToken', newPassword: 'hihihi' });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Invalid or expired token.');
    });

    // user does not exist
    it('should return an error if the token is valid but the user does not exist', async () => {
        // Generate a reset token for an email not associated with any user
        const resetToken = jwt.sign({ email: 'heiditeng22@gmail.com' }, secretKey, { expiresIn: '1h' });

        // Send request to reset password
        const response = await request(app)
            .post('/reset-password')
            .send({ token: resetToken, newPassword: 'hihihi' });

        // Expect error response
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Invalid token or user not found.');
    });
});