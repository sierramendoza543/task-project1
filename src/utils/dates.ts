import { Timestamp } from 'firebase/firestore';

export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

export const isInDateRange = (timestamp: Timestamp, range: { start: Date; end: Date }): boolean => {
  const date = timestampToDate(timestamp);
  return date >= range.start && date <= range.end;
};

export const formatTimestamp = (timestamp: Timestamp): string => {
  return timestampToDate(timestamp).toLocaleDateString();
}; 