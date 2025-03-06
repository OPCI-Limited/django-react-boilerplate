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

export interface Event {
    id: string;
    title: string;
    description: string;
    start_time: Date;
    end_time: Date;
    location?: string;
    organizer: string;
}