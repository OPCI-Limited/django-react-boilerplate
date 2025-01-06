import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Popup from "reactjs-popup";
import { inviteeEventViewService } from "../services/InviteeEventViewService";
import { inviteeService } from '../services/invitees.service';
import Transition from "../utils/Transition";
import './widget4.css'

interface DashboardCard04Props {
  count: number;
  events: any[];
  fetchWidgetData: () => Promise<void>;
  fetchAndGroupEvents: () => Promise<void>;
}

const DashboardCard04: React.FC<DashboardCard04Props> = ({ count, events,fetchWidgetData,fetchAndGroupEvents }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleRSVPUpdate = async (inviteeId: number, status: string) => {
    try {
      await inviteeService.updateRSVPStatus(inviteeId, status);
      alert("RSVP updated successfully!");
      setIsPopupOpen(false);
      await fetchWidgetData();
      await fetchAndGroupEvents();
    } catch (error) {
      console.error("Error updating RSVP status:", error);
    }
  };


  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="flex border-gray-100 " onClick={() => setIsPopupOpen(true)}>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1 mx-2">
          Pending Invitation(s)
        </div>
        <div className="flex items-start">
          <div className="text-xs font-semibold text-gray-800 dark:text-gray-100 mr-2">
            {count}
          </div>
        </div>
      </div>
      <Popup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        modal
      >
        
        <div className="container mx-auto py-10 flex justify-center h-screen">
          <div className="pl-2  h-full flex flex-col">
            <div className="bg-white text-sm text-gray-500 font-bold px-5 py-2 shadow border-b border-gray-300 flex justify-between items-center">
              <div>Pending events</div>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="p-1 rounded hover:bg-gray-100 transition ml-auto"
                aria-label="Close"
              ><span className="sr-only">Close</span>

                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="w-full h-full overflow-auto shadow bg-white" id="journal-scroll">
              <table className="w-full">


                <tbody className="">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <tr key={event.id} className="relative transform scale-100
                                    text-xs py-1 border-b-2 border-blue-100 cursor-default

                            bg-blue-500 bg-opacity-25">
                        <td className="pl-5 pr-3 whitespace-no-wrap">
                          <div className="text-gray-400">{new Date(event.start_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</div>
                          <div>{new Date(event.start_date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</div>
                        </td>

                        <td className="px-2 py-2 whitespace-no-wrap">
                          <div className="leading-5 text-gray-500 text-lg font-bold">{event.event_title}</div>
                          <div className="leading-5 text-gray-800 flex items-center"><span className="mr-2 flex-shrink-0">
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
                          </span><span>{event.event_location}</span></div>
                          <div className="leading-5 text-gray-900">Host: 
                            <a className="text-blue-500 hover:underline px-2" href="#">{event.host_email}</a></div>
                        </td>
                        <td className="px-2 py-2 whitespace-no-wrap">
                          <div className="flex flex-col gap-2">
                            <button
                              className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 transition"
                              onClick={() => handleRSVPUpdate(event.invitee_id, "accepted")}
                            >
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                            </button>
                            <button
                              className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition"
                              onClick={() => handleRSVPUpdate(event.invitee_id, "declined")}
                            >
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        No pending events at the moment.
                    </p>
                  )}
                    
                      
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default DashboardCard04;
