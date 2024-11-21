import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Box } from '@mui/material';
import AnimatedBackground from './AnimatedBackground';
import './Home.css'; 

const Home = () => {
  return (
    <div className="background">
      <AnimatedBackground />
      <div className="content">
        <Container maxWidth="sm">
          <Box sx={{ mt: 5, textAlign: 'center' }}>
              Welcome to Facial Truth
            <img src="https://i.ibb.co/Z2PwKTJ/facialtruth.png" alt="Welcome" style={{ width: '100%', marginBottom: '20px' }} />
            <Button variant="contained" color="primary" component={Link} to="/login" className="floating-button" sx={{ m: 1 }}>
              Login
            </Button>
            <Button variant="contained" color="secondary" component={Link} to="/register" className="floating-button" sx={{ m: 1 }}>
              Register
            </Button>
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default Home;