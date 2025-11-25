/**
 * Brand Basics Section (Section 1)
 * Feature: 005-basic-ai-training
 * User Story 1 (P1): Initial Training Setup
 */

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTrainingStore } from '../../../stores/trainingStore'
import type { BrandBasics } from '../../../types/training'
import './SectionStyles.css'

const INDUSTRY_OPTIONS = [
  { value: '', label: 'Select industry...' },
  { value: 'SaaS', label: 'SaaS / Software' },
  { value: 'Agency', label: 'Agency / Services' },
  { value: 'Clinic', label: 'Clinic / Healthcare' },
  { value: 'E-commerce', label: 'E-commerce / Retail' },
  { value: 'Restaurant', label: 'Restaurant / Food & Beverage' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Consulting', label: 'Consulting' },
  { value: 'Education', label: 'Education / Training' },
  { value: 'Other', label: 'Other (specify below)' }
]

export const BrandBasicsSection: React.FC = () => {
  const { currentProfile, updateSection } = useTrainingStore()
  const data = currentProfile?.section1_brandBasics

  const {
    register,
    watch,
    formState: { errors }
  } = useForm<BrandBasics>({
    defaultValues: data,
    mode: 'onBlur'
  })

  // Watch all fields and update store on change
  useEffect(() => {
    const subscription = watch((value) => {
      updateSection('section1_brandBasics', value as Partial<BrandBasics>)
    })
    return () => subscription.unsubscribe()
  }, [watch, updateSection])

  return (
    <section id="brand-basics" className="training-section">
      <div className="section-header">
        <h2>Brand & Business Basics</h2>
        <p className="section-description">
          Essential information about your brand and business that helps AI generate
          on-brand content
        </p>
      </div>

      <div className="form-grid">
        {/* Brand Name - Required */}
        <div className="form-field">
          <label htmlFor="brandName">
            Brand Name <span className="required">*</span>
          </label>
          <input
            id="brandName"
            type="text"
            {...register('brandName', {
              required: 'Brand name is required',
              maxLength: {
                value: 100,
                message: 'Maximum 100 characters'
              }
            })}
            placeholder="Acme Solutions"
            className={errors.brandName ? 'error' : ''}
          />
          {errors.brandName && (
            <span className="error-message">{errors.brandName.message}</span>
          )}
          <span className="helper-text">
            Your company or site name (e.g., "Acme Corp", "Jane's Bakery")
          </span>
        </div>

        {/* Tagline - Optional */}
        <div className="form-field">
          <label htmlFor="tagline">Tagline / Slogan</label>
          <input
            id="tagline"
            type="text"
            {...register('tagline', {
              maxLength: {
                value: 150,
                message: 'Maximum 150 characters'
              }
            })}
            placeholder="Building the future, one innovation at a time"
            className={errors.tagline ? 'error' : ''}
          />
          {errors.tagline && (
            <span className="error-message">{errors.tagline.message}</span>
          )}
          <span className="helper-text">
            Optional: A catchy phrase that captures your brand essence
          </span>
        </div>

        {/* Elevator Pitch - Required */}
        <div className="form-field form-field--full">
          <label htmlFor="elevatorPitch">
            Elevator Pitch <span className="required">*</span>
          </label>
          <input
            id="elevatorPitch"
            type="text"
            {...register('elevatorPitch', {
              required: 'Elevator pitch is required',
              minLength: {
                value: 10,
                message: 'Minimum 10 characters'
              },
              maxLength: {
                value: 250,
                message: 'Maximum 250 characters'
              }
            })}
            placeholder="We help businesses automate workflows with AI-powered tools"
            className={errors.elevatorPitch ? 'error' : ''}
          />
          {errors.elevatorPitch && (
            <span className="error-message">{errors.elevatorPitch.message}</span>
          )}
          <span className="helper-text">
            One sentence describing what you do and who you help (10-250 characters)
          </span>
        </div>

        {/* Description - Required */}
        <div className="form-field form-field--full">
          <label htmlFor="description">
            Business Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description', {
              required: 'Business description is required',
              minLength: {
                value: 50,
                message: 'Minimum 50 characters'
              },
              maxLength: {
                value: 500,
                message: 'Maximum 500 characters'
              }
            })}
            placeholder="We are a SaaS company that provides AI-powered automation tools for small and medium businesses. Our platform helps teams streamline workflows, reduce manual tasks, and increase productivity through intelligent automation."
            className={errors.description ? 'error' : ''}
          />
          {errors.description && (
            <span className="error-message">{errors.description.message}</span>
          )}
          <span className="helper-text">
            2-3 sentences about your business, services, and target audience (50-500
            characters)
          </span>
        </div>

        {/* Industry - Required */}
        <div className="form-field">
          <label htmlFor="industry">
            Industry / Category <span className="required">*</span>
          </label>
          <select
            id="industry"
            {...register('industry', {
              required: 'Please select your industry'
            })}
            className={errors.industry ? 'error' : ''}
          >
            {INDUSTRY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.industry && (
            <span className="error-message">{errors.industry.message}</span>
          )}
          <span className="helper-text">
            Select the industry that best describes your business
          </span>
        </div>

        {/* Location - Optional */}
        <div className="form-field">
          <label htmlFor="location">Location / Service Area</label>
          <input
            id="location"
            type="text"
            {...register('location', {
              maxLength: {
                value: 100,
                message: 'Maximum 100 characters'
              }
            })}
            placeholder="San Francisco, CA or Global"
            className={errors.location ? 'error' : ''}
          />
          {errors.location && (
            <span className="error-message">{errors.location.message}</span>
          )}
          <span className="helper-text">
            City, country, or "Global" if you serve customers worldwide
          </span>
        </div>
      </div>
    </section>
  )
}
