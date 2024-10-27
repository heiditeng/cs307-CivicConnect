const { app, signupUser, loginUser, users } = require('../server');
const User = require('../user'); // Adjust path to your User model

describe('signupUser', () => {
    // Clear the database before each test
    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should register a new user successfully', async () => {
        const message = await signupUser(
            'heidiTeng',
            'SecurePass123!',
            'SecurePass123!',
            'heidi@example.com',
            '1234567890',
            false,
            false,
            false
        );
        expect(message).toBe('User registered successfully.');
    });

    it('should throw an error when username or password is missing', async () => {
        await expect(
            signupUser('', 'SecurePass123!', 'SecurePass123!', 'heidi@example.com', '1234567890', false, false, false)
        ).rejects.toThrow('Make sure to fill out all fields.');
    });

    it('should throw an error when the user already exists', async () => {
        // Create the first user
        await signupUser(
            'avishiGoyal',
            'securePass123!',
            'securePass123!',
            'avishi@gmail.com',
            '1234567890',
            false,
            false,
            false
        );

        // Attempt to create a user with the same username or email
        await expect(
            signupUser(
                'avishiGoyal',
                'securePass123!',
                'securePass123!',
                'avishi@gmail.com',
                '1234567890',
                false,
                false,
                false
            )
        ).rejects.toThrow('User with this username or email already exists.');
    });
});