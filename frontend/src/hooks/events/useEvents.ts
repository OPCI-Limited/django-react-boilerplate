import { useCallback, useEffect, useState } from 'react';
import { api } from '../../services/api';

import { APIResponseWithCollection, Event } from '../../interfaces';

type EventResponse = APIResponseWithCollection<Event>;

const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(() => {
    setLoading(true);
    
    api.get<EventResponse>('/events')
      .then((res) => setEvents(res.data.results))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refreshEvents: fetchEvents };
};

export default useEvents;
