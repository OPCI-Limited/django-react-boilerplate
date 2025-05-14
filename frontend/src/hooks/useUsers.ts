import { useEffect, useState } from "react";
import { APIResponseWithCollection, MinimalUser } from "../interfaces";
import { api } from "../services/api";

type UsersResponse = APIResponseWithCollection<MinimalUser>;

export const useUsers = () => {
  const [users, setUsers] = useState<MinimalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get<UsersResponse>('/users/');
      setUsers(response.data.results)
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error };
};