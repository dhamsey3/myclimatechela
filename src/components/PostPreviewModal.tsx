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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && post) {
      setIsLoading(true);
      // Simulate loading time for preview
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [isOpen, post]);

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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="h-full overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full my-8 overflow-hidden shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Post Preview</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Post Image */}
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = './img/slide1.png';
                }}
              />
              
              {/* Title and Date */}
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {post.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{post.date}</span>
              </div>

              {/* Content */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {post.preview}
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">Key Insights</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    This article explores critical aspects of climate action and sustainability, providing practical insights that can be applied to everyday life. The discussion covers innovative approaches to environmental challenges and highlights actionable steps individuals can take to make a positive impact.
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Why This Matters</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Understanding these concepts is crucial for anyone looking to contribute to climate solutions. The article provides evidence-based recommendations and real-world examples that demonstrate the effectiveness of sustainable practices.
                  </p>
                  
                  <div className="bg-muted/50 p-4 rounded-lg mt-6">
                    <p className="text-sm text-muted-foreground italic text-center">
                      This is a preview of the full article. Click "Read Full Article" below to access the complete content on Medium.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-6 bg-muted/20">
              <div className="flex flex-col gap-4">
                {/* Share buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareOnTwitter}
                    className="flex items-center gap-2"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareOnLinkedIn}
                    className="flex items-center gap-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Button>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={onClose}
                  >
                    Close
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
      </div>
    </div>
  );
};

export default PostPreviewModal;