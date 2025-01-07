import axios from 'axios';
import { Invitee } from '../interfaces/Invitee.model';
import { getAuthHeaders } from '../utils/getHeaders';


const BASE_URL = 'http://localhost:8001/api/events/invitees/';

class InviteeService {
  // all invitees
  async getAllInvitees(): Promise<Invitee[]> {
    const response = await axios.get<Invitee[]>(BASE_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  // all invitees by eventId
  async getInviteesByEventId(eventId: number): Promise<Invitee[]> {
    const response = await axios.get<Invitee[]>(`${BASE_URL}?event_id=${eventId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  // Create a new invitee
  async createInvitee(invitee: Invitee): Promise<Invitee> {
    const response = await axios.post<Invitee>(BASE_URL, invitee, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  // Update an existing invitee
  async updateInvitee(inviteeId: number, invitee: Invitee): Promise<Invitee> {
    const response = await axios.put<Invitee>(`${BASE_URL}${inviteeId}/`, invitee, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  async updateRSVPStatus(inviteeId: number, status: string): Promise<any> {
    const response = await axios.patch(`${BASE_URL}${inviteeId}/update_rsvp/`, {
      rsvp_status: status,
    },{ headers: getAuthHeaders() });
    return response.data;
  }

  // Delete an invitee
  async deleteInvitee(inviteeId: number): Promise<void> {
    await axios.delete(`${BASE_URL}${inviteeId}/`, {
      headers: getAuthHeaders(),
    });
  }

  // Fetch participants stats for an event
  async getParticipantStats(eventId: number): Promise<{ totalInvites: number; acceptedInvites: number }> {
    try {
      const response = await axios.get(`${BASE_URL}event-participants/${eventId}/`, {
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error bulk creating invitees:", error);
      throw error;
    }
  }

  // Get authentication headers
  // private getAuthHeaders() {
  //   const token = localStorage.getItem('accessToken');
  //   return { Authorization: `Bearer ${token}` };
  // }
}

export const inviteeService = new InviteeService();
