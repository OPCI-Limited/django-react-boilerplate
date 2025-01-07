import { getToken } from './tokenCookies';

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return { Authorization: `Bearer ${token}` };
}
