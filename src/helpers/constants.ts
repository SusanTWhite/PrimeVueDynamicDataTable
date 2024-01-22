export type LabelSet = {
	severity: string;
	label: string;
  };
 
 export type IdSetEntryConfig = Record<string, LabelSet>;  
  
export default {
	idSetEntry: {
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
	  } as IdSetEntryConfig
};
