/**
 * UI Components Barrel Export
 *
 * Centralized export for all reusable UI components.
 * Import components from this file for clean, consistent imports.
 *
 * @example
 * ```tsx
 * import { Button, Card, Badge, Modal } from '@/components/ui';
 * ```
 *
 * @module components/ui
 */

// Existing components
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Icon } from './Icon';
export type { IconProps } from './Icon';

export { TextField } from './TextField';
export type { TextFieldProps } from './TextField';

export { TextareaField } from './TextareaField';
export type { TextareaFieldProps } from './TextareaField';

export { SelectField } from './SelectField';
export type { SelectFieldProps } from './SelectField';

export { ImageField } from './ImageField';
export type { ImageFieldProps } from './ImageField';

export { RichTextEditor } from './RichTextEditor';
export type { RichTextEditorProps } from './RichTextEditor';

export { Tab } from './Tab';
export type { TabProps } from './Tab';

export { Toast } from './Toast';
export type { ToastProps, ToastType } from './Toast';

export { ToastContainer } from './ToastContainer';

export { SkipLinks } from './SkipLinks';

export { ResizeHandle } from './ResizeHandle';
export type { ResizeHandleProps } from './ResizeHandle';

// New Phase 1 & 2 components
export { Card } from './Card';
export type { CardProps } from './Card';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export { Panel } from './Panel';
export type { PanelProps } from './Panel';

export { Stepper } from './Stepper';
export type { StepperProps, Step, StepStatus } from './Stepper';

// Feedback components
export { LoadingState } from '../feedback/LoadingState';
export type { LoadingStateProps } from '../feedback/LoadingState';

export { EmptyState } from '../feedback/EmptyState';
export type { EmptyStateProps } from '../feedback/EmptyState';

export { ErrorState } from '../feedback/ErrorState';
export type { ErrorStateProps } from '../feedback/ErrorState';
