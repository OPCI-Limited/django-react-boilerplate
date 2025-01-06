import axios from 'axios';
import { InviteeEventView } from '../interfaces/InviteeEventView';
import { getAuthHeaders } from '../utils/getHeaders';

const BASE_URL = 'http://localhost:8001/api/events/invitee_event_view/';

class InviteeEventViewService {
  // Get all records
  async getAll(): Promise<InviteeEventView[]> {
    const response = await axios.get<InviteeEventView[]>(BASE_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }
  

  // Get all records by user ID
  //   async getByUserId(userId: number): Promise<InviteeEventView[]> {
  //     const response = await axios.get<InviteeEventView[]>(`${BASE_URL}by_user/?user_id=${userId}`, {
  //       headers: this.getAuthHeaders(),
  //     });
  //     return response.data;
  //   }


  async getByUserId(userId: number): Promise<InviteeEventView[]> {
    const response = await axios.get<InviteeEventView[]>(`${BASE_URL}by_user/?user_id=${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  async getByEventId(eventId: number): Promise<InviteeEventView> {
    const response = await axios.get<InviteeEventView>(`${BASE_URL}by_event/?event_id=${eventId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  
  
  async filterByCriteria(
    userId: number,
    rsvpStatus?: string,
    startDate?: string,
    endDate?: string
  ): Promise<InviteeEventView[]> {
    try {
      const params: Record<string, string | number> = { user_id: userId };

      if (rsvpStatus) params.rsvp_status = rsvpStatus;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await axios.get<InviteeEventView[]>(`${BASE_URL}filter_by_criteria/`, {
        headers: getAuthHeaders(),
        params,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching InviteeEventView records:', error);
      throw error;
    }
  }

  async getFilteredSortedEvents(userId: number, sortBy: string): Promise<InviteeEventView[]> {
    const response = await axios.get<InviteeEventView[]>(`${BASE_URL}invitee_event_view/filtered_sorted/`, {
      params: { user_id: userId, sort_by: sortBy },
      headers: getAuthHeaders(),
    });
    return response.data;
  }



  // // Helper to fetch authentication headers
  // private getAuthHeaders() {
  //   const token = localStorage.getItem('accessToken');
  //   return { Authorization: `Bearer ${token}` };
  // }
}

export const inviteeEventViewService = new InviteeEventViewService();
