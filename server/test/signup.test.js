const { signupUser, users } = require('../server');

describe('signupUser', () => {
    beforeEach(() => {
        // reset the users array before each test to isolate each test case
        users.length = 0;
    });

    // checks if signup is successfull
    it('should register a new user successfully', async () => {
        const message = await signupUser('heidiTeng', 'securePass123', 'heidi@gmail.com', '123456789');
        expect(message).toBe('User registered successfully.');
        expect(users).toHaveLength(1);
        expect(users[0].username).toBe('heidiTeng');
        expect(users[0].email).toBe('heidi@gmail.com');
        expect(users[0].phoneNumber).toBe('123456789');
    });

    // if certain fields are missing
    it('should throw an error when username or password is missing', async () => {
        await expect(signupUser('aysuSaglam', 'password123', 'aysu@gmail.com', '')).rejects.toThrow('Make sure to fill out all fields.');
        await expect(signupUser('', 'password123', 'aysu@gmail.com', '')).rejects.toThrow('Make sure to fill out all fields.');
        await expect(signupUser('aysu', '', '', '')).rejects.toThrow('Make sure to fill out all fields.');
        await expect(signupUser('','','','23432432423')).rejects.toThrow('Make sure to fill out all fields.');
    });

    // if user already exists
    it('should throw an error when the user already exists', async () => {
        await signupUser('avishiGoyal', 'securePass123', 'avishi@gmail.com', '123');
        await expect(signupUser('avishiGoyal', 'securePass123', 'avishi@gmail.com', '123')).rejects.toThrow('User with this username or email already exists.');
    });
});