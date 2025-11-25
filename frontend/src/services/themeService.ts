// Theme Service - Theme CRUD operations and PackMyCode sync
// Feature: 006-themes-and-deploy
// Updated: 4 demo themes with failure simulation (cache disabled)

import type { Theme, PurchasedMetadata, UploadedMetadata, UploadSession } from '../types';
import { validateThemeFile } from '../utils/themeValidator';

const CACHE_KEY_PREFIX = 'pmc_purchased_themes_';
const CACHE_TIMESTAMP_PREFIX = 'pmc_theme_cache_timestamp_';

/**
 * Mock PackMyCode API sync service
 * In production, this would call the actual PackMyCode API
 */
export class ThemeService {
  /**
   * Fetch purchased themes from PackMyCode API (mock implementation)
   * Caches results in localStorage
   *
   * @param userId - User ID to fetch themes for
   * @param forceRefresh - Skip cache and fetch fresh data
   * @returns Array of purchased themes
   */
  async fetchPurchasedThemes(userId: string, siteId: string, forceRefresh = false): Promise<Theme[]> {
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;
    const timestampKey = `${CACHE_TIMESTAMP_PREFIX}${userId}`;

    // Check cache if not forcing refresh
    // DISABLED FOR DEMO - always fetch fresh to ensure theme-fail-demo ID is consistent
    if (false && !forceRefresh) {
      const cached = localStorage.getItem(cacheKey);
      const timestamp = localStorage.getItem(timestampKey);

      if (cached && timestamp) {
        const cacheAge = Date.now() - parseInt(timestamp, 10);
        const ONE_HOUR = 60 * 60 * 1000;

        // Use cache if less than 1 hour old
        if (cacheAge < ONE_HOUR) {
          return JSON.parse(cached);
        }
      }
    }

    // Mock API call - simulate network delay
    await this.sleep(800);

    // Mock purchased themes data - 4 demo themes
    const mockPurchasedThemes: Theme[] = [
      {
        id: 'theme-saas-pro', // Fixed ID for consistent behavior
        name: 'SaaS Pro Theme',
        description: 'Modern SaaS landing page with pricing tables and feature sections',
        version: '1.2.0',
        framework: 'next.js',
        thumbnailUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%234F46E5" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="white" font-size="24"%3ESaaS Pro%3C/text%3E%3C/svg%3E',
        tags: ['saas', 'landing'],
        source: 'purchased',
        sourceMetadata: {
          purchaseId: 'pmc-' + Date.now(),
          purchasedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          downloadUrl: 'https://cdn.packmycode.com/themes/saas-pro.zip',
          marketplaceUrl: 'https://packmycode.com/themes/saas-pro',
        } as PurchasedMetadata,
        deploymentStatus: 'available',
        siteId,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'theme-fail-demo', // Special ID to trigger failure
        name: 'E-commerce Starter',
        description: 'Full-featured e-commerce template with shopping cart',
        version: '1.0.0',
        framework: 'next.js',
        thumbnailUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23EF4444" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="white" font-size="24"%3EE-commerce%3C/text%3E%3C/svg%3E',
        tags: ['e-commerce', 'shop'],
        source: 'purchased',
        sourceMetadata: {
          purchaseId: 'pmc-' + (Date.now() - 2000),
          purchasedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          downloadUrl: 'https://cdn.packmycode.com/themes/ecommerce-starter.zip',
          marketplaceUrl: 'https://packmycode.com/themes/ecommerce-starter',
        } as PurchasedMetadata,
        deploymentStatus: 'available',
        siteId,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'theme-portfolio', // Fixed ID for consistent behavior
        name: 'Portfolio Showcase',
        description: 'Clean portfolio template for designers and developers',
        version: '2.0.1',
        framework: 'gatsby',
        thumbnailUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%2310B981" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="white" font-size="24"%3EPortfolio%3C/text%3E%3C/svg%3E',
        tags: ['portfolio', 'creative'],
        source: 'purchased',
        sourceMetadata: {
          purchaseId: 'pmc-' + (Date.now() - 1000),
          purchasedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          downloadUrl: 'https://cdn.packmycode.com/themes/portfolio-showcase.zip',
          marketplaceUrl: 'https://packmycode.com/themes/portfolio-showcase',
        } as PurchasedMetadata,
        deploymentStatus: 'available',
        siteId,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'theme-blog', // Fixed ID for consistent behavior
        name: 'Blog Minimal',
        description: 'Minimalist blog theme with focus on typography',
        version: '1.5.0',
        framework: 'gatsby',
        thumbnailUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23F59E0B" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="white" font-size="24"%3EBlog%3C/text%3E%3C/svg%3E',
        tags: ['blog', 'minimal'],
        source: 'purchased',
        sourceMetadata: {
          purchaseId: 'pmc-' + (Date.now() - 3000),
          purchasedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          downloadUrl: 'https://cdn.packmycode.com/themes/blog-minimal.zip',
          marketplaceUrl: 'https://packmycode.com/themes/blog-minimal',
        } as PurchasedMetadata,
        deploymentStatus: 'available',
        siteId,
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Skip caching for demo - ensures consistent theme IDs across page reloads
    // localStorage.setItem(cacheKey, JSON.stringify(mockPurchasedThemes));
    // localStorage.setItem(timestampKey, Date.now().toString());

    return mockPurchasedThemes;
  }

  /**
   * Create theme from uploaded file
   *
   * @param uploadSession - Upload session with validated file
   * @param siteId - Site ID to associate theme with
   * @param userId - User ID who uploaded the theme
   * @returns Created theme entity
   */
  async createThemeFromUpload(uploadSession: UploadSession, siteId: string, userId: string): Promise<Theme> {
    const { manifestData, fileName, fileSizeBytes, id: uploadSessionId } = uploadSession;

    if (!manifestData) {
      throw new Error('Upload session missing manifest data');
    }

    const theme: Theme = {
      id: crypto.randomUUID(),
      name: manifestData.name,
      description: manifestData.description,
      version: manifestData.version,
      framework: manifestData.framework,
      tags: [], // Could extract from manifest if desired
      source: 'uploaded',
      sourceMetadata: {
        uploadSessionId,
        originalFilename: fileName,
        fileSizeBytes,
        storagePath: `indexeddb://themes/${uploadSessionId}`, // Mock storage path
      } as UploadedMetadata,
      deploymentStatus: 'available',
      siteId,
      uploadedBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return theme;
  }

  /**
   * Process uploaded theme file
   * Validates file and creates upload session
   *
   * @param file - Uploaded .zip file
   * @param siteId - Site ID
   * @param userId - User ID
   * @param onProgress - Progress callback
   * @returns Upload session
   */
  async processUpload(
    file: File,
    siteId: string,
    userId: string,
    onProgress?: (percent: number) => void
  ): Promise<UploadSession> {
    const session: UploadSession = {
      id: crypto.randomUUID(),
      siteId,
      userId,
      fileName: file.name,
      fileSizeBytes: file.size,
      fileReference: file,
      progressPercent: 0,
      validationState: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Simulate upload progress
    onProgress?.(0);
    await this.sleep(500);
    onProgress?.(50);

    // Validate the file
    session.validationState = 'validating';
    const validationResult = await validateThemeFile(file);

    onProgress?.(100);

    if (validationResult.valid) {
      session.validationState = 'success';
      session.manifestData = validationResult.manifest;
      session.completedAt = new Date().toISOString();
    } else {
      session.validationState = 'error';
      session.errorMessage = validationResult.error;
      session.completedAt = new Date().toISOString();
    }

    return session;
  }

  /**
   * Delete theme
   *
   * @param themeId - Theme ID to delete
   */
  async deleteTheme(themeId: string): Promise<void> {
    // In production, this would call DELETE /api/themes/{themeId}
    // For MVP, just simulate API call
    await this.sleep(300);
    // Actual deletion handled by store
  }

  /**
   * Utility: Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const themeService = new ThemeService();
