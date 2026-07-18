import { describe, expect, it } from 'vitest';
import homepageSource from './ClimateHomepage.tsx?raw';
import supportSource from './BuyMeACoffee.tsx?raw';
import aboutSource from './AboutPage.tsx?raw';
import contactSource from './ContactPage.tsx?raw';

describe('editorial secondary pages', () => {
  it('uses approachable publication language instead of journal positioning', () => {
    const userFacingSource = [homepageSource, supportSource, aboutSource, contactSource].join('\n').toLowerCase();
    expect(userFacingSource).not.toContain('journal');
  });

  it('uses local credited photography on About and Contact', () => {
    expect(aboutSource).toContain('/img/editorial/about-climate-action.jpg');
    expect(contactSource).toContain('/img/editorial/contact-conversation.jpg');
    expect(aboutSource).toContain('pexels.com/photo/');
    expect(contactSource).toContain('pexels.com/photo/');
    expect(aboutSource).toContain('Photo by');
    expect(contactSource).toContain('Photo by');
  });

  it('removes remote hero imagery and template decoration', () => {
    const secondarySource = `${aboutSource}\n${contactSource}`;
    expect(secondarySource).not.toContain('images.pexels.com');
    expect(secondarySource).not.toContain('images.unsplash.com');
    expect(secondarySource).not.toContain('bg-gradient-to');
    expect(secondarySource).not.toContain('blur-3xl');
  });

  it('keeps contact recovery visible and avoids a competing support prompt', () => {
    expect(contactSource).toContain('role="alert"');
    expect(contactSource).toContain('submitError');
    expect(contactSource).not.toContain('<BuyMeACoffee');
  });

  it('preserves the original About language inside the editorial layout', () => {
    expect(aboutSource).toContain('Our voices. Our planet. Our future.');
    expect(aboutSource).toContain('My Climate Definition</strong> is a space for stories and conversations about climate change through the lens of our lived experiences.');
    expect(aboutSource).toContain('A world where personal stories and collective experiences inspire action');
    expect(aboutSource).toContain('To create a platform that connects daily human choices to global climate impacts');
    expect(aboutSource).toContain('Change begins with people coming together, learning from each other, and supporting collective action.');
    expect(aboutSource).toContain('Ready to Join the Conversation?');
  });
});
