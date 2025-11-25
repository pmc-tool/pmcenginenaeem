/**
 * Contact Section (Section 5)
 * Feature: 005-basic-ai-training
 * User Story 5 (P1): Contact Information Setup
 */

import React, { useEffect } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useTrainingStore } from '../../../stores/trainingStore'
import { validators } from '../../../utils/validation'
import type { Contact, SocialLink, ContactMethod } from '../../../types/training'
import './SectionStyles.css'
import './ContactSection.css'

const SOCIAL_PLATFORMS = [
  { value: 'facebook', label: 'Facebook', icon: 'facebook' },
  { value: 'twitter', label: 'Twitter / X', icon: 'twitter' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { value: 'instagram', label: 'Instagram', icon: 'instagram' },
  { value: 'youtube', label: 'YouTube', icon: 'youtube' },
  { value: 'tiktok', label: 'TikTok', icon: 'tiktok' },
  { value: 'other', label: 'Other', icon: 'link' },
]

const CONTACT_METHODS: { value: ContactMethod; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'form', label: 'Contact Form' },
  { value: 'any', label: 'Any Method' },
]

export const ContactSection: React.FC = () => {
  const { currentProfile, updateSection } = useTrainingStore()
  const data = currentProfile?.section5_contact

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<Contact>({
    defaultValues: data,
    mode: 'onBlur',
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  })

  // Watch all fields and update store on change
  useEffect(() => {
    const subscription = watch((value) => {
      updateSection('section5_contact', value as Partial<Contact>)
    })
    return () => subscription.unsubscribe()
  }, [watch, updateSection])

  const addSocialLink = () => {
    const newLink: SocialLink = {
      platform: 'facebook',
      url: '',
    }
    append(newLink)
  }

  return (
    <section id="contact" className="training-section">
      <div className="section-header">
        <h2>Contact Information</h2>
        <p className="section-description">
          Provide contact details so AI can include accurate ways for customers to reach you
        </p>
      </div>

      <div className="form-grid">
        {/* Email */}
        <div className="form-field">
          <label htmlFor="email">
            Email Address <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              validate: (value) =>
                validators.email(value) || 'Please enter a valid email address',
            })}
            placeholder="hello@example.com"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email.message}</span>}
          <span className="helper-text">Primary contact email for your business</span>
        </div>

        {/* Phone */}
        <div className="form-field">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            {...register('phone', {
              validate: (value) =>
                !value || validators.phone(value) || 'Please enter a valid phone number',
            })}
            placeholder="+1 (555) 123-4567"
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone.message}</span>}
          <span className="helper-text">Optional: Include if you accept phone inquiries</span>
        </div>

        {/* Address */}
        <div className="form-field form-field--full">
          <label htmlFor="address">Physical Address</label>
          <textarea
            id="address"
            rows={2}
            {...register('address', {
              maxLength: {
                value: 200,
                message: 'Maximum 200 characters',
              },
            })}
            placeholder="123 Main Street, Suite 100, San Francisco, CA 94105"
            className={errors.address ? 'error' : ''}
          />
          {errors.address && <span className="error-message">{errors.address.message}</span>}
          <span className="helper-text">
            Optional: Full address if you have a physical location
          </span>
        </div>

        {/* Preferred Contact Method */}
        <div className="form-field">
          <label htmlFor="preferredMethod">Preferred Contact Method</label>
          <select
            id="preferredMethod"
            {...register('preferredMethod')}
            className={errors.preferredMethod ? 'error' : ''}
          >
            {CONTACT_METHODS.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
          {errors.preferredMethod && (
            <span className="error-message">{errors.preferredMethod.message}</span>
          )}
          <span className="helper-text">How do you prefer customers reach out?</span>
        </div>

        {/* Social Links */}
        <div className="form-field form-field--full">
          <div className="social-links-header">
            <label>Social Media Links</label>
            <button
              type="button"
              onClick={addSocialLink}
              className="btn-add-social"
              disabled={fields.length >= 6}
            >
              + Add Social Link
            </button>
          </div>

          {fields.length === 0 ? (
            <div className="social-links-empty">
              <p>No social media links added yet.</p>
              <p className="helper-text">
                Click "+ Add Social Link" to include your social media profiles
              </p>
            </div>
          ) : (
            <div className="social-links-list">
              {fields.map((field, index) => (
                <div key={field.id} className="social-link-item">
                  <div className="social-link-fields">
                    {/* Platform Select */}
                    <div className="form-field">
                      <label htmlFor={`socialLinks.${index}.platform`}>Platform</label>
                      <select
                        id={`socialLinks.${index}.platform`}
                        {...register(`socialLinks.${index}.platform`)}
                        className={errors.socialLinks?.[index]?.platform ? 'error' : ''}
                      >
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <option key={platform.value} value={platform.value}>
                            {platform.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* URL Input */}
                    <div className="form-field" style={{ flex: 2 }}>
                      <label htmlFor={`socialLinks.${index}.url`}>Profile URL</label>
                      <input
                        id={`socialLinks.${index}.url`}
                        type="url"
                        {...register(`socialLinks.${index}.url`, {
                          required: 'URL is required',
                          validate: (value) =>
                            validators.url(value) || 'Please enter a valid URL',
                        })}
                        placeholder="https://facebook.com/yourpage"
                        className={errors.socialLinks?.[index]?.url ? 'error' : ''}
                      />
                      {errors.socialLinks?.[index]?.url && (
                        <span className="error-message">
                          {errors.socialLinks[index]?.url?.message}
                        </span>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn-remove-social"
                      aria-label={`Remove social link ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {fields.length > 0 && (
            <div className="social-links-count">
              {fields.length} / 6 social links
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
