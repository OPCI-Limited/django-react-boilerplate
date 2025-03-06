import React, { createContext, ReactNode, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { api } from "../services/api";
import { setAuthorizationHeader } from "../services/interceptors";
import { getToken } from "../utils/tokenCookies";
import { Event } from "../interfaces";

interface EventContextData {
  events: Event[];
  loadingEvents: boolean;
  fetchEvents: () => Promise<void | AxiosError>;
  createEvent: (eventData: Omit<Event, "id">) => Promise<void | AxiosError>;
}

interface EventProviderProps {
  children: ReactNode;
}

export const EventContext = createContext({} as EventContextData);

export function EventProvider({ children }: EventProviderProps) {
  const [events, setEvents] = useState<Event[]>([]); 
  const [loadingEvents, setLoadingEvents] = useState(true);
  const token = getToken();

  async function fetchEvents() {
    setLoadingEvents(true);
    try {
      const response = await api.get<{ results: Event[] }>('/events/');
      setEvents(response.data.results);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoadingEvents(false);
    }
  }

  async function fetchMyEvents() {
    setLoadingEvents(true);
    try {
      const response = await api.get<{ results: Event[] }>('/events/');
      setEvents(response.data.results);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoadingEvents(false);
    }
  }


  async function createEvent(eventData: Omit<Event, "id">) {
    try {
      const response = await api.post("/events/", eventData);
      setEvents((prevEvents) => [...prevEvents, response.data]);
    } catch (error) {
      console.error("Error creating event:", error);
      return error as AxiosError;
    }
  }


  async function cancelEvent(eventId: number) {
    try {
      await axios.delete(`/events/${eventId}`);
      setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
      return error as AxiosError;
    }
  }

  useEffect(() => {
    if (token) {
      setAuthorizationHeader(api.defaults, token);
      fetchEvents();
    }
  }, [token]);

  return (
    <EventContext.Provider value={{ events, loadingEvents, fetchEvents, createEvent, cancelEvent }}>
      {children}
    </EventContext.Provider>
  );
}
