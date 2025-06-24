import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas, ListGroup, Row, Col } from 'react-bootstrap';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { removeFromCart } from '../features/cart/cartSlice';
import { updateCartQuantityAsync } from '../features/cart/cartThunks';
import { LinkContainer } from 'react-router-bootstrap';

const Header: React.FC = () => {
  const [showCart, setShowCart] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  const { books } = useAppSelector(state => state.books);
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const toggleCart = () => setShowCart(!showCart);

  const getBookDetails = (bookId: number) => books.find(b => b.id === bookId);

  const getTotal = () => {
    return cartItems.reduce((sum, item) => {
      const book = getBookDetails(item.bookId);
      return sum + (book?.price || 0) * item.quantity;
    }, 0).toFixed(2);
  };
  const handleIncrement = (bookId: number, currentQty: number) => {
    dispatch(updateCartQuantityAsync({ bookId, quantity: currentQty + 1 }));
  };

  const handleDecrement = (bookId: number, currentQty: number) => {
    if (currentQty > 1) {
      dispatch(updateCartQuantityAsync({ bookId, quantity: currentQty - 1 }));
    }
  };
  const handleRemove = (bookId: number) => {
    dispatch(removeFromCart(bookId));
  };

 

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow">
        <Container>
          <Navbar.Brand href="#">📚 Bookstore</Navbar.Brand>
          <Nav className="ml-auto">
            <Button variant="outline-light" onClick={toggleCart}>
              🛒 Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
            </Button>
            {!isAuthenticated && (
          <LinkContainer to="/login">
            <Nav.Link>
              <i className="fas fa-user me-1"></i> Sign In
            </Nav.Link>
          </LinkContainer>
        )}
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
            <>
              <ListGroup variant="flush">
                {cartItems.map((item) => {
                  const book = getBookDetails(item.bookId);
                  if (!book) return null;

                  const itemTotal = (book.price * item.quantity).toFixed(2);

                  return (
                    <ListGroup.Item key={item.bookId} className="py-3">
                      <Row className="align-items-center">
                        <Col xs={8}>
                          <div className="fw-bold">{book.title}</div>
                          <div className="text-muted small">Author: {book.author}</div>
                          <div className="text-muted small">Price: ${book.price.toFixed(2)}</div>
                          <div className="text-muted small">Total: ${itemTotal}</div>
                        </Col>
                        <Col xs="auto" className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="rounded-circle me-2"
                            onClick={() => handleDecrement(item.bookId, item.quantity)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="rounded-circle ms-2 me-3"
                            onClick={() => handleIncrement(item.bookId, item.quantity)}
                          >
                            +
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemove(item.bookId)}
                            aria-label={`Remove book ${item.bookId} from cart`}
                          >
                            <i className="bi bi-trash fs-5"></i>
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>

              <hr />
              <div className="text-end fw-bold">
                Total: ${getTotal()}
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
