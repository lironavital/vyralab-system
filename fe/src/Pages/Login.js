import React, { useState } from 'react';
import axios from 'axios';
import { getConfig } from '../config/getConfig'

const config = getConfig()

const Login = ({ setLoggedUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simple validation
        if (!email || !password) {
            setError('Email and password are required.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${config.backend}/login`, { email, password, }, { withCredentials: true });
            if (response.status === 200) {
                const userData = response.data
                setLoggedUser(userData)
                localStorage.setItem('vyralab_userData', JSON.stringify(userData))
                debugger
                console.log('Login successful:', userData);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{}}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '2vh' }}>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '2vh' }}>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button style={{ padding: '10px' }} type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
