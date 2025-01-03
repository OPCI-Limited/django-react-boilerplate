import axios from 'axios';
import { Event } from '../interfaces/Event.model';
import { inviteeService } from './invitees.service';

const BASE_URL = 'http://localhost:8001/api/events/events/'; // Replace with your API base URL

class EventService {
  // Get all events
  async getAllEvents(): Promise<Event[]> {
    const response = await axios.get<Event[]>(BASE_URL, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Get a single event by ID
  async getEventById(eventId: number): Promise<Event> {
    const response = await axios.get<Event>(`${BASE_URL}${eventId}/`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Create a new event
  async createEvent(event: Event, user_id: number): Promise<Event> {
    event.created_by=user_id;
    const response = await axios.post<Event>(BASE_URL, event, {
      headers: this.getAuthHeaders(),
    });
    const invitees = await inviteeService.getInviteesByEventId(response.data.id);
    console.log('Invitees:', invitees);
    return response.data;
  }

  // Update an existing event
  async updateEvent(eventId: number, event: Event): Promise<Event> {
    const response = await axios.put<Event>(`${BASE_URL}${eventId}/`, event, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Delete an event
  async deleteEvent(eventId: number): Promise<void> {
    await axios.delete(`${BASE_URL}${eventId}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Filter events by date range
  async filterEventsByDateRange(startDate: string, endDate: string): Promise<Event[]> {
    const response = await axios.get<Event[]>(
      `${BASE_URL}?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Search events by title or location
  async searchEvents(query: string): Promise<Event[]> {
    const response = await axios.get<Event[]>(`${BASE_URL}?search=${query}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const response = await axios.get<Event[]>(`${BASE_URL}upcoming_events/`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Get authentication headers
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken'); // Assuming the token is stored in localStorage
    return { Authorization: `Bearer ${token}` };
  }
}

export const eventService = new EventService();
