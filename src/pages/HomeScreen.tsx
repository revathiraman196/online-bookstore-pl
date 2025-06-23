import React, { useEffect } from 'react';
import { fetchBooksStart, fetchBooksSuccess, fetchBooksFailure, Book } from '../features/books/booksSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchBooksApi } from '../services/booksApi';
import { Card, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { addToCartAsync } from '../features/cart/cartThunks';

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books, loading, error } = useAppSelector(state => state.books);
  const { status: cartStatus, error: cartError } = useAppSelector(state => state.cart);

  useEffect(() => {
    const loadBooks = async () => {
      dispatch(fetchBooksStart());
      try {
        const data = await fetchBooksApi();
        dispatch(fetchBooksSuccess(data));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        dispatch(fetchBooksFailure(message));
      }
    };
    loadBooks();
  }, [dispatch]);

  const handleAddToCart = (bookId: number) => {
    console.log("Clicked book:", bookId,cartStatus);
    if (cartStatus === 'loading') return;
    dispatch(addToCartAsync({ bookId, quantity: 1 }));
  };

  if (loading) return <Spinner animation="border" role="status" aria-label="Loading"><span className="visually-hidden">Loading...</span></Spinner>;
  if (error) return <Alert variant="danger" role="alert">{error}</Alert>;

  return (
    <>
      <h1>Book List</h1>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {books.map((book: Book) => (
          <Col key={book.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{book.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{book.author}</Card.Subtitle>
                <Card.Text className="mb-4">${book.price.toFixed(2)}</Card.Text>
               <Button
                  variant="primary"
                  className="mt-auto"
                  onClick={() => handleAddToCart(book.id)}
                  disabled={cartStatus === 'loading'}
                  aria-label={`Add ${book.name} to cart`}
                >
                  {cartStatus === 'loading' ? (
                    <>
                      <Spinner animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Adding...
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </Button> 
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {cartStatus === 'failed' && cartError && (
        <Alert variant="danger" className="mt-3" role="alert" aria-live="assertive">
          {cartError}
        </Alert>
      )}
    </>
  );
};

export default HomeScreen;
