import React, { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { MixerHorizontalIcon, Cross2Icon } from "@radix-ui/react-icons";
import DatePicker, { DateObject } from "react-multi-date-picker";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
type FilterConditions = {
  dateRange: [Date | null, Date | null];
  rsvpStatus: string;
};

interface PopoverDemoProps {
  onFilterApply: (filters: { dateRange: [Date | null, Date | null]; rsvpStatus: string }) => void;
  align?: "left" | "right";
}

const PopoverDemo: React.FC<PopoverDemoProps> = ({ onFilterApply, align = "left" }) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [rsvpStatus, setRsvpStatus] = useState<string>("");

  const handleDateChange = (value: DateObject[] | DateObject) => {
    if (Array.isArray(value) && value.length === 2) {
      setDateRange([value[0]?.toDate() || null, value[1]?.toDate() || null]);
    }
  };

  const handleRsvpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRsvpStatus(event.target.value);
  };

  const handleApplyFilters = () => {
    onFilterApply({ dateRange, rsvpStatus });
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="inline-flex size-[35px] cursor-default items-center justify-center rounded-full bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black"
          aria-label="Update dimensions"
        >
          <MixerHorizontalIcon />
        </button>
      </Popover.Trigger>
      <Popover.Content
        className="rounded bg-white p-5 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade"
        sideOffset={2}
      >
        <div className="flex flex-col gap-2.5">
          <p className="mb-2.5 text-[15px] font-medium leading-[19px] text-mauve12">
            Filter
          </p>
          <fieldset className="flex flex-col items-center gap-1">
            <label
              className="w-[75px] text-[13px] text-violet11"
              htmlFor="width"
            >
              Date Range
            </label>
            <div>
              <DatePicker
                range
                value={
                  dateRange[0] && dateRange[1]
                    ? [new DateObject(dateRange[0]), new DateObject(dateRange[1])]
                    : []
                }
                onChange={handleDateChange}
              />
            </div>
          </fieldset>
          <fieldset className="flex flex-col items-center gap-1">
            <label
              className="w-[75px] text-[13px] text-violet11"
              htmlFor="maxWidth"
            >
              RSVP Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="rsvp_status"
                  value="accepted"
                  checked={rsvpStatus === "accepted"}
                  onChange={handleRsvpChange}
                />
                Accepted
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="rsvp_status"
                  value="declined"
                  checked={rsvpStatus === "declined"}
                  onChange={handleRsvpChange}
                />
                Declined
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="rsvp_status"
                  value="pending"
                  checked={rsvpStatus === "pending"}
                  onChange={handleRsvpChange}
                />
                Pending
              </label>
            </div>
          </fieldset>
          <button
            onClick={handleApplyFilters}
            className="mt-4 w-full px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            Apply Filters
          </button>
        </div>
        <Popover.Close
          className="absolute right-[5px] top-[5px] inline-flex size-[25px] cursor-default items-center justify-center rounded-full text-violet11 outline-none hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7"
          aria-label="Close"
        >
          <Cross2Icon />
        </Popover.Close>
        <Popover.Arrow className="fill-white" />
      </Popover.Content>
    </Popover.Root>
  );
};

export default PopoverDemo;
