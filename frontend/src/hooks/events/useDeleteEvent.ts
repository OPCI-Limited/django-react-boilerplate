import { useState } from 'react';
import { api } from '../../services/api';

export function useDeleteEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteEvent = async (eventId: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/events/${eventId}`);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { deleteEvent, loading, error };
}