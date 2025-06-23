import React, { useState } from 'react';

import { LinkContainer } from 'react-router-bootstrap';
/* 
const header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>BookStore</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/register">
              <Nav.Link>Register</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default header; */

import { useAppSelector } from '../hooks/useAppSelector';
import { Navbar, Nav, Container, Button, Offcanvas, ListGroup } from 'react-bootstrap';

const Header: React.FC = () => {
  const [showCart, setShowCart] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);

  const toggleCart = () => setShowCart(!showCart);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Bookstore</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-light" onClick={toggleCart}>
              🛒 Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Offcanvas show={showCart} onHide={toggleCart} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item.bookId}>
                  Book ID: {item.bookId} — Quantity: {item.quantity}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
