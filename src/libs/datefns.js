import { format } from "date-fns";
const dateUtils = {
  getDateAndTime: (date) => {
    if (!date) {
      return "";
    }
    return format(date, "dd-MM-yyyy hh:mm:ss a");
  },
};

export default dateUtils;
