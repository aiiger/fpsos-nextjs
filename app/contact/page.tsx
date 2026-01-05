'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations'

interface FormData {
  name: string
  email: string
  discord?: string
  phone?: string
  serviceType: 'quick-fix' | 'full-tune' | 'extreme' | 'diagnosis'
  systemInfo: string
  issues: string
  budget?: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    discord: '',
    phone: '',
    serviceType: 'quick-fix',
    systemInfo: '',
    issues: '',
    budget: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Send to API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      toast.success('Thanks for reaching out! We\'ll contact you within 24 hours.', {
        duration: 4000,
        position: 'bottom-right',
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(48, 209, 88, 0.3)',
          borderRadius: '8px'
        }
      })

      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        discord: '',
        phone: '',
        serviceType: 'quick-fix',
        systemInfo: '',
        issues: '',
        budget: ''
      })

      // Reset after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred'
      toast.error(errorMsg, {
        duration: 4000,
        position: 'bottom-right',
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(255, 69, 58, 0.3)',
          borderRadius: '8px'
        }
      })
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const serviceOptions = [
    { value: 'quick-fix', label: 'Quick Remote Fix (AED 199)', color: 'var(--quick-fix)' },
    { value: 'full-tune', label: 'Full System Tune-Up (AED 399)', color: 'var(--full-tune)' },
    { value: 'extreme', label: 'Extreme BIOSPRIME (AED 699)', color: 'var(--extreme)' },
    { value: 'diagnosis', label: 'Free Diagnosis Only', color: 'var(--fpsos-blue)' }
  ]

  return (
    <>
      <section className="section" style={{
        paddingTop: 'calc(64px + var(--spacing-10))',
        paddingBottom: 'var(--spacing-12)',
        minHeight: '100vh'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-10)'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: 'var(--spacing-2) var(--spacing-4)',
              background: 'rgba(232, 153, 0, 0.08)',
              border: '1px solid rgba(232, 153, 0, 0.15)',
              borderRadius: 'var(--radius-full)',
              marginBottom: 'var(--spacing-4)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--fpsos-orange)',
              letterSpacing: '-0.008em'
            }}>
              Ready to optimize?
            </div>

            <h1 style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 'var(--spacing-3)'
            }}>
              Book Your <span style={{
                background: 'linear-gradient(135deg, var(--fpsos-orange) 0%, var(--fpsos-purple) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Session</span>
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              letterSpacing: '-0.011em'
            }}>
              Tell us about your system and let's get you the best CS2 performance possible.
              <br />
              We'll respond within 24 hours with a custom proposal.
            </p>
          </div>

          {/* Form Container */}
          <div style={{
            background: 'rgba(26, 26, 26, 0.85)',
            backdropFilter: 'blur(20px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-8)',
            marginBottom: 'var(--spacing-10)'
          }}>
            {submitted ? (
              <div style={{
                textAlign: 'center',
                padding: 'var(--spacing-6)',
                animation: 'fade-in 0.4s var(--ease-decelerate)'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: 'var(--spacing-4)'
                }}>
                  ✓
                </div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: 'var(--spacing-2)',
                  color: 'var(--fpsos-orange)'
                }}>
                  Booking Received!
                </h2>
                <p style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: 'var(--spacing-4)'
                }}>
                  Thanks for choosing FPSOS. We'll review your request and send you a personalized quote within 24 hours.
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-tertiary)'
                }}>
                  Check your email for a confirmation message.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{
                    background: 'rgba(255, 67, 58, 0.1)',
                    border: '1px solid rgba(255, 67, 58, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--spacing-3)',
                    marginBottom: 'var(--spacing-6)',
                    color: '#FF453A',
                    fontSize: '0.875rem'
                  }}>
                    {error}
                  </div>
                )}

                {/* Row 1: Name & Email */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: 'var(--spacing-4)',
                  marginBottom: 'var(--spacing-6)'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: 'var(--spacing-2)',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)'
                    }}>
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-3)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        transition: 'all 0.2s var(--ease-standard)',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                        e.currentTarget.style.borderColor = 'rgba(232, 153, 0, 0.3)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: 'var(--spacing-2)',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)'
                    }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-3)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        transition: 'all 0.2s var(--ease-standard)',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                        e.currentTarget.style.borderColor = 'rgba(232, 153, 0, 0.3)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      }}
                    />
                  </div>
                </div>

                {/* Row 2: Discord & Phone */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: 'var(--spacing-4)',
                  marginBottom: 'var(--spacing-6)'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: 'var(--spacing-2)',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)'
                    }}>
                      Discord Handle (optional)
                    </label>
                    <input
                      type="text"
                      name="discord"
                      placeholder="your#1234"
                      value={formData.discord}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-3)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        transition: 'all 0.2s var(--ease-standard)',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                        e.currentTarget.style.borderColor = 'rgba(232, 153, 0, 0.3)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: 'var(--spacing-2)',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)'
                    }}>
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+971 50 123 4567"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-3)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        transition: 'all 0.2s var(--ease-standard)',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                        e.currentTarget.style.borderColor = 'rgba(232, 153, 0, 0.3)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      }}
                    />
                  </div>
                </div>

                {/* Service Type */}
                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-3)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)'
                  }}>
                    Service Type *
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 'var(--spacing-3)'
                  }}>
                    {serviceOptions.map(option => (
                      <label
                        key={option.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: 'var(--spacing-3)',
                          background: formData.serviceType === option.value
                            ? `rgba(${option.value === 'quick-fix' ? '0, 204, 188' : option.value === 'full-tune' ? '255, 90, 0' : option.value === 'extreme' ? '254, 238, 0' : '100, 210, 255'}, 0.1)`
                            : 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${formData.serviceType === option.value ? option.color : 'rgba(255, 255, 255, 0.08)'}`,
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          transition: 'all 0.2s var(--ease-standard)'
                        }}
                        onMouseEnter={(e) => {
                          if (formData.serviceType !== option.value) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                            e.currentTarget.style.borderColor = 'rgba(232, 153, 0, 0.2)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData.serviceType !== option.value) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                          }
                        }}
                      >
                        <input
                          type="radio"
                          name="serviceType"
                          value={option.value}
                          checked={formData.serviceType === option.value}
                          onChange={handleChange}
                          style={{
                            marginRight: 'var(--spacing-2)',
                            width: '16px',
                            height: '16px',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* System Info */}
                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-2)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)'
                  }}>
                    System Information *
                  </label>
                  <textarea
                    name="systemInfo"
                    placeholder="e.g., CPU: Ryzen 9 9800X3D, RAM: 32GB DDR5-6000, GPU: RTX 4090, Monitor: 360Hz"
                    value={formData.systemInfo}
                    onChange={handleChange}
                    required
                    rows={3}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-3)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      fontSize: '1rem',
                      transition: 'all 0.2s var(--ease-standard)',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.borderColor = 'rgba(232, 153, 0, 0.3)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    }}
                  />
                </div>

                {/* Issues/Goals */}
                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-2)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)'
                  }}>
                    What issues are you experiencing? *
                  </label>
                  <textarea
                    name="issues"
                    placeholder="e.g., Frame drops in matches, stuttering, high frame time variance, DPC latency spikes"
                    value={formData.issues}
                    onChange={handleChange}
                    required
                    rows={3}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-3)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      fontSize: '1rem',
                      transition: 'all 0.2s var(--ease-standard)',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.borderColor = 'rgba(232, 153, 0, 0.3)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    }}
                  />
                </div>

                {/* Budget */}
                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-2)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)'
                  }}>
                    Budget (optional)
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-3)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      fontSize: '1rem',
                      transition: 'all 0.2s var(--ease-standard)',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.borderColor = 'rgba(232, 153, 0, 0.3)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <option value="">Select a budget range</option>
                    <option value="under-200">Under AED 200</option>
                    <option value="200-400">AED 200 - 400</option>
                    <option value="400-700">AED 400 - 700</option>
                    <option value="700+">AED 700+</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    background: loading
                      ? 'rgba(232, 153, 0, 0.5)'
                      : 'linear-gradient(135deg, var(--fpsos-purple), var(--fpsos-orange))',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s var(--ease-standard)',
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'scale(0.98)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit Booking Request'}
                </button>

                <p style={{
                  marginTop: 'var(--spacing-4)',
                  fontSize: '0.75rem',
                  color: 'var(--text-tertiary)',
                  textAlign: 'center'
                }}>
                  We respect your privacy. Your information is only used for providing optimization services.
                </p>
              </form>
            )}
          </div>

          {/* Info Boxes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--spacing-4)'
          }}>
            <div style={{
              background: 'rgba(26, 26, 26, 0.5)',
              border: '1px solid rgba(232, 153, 0, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-6)'
            }}>
              <div style={{
                fontSize: '1.5rem',
                marginBottom: 'var(--spacing-2)'
              }}>
                ⏱️
              </div>
              <h3 style={{
                fontWeight: 600,
                marginBottom: 'var(--spacing-2)',
                fontSize: '1rem'
              }}>
                Quick Response
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                We respond to all inquiries within 24 hours with a personalized quote.
              </p>
            </div>

            <div style={{
              background: 'rgba(26, 26, 26, 0.5)',
              border: '1px solid rgba(232, 153, 0, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-6)'
            }}>
              <div style={{
                fontSize: '1.5rem',
                marginBottom: 'var(--spacing-2)'
              }}>
                🔒
              </div>
              <h3 style={{
                fontWeight: 600,
                marginBottom: 'var(--spacing-2)',
                fontSize: '1rem'
              }}>
                100% Remote
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                Complete optimization from anywhere. No on-site visits required.
              </p>
            </div>

            <div style={{
              background: 'rgba(26, 26, 26, 0.5)',
              border: '1px solid rgba(232, 153, 0, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-6)'
            }}>
              <div style={{
                fontSize: '1.5rem',
                marginBottom: 'var(--spacing-2)'
              }}>
                💯
              </div>
              <h3 style={{
                fontWeight: 600,
                marginBottom: 'var(--spacing-2)',
                fontSize: '1rem'
              }}>
                Money-Back Guarantee
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                Not satisfied? Full refund within 7 days, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
