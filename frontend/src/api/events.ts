import axios from "axios";
import { Event } from "../types/types";
import { getToken } from "../utils/tokenCookies"; 

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export const createEvent = async (userEmail: string, eventData: Omit<Event, "id" | "organizer">) => {
  const token = getToken();

  const eventPayload = { ...eventData, organizer: userEmail }; 

  console.log("Sending request to:", `${API_URL}events/`);
  console.log("Event Payload:", eventPayload);

  try {
    const response = await axios.post(`${API_URL}events/`, eventPayload, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    console.log("Event created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response:", error.response.data);
      console.error("HTTP Status:", error.response.status);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const cancelEvent = async (eventId : number) => {
  const token = getToken();
  const eventPayload = { ...eventId }; 

  console.log("Sending request to:", `${API_URL}events/`);
  console.log("Event Payload:", eventPayload);

  try {
    const response = await axios.delete(`${API_URL}events/${eventId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Event canceled successfully:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      console.error('HTTP Status:', error.response.status);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

