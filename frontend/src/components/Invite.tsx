import { inviteeService } from "../services/invitees.service";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  email: string;
}
interface InviteProps {
  eventId: number;
  onCancel: () => void;
}

const Invite: React.FC<InviteProps> = ({ eventId,onCancel }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);

  //suggestions on instant input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeout = window.setTimeout(() => {
      fetchUsers(value);
    }, 300); 
    setDebounceTimeout(timeout);
  };

  // Fetch users from the backend
  const fetchUsers = async (query: string) => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get<User[]>(`http://localhost:8001/api/users/search/?query=${query}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Add user to selected list
  const handleUserSelect = (user: User) => {
    if (!selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchTerm(""); // Clear input
    setSuggestions([]); // Clear suggestions
  };

  // Remove user from selected list
  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleInvite = async () => {
    try {
      const invitees = selectedUsers.map((user) => ({
        event: eventId,
        email: user.email,
      }));
      const response = await inviteeService.bulkCreateInvitees(invitees); 
      if (response.errors?.length) {
        alert(
          `Some invitees could not be created:\n${response.errors
            .map((err: { email: any; error: any; }) => `${err.email}: ${err.error}`)
            .join("\n")}`
        );
      } else {
        alert("All invitations sent successfully!");
      }
      setSelectedUsers([]);
      onCancel();
    } catch (error) {
      console.error("Error inviting users:", error);
      alert("Failed to send invitations.");
    }
  };

  //   const onClear= ()=>{
  //     setSelectedUsers([]);
  //   }

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Invite Users by Email:
      </label>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Type an email..."
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-800 dark:text-gray-100"
        />
        {/* Dropdown Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10">
            {suggestions.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300"
              >
                {user.email}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md"
            >
              <span className="mr-2 text-gray-700 dark:text-gray-300">{user.email}</span>
              <button
                onClick={() => handleRemoveUser(user.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleInvite}
          className="px-2 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          Invite
        </button>
      </div>
    </div>
  );
};

export default Invite;
