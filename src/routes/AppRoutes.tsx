import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Header from '../pages/header';

const AppRoutes = () => (
  <Router>
    <Header></Header> 
     <Container>
        <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      {/* Add more routes here */}
    </Routes>
     </Container>
    
  </Router>
);

export default AppRoutes;


