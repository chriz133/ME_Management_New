import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Alert, Box, Typography } from '@mui/material';
import authService from '../Data/AuthService';
import '../Styles/LoginScreen.css';

function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login(username, password);
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Paper elevation={3} className="login-paper">
                <Box className="login-box">
                    <Typography variant="h4" component="h1" className="login-title">
                        ME Management
                    </Typography>
                    <Typography variant="h6" component="h2" className="login-subtitle">
                        Anmeldung
                    </Typography>
                    
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    
                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Benutzername"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                            required
                            autoFocus
                        />
                        <TextField
                            fullWidth
                            label="Passwort"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                            sx={{ mt: 2 }}
                        >
                            {loading ? 'Anmelden...' : 'Anmelden'}
                        </Button>
                    </form>
                </Box>
            </Paper>
        </div>
    );
}

export default LoginScreen;
