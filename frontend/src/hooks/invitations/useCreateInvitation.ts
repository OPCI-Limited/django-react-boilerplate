import { useState } from "react";
import { InvitationStatus } from "../../interfaces";
import { api } from "../../services/api";

export function useCreateInvitation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createInvitation = async (eventId: number, userId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await api.post('/invitations/', {
        event_id: eventId,
        invitee: userId,
        status: InvitationStatus.PENDING,
      });
      console.log(`Invitation sent to user ${userId} for event ${eventId}`);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createInvitation, loading, error };
}