import { Button, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
import { useDeleteEvent } from '../../hooks/events/useDeleteEvent';
import { useEventById } from '../../hooks/events/useEvent';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';

export function EventDetail() {
  const { event, loading, error } = useEventById();
  const { deleteEvent, loading: deleting } = useDeleteEvent();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  if (loading) return <p>Loading event...</p>
  if (error || !event) return <p>Error loading event.</p>

  const handleEdit = () => {
    navigate(`/events/${event.id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteEvent(event.id);
      navigate('/events');
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setShowDeleteModal(false);
    }
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

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName="event"
        loading={deleting}
      />
    </Container>
  );
}