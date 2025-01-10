import React from 'react';
import { Library, Book, ClipboardList } from 'lucide-react';

interface NavigationProps {
  currentPage: 'library' | 'queue';
  onNavigate: (page: 'library' | 'queue') => void;
  queueCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentPage, 
  onNavigate,
  queueCount
}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Library className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">E-Library</h1>
          </div>
          
          <nav className="flex gap-4">
            <button
              onClick={() => onNavigate('library')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                currentPage === 'library'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Book className="w-4 h-4 mr-2" /> {/* Icon with margin */}
              Library
            </button>

            <button
              onClick={() => onNavigate('queue')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                currentPage === 'queue'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Queue
              {queueCount > 0 && (
                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                  {queueCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};