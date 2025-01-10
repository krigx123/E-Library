import React, { useState } from 'react';
import { Book } from '../types';
import { BookOpen, MapPin, Clock } from 'lucide-react';
import { calculateDaysUntilReturn, formatDate } from '../utils/dateUtils';
import { QueueModal } from './QueueModal';

interface BookCardProps {
  book: Book;
  onQueue: (bookId: string, userName: string) => void;
  queueLength: number;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onQueue, queueLength }) => {
  const [showQueueModal, setShowQueueModal] = useState(false);

  const statusColors: { [key: string]: string } = {
    available: 'bg-green-100 text-green-800',
    issued: 'bg-yellow-100 text-yellow-800',
    // taken: 'bg-red-100 text-red-800',
    'not in library': 'bg-gray-100 text-gray-800',
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-4">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-24 h-32 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>

            <div className="flex flex-wrap gap-1 mt-2">
              {book.genre.map((g) => (
                <span
                  key={g}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {g}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                Shelf {book.position.shelf}, Row {book.position.row}, Col {book.position.column}
              </span>
            </div>

            {book.returnDate && (book.status === 'issued' || book.status === 'taken') && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  Returns: {formatDate(book.returnDate)} (
                  {calculateDaysUntilReturn(book.returnDate)} days left)
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <span className={`px-2 py-1 rounded-full text-sm ${statusColors[book.status]}`}>
                {book.status}
              </span>

              {book.status !== 'available' && book.status !== 'not in library' && (
                <button
                  onClick={() => setShowQueueModal(true)}
                  className="flex items-center gap-2 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  <BookOpen className="w-4 h-4" />
                  Queue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showQueueModal && (
        <QueueModal
          book={book}
          onClose={() => setShowQueueModal(false)}
          onQueue={(userName) => {
            onQueue(book.id, userName);
            setShowQueueModal(false);
          }}
          currentQueueLength={queueLength}
        />
      )}
    </>
  );
};
