import { checkRateLimit, getClientIp } from '../rate-limiter'

describe('Rate Limiter', () => {
  describe('checkRateLimit', () => {
    it('should allow requests within limit', () => {
      const identifier = 'test-ip-1'
      const limit = 5
      const windowMs = 60000

      // First 5 requests should succeed
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(identifier, limit, windowMs)
        expect(result.success).toBe(true)
        expect(result.limit).toBe(5)
        expect(result.remaining).toBe(4 - i)
      }
    })

    it('should block requests exceeding limit', () => {
      const identifier = 'test-ip-2'
      const limit = 3
      const windowMs = 60000

      // Use up the limit
      for (let i = 0; i < 3; i++) {
        checkRateLimit(identifier, limit, windowMs)
      }

      // Next request should be blocked
      const result = checkRateLimit(identifier, limit, windowMs)
      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should reset after window expires', async () => {
      const identifier = 'test-ip-3'
      const limit = 2
      const windowMs = 100 // 100ms window for faster test

      // Use up the limit
      checkRateLimit(identifier, limit, windowMs)
      checkRateLimit(identifier, limit, windowMs)

      // Should be blocked
      let result = checkRateLimit(identifier, limit, windowMs)
      expect(result.success).toBe(false)

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 150))

      // Should be allowed again
      result = checkRateLimit(identifier, limit, windowMs)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(1)
    })

    it('should track different identifiers separately', () => {
      const limit = 2
      const windowMs = 60000

      // IP 1 uses up limit
      checkRateLimit('ip-1', limit, windowMs)
      checkRateLimit('ip-1', limit, windowMs)

      // IP 1 should be blocked
      const result1 = checkRateLimit('ip-1', limit, windowMs)
      expect(result1.success).toBe(false)

      // IP 2 should still be allowed
      const result2 = checkRateLimit('ip-2', limit, windowMs)
      expect(result2.success).toBe(true)
    })

    it('should return correct reset timestamp', () => {
      const identifier = 'test-ip-4'
      const limit = 5
      const windowMs = 60000
      const before = Date.now()

      const result = checkRateLimit(identifier, limit, windowMs)

      const after = Date.now()
      const expectedReset = before + windowMs

      expect(result.reset).toBeGreaterThanOrEqual(expectedReset)
      expect(result.reset).toBeLessThanOrEqual(after + windowMs)
    })
  })

  describe('getClientIp', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-forwarded-for': '1.2.3.4, 5.6.7.8',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('1.2.3.4')
    })

    it('should extract IP from x-real-ip header', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-real-ip': '9.10.11.12',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('9.10.11.12')
    })

    it('should extract IP from cf-connecting-ip header (Cloudflare)', () => {
      const request = new Request('http://localhost', {
        headers: {
          'cf-connecting-ip': '13.14.15.16',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('13.14.15.16')
    })

    it('should prioritize x-forwarded-for over other headers', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-forwarded-for': '1.1.1.1',
          'x-real-ip': '2.2.2.2',
          'cf-connecting-ip': '3.3.3.3',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('1.1.1.1')
    })

    it('should return "unknown" when no IP headers present', () => {
      const request = new Request('http://localhost')

      const ip = getClientIp(request)
      expect(ip).toBe('unknown')
    })

    it('should handle multiple IPs in x-forwarded-for and take first', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-forwarded-for': '10.0.0.1, 10.0.0.2, 10.0.0.3',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('10.0.0.1')
    })

    it('should trim whitespace from IP address', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-forwarded-for': '  192.168.1.1  ',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('192.168.1.1')
    })
  })
})
