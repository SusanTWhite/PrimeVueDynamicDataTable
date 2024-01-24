import dayjs from 'dayjs';

type IndexableFunctions = {
	[key: string]: (...args: any[]) => any;
  };

type DateHelpersType = {
  getDateStringFromTimestamp(timestamp: number | undefined): string;
  // Add other utility functions without the need for indexing
} & IndexableFunctions;

//The & syntax creates a type union making the 

class DateHelpers implements DateHelpersType {
  getDateStringFromTimestamp(timestamp: number | undefined): string {
    // Implementation of the function
    return timestamp ? dayjs(timestamp).format('MM/DD/YYYY') : '';
  }
  // Only specific functions are made indexable
  [key: string]: (...args: any[]) => any;

  now(): string {
	return dayjs().toString();
  }
  // Add other utility functions without the need for indexing
  // For example:
  addDays(a: string, b: number): string {
	return dayjs(a).add(b, 'day').format('MM/DD/YYYY');
  }
}

const dateHelper: DateHelpersType = new DateHelpers();
export default dateHelper;
