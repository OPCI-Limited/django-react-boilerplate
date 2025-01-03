export class Invitee {
    id: number;          
    event_id: number;
    user_id: number;   
    email: string;        
    rsvp_status: 'pending' | 'accepted' | 'declined'; 
    created_at?: string;
    updated_at?: string;   

  
    constructor() {
      this.id = 0;
      this.event_id = 0;
      this.user_id = 0;
      this.email = '';
      this.rsvp_status = 'pending'; 
    }
}
  