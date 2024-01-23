export type severitySet = {
	severity: string;
	label: string;
  };
 
export type IdSetConfig = Record<string, severitySet>;  
  
export default {
	productIdSet: {
		'-2': {
		  severity: 'danger',
		  label: 'Out of Stock'
		},
		'-1': {
		  severity: 'warning',
		  label: 'Back Ordered'
		},
		'0': {
		  severity: 'info',
		  label: 'Low Stock'
		},
		'1': {
		  severity: 'success',
		  label: 'In Stock'
		}
	  } as IdSetConfig
};
