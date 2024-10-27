jest.mock('mongoose', () => {
    const SchemaMock = function (schemaDefinition) {
        this.schemaDefinition = schemaDefinition;
        return this;
    };

    // simluate behavior of mongoose
    const ModelMock = {
        findOne: jest.fn(),
        save: jest.fn().mockResolvedValue({}),
    };

    return {
        Schema: SchemaMock,
        model: jest.fn(() => ModelMock),
        connect: jest.fn().mockResolvedValue({}),
    };
});

const bcrypt = require('bcrypt');
const supertestSession = require('supertest-session');
const { app } = require('../server');

describe('POST /save-credentials', () => {
    let testSession;
    let hashedPassword;

    beforeAll(async () => {
        // Hash the password before the tests run
        hashedPassword = await bcrypt.hash('password', 10);

        // Set up the mock for User.findOne
        require('mongoose').model().findOne.mockResolvedValue({
            username: 'testuser',
            password: hashedPassword,
            enableMFAEmail: false,
            enableMFAPhone: false,
        });

        // Initialize supertest-session
        testSession = supertestSession(app);
    });

    it('should save credentials successfully', async () => {
        // simulate a successful login to establish session state
        await testSession
            .post('/login')
            .send({ username: 'testuser', password: 'password' })
            .expect(200);

        // call save creds
        const response = await testSession
            .post('/save-credentials')
            .send({ username: 'testuser', password: 'password' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Credentials saved successfully.');
    });

    it('should return an error if no user is in session', async () => {
        // call save cred without logging in (shouldn't work)
        const response = await supertestSession(app)
            .post('/save-credentials')
            .send({ username: 'testuser', password: 'password' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No user in session.');
    });
});