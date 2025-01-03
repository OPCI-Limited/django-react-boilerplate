export class InviteeEventView {
    id: string;
    invitee_id: number;
    event_id: number;
    user_id: number;
    email: string;
    rsvp_status: 'pending' | 'accepted' | 'declined';
    event_title: string;
    event_description: string;
    event_location: string;
    start_date: string;
    end_date: string;
    event_created_by: number;
    event_created_at: string;
    event_updated_at: string;
    first_name: string;
    last_name: string;
    host_email: string;

    constructor() {
      this.id = '';
      this.invitee_id = 0;
      this.event_id = 0;
      this.user_id = 0;
      this.email = '';
      this.rsvp_status = 'pending';
      this.event_title = '';
      this.event_description = '';
      this.event_location = '';
      this.start_date = '';
      this.end_date = '';
      this.event_created_by = 0;
      this.event_created_at = '';
      this.event_updated_at = '';
      this.first_name = '';
      this.last_name = '';
      this.host_email = '';
    }
}
