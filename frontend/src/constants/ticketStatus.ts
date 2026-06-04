export const TICKET_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  REJECTED: 'REJECTED',
  CLOSED: 'CLOSED',
} as const;

export const TICKET_STATUS_LABEL: Record<string, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  REJECTED: 'Rejected',
  CLOSED: 'Closed',
};