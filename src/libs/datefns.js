import { format } from "date-fns";
const dateUtils = {
  getDateAndTime: (date) => {
    if (!date) {
      return "";
    }
    return format(date, "dd-MM-yyyy hh:mm:ss a");
  },
  getDate: (date) => {
    if (!date) {
      return "";
    }
    return format(date, "dd-MM-yyyy");
  },
  getMilliseconds: (date) => {
    if (!date) {
      return "";
    }
    return format(date, "SSS");
  },
};

export default dateUtils;
