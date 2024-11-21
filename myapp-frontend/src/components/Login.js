import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Background from './Background';
import './Register.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); 
      navigate('/dashboard');
    } catch (error) {
      alert('Error logging in');
    }
  };

  return (
    <Background>
      <Container maxWidth="md">
        <Card className="card">
          <CardContent>
            <Box sx={{ mt: 5 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Login
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Login
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="contained" color="secondary" fullWidth onClick={() => navigate('/')}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Background>
  );
};

export default Login;