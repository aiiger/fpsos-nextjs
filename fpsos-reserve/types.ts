
export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  description: string;
  price: number;
}

export interface Booking {
  id: string;
  serviceId: string;
  date: Date;
  startTime: string;
  customerName: string;
  customerEmail: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export enum AppView {
  USER_SELECT_SERVICE = 'USER_SELECT_SERVICE',
  USER_SELECT_DATE = 'USER_SELECT_DATE',
  USER_SELECT_TIME = 'USER_SELECT_TIME',
  USER_FORM = 'USER_FORM',
  USER_CONFIRMED = 'USER_CONFIRMED',
  OWNER_DASHBOARD = 'OWNER_DASHBOARD'
}
