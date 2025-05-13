import { useEffect, useState } from "react";
import { APIResponseWithCollection, Invitation } from "../../interfaces";
import { api } from "../../services/api";

type EventResponse = APIResponseWithCollection<Invitation>;

const useInvitations = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInvitations = () => {
    setLoading(true);

    api
      .get<EventResponse>("/invitations")
      .then((res) => {
        console.log('Fetched invitations:', res.data);
        setInvitations(res.data.results);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  return { invitations, loading, error, refreshInvitations: fetchInvitations };
};

export default useInvitations;
