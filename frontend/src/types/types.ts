export interface Event {
    id: number;
    title: string;
    description: string;
    start_time: string;  // ISO format (YYYY-MM-DDTHH:MM:SSZ)
    end_time: string;
    location: string;
    organizer: number;  // User ID
}

export interface Invitation {
    id: number;
    event: number;
    invitee: number;
    status: "Pending" | "Accepted" | "Declined";
}
