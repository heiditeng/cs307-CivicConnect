const { signupUser, loginUser, users } = require('../server');

describe('loginUser', () => {
    beforeEach(() => {
        users.length = 0;
    });

    // register before start
    beforeEach(async () => {
        await signupUser('testUser', 'testPassword123', 'test@example.com', '4857489257483957');
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
