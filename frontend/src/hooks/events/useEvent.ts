import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Event } from '../../interfaces';
import { api } from '../../services/api';

export const useEventById = (idOverride?: string) => {
  const routeParams = useParams<{ id: string }>();
  const id = idOverride ?? routeParams.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    api.get<Event>(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  return { event, loading, error };
};