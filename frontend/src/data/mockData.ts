/**
 * Mock Data - Sample site with pages and sections
 * Used for development and testing
 */

import type { Site, Page, Section } from '../types/content'

const now = new Date().toISOString()

const mockSections: Section[] = [
  {
    id: 'section-1',
    pageId: 'page-home',
    type: 'hero',
    title: 'Hero Section',
    order: 0,
    fields: {
      heading: 'Build Modern Websites with AI-Powered Tools',
      subheading: 'Create, edit, and publish professional websites faster than ever with intelligent assistance',
      ctaText: 'Start Building',
      ctaUrl: '#',
      backgroundImage: {
        url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=600&fit=crop',
        alt: 'Modern technology background',
      },
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
    },
  },
  {
    id: 'section-2',
    pageId: 'page-home',
    type: 'features',
    title: 'Features Section',
    order: 1,
    fields: {
      heading: 'Everything You Need to Build Great Websites',
      features: [
        {
          title: 'AI-Powered Content',
          description: 'Generate and refine content with advanced AI assistance for professional results',
          icon: 'AI',
        },
        {
          title: 'Real-Time Preview',
          description: 'See your changes instantly with live preview as you edit and build',
          icon: 'PREVIEW',
        },
        {
          title: 'Code Editor',
          description: 'Access powerful code editing capabilities with syntax highlighting and validation',
          icon: 'CODE',
        },
      ],
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
    },
  },
  {
    id: 'section-3',
    pageId: 'page-home',
    type: 'cta',
    title: 'Call to Action',
    order: 2,
    fields: {
      heading: 'Ready to Build Your Next Project?',
      buttonText: 'Get Started Now',
      buttonUrl: '#',
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
    },
  },
  {
    id: 'section-4',
    pageId: 'page-about',
    type: 'content',
    title: 'About Content',
    order: 0,
    fields: {
      heading: 'About Our Platform',
      content:
        'We provide cutting-edge tools that empower developers and content creators to build professional websites efficiently. Our AI-powered platform combines intelligent content generation with powerful editing capabilities.',
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
    },
  },
  {
    id: 'section-5',
    pageId: 'page-contact',
    type: 'form',
    title: 'Contact Form',
    order: 0,
    fields: {
      heading: 'Get in Touch',
      submitText: 'Send Message',
      fields: ['name', 'email', 'message'],
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
    },
  },
]

const mockPages: Page[] = [
  {
    id: 'page-home',
    title: 'Home',
    slug: '/',
    order: 0,
    sections: mockSections.filter((s) => s.pageId === 'page-home'),
    metadata: {
      createdAt: now,
      updatedAt: now,
      published: true,
    },
  },
  {
    id: 'page-about',
    title: 'About',
    slug: '/about',
    order: 1,
    sections: mockSections.filter((s) => s.pageId === 'page-about'),
    metadata: {
      createdAt: now,
      updatedAt: now,
      published: true,
    },
  },
  {
    id: 'page-contact',
    title: 'Contact',
    slug: '/contact',
    order: 2,
    sections: mockSections.filter((s) => s.pageId === 'page-contact'),
    metadata: {
      createdAt: now,
      updatedAt: now,
      published: false,
    },
  },
]

export const mockSite: Site = {
  id: 'site-1',
  name: 'My PMC Site',
  logoUrl: null,
  pages: mockPages,
  metadata: {
    createdAt: now,
    updatedAt: now,
  },
}

// Helper function to get page by ID
export function getPageById(pageId: string): Page | undefined {
  return mockSite.pages.find((p) => p.id === pageId)
}

// Helper function to get section by ID
export function getSectionById(sectionId: string): Section | undefined {
  for (const page of mockSite.pages) {
    const section = page.sections.find((s) => s.id === sectionId)
    if (section) return section
  }
  return undefined
}
