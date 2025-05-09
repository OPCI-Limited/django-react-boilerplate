import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import React from 'react';
import { EventsList } from '../../components/EventList';

export function Events() {
  const navigate = useNavigate();

  const handleCreateButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    navigate(`/events/create`);
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Events</h1>
        <Button variant="primary" onClick={handleCreateButtonClick}>Create Event</Button>
      </div>

      <EventsList />
    </Container>
  );
}
