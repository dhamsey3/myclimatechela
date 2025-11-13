import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Calendar, Twitter, Linkedin } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  preview: string;
  image: string;
  mediumLink: string;
}

interface PostPreviewModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

const PostPreviewModal = ({ post, isOpen, onClose }: PostPreviewModalProps) => {
  const [fullContent, setFullContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && post) {
      setIsLoading(true);
      // Try to fetch more content or use extended preview
      // For now, we'll create an enhanced preview
      setFullContent(generateEnhancedContent(post));
      setIsLoading(false);
    }
  }, [isOpen, post]);

  const generateEnhancedContent = (post: BlogPost) => {
    // Enhanced content based on the preview
    return `
      <p>${post.preview}</p>
      
      <h3>Key Insights</h3>
      <p>This article explores critical aspects of climate action and sustainability, providing practical insights that can be applied to everyday life. The discussion covers innovative approaches to environmental challenges and highlights actionable steps individuals can take to make a positive impact.</p>
      
      <h3>Why This Matters</h3>
      <p>Understanding these concepts is crucial for anyone looking to contribute to climate solutions. The article provides evidence-based recommendations and real-world examples that demonstrate the effectiveness of sustainable practices.</p>
      
      <h3>Next Steps</h3>
      <p>After reading this preview, you can continue to the full article on Medium for detailed analysis, additional examples, and comprehensive coverage of the topic.</p>
      
      <p><em>This is a preview of the full article. Click "Read Full Article" to access the complete content on Medium.</em></p>
    `;
  };

  const shareOnTwitter = () => {
    if (!post) return;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(post.mediumLink)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    if (!post) return;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(post.mediumLink)}`;
    window.open(url, '_blank');
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = './img/slide1.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </Button>
          
          {/* Title overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {post.title}
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{post.date}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div 
              className="prose prose-green dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: fullContent }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-muted/50">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnTwitter}
                className="flex items-center gap-2"
              >
                <Twitter className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnLinkedIn}
                className="flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4" />
                Share
              </Button>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close Preview
              </Button>
              <Button
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                onClick={() => window.open(post.mediumLink, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Read Full Article
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPreviewModal;