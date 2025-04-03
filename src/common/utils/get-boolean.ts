import { BooleanLikeString } from '../types/boolean-like-string';

export function getBoolean(value: BooleanLikeString): boolean {
  if (value === 'y') return true;
  if (value === 'n') return false;
  return undefined;
}
