import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas, ListGroup } from 'react-bootstrap';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { removeFromCart } from '../features/cart/cartSlice';
import { updateCartQuantityAsync } from '../features/cart/cartThunks';

const Header: React.FC = () => {
  const [showCart, setShowCart] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();

  const toggleCart = () => setShowCart(!showCart);
  const handleRemove = (bookId: number) => {
    dispatch(removeFromCart(bookId));
  };

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
                <ListGroup.Item
                  key={item.bookId}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>Book ID:</strong> {item.bookId}
                    
                  </div>

                  <div className="d-flex align-items-center">
                                        <Button
                      variant="outline-secondary"
                      size="sm"
                      className="rounded-circle me-2"
                      onClick={() =>
                        dispatch(updateCartQuantityAsync({ bookId: item.bookId, quantity: item.quantity - 1 }))
                      }
                      disabled={item.quantity <= 1}
                    >
                      −
                    </Button>

                    <span className="mx-2">{item.quantity}</span>

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="rounded-circle me-2"
                      onClick={() =>
                        dispatch(updateCartQuantityAsync({ bookId: item.bookId, quantity: item.quantity + 1 }))
                      }
                    >
                      +
                    </Button>


                    {/* Delete (Bin icon only) */}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => dispatch(removeFromCart(item.bookId))}
                      aria-label={`Remove book ${item.bookId} from cart`}
                    >
                      <i className="bi bi-trash fs-5"></i>
                    </Button>
                  </div>
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
