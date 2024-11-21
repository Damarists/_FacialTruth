import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Avatar, Box, Drawer, List, ListItem, ListItemText, CssBaseline, Divider, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './Layout.css';

const drawerWidth = 240;

const LiveEmotionDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detecting, setDetecting] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing the camera', err);
      }
    };

    startVideo();
  }, []);

  const handleDetectEmotions = async () => {
    setDetecting(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const captureFrame = () => {
      if (!detecting) return;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');
      axios.post('http://localhost:5000/detect-emotions', { image: imageData })
        .then(response => {
          setEmotions(prevEmotions => [...prevEmotions, response.data]);
        })
        .catch(error => {
          console.error('Error detecting emotions:', error);
        });
      requestAnimationFrame(captureFrame);
    };

    captureFrame();
  };

  const handleStopDetection = () => {
    setDetecting(false);
    generateReport();
  };

  const generateReport = () => {
    const reportData = emotions.map((emotion, index) => `Frame ${index + 1}: ${JSON.stringify(emotion)}`).join('\n');
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emotion_report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, backgroundColor: '#292929' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#fff' }}>
            Bienvenido
          </Typography>
          <Avatar alt="User Avatar" src="/static/images/avatar/1.jpg" />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1c1c1c', // Fondo negro
            color: '#fff', // Palabras blancas
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', textAlign: 'center', padding: '10px' }}>
          <img src="https://i.ibb.co/Z2PwKTJ/facialtruth.png" alt="Welcome" style={{ width: '100%', marginBottom: '20px' }} />
          <Divider />
          <List>
            <ListItem button component={Link} to="/profile" sx={{ '&:hover': { backgroundColor: '#1976d2' } }}>
              <ListItemText primary="Mi Perfil" sx={{ color: '#fff' }} />
            </ListItem>
            <ListItem button component={Link} to="/live-emotion-detection" sx={{ '&:hover': { backgroundColor: '#1976d2' } }}>
              <ListItemText primary="Detectar Emoción en Vivo" sx={{ color: '#fff' }} />
            </ListItem>
            <ListItem button component={Link} to="/video-emotion-detection" sx={{ '&:hover': { backgroundColor: '#1976d2' } }}>
              <ListItemText primary="Detectar Emoción a través de un vídeo" sx={{ color: '#fff' }} />
            </ListItem>
            <ListItem button component={Link} to="/emotion-report" sx={{ '&:hover': { backgroundColor: '#1976d2' } }}>
              <ListItemText primary="Reporte de Emociones" sx={{ color: '#fff' }} />
            </ListItem>
            <ListItem button onClick={handleLogout} sx={{ '&:hover': { backgroundColor: '#1976d2' } }}>
              <ListItemText primary="Logout" sx={{ color: '#fff' }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <div>
          <h2>Detectar Emoción en Vivo</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', position: 'relative' }}>
            <video ref={videoRef} style={{ width: '80%', borderRadius: '10px' }} autoPlay muted />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={handleDetectEmotions} disabled={detecting}>
              {detecting ? 'Detectando Emociones...' : 'Detectar Emociones'}
            </button>
            {detecting && (
              <button onClick={handleStopDetection} style={{ marginLeft: '10px' }}>
                Terminar Detección de Emociones
              </button>
            )}
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default LiveEmotionDetection;