import React, { useContext, useEffect, useState } from 'react';
import { InviteeEventView } from '../interfaces/InviteeEventView';
import moment from 'moment';
import DropdownEditMenu from '../components/DropdownEditMenu';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AuthContext } from '../context/AuthContext'
import './widget4.css';





  interface DashboardCard02Props {
    events: InviteeEventView[];
    groupedEvents: Record<string, InviteeEventView[]>;
    onEditClick: (event: any) => void;
    onViewClick: (event: any) => void;
    onInviteClick: (eventId: number) => void;
    onDeleteClick: (eventId: number) => void;
    
  }

const DashboardCard02: React.FC<DashboardCard02Props> = ({ events, groupedEvents, onEditClick, onViewClick, onInviteClick, onDeleteClick  }) => {   
  const { userId } = useContext(AuthContext);

 
  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {Object.keys(groupedEvents).length === 0 ? (
        <p className="text-center text-gray-500">No events to display.</p>
      ) : (
        <div className="w-full h-full overflow-auto shadow bg-white" id="journal-scroll">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table Header
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
            </thead> */}

            {/* Table Body */}
            {Object.entries(groupedEvents).map(([longDate, eventsForDate]) => (
              <tbody key={longDate} className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
                {/* Group Header */}
                <tr>
                  <td colSpan={5} className="px-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{longDate}</h2>
                  </td>
                </tr>

                {/* Events for the Group */}
                {eventsForDate.map(event => (
                  
                  <tr key={event.id}>
                    <td className="pl-5 pr-3 whitespace-no-wrap">
                      <div className="text-gray-400">{new Date(event.start_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</div>
                      <div>{new Date(event.start_date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</div>
                    </td>

                    <td className="px-2 py-2 whitespace-no-wrap">
                      <div className="leading-5 text-gray-500 text-lg font-bold"><div className='mr-2'></div>{event.event_title}</div>
                      <div className="leading-5 text-gray-800 flex items-center">
                        <span className="mr-2 flex-shrink-0">
                          <svg
                            fill="#000000"
                            version="1.1"
                            id="Capa_1"
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            viewBox="0 0 395.71 395.71"
                          >
                            <g>
                              <path
                                d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738
              c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388
              C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191
              c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"
                              />
                            </g>
                          </svg>
                        </span>
                        <span>{event.event_location}</span>
                      </div>

                    </td>

                    <td className="p-2">
                      <div className="text-center text-sky-500"><div className='mr-2'>Ends at:</div>{moment(event.end_date).format('MMM D, YYYY hh:mm A')}</div>
                    </td>
                    
                    <td className="p-2">
                      <div className="text-center">
                        <DropdownEditMenu>
                          {event.event_created_by === userId && new Date(event.start_date) >= new Date() && (
                            <DropdownMenu.Item
                              className="px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                              onClick={() => onEditClick(event)}
                            >
                          Edit
                            </DropdownMenu.Item>
                          )}
                          <DropdownMenu.Item
                            onClick={() => onViewClick(event)}
                            className="px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                          >
                        View Details
                          </DropdownMenu.Item>
                          {event.event_created_by === userId && new Date(event.start_date) >= new Date() && (
                            <DropdownMenu.Item
                              onClick={() => onInviteClick(event.event_id)}
                              className="px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                            >
                          Invite Friend(s)
                            </DropdownMenu.Item>
                          )}
                          {event.event_created_by === userId && new Date(event.start_date) >= new Date() && (
                            <DropdownMenu.Item
                              onClick={() => onDeleteClick(event.event_id)}
                              className="px-4 py-2 text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700 cursor-pointer"
                            >
                          Remove
                            </DropdownMenu.Item>
                          )}
                        </DropdownEditMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      )}
    </div>

  );
};

export default DashboardCard02;
