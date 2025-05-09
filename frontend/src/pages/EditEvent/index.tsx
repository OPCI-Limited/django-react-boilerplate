import { useParams } from 'react-router-dom';
import { EventForm } from '../../components/EventForm';

export function EditEvent() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <p>Event not found.</p>

  return (
    <EventForm eventId={+id}></EventForm>
  );
}