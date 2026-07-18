import { describe, expect, it } from 'vitest';
import carouselSource from './StoryCarousel.tsx?raw';
import homepageSource from './ClimateHomepage.tsx?raw';

describe('original-image story carousel', () => {
  it('uses all four original slide assets with accessible controls', () => {
    for (let slide = 1; slide <= 4; slide += 1) {
      expect(carouselSource).toContain(`/img/slide${slide}.png`);
    }
    expect(carouselSource).toContain('Previous image');
    expect(carouselSource).toContain('Next image');
    expect(carouselSource).toContain('aria-live="polite"');
    expect(carouselSource).toContain("matchMedia('(prefers-reduced-motion: reduce)')");
  });

  it('places the carousel after latest stories and before the purpose section', () => {
    const latestIndex = homepageSource.indexOf('Latest stories');
    const carouselIndex = homepageSource.indexOf('<StoryCarousel');
    const purposeIndex = homepageSource.indexOf('Our point of view');

    expect(latestIndex).toBeLessThan(carouselIndex);
    expect(carouselIndex).toBeLessThan(purposeIndex);
  });
});
