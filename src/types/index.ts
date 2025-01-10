export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string[];
  position: {
    shelf: string;
    row: number;
    column: number;
  };
  status: 'available' | 'issued' | 'taken' | 'not in library';
  coverUrl: string;
  isbn?: string;
  issuedDate?: string; // Date when the book was issued
  returnDate?: string; // ISO date string
  currentHolder?: string; // Name of the person currently holding the book
}

export interface QueueEntry {
  bookId: string;
  userName: string;
  queuePosition: number;
  requestDate: string; // ISO date string
  expectedAvailableDate: string; // Expected date when book will be available for this person
}

export interface Filter {
  search: string;
  genres: string[];
  status: string;
}