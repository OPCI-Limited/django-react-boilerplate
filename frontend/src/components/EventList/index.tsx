import Table from 'react-bootstrap/Table';

import useEvents from '../../hooks/events/useEvents';

export function EventsList() {
  const { events, loading, error } = useEvents();

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error loading events.</p>;

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Title</th>
          <th>Date & Time</th>
        </tr>
      </thead>
      <tbody>
        {events.map(event => (
          <tr key={event.id}>
            <td>{event.title}</td>
            <td>{new Date(event.start_time).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}