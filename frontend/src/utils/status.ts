import type { TFunction } from 'i18next';

export const getStatusLabel = (t: TFunction, status: string) => {
  return t(`statusValues.${status}`);
};