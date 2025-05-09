import { Button, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useEventById } from '../../hooks/events/useEvent';

export function EventDetail() {
  const { event, loading, error } = useEventById();
  const navigate = useNavigate();

  if (loading) return <p>Loading event...</p>
  if (error || !event) return <p>Error loading event.</p>

  const handleEdit = () => {
    navigate(`/events/${event.id}/edit`);
  };
  const handleDelete = () => {
    // Open delete modal or confirmation
    console.log('Delete event', event.id);
  };

  return (
    <Container className="mt-4">
      <Button variant="link" onClick={() => navigate('/events')}>
        &larr; Back to Events
      </Button>

      <Card className="mt-3">
        <Card.Body>
          <Card.Title as="h2">{event.title}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            {new Date(event.start_time).toLocaleString()} &ndash; {new Date(event.end_time).toLocaleString()}
          </Card.Subtitle>

          <Card.Text>{event.description}</Card.Text>

          <h5>Location</h5>
          <p>{event.location}</p>

          <div className="d-flex gap-2 mt-4">
            <Button variant="primary" onClick={handleEdit}>Edit</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}