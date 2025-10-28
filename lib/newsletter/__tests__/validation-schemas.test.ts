import {
  SubscribeRequestSchema,
  PreferenceUpdateSchema,
  UnsubscribeSchema,
  TokenParamSchema,
} from '../validation-schemas'

describe('Validation Schemas', () => {
  describe('SubscribeRequestSchema', () => {
    it('should accept valid subscription data', () => {
      const valid = {
        email: 'test@example.com',
        newsletterTypes: ['aviation', 'dev-startup'],
        source: 'homepage',
      }

      const result = SubscribeRequestSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email format', () => {
      const invalid = {
        email: 'not-an-email',
        newsletterTypes: ['aviation'],
      }

      const result = SubscribeRequestSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject empty newsletter types', () => {
      const invalid = {
        email: 'test@example.com',
        newsletterTypes: [],
      }

      const result = SubscribeRequestSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject invalid newsletter type', () => {
      const invalid = {
        email: 'test@example.com',
        newsletterTypes: ['invalid-type'],
      }

      const result = SubscribeRequestSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should accept all valid newsletter types', () => {
      const valid = {
        email: 'test@example.com',
        newsletterTypes: ['aviation', 'dev-startup', 'education', 'all'],
      }

      const result = SubscribeRequestSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('should make source optional', () => {
      const valid = {
        email: 'test@example.com',
        newsletterTypes: ['aviation'],
      }

      const result = SubscribeRequestSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })
  })

  describe('PreferenceUpdateSchema', () => {
    it('should accept valid preference update', () => {
      const valid = {
        token: 'a'.repeat(64),
        preferences: {
          aviation: true,
          'dev-startup': false,
          education: true,
          all: false,
        },
      }

      const result = PreferenceUpdateSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('should reject if no preferences are true', () => {
      const invalid = {
        token: 'a'.repeat(64),
        preferences: {
          aviation: false,
          'dev-startup': false,
          education: false,
          all: false,
        },
      }

      const result = PreferenceUpdateSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject invalid token length', () => {
      const invalid = {
        token: 'short',
        preferences: {
          aviation: true,
          'dev-startup': false,
          education: false,
          all: false,
        },
      }

      const result = PreferenceUpdateSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject non-hex token', () => {
      const invalid = {
        token: 'X'.repeat(64),
        preferences: {
          aviation: true,
          'dev-startup': false,
          education: false,
          all: false,
        },
      }

      const result = PreferenceUpdateSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should allow at least one preference to be true', () => {
      const valid = {
        token: 'a'.repeat(64),
        preferences: {
          aviation: false,
          'dev-startup': false,
          education: false,
          all: true,
        },
      }

      const result = PreferenceUpdateSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })
  })

  describe('UnsubscribeSchema', () => {
    it('should accept valid unsubscribe request', () => {
      const valid = {
        token: 'b'.repeat(64),
        hardDelete: false,
      }

      const result = UnsubscribeSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('should make hardDelete optional (defaults to false)', () => {
      const valid = {
        token: 'c'.repeat(64),
      }

      const result = UnsubscribeSchema.safeParse(valid)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.hardDelete).toBe(false)
      }
    })

    it('should accept hardDelete: true for GDPR deletion', () => {
      const valid = {
        token: 'd'.repeat(64),
        hardDelete: true,
      }

      const result = UnsubscribeSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('should reject invalid token', () => {
      const invalid = {
        token: 'invalid',
        hardDelete: false,
      }

      const result = UnsubscribeSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })

  describe('TokenParamSchema', () => {
    it('should accept valid 64-char hex token', () => {
      const valid = 'e'.repeat(64)

      const result = TokenParamSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('should reject too short token', () => {
      const invalid = 'f'.repeat(32)

      const result = TokenParamSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject too long token', () => {
      const invalid = 'g'.repeat(128)

      const result = TokenParamSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject non-hex characters', () => {
      const invalid = 'Z'.repeat(64)

      const result = TokenParamSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should accept mixed case hex', () => {
      const valid = 'aBcDeF0123456789'.repeat(4)

      const result = TokenParamSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })
  })
})
