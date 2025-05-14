import { ListGroup } from "react-bootstrap";
import { Attendee } from "../../interfaces";

export function AttendeeList({ title, attendees }: { title: string, attendees: Attendee[] }) {
  if (attendees.length === 0) return null;

  return (
    <>
      <h6 className="mt-3">{title}</h6>
      <ListGroup>
        {attendees.map(i => (
          <ListGroup.Item key={i.user.id}>{i.user.email}</ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}