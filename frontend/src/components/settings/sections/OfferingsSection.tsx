/**
 * Offerings Section (Section 4)
 * Feature: 005-basic-ai-training
 * User Story 4 (P1): Offerings & Services Setup
 */

import React, { useEffect } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useTrainingStore } from '../../../stores/trainingStore'
import type { Offerings, Service } from '../../../types/training'
import './SectionStyles.css'
import './OfferingsSection.css'

export const OfferingsSection: React.FC = () => {
  const { currentProfile, updateSection } = useTrainingStore()
  const data = currentProfile?.section4_offerings

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<Offerings>({
    defaultValues: data,
    mode: 'onBlur',
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services',
  })

  // Watch all fields and update store on change
  useEffect(() => {
    const subscription = watch((value) => {
      updateSection('section4_offerings', value as Partial<Offerings>)
    })
    return () => subscription.unsubscribe()
  }, [watch, updateSection])

  const addService = () => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      name: '',
      description: '',
      price: '',
    }
    append(newService)
  }

  return (
    <section id="offerings" className="training-section">
      <div className="section-header">
        <h2>Offerings & Services</h2>
        <p className="section-description">
          Define your products or services to help AI generate relevant, accurate content
          about what you offer
        </p>
      </div>

      <div className="form-grid">
        {/* Services List */}
        <div className="form-field form-field--full">
          <div className="services-header">
            <label>Services / Products</label>
            <button
              type="button"
              onClick={addService}
              className="btn-add-service"
              disabled={fields.length >= 10}
            >
              + Add Service
            </button>
          </div>

          {fields.length === 0 ? (
            <div className="services-empty">
              <p>No services added yet.</p>
              <p className="helper-text">
                Click "+ Add Service" to define what you offer (minimum 3 recommended for
                best AI results)
              </p>
            </div>
          ) : (
            <div className="services-list">
              {fields.map((field, index) => (
                <div key={field.id} className="service-card">
                  <div className="service-card-header">
                    <span className="service-number">Service {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn-remove-service"
                      aria-label={`Remove service ${index + 1}`}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="service-card-body">
                    {/* Service Name */}
                    <div className="form-field">
                      <label htmlFor={`services.${index}.name`}>
                        Service Name <span className="required">*</span>
                      </label>
                      <input
                        id={`services.${index}.name`}
                        type="text"
                        {...register(`services.${index}.name`, {
                          required: 'Service name is required',
                          maxLength: {
                            value: 100,
                            message: 'Maximum 100 characters',
                          },
                        })}
                        placeholder="e.g., Website Design, SEO Audit, Consulting"
                        className={errors.services?.[index]?.name ? 'error' : ''}
                      />
                      {errors.services?.[index]?.name && (
                        <span className="error-message">
                          {errors.services[index]?.name?.message}
                        </span>
                      )}
                    </div>

                    {/* Service Description */}
                    <div className="form-field">
                      <label htmlFor={`services.${index}.description`}>
                        Description <span className="required">*</span>
                      </label>
                      <textarea
                        id={`services.${index}.description`}
                        rows={3}
                        {...register(`services.${index}.description`, {
                          required: 'Description is required',
                          minLength: {
                            value: 20,
                            message: 'Minimum 20 characters',
                          },
                          maxLength: {
                            value: 300,
                            message: 'Maximum 300 characters',
                          },
                        })}
                        placeholder="Brief description of what this service includes and its benefits"
                        className={errors.services?.[index]?.description ? 'error' : ''}
                      />
                      {errors.services?.[index]?.description && (
                        <span className="error-message">
                          {errors.services[index]?.description?.message}
                        </span>
                      )}
                    </div>

                    {/* Optional Price */}
                    <div className="form-field">
                      <label htmlFor={`services.${index}.price`}>
                        Price (Optional)
                      </label>
                      <input
                        id={`services.${index}.price`}
                        type="text"
                        {...register(`services.${index}.price`, {
                          maxLength: {
                            value: 50,
                            message: 'Maximum 50 characters',
                          },
                        })}
                        placeholder="e.g., $999, Starting at $500, Contact for quote"
                        className={errors.services?.[index]?.price ? 'error' : ''}
                      />
                      {errors.services?.[index]?.price && (
                        <span className="error-message">
                          {errors.services[index]?.price?.message}
                        </span>
                      )}
                      <span className="helper-text">
                        Optional: Provide pricing info or leave blank
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="services-count">
            {fields.length} / 10 services ({fields.length < 3 ? 'add at least 3 for completion' : `${fields.length} added`})
          </div>
        </div>

        {/* Primary CTA */}
        <div className="form-field form-field--full">
          <label htmlFor="primaryCTA">
            Primary Call-to-Action <span className="required">*</span>
          </label>
          <input
            id="primaryCTA"
            type="text"
            {...register('primaryCTA', {
              required: 'Primary CTA is required',
              maxLength: {
                value: 50,
                message: 'Maximum 50 characters',
              },
            })}
            placeholder="e.g., Get Started, Request a Quote, Book a Demo"
            className={errors.primaryCTA ? 'error' : ''}
          />
          {errors.primaryCTA && (
            <span className="error-message">{errors.primaryCTA.message}</span>
          )}
          <span className="helper-text">
            The main action you want visitors to take (appears in AI-generated content)
          </span>
        </div>
      </div>
    </section>
  )
}
