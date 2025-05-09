import { useEffect, useState } from 'react';
import { api } from '../../services/api';

import { APIResponseWithCollection, Event } from '../../interfaces';

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
