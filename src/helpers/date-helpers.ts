import dayjs from 'dayjs';

type IndexableType = {
	getDateStringFromTimestamp(timestamp: number | undefined): string;
	// Add other utility functions with their respective signatures
	[key: string]: (...args: any[]) => any;
  };
  
  const dateHelpers: IndexableType = {
	getDateStringFromTimestamp(timestamp: number | undefined): string {
	  // Implementation of the function
	  return timestamp ? dayjs(timestamp).format('MM/DD/YYYY') : '';
	},
	// Add other utility functions with their respective implementations
  };

  export default dateHelpers;

  /*
  export default {
	getDateStringFromTimestamp(timestamp: number | undefined): string {
		return timestamp ? dayjs.unix(timestamp).format('MM/DD/YYYY') : '';
	}
  */
