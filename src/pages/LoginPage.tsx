import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authThunks';
import { RootState, AppDispatch } from '../app/store';
import { useNavigate, Link } from 'react-router-dom';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!username || !password) {
      setValidationError('Username and password are required');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    setValidationError('');
    dispatch(loginUser({ username, password }));
  };

  return (
    <Container style={{ maxWidth: '400px', marginTop: '3rem' }}>
      <h2 className="mb-4 text-center">Sign In</h2>
      
      {validationError && <Alert variant="warning">{validationError}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading} className="w-100">
          {loading ? <Spinner animation="border" size="sm" /> : 'Sign In'}
        </Button>
      </Form>

      <Row className="py-3">
        <Col className="text-center">
          New customer? <Link to="/signup">Register here</Link>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;
