import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';


export function Profile() {
  const { user, isAuthenticated, loadingUserData } = useContext(AuthContext);

  // If data is loading or user is not authenticated, show a loading message
  if (loadingUserData) {
    return <div>Loading user data...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-4">User Profile</Card.Title>
              <Card.Text><strong>Email:</strong> {user?.email}</Card.Text>
              <Card.Text><strong>Name:</strong> {user?.name}</Card.Text>
              <Card.Text><strong>Email:</strong> {user?.surname}</Card.Text>
              <Card.Text><strong>Groups:</strong> {user?.groups?.map(group => group.name).join(', ') || 'No groups assigned'}</Card.Text>
              <Card.Text><strong>Permissions:</strong> {user?.permissions?.join(', ')}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
