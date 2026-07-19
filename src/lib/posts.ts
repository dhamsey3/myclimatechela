export interface BlogPost {
  id: number;
  title: string;
  date: string;
  preview: string;
  image: string;
  mediumLink: string;
}

const DEFAULT_PREVIEW = 'Discover a grounded perspective on climate, sustainability, and everyday life.';

export const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'Sustainable living: small changes, lasting impact',
    date: 'March 10, 2024',
    preview: 'Practical ways everyday choices can support a fairer, more sustainable future.',
    image: '/img/slide2.png',
    mediumLink: '/posts/sustainability-tips/',
  },
  {
    id: 2,
    title: 'Welcome to My Climate Definition',
    date: 'March 5, 2024',
    preview: 'Why personal stories can make climate change easier to understand and harder to ignore.',
    image: '/img/slide1.png',
    mediumLink: '/posts/welcome-to-my-climate-definition/',
  },
];

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

const firstString = (record: Record<string, unknown>, keys: string[], fallback = '') => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return fallback;
};

const formatDate = (value: string) => {
  if (!value) return 'Recently published';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

export const normalizePosts = (rawPosts: unknown): BlogPost[] => {
  if (!Array.isArray(rawPosts)) return [];

  return rawPosts
    .filter(isRecord)
    .filter((post) => firstString(post, ['title']).length > 0)
    .slice(0, 7)
    .map((post, index) => ({
      id: index + 1,
      title: firstString(post, ['title']),
      date: formatDate(firstString(post, ['date', 'published_at', 'pubDate'])),
      preview: firstString(post, ['summary', 'excerpt', 'preview'], DEFAULT_PREVIEW),
      image: firstString(post, ['image', 'thumbnail'], `/img/slide${(index % 4) + 1}.png`),
      mediumLink: firstString(post, ['external_url', 'permalink', 'url'], '#'),
    }));
};

export const getPostsOrFallback = (rawPosts: unknown): BlogPost[] => {
  const posts = normalizePosts(rawPosts);
  return posts.length > 0 ? posts : FALLBACK_POSTS;
};
