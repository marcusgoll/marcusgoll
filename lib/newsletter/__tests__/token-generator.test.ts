import { generateUnsubscribeToken } from '../token-generator'

describe('Token Generator', () => {
  describe('generateUnsubscribeToken', () => {
    it('should generate a 64-character hex token', () => {
      const token = generateUnsubscribeToken()

      expect(token).toHaveLength(64)
      expect(token).toMatch(/^[0-9a-f]{64}$/)
    })

    it('should generate unique tokens', () => {
      const token1 = generateUnsubscribeToken()
      const token2 = generateUnsubscribeToken()
      const token3 = generateUnsubscribeToken()

      expect(token1).not.toBe(token2)
      expect(token2).not.toBe(token3)
      expect(token1).not.toBe(token3)
    })

    it('should have sufficient entropy (256 bits)', () => {
      // 32 bytes = 256 bits = 64 hex chars
      // Test by generating many tokens and checking uniqueness
      const tokens = new Set()
      const count = 1000

      for (let i = 0; i < count; i++) {
        tokens.add(generateUnsubscribeToken())
      }

      // All tokens should be unique
      expect(tokens.size).toBe(count)
    })
  })
})
