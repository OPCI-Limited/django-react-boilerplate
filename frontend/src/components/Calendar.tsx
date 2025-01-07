import React, { useContext, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Popup from 'reactjs-popup';
import EventForm from './EventForm';
import EventInfo from './EventInfo';
import { InviteeEventView } from '../interfaces/InviteeEventView';
import { inviteeEventViewService } from '../services/InviteeEventViewService';
import { Event } from '../interfaces/Event.model';
import { eventService } from '../services/event.service';
import { AuthContext } from '../context/AuthContext'

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [currentEventView, setCurrentEventView] = useState<InviteeEventView | null>(null);
  const { userId } = useContext(AuthContext);
  

  // Fetch events for the calendar
  const fetchEvents = async () => {
    try {
      if (!userId) {
        console.error("No current user");
        return;
      }

      const allEvents = await inviteeEventViewService.getByUserId(userId);
      const formattedEvents = allEvents.map((event: InviteeEventView) => ({
        id: String(event.event_id),
        title: `${event.event_title} (${event.event_location})`,
        start: event.start_date,
        end: event.end_date,
        extendedProps: {
          event_title: `${event.event_title}`,
          starts: event.start_date,
          ends: event.end_date,
          description: event.event_description,
          location: event.event_location,
          created_by: event.event_created_by,
          eventid_inviteeid: event.id,
          host_mail: event.host_email
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

  const handleDateClick = (info: any) => {
    const clickedDate = new Date(info.dateStr);
    const today = new Date();

    // Reset time for accurate date comparison
    clickedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (clickedDate < today) {
      alert("You can't create an event on a past date!");
      return;
    }
    setCurrentEvent(new Event());
    setEventFormOpen(true);
  };

  const handleEventClick = async (info: any) => {
    try {

      const { event_title, location, description, starts, ends, host_mail, created_by, eventid_inviteeid } = info.event.extendedProps;
      const eventId = Number(info.event.id);
      const event = new InviteeEventView();
      event.event_title = event_title;
      event.event_location = location;
      event.event_description = description;
      event.start_date = starts;
      event.end_date = ends;
      event.event_created_by = created_by;
      event.host_email = host_mail;
      event.id = eventid_inviteeid;

  
      if (event) {
        setCurrentEventView(event); 
        setViewModalOpen(true); 
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };
  

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userId) {
        console.error("No current user");
        return;
      }

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
