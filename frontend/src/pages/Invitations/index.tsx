import Container from 'react-bootstrap/Container';
import { InvitationList } from '../../components/InvitationList';

export function Invitations() {
  return (
    <Container className="mt-4">
      <h1 className="mb-0">Invitations</h1>
      <InvitationList></InvitationList>
    </Container>
  );
}