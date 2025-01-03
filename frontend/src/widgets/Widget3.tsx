import React, { useEffect, useState } from 'react';
import { inviteeEventViewService } from '../services/InviteeEventViewService';
import { InviteeEventView } from '../interfaces/InviteeEventView';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import DropdownEditMenu from '../components/DropdownEditMenu';
import { Link } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { eventService } from '../services/event.service';
import Popup from 'reactjs-popup';
import EventForm from '../components/EventForm';
import { Event } from '../interfaces/Event.model';



  interface DecodedToken {
    user_id: number;
    exp: number; 
    iat: number; 
  }

  interface DashboardCard02Props {
    events: InviteeEventView[];
    groupedEvents: Record<string, InviteeEventView[]>;
    onEditClick: (event: any) => void;
    onViewClick: (event: any) => void;
    onInviteClick: (eventId: number) => void;
    onDeleteClick: (eventId: number) => void;
    
  }

const DashboardCard02: React.FC<DashboardCard02Props> = ({ events, groupedEvents, onEditClick, onViewClick, onInviteClick, onDeleteClick  }) => {   

  const loggedInUserId = React.useMemo(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const decodedToken = jwtDecode<DecodedToken>(token);
    return decodedToken.user_id;
  }, []);
  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {Object.keys(groupedEvents).length === 0 ? (
        <p className="text-center text-gray-500">No events to display.</p>
      ) : (
        Object.entries(groupedEvents).map(([longDate, eventsForDate]) => (
          <div key={longDate}>
            {/* Group Header */}
            <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">{longDate}</h2>
            </header>

            {/* Table */}
            <div className="p-3">
              <div className="overflow-x-auto">
                <table className="table-auto w-full dark:text-gray-300">
                  {/* Table Header */}
                  <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
                    <tr>
                      <th className="p-2">
                        <div className="font-semibold text-left">Title</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Location</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Start Date</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">End Date</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Actions</div>
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
                    {eventsForDate.map(event => (
                      <tr key={event.id}>
                        <td className="p-2">
                          <div className="text-gray-800 dark:text-gray-100">{event.event_title}</div>
                        </td>
                        <td className="p-2">
                          <div className="text-center">{event.event_location}</div>
                        </td>
                        <td className="p-2">
                          <div className="text-center text-green-500">{moment(event.start_date).format('hh:mm A')}</div>
                        </td>
                        <td className="p-2">
                          <div className="text-center text-sky-500">{moment(event.end_date).format('MMM D, YYYY hh:mm A')}</div>
                        </td>
                        <td className="p-2">
                          <div className="text-center">
                            <DropdownEditMenu>
                              {/* <DropdownMenu.Item className="px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer">
                                Edit
                              </DropdownMenu.Item> */}
                              {event.event_created_by === loggedInUserId && new Date(event.start_date) >= new Date() && (
                                <DropdownMenu.Item
                                  className="px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                                  onClick={() => onEditClick(event)}
                                >
                                  Edit
                                </DropdownMenu.Item>
                              )}
                              <DropdownMenu.Item  onClick={() => onViewClick(event)} className="px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer">
                                View Details
                              </DropdownMenu.Item>
                              <DropdownMenu.Item onClick={() => onInviteClick(event.event_id)} className="px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer">
                                Invite Friend(s)
                              </DropdownMenu.Item>
                              <DropdownMenu.Item onClick={() => onDeleteClick(event.event_id)} className="px-4 py-2 text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700 cursor-pointer">
                                Remove
                              </DropdownMenu.Item>
                            </DropdownEditMenu>


                          </div>
                        </td>


                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="flex items-center gap-4 before:h-px before:flex-1 before:bg-gray-300  before:content-[''] after:h-px after:flex-1 after:bg-gray-300  after:content-['']"></div>

              </div>
            </div>
          </div>
        )))}
    </div>
  );
};

export default DashboardCard02;
