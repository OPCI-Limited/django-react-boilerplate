import React, { useState, useRef, useEffect } from "react";
import Transition from "../utils/Transition";

interface DropdownFilterProps {
  align?: "left" | "right";
  onApply: (filter: string) => void; // Callback to apply selected filter
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({ align = "left", onApply }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("none");

  const trigger = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (
        !dropdown.current ||
        !trigger.current ||
        dropdown.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      ) {
        return;
      }
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [dropdownOpen]);

  // Close dropdown if Esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (keyCode === 27 && dropdownOpen) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [dropdownOpen]);

  // Apply filter
  const handleApply = () => {
    onApply(selectedFilter);
    setDropdownOpen(false);
  };

  return (
    <div className="relative inline-flex">
      {/* Trigger button */}
      <button
        ref={trigger}
        className="inline-flex size-[35px] cursor-default items-center justify-center rounded-full bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Sort By</span>
        <svg
          className="fill-current"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path d="M0 3a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1ZM3 8a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM7 12a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Z" />
        </svg>
      </button>

      {/* Dropdown */}
      <Transition
        show={dropdownOpen}
        tag="div"
        className={`origin-top-right z-10 absolute top-full left-0 right-auto min-w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 pt-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
          align === "right"
            ? "md:left-auto md:right-0"
            : "md:left-0 md:right-auto"
        }`}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div ref={dropdown}>
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-3">
            Sort By
          </div>
          <ul className="mb-4">
            {["none", "startDate", "hostName"].map((filter) => (
              <li key={filter} className="py-1 px-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="filter"
                    value={filter}
                    checked={selectedFilter === filter}
                    onChange={() => setSelectedFilter(filter)}
                    className="form-radio"
                  />
                  <span className="text-sm font-medium ml-2">
                    {filter === "none" ? "None" : filter === "startDate" ? "Start Date" : "Host Name"}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <div className="py-2 px-3 border-t border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-700/20">
            <ul className="flex items-center justify-between">
              <li>
                <button
                  className="mt-4 text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2"
                  onClick={handleApply}
                >
                  Apply
                </button>
              </li>
            </ul>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default DropdownFilter;
