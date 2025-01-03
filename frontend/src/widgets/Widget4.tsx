import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Popup from "reactjs-popup";
import { inviteeEventViewService } from "../services/InviteeEventViewService";
import { inviteeService } from '../services/invitees.service';

interface DashboardCard04Props {
  count: number;
  events: any[];
}

const DashboardCard04: React.FC<DashboardCard04Props> = ({ count, events }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleRSVPUpdate = async (inviteeId: number, status: string) => {
    try {
      await inviteeService.updateRSVPStatus(inviteeId, status);
      alert("RSVP updated successfully!");
      setIsPopupOpen(false); // Close popup after update
    } catch (error) {
      console.error("Error updating RSVP status:", error);
    }
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="flex" onClick={() => setIsPopupOpen(true)}>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1 mx-2">
          Pending Invitation(s)
        </div>
        <div className="flex items-start">
          <div className="text-xs font-semibold text-gray-800 dark:text-gray-100 mr-2">
            {count}
          </div>
        </div>
      </div>
      <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} modal>
        <div className="p-4">
          <h3 className="text-lg font-semibold">Pending Events</h3>
          <ul>
            {events.map(event => (
              <li key={event.id} className="border-b py-2">
                <p>{event.event_title}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={() => handleRSVPUpdate(event.invitee_id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => handleRSVPUpdate(event.invitee_id, "declined")}
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Popup>
    </div>
  );
};

export default DashboardCard04;
