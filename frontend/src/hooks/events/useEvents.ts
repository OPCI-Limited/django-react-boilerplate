import { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface APIResponseWithCollection<T> {
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

type EventResponse = APIResponseWithCollection<Event>;

const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api.get<EventResponse>('/events')
      .then((response) => setEvents(response.data.results))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { events, loading, error };
};

export default useEvents;
