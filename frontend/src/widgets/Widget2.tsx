import React from 'react';
import { Link } from 'react-router-dom';


interface DashboardCard03Props {
  count: number;
}

const DashboardCard03: React.FC<DashboardCard03Props> = ({ count })  => {
  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="flex">
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1 mx-2">
          Upcoming Events: 
        </div>
        <div className="flex items-start">
          <div className="text-xs font-semibold text-gray-800 dark:text-gray-100 mr-2">
            {count}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard03;
