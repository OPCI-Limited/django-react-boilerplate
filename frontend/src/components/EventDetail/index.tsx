import { Button, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
import { useDeleteEvent } from '../../hooks/events/useDeleteEvent';
import { useEventById } from '../../hooks/events/useEvent';
import { useEventAttendees } from '../../hooks/events/useEventAttendees';
import { useCreateInvitation } from '../../hooks/invitations/useCreateInvitation';
import { InvitationStatus } from '../../interfaces';
import { formatDate } from '../../utils/formatDate';
import { AttendeeList } from '../AttendeeList';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { InviteUsersModal } from '../InviteUsersModal';

export function EventDetail() {
  const { event, loading, error } = useEventById();
  const { deleteEvent, loading: deleting } = useDeleteEvent();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const { attendees, loading: attendeesLoading, error: attendeesError, refreshAttendees } = useEventAttendees(event?.id);
  const [showInviteUsersModal, setShowInviteUsersModal] = useState(false);
  const { createInvitation, loading: creatingInvitation } = useCreateInvitation();

  if (loading) return <p>Loading event...</p>
  if (error || !event) return <p>Error loading event.</p>

  const acceptedAttendees = attendees.filter(a => a.status === InvitationStatus.ACCEPTED);
  const pendingAttendees = attendees.filter(a => a.status === InvitationStatus.PENDING);

  const handleEdit = () => {
    navigate(`/events/${event.id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleInviteUsers = () => {
    setShowInviteUsersModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteEvent(event.id);
      navigate('/events');
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const confirmInviteUsers = async (userId: string) => {
    try {
      await createInvitation(event.id, userId);
      refreshAttendees();
    } catch (error) {
      alert('Failed to invite user');
    } finally {
      setShowInviteUsersModal(false);
    }
  };

  return (
    <Container className="mt-4">
      <Button variant="link" onClick={() => navigate('/events')}>
        &larr; Back to Events
      </Button>

      <Card className="mt-3">
        <Card.Body>
          <Card.Title as="h2">{event.title}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            {formatDate(event.start_time)} &ndash; {formatDate(event.end_time)}
          </Card.Subtitle>

          <Card.Text>{event.description}</Card.Text>

          <h5>Location</h5>
          <p>{event.location}</p>

          <div className="d-flex gap-2 mt-4">
            <Button variant="primary" onClick={handleEdit}>Edit</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
            <Button variant="secondary" onClick={handleInviteUsers}>Invite users</Button>
          </div>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Attendees</Card.Title>

          {attendeesLoading && <p>Loading attendees...</p>}
          {attendeesError && <p>Error loading attendees.</p>}

          {!attendeesLoading && !attendeesError && attendees.length === 0 && (
            <p className="text-muted">No attendees yet.</p>
          )}

          {!attendeesLoading && !attendeesError && attendees.length > 0 && (
            <>
              <AttendeeList
                title={`Accepted (${acceptedAttendees.length})`}
                attendees={acceptedAttendees}
              />
              <AttendeeList
                title={`Pending (${pendingAttendees.length})`}
                attendees={pendingAttendees}
              />
            </>
          )}
        </Card.Body>
      </Card>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName="event"
        loading={deleting}
      />

      <InviteUsersModal
        show={showInviteUsersModal}
        onHide={() => setShowInviteUsersModal(false)}
        onConfirm={confirmInviteUsers}
        loading={creatingInvitation}
      />
    </Container>
  );
}