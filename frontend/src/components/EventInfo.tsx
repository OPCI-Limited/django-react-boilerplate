import React, { useEffect, useState } from "react";
import { Event } from "../interfaces/Event.model";
import { InviteeEventView } from "../interfaces/InviteeEventView";
import { inviteeService } from "../services/invitees.service";

interface EventInfoProps {
  event: InviteeEventView; // Event object to display information
  onClose: () => void; // Callback to close the modal or component
}

const EventInfo: React.FC<EventInfoProps> = ({ event, onClose }) => {
  const [participantStats, setParticipantStats] = useState({
    totalInvites: 0,
    acceptedInvites: 0,
  });
  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        const stats = await inviteeService.getParticipantStats(event.event_id);
        setParticipantStats(stats);
      } catch (error) {
        console.error("Error fetching participant data:", error);
      }
    };
    
    fetchParticipantData();
  }, [event.event_id]);
    

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      
      <div className="space-y-4">
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Title:</span>
          <p className="text-gray-800 dark:text-gray-100">{event.event_title}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Description:</span>
          <p className="text-gray-800 dark:text-gray-100">{event.event_description}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Location:</span>
          <p className="text-gray-800 dark:text-gray-100">{event.event_description}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Start Date:</span>
          <p className="text-gray-800 dark:text-gray-100">
            {new Date(event.start_date).toLocaleString()}
          </p>
        </div>
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">End Date:</span>
          <p className="text-gray-800 dark:text-gray-100">
            {new Date(event.end_date).toLocaleString()}
          </p>
        </div>
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Number of Participant:</span>
          <p className="text-gray-800 dark:text-gray-100">
            {participantStats.totalInvites} participants, {participantStats.totalInvites} invites sent, {participantStats.acceptedInvites} accepted
          </p>
        </div>
        {event.event_created_by && (
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Host:</span>
            <p className="text-gray-800 dark:text-gray-100">{event.first_name} {event.last_name} -<a className="text-blue-500 hover:underline px-2" href={`mailto:${event.host_email}`}>({event.host_email})</a></p>
          </div>
        )}
      </div>
      <div className="mt-6 text-right">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EventInfo;
