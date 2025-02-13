import { Timestamp } from 'firebase/firestore';

export const timestampToDate = (timestamp: Timestamp | Date): Date => {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  return new Date(timestamp as any);
};

export const isInDateRange = (timestamp: Timestamp | Date, range: { start: Date; end: Date }): boolean => {
  const date = timestampToDate(timestamp);
  const startTime = range.start.getTime();
  const endTime = range.end.getTime();
  const timeToCheck = date.getTime();
  
  return timeToCheck >= startTime && timeToCheck <= endTime;
};

export const formatTimestamp = (timestamp: Timestamp | Date): string => {
  const date = timestampToDate(timestamp);
  return date.toLocaleDateString();
}; 