import { useState } from "react";
import { Button, ListGroup, Spinner } from "react-bootstrap";
import useInvitations from "../../hooks/invitations/useInvitations";
import { api } from "../../services/api";
import { formatDate } from "../../utils/formatDate";

export function InvitationList() {
  const { invitations, loading, error, refreshInvitations } = useInvitations();
  const [isActionLoading, setActionLoading] = useState(false);

  if (loading) return <p>Loading invitations...</p>;
  if (error) return <p>Error loading invitations.</p>;
  if (!loading && (invitations || []).length === 0) {
    return <p>No invitations yet.</p>;
  }

  const onAccept = async (inviteId: number) => {
    try {
      setActionLoading(true);
      await api.patch(`/invitations/${inviteId}/`, { status: "accepted" });

      refreshInvitations();
    } catch (error) {
      console.error("Error accepting invitation", error);
      alert("Failed to accept invitation. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const onDecline = async (inviteId: number) => {
    try {
      setActionLoading(true);
      await api.patch(`/invitations/${inviteId}/`, { status: "declined" });

      refreshInvitations();
    } catch (error) {
      console.error("Error accepting invitation", error);
      alert("Failed to decline invitation. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <ListGroup className="mt-3">
        {invitations.map((invite) => (
          <ListGroup.Item
            key={invite.id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{invite.event.title}</strong>
              <div className="text-muted small">
                {formatDate(invite.event.start_time)} - {invite.event.location}
              </div>
            </div>
            <div>
              <Button
                variant="success"
                disabled={isActionLoading}
                size="sm"
                className="me-2"
                onClick={() => onAccept(invite.id)}
              >
                {(isActionLoading || loading) && (
                  <Spinner animation="border" size="sm" className="me-2" />
                )}
                Accept
              </Button>
              <Button
                variant="outline-danger"
                disabled={isActionLoading}
                size="sm"
                onClick={() => onDecline(invite.id)}
              >
                {(isActionLoading || loading) && (
                  <Spinner animation="border" size="sm" className="me-2" />
                )}
                Decline
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}
