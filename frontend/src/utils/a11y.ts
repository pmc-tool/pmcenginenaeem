/**
 * Accessibility Utilities - Constitutional WCAG AA compliance helpers
 */

/**
 * Generate unique ID for ARIA attributes
 */
let idCounter = 0
export function generateId(prefix: string = 'pmc'): string {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

/**
 * Announce to screen readers using live region
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Trap focus within a container (for modals, panels)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        lastElement?.focus()
        e.preventDefault()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        firstElement?.focus()
        e.preventDefault()
      }
    }
  }

  container.addEventListener('keydown', handleTabKey)

  // Focus first element
  firstElement?.focus()

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey)
  }
}

/**
 * Restore focus to previously focused element
 */
export function createFocusManager() {
  let previouslyFocusedElement: HTMLElement | null = null

  return {
    save: () => {
      previouslyFocusedElement = document.activeElement as HTMLElement
    },
    restore: () => {
      previouslyFocusedElement?.focus()
      previouslyFocusedElement = null
    },
  }
}

/**
 * Check if element is visible (for skip links)
 */
export function isElementVisible(element: HTMLElement): boolean {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  )
}

/**
 * Roving tabindex manager for keyboard navigation (left rail, tabs)
 */
export class RovingTabIndexManager {
  private items: HTMLElement[] = []
  private currentIndex: number = 0

  constructor(container: HTMLElement, itemSelector: string) {
    this.items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector))
    this.updateTabIndices()
  }

  private updateTabIndices() {
    this.items.forEach((item, index) => {
      item.setAttribute('tabindex', index === this.currentIndex ? '0' : '-1')
    })
  }

  public focusItem(index: number) {
    if (index >= 0 && index < this.items.length) {
      this.currentIndex = index
      this.updateTabIndices()
      this.items[index]?.focus()
    }
  }

  public focusNext() {
    this.focusItem((this.currentIndex + 1) % this.items.length)
  }

  public focusPrevious() {
    this.focusItem((this.currentIndex - 1 + this.items.length) % this.items.length)
  }

  public focusFirst() {
    this.focusItem(0)
  }

  public focusLast() {
    this.focusItem(this.items.length - 1)
  }

  public getCurrentIndex(): number {
    return this.currentIndex
  }
}
