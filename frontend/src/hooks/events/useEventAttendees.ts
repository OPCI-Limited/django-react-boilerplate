import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Attendee } from "../../interfaces";
import { api } from "../../services/api";

export const useEventAttendees = (eventIdOverride?: number) => {
  const routeParams = useParams();
  const id = eventIdOverride ?? routeParams.id;
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!id) {
    throw new Error("Event ID is required");
  }

  const fetchAttendees = async () => {
    try {
      const response = await api.get<Attendee[]>(`/events/${id}/attendees`);
      setAttendees(response.data);
    } catch (err) {
      setError('Failed to load attendees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [id]);

  return { attendees, loading, error, refreshAttendees: fetchAttendees };
};
