import axios from 'axios';
import { Invitee } from '../interfaces/Invitee.model';

const BASE_URL = 'http://localhost:8001/api/events/invitees/'; // Replace with your API base URL

class InviteeService {
  // Get all invitees
  async getAllInvitees(): Promise<Invitee[]> {
    const response = await axios.get<Invitee[]>(BASE_URL, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Get all invitees by event ID
  async getInviteesByEventId(eventId: number): Promise<Invitee[]> {
    const response = await axios.get<Invitee[]>(`${BASE_URL}?event_id=${eventId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Create a new invitee
  async createInvitee(invitee: Invitee): Promise<Invitee> {
    const response = await axios.post<Invitee>(BASE_URL, invitee, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Update an existing invitee
  async updateInvitee(inviteeId: number, invitee: Invitee): Promise<Invitee> {
    const response = await axios.put<Invitee>(`${BASE_URL}${inviteeId}/`, invitee, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async updateRSVPStatus(inviteeId: number, status: string): Promise<void> {
    const response = await axios.patch(`${BASE_URL}${inviteeId}/update_rsvp/`, {
      rsvp_status: status,
    });
    return response.data;
  }

  // Delete an invitee
  async deleteInvitee(inviteeId: number): Promise<void> {
    await axios.delete(`${BASE_URL}${inviteeId}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Fetch participants stats for an event
  async getParticipantStats(eventId: number): Promise<{ totalInvites: number; acceptedInvites: number }> {
    try {
      const response = await axios.get(`${BASE_URL}event-participants/${eventId}/`, {
        headers: this.getAuthHeaders(),
      });
      return {
        totalInvites: response.data.total_invites,
        acceptedInvites: response.data.accepted_invites,
      };
    } catch (error) {
      console.error("Error fetching participant stats:", error);
      throw error;
    }
  }

  async bulkCreateInvitees(invitees: { event: number; email: string }[]): Promise<any> {
    try {
      const response = await axios.post(`${BASE_URL}bulk_create/`, { invitees }, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error bulk creating invitees:", error);
      throw error;
    }
  }

  // Get authentication headers
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken'); // Assuming the token is stored in localStorage
    return { Authorization: `Bearer ${token}` };
  }
}

export const inviteeService = new InviteeService();
