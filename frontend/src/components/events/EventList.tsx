import React, { useState, useContext } from 'react';
import { EventContext } from '../../context/EventContext';
import { AuthContext } from '../../context/AuthContext';
import { cancelEvent } from "../../api/events";
import Modal from './Modal';
import './EventList.css';

const EventList: React.FC = () => {
  const { events, loadingEvents } = useContext(EventContext);
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');

  if (loadingEvents) return <p>Loading events...</p>;
  if (!Array.isArray(events) || events.length === 0)
    return <p>No events available.</p>;

  const openModal = (eventId: number) => {
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInviteEmail('');
  };

  const handleInvite = async () => {
    if (!inviteEmail || !selectedEventId) return;

    try {
      await api.post(`/events/${selectedEventId}/invite`, { email: inviteEmail });
      alert(`Invitation sent to ${inviteEmail}`);
      closeModal();
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

  const handleCancelEvent = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to cancel this event?')) {
      return;
    }

    try {
      await cancelEvent(eventId);
      alert('Event canceled successfully!');
    } catch (error) {
      console.error('Event cancellation failed:', error);
      alert('Failed to cancel the event. Please try again.');
    }
  };

  return (
    <div className="event-list-container">
      <h2>Upcoming Events</h2>

      <table className="event-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Organizer</th>
            <th>Description</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.organizer}</td>
              <td>{event.description}</td>
              <td>{new Date(event.start_time).toLocaleString()}</td>
              <td>{new Date(event.end_time).toLocaleString()}</td>
              <td>{event.location}</td>
              <td>
                {user?.email === event.organizer && (
                  <button
                    className="invite-users-button"
                    data-modal="invite"
                    onClick={() => openModal(event.id)}
                  >
                    Invite Users
                  </button>
                )}
                {user?.email === event.organizer && (
                  <button
                    className="cancel-event-button"
                    onClick={() => handleCancelEvent(event.id)}
                  >
                    Cancel Event
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={closeModal} id="invite">
        <h2>Invite User</h2>
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Enter user's email"
          required
        />
        <button onClick={handleInvite}>Send Invitation</button>
      </Modal>
    </div>
  );
};

export default EventList;
