'use client'

/**
 * Contact Form Component
 *
 * Purpose: Client-side contact form with validation, spam protection, and UX states
 * Features:
 * - Client + server validation (Zod)
 * - Turnstile spam protection (invisible mode)
 * - Honeypot field (hidden from users, visible to bots)
 * - Real-time validation feedback
 * - Character counter for message field
 * - Success/error/loading states
 *
 * Progressive enhancement: Works without JavaScript (server-side validation only)
 */

import { useState, useEffect, FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import {
  ContactFormSchema,
  ContactSubject,
  VALIDATION,
} from '@/lib/contact/validation-schema'
import { z } from 'zod'

type FormData = {
  name: string
  email: string
  subject: ContactSubject | ''
  message: string
  honeypot: string
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

type ValidationErrors = {
  [K in keyof FormData]?: string
}

export default function ContactForm() {
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '', // Hidden field for bot detection
  })

  // Form submission state
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const [turnstileLoaded, setTurnstileLoaded] = useState(false)

  // Load Turnstile script
  useEffect(() => {
    if (turnstileLoaded) return

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    script.onload = () => setTurnstileLoaded(true)
    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [turnstileLoaded])

  // Handle Turnstile callback (global function)
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Define callback function in global scope
    ;(window as any).onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token)
    }

    return () => {
      delete (window as any).onTurnstileSuccess
    }
  }, [])

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear validation error for this field
    if (validationErrors[name as keyof FormData]) {
      setValidationErrors((prev) => {
        const updated = { ...prev }
        delete updated[name as keyof FormData]
        return updated
      })
    }
  }

  // Client-side validation
  const validateForm = (): boolean => {
    try {
      ContactFormSchema.parse({
        ...formData,
        turnstileToken: turnstileToken || 'pending', // Allow pending token for client validation
      })
      setValidationErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationErrors = {}
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof FormData
          if (field !== 'turnstileToken') {
            // Don't show Turnstile errors to user (handled separately)
            errors[field] = issue.message
          }
        })
        setValidationErrors(errors)
      }
      return false
    }
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    // Check Turnstile token
    if (!turnstileToken) {
      setErrorMessage('Security verification pending. Please wait a moment and try again.')
      return
    }

    // Set loading state
    setFormState('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Success!
        setFormState('success')

        // Clear form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            honeypot: '',
          })
          setTurnstileToken('')
          // Reset Turnstile widget
          if ((window as any).turnstile) {
            try {
              ;(window as any).turnstile.reset()
            } catch (e) {
              console.warn('Failed to reset Turnstile:', e)
            }
          }
          setFormState('idle')
        }, 3000)
      } else {
        // Server error
        setFormState('error')
        setErrorMessage(data.message || 'An error occurred. Please try again.')

        // Reset Turnstile on error
        if ((window as any).turnstile) {
          try {
            ;(window as any).turnstile.reset()
          } catch (e) {
            console.warn('Failed to reset Turnstile:', e)
          }
        }
        setTurnstileToken('')
      }
    } catch (error) {
      // Network error
      setFormState('error')
      setErrorMessage('Network error. Please check your connection and try again.')
      console.error('Contact form submission error:', error)
    }
  }

  // Character counter for message
  const messageLength = formData.message.length
  const messageStatus =
    messageLength < VALIDATION.MESSAGE_MIN
      ? 'insufficient'
      : messageLength > VALIDATION.MESSAGE_MAX
        ? 'exceeded'
        : 'valid'

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      {/* Success Message */}
      {formState === 'success' && (
        <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-lg p-4 text-emerald-300">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium">Message sent successfully!</p>
              <p className="text-sm text-emerald-400 mt-1">
                I'll respond within 24-48 hours. Check your email for a confirmation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {formState === 'error' && errorMessage && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-300">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm text-red-400 mt-1">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          maxLength={VALIDATION.NAME_MAX}
          disabled={formState === 'submitting'}
          className={`w-full px-4 py-2 bg-navy-950 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
            validationErrors.name ? 'border-red-500' : 'border-navy-700'
          }`}
          placeholder="Your name"
          required
        />
        {validationErrors.name && (
          <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={formState === 'submitting'}
          className={`w-full px-4 py-2 bg-navy-950 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
            validationErrors.email ? 'border-red-500' : 'border-navy-700'
          }`}
          placeholder="your.email@example.com"
          required
        />
        {validationErrors.email && (
          <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
        )}
      </div>

      {/* Subject Dropdown */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
          Subject <span className="text-red-400">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          disabled={formState === 'submitting'}
          className={`w-full px-4 py-2 bg-navy-950 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
            validationErrors.subject ? 'border-red-500' : 'border-navy-700'
          }`}
          required
        >
          <option value="">Select a subject...</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Aviation Consulting">Aviation Consulting</option>
          <option value="Dev/Startup Collaboration">Dev/Startup Collaboration</option>
          <option value="CFI Training Resources">CFI Training Resources</option>
          <option value="Speaking/Workshop Request">Speaking/Workshop Request</option>
          <option value="Other">Other</option>
        </select>
        {validationErrors.subject && (
          <p className="text-red-400 text-sm mt-1">{validationErrors.subject}</p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          maxLength={VALIDATION.MESSAGE_MAX}
          disabled={formState === 'submitting'}
          rows={8}
          className={`w-full px-4 py-2 bg-navy-950 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors resize-y ${
            validationErrors.message ? 'border-red-500' : 'border-navy-700'
          }`}
          placeholder="Please provide details about your inquiry (minimum 500 characters)..."
          required
        />
        {/* Character Counter */}
        <div className="flex justify-between items-center mt-2 text-sm">
          <span
            className={
              messageStatus === 'insufficient'
                ? 'text-red-400'
                : messageStatus === 'exceeded'
                  ? 'text-red-400'
                  : 'text-gray-500'
            }
          >
            {messageStatus === 'insufficient' &&
              `Minimum ${VALIDATION.MESSAGE_MIN} characters required`}
            {messageStatus === 'exceeded' && `Maximum ${VALIDATION.MESSAGE_MAX} characters`}
            {messageStatus === 'valid' && 'Character count'}
          </span>
          <span
            className={
              messageStatus === 'insufficient'
                ? 'text-red-400'
                : messageStatus === 'exceeded'
                  ? 'text-red-400'
                  : 'text-gray-400'
            }
          >
            {messageLength.toLocaleString()} / {VALIDATION.MESSAGE_MAX.toLocaleString()}
          </span>
        </div>
        {validationErrors.message && (
          <p className="text-red-400 text-sm mt-1">{validationErrors.message}</p>
        )}
      </div>

      {/* Honeypot Field (hidden from users, visible to bots) */}
      <div
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
        aria-hidden="true"
      >
        <label htmlFor="website">Website (leave blank)</label>
        <input
          type="text"
          id="website"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Turnstile Widget (invisible mode) */}
      {turnstileLoaded && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <div
          className="cf-turnstile"
          data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          data-callback="onTurnstileSuccess"
          data-theme="dark"
        />
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={formState === 'submitting'}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        {formState === 'submitting' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </Button>

      {/* Privacy Note */}
      <p className="text-center text-gray-500 text-sm">
        This form is protected by Cloudflare Turnstile to prevent spam.
      </p>
    </form>
  )
}
