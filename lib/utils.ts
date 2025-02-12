import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(time: string): string {
  try {
    return new Date(`1970/01/01 ${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return time;
  }
}

export function validateLocation(location: string): boolean {
  return location.trim().length >= 2;
}

export function validateInterests(interests: string[]): boolean {
  return interests.length > 0 && interests.every(interest => interest.trim().length > 0);
}
