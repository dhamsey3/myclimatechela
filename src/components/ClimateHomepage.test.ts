import { describe, expect, it } from 'vitest';
import homepageSource from './ClimateHomepage.tsx?raw';

describe('story-first homepage', () => {
  it('orders reading content before utility and support content', () => {
    expect(homepageSource).toContain('id="main-content"');
    expect(homepageSource).toContain('Read featured story');
    expect(homepageSource).toContain('Latest stories');
    expect(homepageSource).toContain('A quick estimate');

    const storiesIndex = homepageSource.indexOf('Latest stories');
    const calculatorIndex = homepageSource.indexOf('<CarbonCalculator');
    const supportIndex = homepageSource.indexOf('<BuyMeACoffee');
    expect(storiesIndex).toBeLessThan(calculatorIndex);
    expect(calculatorIndex).toBeLessThan(supportIndex);
  });

  it('removes carousel, sharing, duplicated metadata, and decorative gradients', () => {
    expect(homepageSource).not.toContain('carouselImages');
    expect(homepageSource).not.toContain('currentSlide');
    expect(homepageSource).not.toContain('bg-gradient-to');
    expect(homepageSource).not.toContain('<Twitter');
    expect(homepageSource).not.toContain('<Linkedin');
    expect(homepageSource).not.toContain('<span>{post.date}</span>\n                          <span>{post.date}</span>');
  });
});
