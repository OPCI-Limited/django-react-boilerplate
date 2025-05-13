export interface Group {
  id: number
  name: string
}

export interface User {
  email: string
  name?: string
  surname?: string
  permissions: string[]
  groups?: Group[]
}

export interface APIResponseWithCollection<T> {
  count: number;
  next: number | null;
  previous: number | null;
  results: T[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export interface Invitation {
  id: number
  event: Event,
  created_by: number,
  invitee: number,
  status: InvitationStatus,
}