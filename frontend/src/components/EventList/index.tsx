import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

import useEvents from '../../hooks/events/useEvents';

export function EventsList() {
  const { events, loading, error } = useEvents();
  const navigate = useNavigate();

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error loading events.</p>;

  const handleRowClick = (eventId: number) => {
    navigate(`/events/${eventId}`);
    console.log('row clicked', eventId);
  };

  const handleEdit = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    // navigate(`/events/${eventId}/edit`);
    console.log('edit', eventId);
  };

  const handleDelete = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    // Trigger modal or confirm delete logic
    console.log('Delete event', eventId);
  };

  return (
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
            <td>{new Date(event.start_time).toLocaleString()}</td>
            <td onClick={(e) => e.stopPropagation()}>
              <Button variant="primary" size="sm" onClick={(e) => handleEdit(e, event.id)} className="me-2">
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={(e) => handleDelete(e, event.id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}