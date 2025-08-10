import { format, isAfter, isBefore, isEqual } from "date-fns";

export const formatDateTime = (dateTime: string): string => {
  try {
    return format(new Date(dateTime), "MMM dd, yyyy - hh:mm a");
  } catch {
    return "Invalid date";
  }
};

export const formatDate = (date: string): string => {
  try {
    return format(new Date(date), "MMM dd, yyyy");
  } catch {
    return "Invalid date";
  }
};

export const formatTime = (dateTime: string): string => {
  try {
    return format(new Date(dateTime), "hh:mm a");
  } catch {
    return "Invalid time";
  }
};

export const isDateTimeAfter = (
  dateTime1: string,
  dateTime2: string
): boolean => {
  try {
    return isAfter(new Date(dateTime1), new Date(dateTime2));
  } catch {
    return false;
  }
};

export const isDateTimeBefore = (
  dateTime1: string,
  dateTime2: string
): boolean => {
  try {
    return isBefore(new Date(dateTime1), new Date(dateTime2));
  } catch {
    return false;
  }
};

export const isDateTimeEqual = (
  dateTime1: string,
  dateTime2: string
): boolean => {
  try {
    return isEqual(new Date(dateTime1), new Date(dateTime2));
  } catch {
    return false;
  }
};

export const checkTimeOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  try {
    const startDate1 = new Date(start1);
    const endDate1 = new Date(end1);
    const startDate2 = new Date(start2);
    const endDate2 = new Date(end2);

    // Check for overlap: start1 < end2 && start2 < end1
    return isBefore(startDate1, endDate2) && isBefore(startDate2, endDate1);
  } catch {
    return false;
  }
};

export const convertToISOString = (dateTimeLocal: string): string => {
  try {
    const date = new Date(dateTimeLocal);
    return date.toISOString();
  } catch {
    return "";
  }
};

export const convertFromISOString = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    // Format for datetime-local input (YYYY-MM-DDTHH:mm)
    return format(date, "yyyy-MM-dd'T'HH:mm");
  } catch {
    return "";
  }
};
