export class Event {
    id: number;
    title: string;
    start_date: string; 
    end_date: string;   
    description: string;
    location: string;
    created_by: number; 
    created_at?: string; 
    updated_at?: string; 
   

    constructor() {
      this.id = 0;
      this.title = '';
      this.start_date = '';
      this.end_date = '';
      this.description = '';
      this.location = '';
      this.created_by=0;
        
    }
}