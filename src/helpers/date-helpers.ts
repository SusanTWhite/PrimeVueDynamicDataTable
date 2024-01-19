import dayjs from 'dayjs';

export default {
	getDateStringFromTimestamp(timestamp: number | undefined): string {
		if (!timestamp) return '';
		return dayjs.unix(timestamp).format('MM/DD/YYYY');
	}
};
