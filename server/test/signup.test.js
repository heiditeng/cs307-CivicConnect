const { signupUser, users } = require('../server');

describe('signupUser', () => {
    beforeEach(() => {
        // reset the users array before each test to isolate each test case
        users.length = 0;
    });

    it('should register a new user successfully', async () => {
        const message = await signupUser('heidiTeng', 'securePass123');
        expect(message).toBe('User registered successfully.');
        expect(users).toHaveLength(1);
        expect(users[0].username).toBe('heidiTeng');
    });

    it('should throw an error when username or password is missing', async () => {
        await expect(signupUser('aysuSaglam', '')).rejects.toThrow('Make sure to fill out both username and password.');
        await expect(signupUser('', 'password123')).rejects.toThrow('Make sure to fill out both username and password.');
    });

    it('should throw an error when the user already exists', async () => {
        await signupUser('avishiGoyal', 'securePass123');
        await expect(signupUser('avishiGoyal', 'securePass123')).rejects.toThrow('User already exists.');
    });
});