import React, { useEffect, useState,useContext } from "react";
import DropdownFilter from "../../components/DropdownFilter";
import PopoverDemo from "../../components/Filter";
import DashboardCard01 from "../../widgets/Widget1";
import DashboardCard02 from "../../widgets/Widget3";
import DashboardCard03 from "../../widgets/Widget2";
import ModalSearch from "../../components/ModalSearch";
import EventForm from "../../components/EventForm";
import Popup from "reactjs-popup";
import { eventService } from "../../services/event.service";
import { Event } from "../../interfaces/Event.model";
import { inviteeEventViewService } from '../../services/InviteeEventViewService';
import { InviteeEventView } from '../../interfaces/InviteeEventView';
import moment from 'moment';
import DropdownEditMenu from '../../components/DropdownEditMenu';
import { Link } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Invite from "../../components/Invite";
import EventInfo from "../../components/EventInfo";
import Confirmation from "../../components/Confirmation";
import DashboardCard04 from "../../widgets/Widget4";
import { AuthContext } from '../../context/AuthContext'





export const Home: React.FC = () => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [events, setEvents] = useState<InviteeEventView[]>([]);
  const [events2, setEvents2] = useState<Event[]>([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<Event>(new Event());
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [currentEvent2, setCurrentEvent2] = useState<InviteeEventView | null>(null);
  const [groupedEvents, setGroupedEvents] = useState<Record<string, InviteeEventView[]>>({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [hostedEventsCount, setHostedEventsCount] = useState(0);
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
  const [pendingEvents, setPendingEvents] = useState<InviteeEventView[]>([]);
  const { userId } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState<InviteeEventView[]>([]);
  const [sortBy, setSortBy] = useState<string>("startDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  
  // const [filters, setFilters] = useState<{ dateRange: [Date | null, Date | null]; rsvpStatus: string }>({
  //     dateRange: [null, null],
  //     rsvpStatus: "",
  //   });
  const getStartOfMonth = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };
  
  const getEndOfMonth = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  };
  const [filters, setFilters] = useState({
    dateRange: [getStartOfMonth(), getEndOfMonth()] as [Date | null, Date | null],
    rsvpStatus: "accepted",
  });

  const add24Hours = (date: Date | null): Date | null => {
    if (!date) return null;
    const newDate = new Date(date);
    newDate.setTime(newDate.getTime() + 24 * 60 * 60 * 1000); 
    return newDate;
  };
    
  //   const addNoHours = (date: Date | null): Date | null => {
  //     if (!date) return null;
  //     const newDate = new Date(date);
  //     newDate.setTime(newDate.getTime() + 24 * 60 * 60 * 1000); 
  //     return newDate;
  //   };
  const handleSearchResults = (results: Event[]) => {
    // setSearchResults(results);
    setEvents2(results); 
  };
    
  const fetchAndGroupEvents = async () => {
    try {
      if (!userId) {
        console.error("No current user");
        return;
      }
      // console.log(userId);
      const { dateRange, rsvpStatus } = filters;
      const startDate = dateRange[0]?.toISOString().split("T")[0] || undefined;
      const endDate = dateRange[1]?.toISOString().split("T")[0] || undefined;
      // adding 24 hours to the end date
      const adjustedEndDate = filters.dateRange[1]
        ? add24Hours(filters.dateRange[1])?.toISOString()
        : undefined;
      const allEvents = await inviteeEventViewService.filterByCriteria(userId,
        filters.rsvpStatus,
        startDate,
        adjustedEndDate
      );
      //   const filteredEvents = allEvents.filter((event) => new Date(event.start_date) >= new Date());

      setEvents(allEvents);

      const grouped = allEvents.reduce((acc: Record<string, InviteeEventView[]>, event) => {
        const longDate = moment(event.start_date).format("dddd, MMMM Do YYYY");
        if (!acc[longDate]) acc[longDate] = [];
        acc[longDate].push(event);
        return acc;
      }, {});

      setGroupedEvents(grouped);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchWidgetData = async () => {
    // const userId = localStorage.getItem("userId"); 

   
    const hostedEvents = await inviteeEventViewService.getByUserId(Number(userId));
    // console.log(hostedEvents.length)
    setHostedEventsCount(hostedEvents.filter(e => e.event_created_by === Number(userId)).length);

    // count upcoming events 
    const upcomingEvents = hostedEvents.filter(e => 
      e.rsvp_status === "accepted" && new Date(e.start_date) > new Date()
    );
    setUpcomingEventsCount(upcomingEvents.length);

    // pending events
    const pending = hostedEvents.filter(e => e.rsvp_status === "pending" && new Date(e.start_date) > new Date());
    setPendingEvents(pending);
  };


  useEffect(() => {
    if (userId) {
      fetchAndGroupEvents();
      
      fetchWidgetData();
    }
  }, [userId, filters]);




  const handleEventFormClose = () => {
    setEventFormOpen(false);
    setCurrentEvent(new Event()); 
  };



  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!currentEvent) {
        console.error("No event data available for submission");
        return;
      }
      let createdEvent: Event;
      if (currentEvent?.id) {
      // update event
        await eventService.updateEvent(currentEvent.id, currentEvent);
      } else {
        console.log(currentEvent);
        // create event
        if (!userId) {
          console.error("No current user");
          return;
        }
        createdEvent = await eventService.createEvent(currentEvent, userId);
        setCurrentEventId(createdEvent.id); // Store the new event ID for invite
        setInviteModalOpen(true);
      }

      await fetchAndGroupEvents();
      await fetchWidgetData();
      handleEventFormClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleCreateClick = () => {
    setCurrentEvent(new Event());
    setEventFormOpen(true);
  };

  const handleEditClick = (event: any) => {
    const eventToEdit = new Event();
    eventToEdit.id = event.event_id;
    eventToEdit.title = event.event_title;
    eventToEdit.location = event.event_location;
    eventToEdit.description = event.event_description;
    eventToEdit.start_date = event.start_date;
    eventToEdit.end_date = event.end_date;
    eventToEdit.created_by = event.event_created_by;

    setCurrentEvent(eventToEdit);
    setEventFormOpen(true); 
  };

  const handleViewClick = (event: any) => {
  // const eventToEdit = new Event();
  // eventToEdit.id = event.event_id;
  // eventToEdit.title = event.event_title;
  // eventToEdit.location = event.event_location;
  // eventToEdit.description = event.event_description;
  // eventToEdit.start_date = event.start_date;
  // eventToEdit.end_date = event.end_date;
  // eventToEdit.created_by = event.event_created_by;
    setCurrentEvent2(event);
    setViewModalOpen(true);
  };

  const handleClose = () => {
    setCurrentEvent(null); 
    setViewModalOpen(false); 
  };    
  const handleInviteClick = (eventId: number) => {
    setCurrentEventId(eventId); 
    setInviteModalOpen(true); 
  };

  const handleDeleteEvent = async () => {
    try {
      if (currentEventId) {
        await eventService.deleteEvent(currentEventId);
        await fetchAndGroupEvents();
        await fetchWidgetData();
        setConfirmationOpen(false);
        setCurrentEvent(null);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };
  const handleDeleteClick = (event: number) => {
    setCurrentEventId(event);
    setConfirmationOpen(true);
  };

  //   const handleDelete = () => {
  //     console.log("Item deleted");
  //     setConfirmationOpen(false);
  //   };

  //   const handleCancel = () => {
  //     console.log("Action canceled");
  //     setConfirmationOpen(false);
  //   };

  const handleFilterApply = (filters: { dateRange: [Date | null, Date | null]; rsvpStatus: string }) => {
    setFilters(filters);
  };

  const fetchFilteredAndSortedEvents = async (userId: number, sortBy: string,): Promise<void> => {
    try {
      const events = await inviteeEventViewService.getFilteredSortedEvents(userId, sortBy);
      setEvents(events);
  
      const grouped = events.reduce((acc: Record<string, InviteeEventView[]>, event) => {
        const longDate = moment(event.start_date).format("dddd, MMMM Do YYYY");
        if (!acc[longDate]) acc[longDate] = [];
        acc[longDate].push(event);
        return acc;
      }, {});
  
      setGroupedEvents(grouped);
    } catch (error) {
      console.error("Error fetching filtered and sorted events:", error);
    }
  };


  const sortEvents = (criteria: string) => {
    const nextOrder = sortBy === criteria && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(criteria);
    setSortOrder(nextOrder);
  
    const sortedEvents = [...events].sort((a, b) => {
      if (criteria === "startDate") {
        return nextOrder === "asc"
          ? new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          : new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      }
      if (criteria === "hostName") {
        return nextOrder === "asc"
          ? a.host_email.localeCompare(b.host_email)
          : b.host_email.localeCompare(a.host_email);
      }
      return 0;
    });
  
    // Update groupedEvents after sorting
    const grouped = sortedEvents.reduce((acc: Record<string, InviteeEventView[]>, event) => {
      const longDate = moment(event.start_date).format("dddd, MMMM Do YYYY");
      if (!acc[longDate]) acc[longDate] = [];
      acc[longDate].push(event);
      return acc;
    }, {});
  
    setEvents(sortedEvents);
    setGroupedEvents(grouped);
  };
  


  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Dashboard
                </h1>
              </div>
              <div className="grid grid-cols-12 gap-6 justify-center sm:justify-center">
                <DashboardCard01 count={hostedEventsCount} />
                <DashboardCard03 count={upcomingEventsCount} />
                <DashboardCard04 count={pendingEvents.length} events={pendingEvents} fetchWidgetData={fetchWidgetData} fetchAndGroupEvents={fetchAndGroupEvents}/>
              </div>
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-4 mt-4 sm:mt-0">
                {/* Search, Filter and Creation buttons */}
                
                <button
                  className="inline-flex size-[35px] cursor-default items-center justify-center rounded-full bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black"
                  onClick={() => setSearchModalOpen(true)}
                >
                  <span className="sr-only">Search</span>
                  <svg
                    className="fill-current text-gray-500/80 dark:text-gray-400/80"
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7ZM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5Z" />
                    <path d="m13.314 11.9 2.393 2.393a.999.999 0 1 1-1.414 1.414L11.9 13.314a8.019 8.019 0 0 0 1.414-1.414Z" />
                  </svg>
                </button>

                <DropdownFilter
                  onApply={(criteria) => {
                    sortEvents(criteria); // Apply local sorting
                  }}
                  align="right"
                />
                <PopoverDemo onFilterApply ={handleFilterApply} align="left" />
                <button
                  onClick={handleCreateClick}
                  className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2"
                >
                  <svg
                    className="fill-current shrink-0 xs:hidden block md:hidden"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="max-xs:sr-only hidden md:inline ">Add Event</span>
                </button>
                

              
              </div>
            </div>
            <DashboardCard02 events={events} groupedEvents={groupedEvents || {}} onEditClick={handleEditClick} onViewClick={handleViewClick} onInviteClick={handleInviteClick} onDeleteClick={handleDeleteClick}/>

          </div>
        </main>
      </div>

      {/* popup for event creation form */}
      <Popup open={eventFormOpen} closeOnDocumentClick onClose={handleEventFormClose} modal>
        <div className="w-full px-6 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            {currentEvent?.id ? "Edit Event" : "Create Event"}
          </h2>
          <EventForm
            newEvent={currentEvent || new Event()}
            setNewEvent={setCurrentEvent}
            handleFormSubmit={handleFormSubmit}
          />
        </div>
      </Popup>

      {/* popup to view event */}
      <Popup
        open={viewModalOpen}
        closeOnDocumentClick
        onClose={() => setViewModalOpen(false)}
        modal
      >
        <div className="w-full px-6 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Event Information</h2>
          <EventInfo event={currentEvent2 || new InviteeEventView()} onClose={handleClose} />
        </div>
      </Popup>
      {/* popup for inviting users */}
      <Popup open={inviteModalOpen} closeOnDocumentClick onClose={() => setInviteModalOpen(false)} modal>
        <div className="w-full px-6 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Invite Users</h2>
          {currentEventId && <Invite eventId={currentEventId}  onCancel={() => setInviteModalOpen(false)}  />}
        </div>
      </Popup>


      {/* deletion confirmation pop up */}
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

      <ModalSearch
        modalOpen={searchModalOpen}
        setModalOpen={setSearchModalOpen}
        onSearchResults={handleSearchResults}
      />

  
    </div>
  );
};

export default Home;

