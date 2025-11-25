/**
 * Tab UI Primitive - Accessible tab component using Radix UI
 * Implements WCAG AA keyboard navigation patterns
 */

import React from 'react'
import * as RadixTabs from '@radix-ui/react-tabs'
import './Tab.css'

export interface Tab {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
  priority?: 'low' | 'normal'
}

export interface TabsProps {
  tabs: Tab[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultValue,
  value,
  onValueChange,
  orientation = 'horizontal',
  className = '',
}) => {
  return (
    <RadixTabs.Root
      className={`tabs ${className}`}
      defaultValue={defaultValue || tabs[0]?.id}
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
    >
      <RadixTabs.List className="tabs__list" aria-label="Tabs">
        {tabs.map((tab) => (
          <RadixTabs.Trigger
            key={tab.id}
            className="tabs__trigger"
            value={tab.id}
            disabled={tab.disabled}
            data-priority={tab.priority}
          >
            {tab.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {tabs.map((tab) => (
        <RadixTabs.Content key={tab.id} className="tabs__content" value={tab.id}>
          {tab.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  )
}
