// src/features/books/BookList.tsx
import React, { useEffect } from 'react';
import { fetchBooksStart, fetchBooksSuccess, fetchBooksFailure, Book } from '../features/books/booksSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { store } from '../app/store';
import { fetchBooksApi } from '../services/booksApi';
import { Card, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';

const BookList = () => {
  const dispatch = useAppDispatch()
  const { books, loading, error } = useAppSelector(state => state.books);

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
                <Button variant="primary" className="mt-auto">
                  Add to Cart
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default BookList;
