import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { useUsers } from '../../hooks/useUsers';

interface InviteUsersModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (userId: string) => void;
  loading?: boolean;
}

export function InviteUsersModal({
  show,
  onHide,
  onConfirm,
  loading = false,
}: InviteUsersModalProps) {
  const { users, loading: usersLoading, error } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const { user } = useAuth();

  const filteredUsers = users.filter((u) => u.email !== user?.email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      onConfirm(selectedUserId);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Invite a User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {usersLoading && <p>Loading users...</p>}
          {error && <p>Error loading users.</p>}

          {!usersLoading && !error && (
            <Form.Group controlId="userSelect">
              <Form.Label>Select a user to invite</Form.Label>
              <Form.Select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={loading}
              >
                <option value="">-- Select a user --</option>
                {filteredUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={!selectedUserId || loading}
          >
            {loading ? 'Inviting...' : 'Invite'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}