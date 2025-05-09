import Container from 'react-bootstrap/Container';
import { useParams } from 'react-router-dom';
import { EventForm } from '../../components/EventForm';

export function EditEvent() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <p>Event not found.</p>

  return (
    <Container className="mt-4">
      <EventForm eventId={+id}></EventForm>
    </Container>
  );
}