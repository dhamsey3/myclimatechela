import { describe, expect, it } from 'vitest';
import { FALLBACK_POSTS, getPostsOrFallback, normalizePosts } from './posts';

describe('normalizePosts', () => {
  it('normalizes feed fields without changing an external article URL', () => {
    const posts = normalizePosts([{
      title: 'A climate story',
      date: '2026-07-01T00:00:00.000Z',
      summary: 'A human-scale account.',
      image: '/img/slide2.png',
      external_url: 'https://medium.com/example/story',
    }]);

    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      id: 1,
      title: 'A climate story',
      preview: 'A human-scale account.',
      image: '/img/slide2.png',
      mediumLink: 'https://medium.com/example/story',
    });
    expect(posts[0].date).toContain('2026');
  });

  it('removes incomplete entries and caps the homepage feed at six stories', () => {
    const raw = Array.from({ length: 8 }, (_, index) => ({
      title: index === 0 ? '' : `Story ${index}`,
      date: '2026-07-01',
      permalink: `/stories/${index}`,
    }));

    expect(normalizePosts(raw)).toHaveLength(6);
    expect(normalizePosts(raw)[0].title).toBe('Story 1');
  });
});

describe('getPostsOrFallback', () => {
  it('returns local fallback stories for invalid or empty feed data', () => {
    expect(getPostsOrFallback(undefined)).toEqual(FALLBACK_POSTS);
    expect(getPostsOrFallback([])).toEqual(FALLBACK_POSTS);
  });
});
