import { useState, useMemo } from 'react';
import { books } from './data/books';
import { Filter, QueueEntry } from './types';
import { FilterSection } from './components/FilterSection';
import { BookCard } from './components/BookCard';
import { Navigation } from './components/Navigation';
import { QueuePage } from '../pages/QueuePage';
import { calculateNextAvailableDate } from './utils/dateUtils';

function App() {
  const [currentPage, setCurrentPage] = useState<'library' | 'queue'>('library');
  const [filter, setFilter] = useState<Filter>({
    search: '',
    genres: [],
    status: 'all'
  });
  const [queue, setQueue] = useState<QueueEntry[]>([]);

  // Extract unique genres from books
  const availableGenres = useMemo(() => {
    const genres = new Set(books.flatMap(book => book.genre));
    return Array.from(genres).sort();
  }, []);

  // Filter books based on search criteria
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = 
        filter.search === '' ||
        book.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        book.author.toLowerCase().includes(filter.search.toLowerCase());
      
      const matchesGenres = 
        filter.genres.length === 0 ||
        filter.genres.some(genre => book.genre.includes(genre));
      
      const matchesStatus = 
        filter.status === 'all' ||
        book.status === filter.status;
      
      return matchesSearch && matchesGenres && matchesStatus;
    });
  }, [filter]);

  const handleQueue = (bookId: string, userName: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book || !book.returnDate) return;

    const bookQueue = queue.filter(q => q.bookId === bookId);
    const queuePosition = bookQueue.length + 1;
    
    const newQueueEntry: QueueEntry = {
      bookId,
      userName,
      queuePosition,
      requestDate: new Date().toISOString(),
      expectedAvailableDate: calculateNextAvailableDate(book.returnDate, queuePosition)
    };
    
    setQueue([...queue, newQueueEntry]);
  };

  const handleRemoveFromQueue = (bookId: string) => {
    setQueue(queue.filter(q => q.bookId !== bookId));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        queueCount={queue.length}
      />

      {currentPage === 'library' ? (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <FilterSection
                filter={filter}
                onFilterChange={setFilter}
                availableGenres={availableGenres}
              />
            </div>
            <div className="md:col-span-3">
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onQueue={handleQueue}
                    queueLength={queue.filter(q => q.bookId === book.id).length}
                  />
                ))}
              </div>

              {filteredBooks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No books found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      ) : (
        <QueuePage
          queues={queue}
          books={books}
          onRemoveFromQueue={handleRemoveFromQueue}
        />
      )}
    </div>
  );
}

export default App;