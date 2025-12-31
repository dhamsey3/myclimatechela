import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  preview: string;
  image: string;
  mediumLink: string;
  tags?: string[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BlogPost[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load all posts for searching
    fetch('./posts.json')
      .then(response => response.json())
      .then((posts: any[]) => {
        const transformedPosts: BlogPost[] = posts.map((post, index) => {
          const date = new Date(post.date);
          const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          return {
            id: index + 1,
            title: post.title,
            date: formattedDate,
            preview: post.summary || post.excerpt || '',
            image: post.image || `./img/slide${(index % 4) + 1}.png`,
            mediumLink: post.external_url || post.permalink || post.url || '#',
            tags: post.tags || []
          };
        });
        setAllPosts(transformedPosts);
      })
      .catch(error => console.error('Error loading posts:', error));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const searchQuery = query.toLowerCase();
    
    const filtered = allPosts.filter(post => 
      post.title.toLowerCase().includes(searchQuery) ||
      post.preview.toLowerCase().includes(searchQuery) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
    );

    // Simulate slight delay for better UX
    const timer = setTimeout(() => {
      setResults(filtered);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, allPosts]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Open search with Cmd/Ctrl + K or just '/'
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handlePostClick = (link: string) => {
    window.open(link, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4" onClick={onClose}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-background border-2 border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search articles, topics, or tags..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="flex-shrink-0"
                >
                  <kbd className="px-2 py-1 text-xs bg-muted rounded">Esc</kbd>
                </Button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {!query ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Start typing to search articles...</p>
                    <div className="flex gap-2 justify-center mt-4 flex-wrap">
                      <Badge variant="secondary" className="cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30">
                        Climate Change
                      </Badge>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30">
                        Sustainability
                      </Badge>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30">
                        Carbon Footprint
                      </Badge>
                    </div>
                  </div>
                ) : isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto" />
                    <p className="text-sm text-muted-foreground mt-3">Searching...</p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p className="text-sm">No results found for "{query}"</p>
                    <p className="text-xs mt-2">Try different keywords or browse all posts</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {results.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handlePostClick(post.mediumLink)}
                        className="p-4 hover:bg-muted/50 cursor-pointer transition-colors group"
                      >
                        <div className="flex gap-4">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-1">
                              {post.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                              {post.preview}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{post.date}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {results.length > 0 && (
                <div className="p-3 border-t border-border bg-muted/30 text-xs text-muted-foreground text-center">
                  {results.length} result{results.length !== 1 ? 's' : ''} found
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
