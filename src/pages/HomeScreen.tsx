import { Card, Col, Row,Button} from 'react-bootstrap';
const HomeScreen = () => {

    const books = [
  { id: 1, name: 'Book One', author: 'Author A', price: 15.99 },
  { id: 2, name: 'Book Two', author: 'Author B', price: 12.49 },
  { id: 3, name: 'Book Three', author: 'Author C', price: 19.99 },
  // add more books...
];

    return (
        <>
        <h1>Latestest Books</h1>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {books.map((book) => (
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
export default HomeScreen;