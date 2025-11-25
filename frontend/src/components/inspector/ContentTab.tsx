/**
 * ContentTab - Content Editing Panel
 * Schema-driven field editing based on section type
 */

import React from 'react'
import { useContentStore } from '../../store/contentStore'
import { TextField } from '../ui/TextField'
import { TextareaField } from '../ui/TextareaField'
import { ImageField } from '../ui/ImageField'
import { RichTextEditor } from '../ui/RichTextEditor'
import type { ImageValue } from '../ui/ImageField'
import './ContentTab.css'

interface ContentTabProps {
  selectedSectionId: string | null
}

export const ContentTab: React.FC<ContentTabProps> = ({ selectedSectionId }) => {
  const getSectionById = useContentStore((state) => state.getSectionById)
  const updateSectionField = useContentStore((state) => state.updateSectionField)

  const selectedSection = selectedSectionId ? getSectionById(selectedSectionId) : null

  if (!selectedSection) {
    return (
      <div className="content-tab__placeholder">
        <p>Select a section to edit its content.</p>
        <p className="content-tab__hint">
          Click on any section in the canvas or page sidebar to start editing.
        </p>
      </div>
    )
  }

  const fields = selectedSection.fields

  // Render fields based on section type
  switch (selectedSection.type) {
    case 'hero':
      return (
        <div className="content-tab__form">
          <div className="content-tab__section-info">
            <h3 className="content-tab__section-title">{selectedSection.title}</h3>
            <span className="content-tab__section-type">{selectedSection.type}</span>
          </div>

          <TextField
            id="hero-heading"
            label="Heading"
            value={fields.heading as string}
            onChange={(value) => updateSectionField(selectedSection.id, 'heading', value)}
            placeholder="Enter hero heading"
            maxLength={100}
            required
          />

          <TextField
            id="hero-subheading"
            label="Subheading"
            value={fields.subheading as string}
            onChange={(value) => updateSectionField(selectedSection.id, 'subheading', value)}
            placeholder="Enter subheading"
            maxLength={200}
          />

          <ImageField
            id="hero-background-image"
            label="Background Image"
            value={(fields.backgroundImage as ImageValue) || { url: '', alt: '' }}
            onChange={(value) => updateSectionField(selectedSection.id, 'backgroundImage', value)}
            maxSizeKB={2048}
          />

          <TextField
            id="hero-cta-text"
            label="Call to Action Text"
            value={fields.ctaText as string}
            onChange={(value) => updateSectionField(selectedSection.id, 'ctaText', value)}
            placeholder="Get Started"
            maxLength={50}
          />

          <TextField
            id="hero-cta-url"
            label="Call to Action URL"
            value={fields.ctaUrl as string}
            onChange={(value) => updateSectionField(selectedSection.id, 'ctaUrl', value)}
            placeholder="https://example.com"
          />
        </div>
      )

    case 'features':
      return (
        <div className="content-tab__form">
          <div className="content-tab__section-info">
            <h3 className="content-tab__section-title">{selectedSection.title}</h3>
            <span className="content-tab__section-type">{selectedSection.type}</span>
          </div>

          <TextField
            id="features-heading"
            label="Section Heading"
            value={fields.heading as string}
            onChange={(value) => updateSectionField(selectedSection.id, 'heading', value)}
            placeholder="Key Features"
            maxLength={100}
          />

          <div className="content-tab__hint">
            <p>Feature items are managed in Logic & Data tab.</p>
          </div>
        </div>
      )

    case 'cta':
      return (
        <div className="content-tab__form">
          <div className="content-tab__section-info">
            <h3 className="content-tab__section-title">{selectedSection.title}</h3>
            <span className="content-tab__section-type">{selectedSection.type}</span>
          </div>

          <TextField
            id="cta-heading"
            label="Heading"
            value={fields.heading as string}
            onChange={(value) => updateSectionField(selectedSection.id, 'heading', value)}
            placeholder="Ready to get started?"
            maxLength={100}
          />

          <TextField
            id="cta-button-text"
            label="Button Text"
            value={fields.buttonText as string}
            onChange={(value) => updateSectionField(selectedSection.id, 'buttonText', value)}
            placeholder="Start Building"
            maxLength={50}
          />

          <TextField
            id="cta-button-url"
            label="Button URL"
            value={fields.buttonUrl as string}
            onChange={(value) => updateSectionField(selectedSection.id, 'buttonUrl', value)}
            placeholder="https://example.com"
          />
        </div>
      )

    case 'content':
      return (
        <div className="content-tab__form">
          <div className="content-tab__section-info">
            <h3 className="content-tab__section-title">{selectedSection.title}</h3>
            <span className="content-tab__section-type">{selectedSection.type}</span>
          </div>

          <TextField
            id="content-heading"
            label="Heading"
            value={fields.heading as string}
            onChange={(value) => updateSectionField(selectedSection.id, 'heading', value)}
            placeholder="Section Heading"
            maxLength={100}
          />

          <RichTextEditor
            id="content-body"
            label="Content"
            value={fields.content as string}
            onChange={(value) => updateSectionField(selectedSection.id, 'content', value)}
            placeholder="Enter your content here..."
            maxLength={2000}
          />
        </div>
      )

    case 'form':
      return (
        <div className="content-tab__form">
          <div className="content-tab__section-info">
            <h3 className="content-tab__section-title">{selectedSection.title}</h3>
            <span className="content-tab__section-type">{selectedSection.type}</span>
          </div>

          <TextField
            id="form-heading"
            label="Form Heading"
            value={fields.heading as string}
            onChange={(value) => updateSectionField(selectedSection.id, 'heading', value)}
            placeholder="Get in Touch"
            maxLength={100}
          />

          <TextField
            id="form-submit-text"
            label="Submit Button Text"
            value={fields.submitText as string}
            onChange={(value) => updateSectionField(selectedSection.id, 'submitText', value)}
            placeholder="Send Message"
            maxLength={50}
          />

          <div className="content-tab__hint">
            <p>Form fields are managed in Logic & Data tab.</p>
          </div>
        </div>
      )

    default:
      return (
        <div className="content-tab__placeholder">
          <p>No editor available for section type: {selectedSection.type}</p>
          <pre className="content-tab__debug">{JSON.stringify(fields, null, 2)}</pre>
        </div>
      )
  }
}
