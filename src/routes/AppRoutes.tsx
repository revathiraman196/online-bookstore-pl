import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import HomeScreen from '../pages/HomeScreen';
import Header from '../pages/header';
import RegisterScreen from '../pages/RegisterScreen';

const AppRoutes = () => (
  <Router>
    <Header></Header> 
     <main className="p-4">
         <Container>
        <Routes>
      <Route path="/homescreen" element={<HomeScreen />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterScreen />} />
      <Route path="*" element={<Navigate to="/homescreen" replace />} />
      {/* Add more routes here */}
    </Routes>
     </Container>
     </main>   
    
  </Router>
);

export default AppRoutes;


