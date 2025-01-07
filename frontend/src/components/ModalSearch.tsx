import React, { useRef, useEffect, useState, useContext } from 'react';
import { inviteeEventViewService } from '../services/InviteeEventViewService';
import { eventService } from '../services/event.service';
import DropdownEditMenu from './DropdownEditMenu';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AuthContext } from '../context/AuthContext';
import Popup from 'reactjs-popup';
import Confirmation from './Confirmation';
import EventForm from "./EventForm";
import EventInfo from "./EventInfo";
import Invite from "./Invite";
import { InviteeEventView } from "../interfaces/InviteeEventView";


interface ModalSearchProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  onSearchResults: (results: any[]) => void;
}

const ModalSearch: React.FC<ModalSearchProps> = ({ modalOpen, setModalOpen, onSearchResults }) => {
  const modalContent = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useContext(AuthContext);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [currentEvent2, setCurrentEvent2] = useState<InviteeEventView | null>(null);

  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);


  useEffect(() => {
    if (modalOpen) searchInput.current?.focus();
  }, [modalOpen]);

  const fetchSearchResults = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      try {
        const results = await eventService.searchEvent(searchTerm);
        setSearchResults(results);
        onSearchResults(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    fetchSearchResults();
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      modalOpen &&
      modalContent.current &&
      !modalContent.current.contains(e.target as Node) &&
      !(e.target as HTMLElement).closest('.dropdown-menu')
    ) {
      setModalOpen(false);
    }
  };

  const handleViewClick = (event: any) => {
    const eventToEdit = new InviteeEventView();
    eventToEdit.event_id = event.id;
    eventToEdit.event_title = event.title;
    eventToEdit.event_location = event.location;
    eventToEdit.event_description = event.description;
    eventToEdit.start_date = event.start_date;
    eventToEdit.end_date = event.end_date;
    eventToEdit.event_created_by = event.created_by;
    setCurrentEvent2(eventToEdit);
    setViewModalOpen(true);
  };

  const handleDeleteEvent = async () => {
    try {
      if (currentEventId) {
        await eventService.deleteEvent(currentEventId);
        setConfirmationOpen(false);
        setCurrentEvent(null);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleDeleteClick = (eventId: number) => {
    setCurrentEventId(eventId);
    setConfirmationOpen(true);
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [modalOpen]);

  const handleEventFormClose = () => {
    setEventFormOpen(false);
    setCurrentEvent(null); // Reset form values
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setCurrentEvent(null);
  };



  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center px-4 sm:px-6 ${
        modalOpen ? 'block' : 'hidden'
      }`}
    >
      <div ref={modalContent} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="p-4 border-b dark:border-gray-700">
          <input
            ref={searchInput}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border dark:border-gray-700 rounded focus:ring focus:ring-violet-500 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Search events..."
          />
        </div>
        <div className="p-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : searchResults.length > 0 ? (
            <div>
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded border-b last:border-none border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{result.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(result.start_date).toLocaleString()}</p>
                    </div>
                    <div>
                      {result.created_by === userId && new Date(result.start_date) >= new Date() && (
                        <button
                          className="px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleViewClick(result)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleViewClick(result)}
                      >
                        View Details
                      </button>
                      {result.created_by === userId && new Date(result.start_date) >= new Date() && (
                        <button
                          className="px-4 py-2 text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700 cursor-pointer"
                          onClick={() => handleDeleteClick(result.id)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No results found.</p>
          )}
        </div>
      </div>
      

      {/* Event Info Modal */}
      <Popup open={viewModalOpen} closeOnDocumentClick onClose={handleViewModalClose} modal>
        <div className="w-full px-6 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Event Information</h2>
          {currentEvent2 && <EventInfo event={currentEvent2} onClose={handleViewModalClose} />}
        </div>
      </Popup>

      {/* Invite Modal */}
      <Popup open={inviteModalOpen} closeOnDocumentClick onClose={() => setInviteModalOpen(false)} modal>
        <div className="w-full px-6 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Invite Users</h2>
          {currentEventId && <Invite eventId={currentEventId} onCancel={() => setInviteModalOpen(false)} />}
        </div>
      </Popup>


      <Popup
        open={confirmationOpen}
        closeOnDocumentClick
        onClose={() => setConfirmationOpen(false)}
        modal
      >
        <Confirmation
          message="Are you sure you want to delete this event?"
          onConfirm={handleDeleteEvent}
          onCancel={() => setConfirmationOpen(false)}
        />
      </Popup>
    </div>
  );
};

export default ModalSearch;
