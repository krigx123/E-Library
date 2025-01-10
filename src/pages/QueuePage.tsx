import React from 'react';
import { QueueList } from '../components/QueueList';
import { Book, QueueEntry } from '../types';
import { ClipboardList } from 'lucide-react';

interface QueuePageProps {
  queues: QueueEntry[];
  books: Book[];
  onRemoveFromQueue: (queueId: string) => void;
}

export const QueuePage: React.FC<QueuePageProps> = ({ queues, books, onRemoveFromQueue }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-900">My Queue</h1>
      </div>
      
      <QueueList
        queues={queues}
        books={books}
        onRemoveFromQueue={onRemoveFromQueue}
      />
    </div>
  );
};