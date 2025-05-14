import Container from "react-bootstrap/Container";
import { EventForm } from "../../components/EventForm";

export function CreateEvent() {
  return (
    <Container className="mt-4">
      <EventForm></EventForm>
    </Container>
  );
}