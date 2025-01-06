import axios from "axios";
import { Notification } from "../interfaces/notification.model";
import { getAuthHeaders } from '../utils/getHeaders';

const apiURL = 'http://localhost:8001/api/events/notifications/';

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await axios.get<Notification[]>(`${apiURL}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
  
  async getUnreadNotifications(): Promise<Notification[]> {
    const response = await axios.get<Notification[]>(`${apiURL}unread/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
  

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await axios.post(`${apiURL}${notificationId}/mark-read/`, {},{
      headers: getAuthHeaders(),
    });
  },
};