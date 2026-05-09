export type EventDto = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string;
  capacity: number;
  remainingSeats: number;
  isFull: boolean;
  createdAt: string;
};

export type RegistrationDto = {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  registeredAt: string;
};

export type PageResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type LoginResponseDto = {
  token: string;
  role: string;
  email: string;
};

export type ProblemDetail = {
  type?: string;
  title?: string;
  status: number;
  detail?: string;
  instance?: string;
  code?: string;
  errors?: { field: string; message: string }[];
};
