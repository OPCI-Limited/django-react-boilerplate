import React from 'react';

interface EventFormProps {
  newEvent: any;
  setNewEvent: React.Dispatch<React.SetStateAction<any>>;
  handleFormSubmit: (e: React.FormEvent) => void;
}

const EventForm: React.FC<EventFormProps> = ({ newEvent, setNewEvent, handleFormSubmit }) => {
  return (
    <form
      className="w-full border-b border-gray-200 dark:border-gray-700/60 space-y-6"
      onSubmit={handleFormSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title:
        </label>
        <input
          type="text"
          value={newEvent.title || ""}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          required
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Location:
        </label>
        <input
          type="text"
          value={newEvent.location || ""}
          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
          required
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description:
        </label>
        <textarea
          value={newEvent.description || ""}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          required
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-800 dark:text-gray-100"
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Start Date:
        </label>
        <input
          type="datetime-local"
          value={newEvent.start_date ? new Date(newEvent.start_date).toISOString().slice(0, 16) : ""}
          onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
          min={new Date().toISOString().slice(0, 16)}
          required
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          End Date:
        </label>
        <input
          type="datetime-local"
          value={newEvent.end_date ? new Date(newEvent.end_date).toISOString().slice(0, 16) : ""}
          onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
          min={newEvent.start_date || new Date().toISOString().slice(0, 16)}
          required
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-violet-500 rounded-md shadow-sm hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        {newEvent.id ? 'Update Event' : 'Create Event'}
      </button>
    </form>
  );
};

export default EventForm;
