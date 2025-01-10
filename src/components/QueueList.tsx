import React from 'react';
import { QueueEntry, Book } from '../types';
import { X, Clock, BookOpen } from 'lucide-react';
import { formatDate, calculateDaysUntilReturn } from '../utils/dateUtils';

interface QueueListProps {
  queues: QueueEntry[];
  books: Book[];
  onRemoveFromQueue: (queueId: string) => void;
}

export const QueueList: React.FC<QueueListProps> = ({ queues, books, onRemoveFromQueue }) => {
  const getBook = (bookId: string) => books.find(b => b.id === bookId);

  return (
    <div className="space-y-4">
      {queues.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No books in your queue</p>
        </div>
      ) : (
        queues.map((queue) => {
          const book = getBook(queue.bookId);
          if (!book) return null;

          return (
            <div key={queue.bookId} className="bg-white rounded-lg shadow p-4">
              <div className="flex gap-4">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{book.title}</h3>
                      <p className="text-gray-600 text-sm">{book.author}</p>
                    </div>
                    <button
                      onClick={() => onRemoveFromQueue(queue.bookId)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      Queue Position: <span className="font-medium">#{queue.queuePosition}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Requested: {formatDate(queue.requestDate)}
                    </p>
                    {book.returnDate && (
                      <div className="flex items-center gap-1 text-sm text-blue-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          Expected return: {formatDate(book.returnDate)} 
                          ({calculateDaysUntilReturn(book.returnDate)} days)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};