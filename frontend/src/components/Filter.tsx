import React, { useState, useRef, useEffect } from "react";
import Transition from "../utils/Transition";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { MixerHorizontalIcon, Cross2Icon } from "@radix-ui/react-icons";


type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface PopoverDemoProps {
  onFilterApply: (filters: { dateRange: [Date | null, Date | null]; rsvpStatus: string }) => void;
  align?: "left" | "right";
}

const PopoverDemo: React.FC<PopoverDemoProps> = ({ onFilterApply, align = "left" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [rsvpStatus, setRsvpStatus] = useState<string>("");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Handle date range change
  const handleDateChange = (value: DateObject[] | DateObject) => {
    if (Array.isArray(value) && value.length === 2) {
      setDateRange([value[0]?.toDate() || null, value[1]?.toDate() || null]);
    }
  };

  // Handle RSVP status change
  const handleRsvpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRsvpStatus(event.target.value);
  };

  // Apply filters
  const handleApplyFilters = () => {
    onFilterApply({ dateRange, rsvpStatus });
    setDropdownOpen(false); // Close dropdown after applying filters
  };

  return (
    <div className="relative inline-flex">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="inline-flex size-[35px] cursor-pointer items-center justify-center rounded-full bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Filter</span>
        <MixerHorizontalIcon />
      </button>

      {/* Dropdown Content */}
      <Transition
        show={dropdownOpen}
        tag="div"
        className={`origin-top-right z-10 absolute top-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-2 ${
          align === "right" 
            ? "right-0 left-auto" // Right alignment for all screens
            : "left-0 right-auto" // Left alignment for all screens
        } md:${align === "right" ? "right-0 left-auto" : "left-0 right-auto"}`}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 scale-95"
        enterEnd="opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveStart="opacity-100 scale-100"
        leaveEnd="opacity-0 scale-95"
      >
        <div ref={dropdownRef} className="p-4">
          {/* Filters */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date Range
              </label>
              <DatePicker
                range
                value={
                  dateRange[0] && dateRange[1]
                    ? [new DateObject(dateRange[0]), new DateObject(dateRange[1])]
                    : []
                }
                onChange={handleDateChange}
                className="mt-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                RSVP Status
              </label>
              <div className="flex gap-4 mt-2">
                {["accepted", "declined"].map((status) => (
                  <label key={status} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="rsvp_status"
                      value={status}
                      checked={rsvpStatus === status}
                      onChange={handleRsvpChange}
                      className="form-radio"
                    />
                    <span className="text-sm capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* Apply Filters Button */}
          <button
            onClick={handleApplyFilters}
            className="mt-4 text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2"
          >
            Apply Filters
          </button>
        </div>
      </Transition>
    </div>
  );
};

export default PopoverDemo;
