import React, { useState } from 'react';
import { X, User, Calendar } from 'lucide-react';
import { Book } from '../types';
import { formatDate, calculateNextAvailableDate } from '../utils/dateUtils';

interface QueueModalProps {
  book: Book;
  onClose: () => void;
  onQueue: (userName: string) => void;
  currentQueueLength: number;
}

export const QueueModal: React.FC<QueueModalProps> = ({ 
  book, 
  onClose, 
  onQueue,
  currentQueueLength 
}) => {
  const [userName, setUserName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      onQueue(userName.trim());
    }
  };

  const nextAvailableDate = book.returnDate 
    ? calculateNextAvailableDate(book.returnDate, currentQueueLength)
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Queue for Book</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-medium">{book.title}</h3>
          <p className="text-gray-600">{book.author}</p>

          {/* Current holder information */}
          {book.currentHolder && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <User className="w-4 h-4" />
                <span>Currently held by: {book.currentHolder}</span>
              </div>
              {book.issuedDate && (
                <div className="mt-2 text-sm text-blue-700">
                  <p>Issued on: {formatDate(book.issuedDate)}</p>
                  <p>Returns on: {formatDate(book.returnDate!)}</p>
                </div>
              )}
            </div>
          )}

          {/* Queue position and next available date */}
          {nextAvailableDate && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <Calendar className="w-4 h-4" />
                <span>Your queue position will be: #{currentQueueLength + 1}</span>
              </div>
              <p className="mt-2 text-sm text-green-700">
                Expected available date: {formatDate(nextAvailableDate)}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Join Queue
          </button>
        </form>
      </div>
    </div>
  );
};