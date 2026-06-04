export const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPEN':
      return '#2196f3';
    case 'IN_PROGRESS':
      return '#ff9800';
    case 'REJECTED':
      return '#f44336';
    case 'CLOSED':
      return '#4caf50';
    default:
      return '#999';
  }
};