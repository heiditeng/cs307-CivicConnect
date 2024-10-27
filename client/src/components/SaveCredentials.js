import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const SaveCredentials = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state?.username; // Get the username passed from login

    const handleSaveCredentials = async () => {
        try {
            const response = await axios.post('http://localhost:5010/save-credentials', {
                username,
                password
            });

            setMessage(response.data.message);

            if (response.data.message === 'Credentials saved successfully.') {
                navigate('/profile');
            }
        } catch (error) {
            setMessage('Failed to save credentials. Please try again.');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Save Your Credentials</h2>
            <p>Enter your password to securely save your credentials.</p>
            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '10px', marginBottom: '10px' }}
            />
            <br />
            <button onClick={handleSaveCredentials} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                Save Credentials
            </button>
            {message && <p style={{ color: message.includes('Failed') ? 'red' : 'green' }}>{message}</p>}
        </div>
    );
};

export default SaveCredentials;
