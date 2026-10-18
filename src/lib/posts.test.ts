import { describe, expect, it } from 'vitest';
import { FALLBACK_POSTS, getPostsOrFallback, normalizePosts, topicLabel } from './posts';

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

  it('removes incomplete entries and retains seven stories for the homepage', () => {
    const raw = Array.from({ length: 8 }, (_, index) => ({
      title: index === 0 ? '' : `Story ${index}`,
      date: '2026-07-01',
      permalink: `/stories/${index}`,
    }));

    expect(normalizePosts(raw)).toHaveLength(7);
    expect(normalizePosts(raw)[0].title).toBe('Story 1');
  });
});

describe('getPostsOrFallback', () => {
  it('returns local fallback stories for invalid or empty feed data', () => {
    expect(getPostsOrFallback(undefined)).toEqual(FALLBACK_POSTS);
    expect(getPostsOrFallback([])).toEqual(FALLBACK_POSTS);
  });
});

describe('story metadata', () => {
  it('reads topics, writer and reading time from the feed', () => {
    const [post] = normalizePosts([{
      title: 'Plastic Is Everywhere',
      tags: ['plastic-pollution', 'climate-change', 'plastic-pollution', 42],
      author: 'Patricia Korir',
      reading_minutes: 5,
    }]);
    expect(post.topics).toEqual(['Plastic pollution', 'Climate change']);
    expect(post.author).toBe('Patricia Korir');
    expect(post.readingMinutes).toBe(5);
  });

  it('leaves metadata empty when the feed has none', () => {
    const [post] = normalizePosts([{ title: 'Older story' }]);
    expect(post.topics).toEqual([]);
    expect(post.author).toBe('');
    expect(post.readingMinutes).toBe(0);
  });
});

describe('topicLabel', () => {
  it('turns tag slugs into readable topics and keeps acronyms in capitals', () => {
    expect(topicLabel('climate-change')).toBe('Climate change');
    expect(topicLabel('cop30')).toBe('COP30');
    expect(topicLabel('ipcc-report')).toBe('IPCC report');
    expect(topicLabel('Plastic_Pollution')).toBe('Plastic pollution');
  });
});
