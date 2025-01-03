import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Popup from 'reactjs-popup';
import jwtDecode from 'jwt-decode';
import EventForm from './EventForm';
import EventInfo from './EventInfo';
import { InviteeEventView } from '../interfaces/InviteeEventView';
import { inviteeEventViewService } from '../services/InviteeEventViewService';
import { Event } from '../interfaces/Event.model';
import { eventService } from '../services/event.service';

interface DecodedToken {
  user_id: number;
  exp: number;
  iat: number;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [currentEventView, setCurrentEventView] = useState<InviteeEventView | null>(null);

  // Fetch events for the calendar
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token found');
      const userId = jwtDecode<DecodedToken>(token).user_id;

      const allEvents = await inviteeEventViewService.getByUserId(userId);
      const formattedEvents = allEvents.map((event: InviteeEventView) => ({
        id: String(event.event_id),
        title: `${event.event_title} (${event.event_location})`,
        start: event.start_date,
        end: event.end_date,
        extendedProps: {
          description: event.event_description,
          location: event.event_location,
        },
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = () => {
    setCurrentEvent(new Event());
    setEventFormOpen(true);
  };

  const handleEventClick = async (info: any) => {
    try {
      const eventId = Number(info.event.id);
      const eventDetails = await inviteeEventViewService.getByEventId(eventId);
  
      if (eventDetails) {
        setCurrentEventView(eventDetails); // Set the specific InviteeEventView
        setViewModalOpen(true); // Open the view modal
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };
  

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token found');
      const userId = jwtDecode<DecodedToken>(token).user_id;

      if (currentEvent?.id) {
        await eventService.updateEvent(currentEvent.id, currentEvent);
      } else {
        if(currentEvent){
          await eventService.createEvent(currentEvent, userId);
        }
        
      }

      setEventFormOpen(false);
      setCurrentEvent(null);
      fetchEvents(); // Refresh events
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}
        selectable={true}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />

      {/* Event Form Popup */}
      <Popup open={eventFormOpen} closeOnDocumentClick onClose={() => setEventFormOpen(false)} modal>
        <div className="w-full px-6 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            {currentEvent?.id ? 'Edit Event' : 'Create Event'}
          </h2>
          <EventForm
            newEvent={currentEvent || new Event()}
            setNewEvent={setCurrentEvent}
            handleFormSubmit={handleFormSubmit}
          />
        </div>
      </Popup>

      {/* Event Info Popup */}
      <Popup open={viewModalOpen} closeOnDocumentClick onClose={() => setViewModalOpen(false)} modal>
        <div className="w-full px-6 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Event Information</h2>
          <EventInfo event={currentEventView || new InviteeEventView()} onClose={() => setViewModalOpen(false)} />
        </div>
      </Popup>
    </>
  );
};

export default Calendar;
