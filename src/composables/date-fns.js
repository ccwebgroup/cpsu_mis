import { formatDistance } from "date-fns";

export const useDateFns = () => {
  function relativeDate(val) {
    return formatDistance(val, new Date());
  }

  return { relativeDate };
};
