import { Event } from "./Event.model";
export class Notification {
    id: number;
    message: string;
    is_read: boolean;
    created_at: string;
    event?:  {
        id: number;
        title: string;
        start_date: string;
        location: string;
      };
  
    constructor() {
      this.id = 0;
      this.message = '';
      this.is_read = false;
      this.created_at = '';
    }
  
}
  