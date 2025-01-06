import React from 'react';
import { BellIcon } from '@radix-ui/react-icons';
import { useNotifications } from '../context/Notification';

export const NotificationsDropdown: React.FC = () => {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="relative">
      <button className="relative">
        <BellIcon className="w-6 h-6 text-gray-800 dark:text-gray-100" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 bg-red-600 rounded-full" />
        )}
      </button>
      <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg">
        <div className="p-2 text-sm font-semibold border-b">Notifications</div>
        <ul className="max-h-60 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li
                key={notification.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => markAsRead(notification.id)}
              >
                {notification.message}
              </li>
            ))
          ) : (
            <li className="p-2 text-sm text-gray-500">No notifications</li>
          )}
        </ul>
        <div className="p-2 text-center text-sm font-medium border-t">
          <a href="/notifications" className="text-blue-500 hover:underline">
            View All
          </a>
        </div>
      </div>
    </div>
  );
};
