import { Button, Container } from 'react-bootstrap';

import { EventsList } from '../../components/EventList';

export function Events() {
  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Events</h1>
        <Button variant="primary">Create Event</Button>
      </div>

      <EventsList />
    </Container>
  );
}
