import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
import { useDeleteEvent } from '../../hooks/events/useDeleteEvent';
import useEvents from '../../hooks/events/useEvents';
import { formatDate } from '../../utils/formatDate';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';

export function EventsList() {
  const { events, loading, error, refreshEvents } = useEvents();
  const { deleteEvent, loading: deleting } = useDeleteEvent();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error loading events.</p>;

  if (!loading && events.length === 0) {
    return <p>No events yet. Click "Create Event" to get started!</p>;
  }

  const handleRowClick = (eventId: number) => {
    navigate(`/events/${eventId}`);
    console.log('row clicked', eventId);
  };

  const handleEdit = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    
    navigate(`/events/${eventId}/edit`);
  };

  const handleDelete = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();

    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (eventToDelete == null) return;

    try {
      await deleteEvent(eventToDelete);

      refreshEvents();
    } catch (err) {
      // TODO: handle error
      console.error('Failed to delete event:', err);
    } finally {
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date & Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id} onClick={() => handleRowClick(event.id)} className="clickable-row">
              <td>{event.title}</td>
              <td>{formatDate(event.start_time)}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <Button variant="outline-primary" size="sm" onClick={(e) => handleEdit(e, event.id)} className="me-2">
                  Edit
                </Button>
                <Button variant="outline-danger" size="sm" onClick={(e) => handleDelete(e, event.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName="event"
        loading={deleting}
      />
    </>
  );
}