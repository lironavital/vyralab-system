import React, { useState } from 'react';
import axios from 'axios';
import { getConfig } from '../config/getConfig'

const config = getConfig()

const Login = ({ setLoggedUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simple validation
        if (!username || !password) {
            setError('Username and password are required.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${config.backend}/login`, { username, password, }, { withCredentials: true });
            if (response.status === 200) {
                setLoggedUser(response.data)
            }
            console.log('Login successful:', response.data);
        } catch (error) {
            console.error('Error during login:', error);
            setError('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: "center", flexDirection: 'column' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1vh' }}>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '1vh' }}>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
