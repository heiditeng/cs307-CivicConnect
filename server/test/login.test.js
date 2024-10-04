const { signupUser, loginUser, users } = require('../server');

describe('loginUser', () => {
    beforeEach(() => {
        users.length = 0; // reset user array
    });

    // checks if valid error message is filled
    it('should throw an error when username or password is missing', async () => {
        await expect(loginUser('username', '')).rejects.toThrow('Make sure to fill out both fields.');
        await expect(loginUser('', 'password')).rejects.toThrow('Make sure to fill out both fields.');
    });

    // invalid username
    it('should throw an error when username is not found', async () => {
        await signupUser('aysu', 'password123');
        await expect(loginUser('newUser', 'password123')).rejects.toThrow('Invalid username or password.');
    });

    // invalud password
    it('should throw an error when password is incorrect', async () => {
        await signupUser('heidi', 'password123');
        await expect(loginUser('heidi', 'wrong_password')).rejects.toThrow('Invalid username or password.');
    });

    // successful login
    it('should successfully log in when correct credentials are provided', async () => {
        // login
        await signupUser('avishi', 'password123');
        const loginResult = await loginUser('avishi', 'password123');

        // check the return value
        expect(loginResult.message).toBe('Login successful.');
        expect(loginResult.token).toBeDefined();
        expect(typeof loginResult.token).toBe('string');
    });
});