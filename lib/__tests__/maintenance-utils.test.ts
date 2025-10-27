/**
 * Unit Tests: Maintenance Mode Utilities
 *
 * Test Framework: None (manual test harness for now)
 * To run: node --loader ts-node/esm lib/__tests__/maintenance-utils.test.ts
 * Or: Add Jest/Vitest and run via npm test
 *
 * Coverage Target: 100% of lib/maintenance-utils.ts
 */

import {
  validateBypassToken,
  isExcludedPath,
  maskToken,
  logBypassAttempt,
} from '../maintenance-utils'

// Simple test harness (no framework dependency)
let testsRun = 0
let testsPassed = 0
let testsFailed = 0

function test(name: string, fn: () => void): void {
  testsRun++
  try {
    fn()
    testsPassed++
    console.log(`✅ ${name}`)
  } catch (error) {
    testsFailed++
    console.error(`❌ ${name}`)
    console.error(`   ${error}`)
  }
}

function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    throw new Error(
      message ||
        `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    )
  }
}

// =============================================================================
// validateBypassToken Tests
// =============================================================================

test('validateBypassToken: valid token returns true', () => {
  const token = '7ce4b83f45c5d38063b5421d166cbbc57459d47b729ff3b5365c89cbc69e7048'
  const envToken =
    '7ce4b83f45c5d38063b5421d166cbbc57459d47b729ff3b5365c89cbc69e7048'
  assertEqual(validateBypassToken(token, envToken), true)
})

test('validateBypassToken: invalid token returns false', () => {
  const token = 'INVALID_TOKEN'
  const envToken =
    '7ce4b83f45c5d38063b5421d166cbbc57459d47b729ff3b5365c89cbc69e7048'
  assertEqual(validateBypassToken(token, envToken), false)
})

test('validateBypassToken: empty token returns false', () => {
  const token = ''
  const envToken =
    '7ce4b83f45c5d38063b5421d166cbbc57459d47b729ff3b5365c89cbc69e7048'
  assertEqual(validateBypassToken(token, envToken), false)
})

test('validateBypassToken: null token returns false', () => {
  const token = null
  const envToken =
    '7ce4b83f45c5d38063b5421d166cbbc57459d47b729ff3b5365c89cbc69e7048'
  assertEqual(validateBypassToken(token, envToken), false)
})

test('validateBypassToken: undefined token returns false', () => {
  const token = undefined
  const envToken =
    '7ce4b83f45c5d38063b5421d166cbbc57459d47b729ff3b5365c89cbc69e7048'
  assertEqual(validateBypassToken(token, envToken), false)
})

test('validateBypassToken: empty envToken returns false', () => {
  const token = '7ce4b83f45c5d38063b5421d166cbbc57459d47b729ff3b5365c89cbc69e7048'
  const envToken = ''
  assertEqual(validateBypassToken(token, envToken), false)
})

test('validateBypassToken: null envToken returns false', () => {
  const token = '7ce4b83f45c5d38063b5421d166cbbc57459d47b729ff3b5365c89cbc69e7048'
  const envToken = null
  assertEqual(validateBypassToken(token, envToken), false)
})

test('validateBypassToken: case-sensitive comparison', () => {
  const token = 'ABC123'
  const envToken = 'abc123'
  assertEqual(validateBypassToken(token, envToken), false)
})

test('validateBypassToken: whitespace NOT trimmed', () => {
  const token = ' token '
  const envToken = 'token'
  assertEqual(validateBypassToken(token, envToken), false)
})

test('validateBypassToken: different lengths return false', () => {
  const token = '123'
  const envToken = '12345'
  assertEqual(validateBypassToken(token, envToken), false)
})

// =============================================================================
// isExcludedPath Tests
// =============================================================================

test('isExcludedPath: /_next/static/chunks/main.js returns true', () => {
  assertEqual(isExcludedPath('/_next/static/chunks/main.js'), true)
})

test('isExcludedPath: /_next returns true', () => {
  assertEqual(isExcludedPath('/_next'), true)
})

test('isExcludedPath: /images/logo.png returns true', () => {
  assertEqual(isExcludedPath('/images/logo.png'), true)
})

test('isExcludedPath: /images returns true', () => {
  assertEqual(isExcludedPath('/images'), true)
})

test('isExcludedPath: /fonts/WorkSans-Regular.woff2 returns true', () => {
  assertEqual(isExcludedPath('/fonts/WorkSans-Regular.woff2'), true)
})

test('isExcludedPath: /fonts returns true', () => {
  assertEqual(isExcludedPath('/fonts'), true)
})

test('isExcludedPath: /api/health returns true', () => {
  assertEqual(isExcludedPath('/api/health'), true)
})

test('isExcludedPath: /maintenance returns true', () => {
  assertEqual(isExcludedPath('/maintenance'), true)
})

test('isExcludedPath: /maintenance/nested returns true', () => {
  assertEqual(isExcludedPath('/maintenance/nested'), true)
})

test('isExcludedPath: / returns false', () => {
  assertEqual(isExcludedPath('/'), false)
})

test('isExcludedPath: /blog returns false', () => {
  assertEqual(isExcludedPath('/blog'), false)
})

test('isExcludedPath: /about returns false', () => {
  assertEqual(isExcludedPath('/about'), false)
})

test('isExcludedPath: /about?query=test returns false', () => {
  assertEqual(isExcludedPath('/about?query=test'), false)
})

test('isExcludedPath: /api/posts returns false', () => {
  assertEqual(isExcludedPath('/api/posts'), false)
})

test('isExcludedPath: empty string returns false', () => {
  assertEqual(isExcludedPath(''), false)
})

test('isExcludedPath: /blogimages returns false (must match prefix)', () => {
  assertEqual(isExcludedPath('/blogimages'), false)
})

// =============================================================================
// maskToken Tests
// =============================================================================

test('maskToken: 64-char token shows last 4', () => {
  const token = '7ce4b83f45c5d38063b5421d166cbbc57459d47b729ff3b5365c89cbc69e7048'
  const masked = maskToken(token)
  assertEqual(masked, '***7048')
})

test('maskToken: short token (4 chars) is fully visible', () => {
  const token = 'ABCD'
  const masked = maskToken(token)
  assertEqual(masked, '***ABCD')
})

test('maskToken: short token (3 chars) is fully visible', () => {
  const token = 'ABC'
  const masked = maskToken(token)
  assertEqual(masked, '***ABC')
})

test('maskToken: empty string returns ***', () => {
  const token = ''
  const masked = maskToken(token)
  assertEqual(masked, '***')
})

test('maskToken: null returns ***', () => {
  const token = null
  const masked = maskToken(token)
  assertEqual(masked, '***')
})

test('maskToken: undefined returns ***', () => {
  const token = undefined
  const masked = maskToken(token)
  assertEqual(masked, '***')
})

test('maskToken: 10-char token shows last 4', () => {
  const token = '1234567890'
  const masked = maskToken(token)
  assertEqual(masked, '***7890')
})

// =============================================================================
// logBypassAttempt Tests
// =============================================================================

// Note: These tests verify function execution without throwing errors
// Console output should be manually inspected

test('logBypassAttempt: successful bypass logs INFO', () => {
  const consoleSpy: string[] = []
  const originalInfo = console.info
  console.info = (...args: unknown[]) => {
    consoleSpy.push(args.join(' '))
  }

  logBypassAttempt(true, {
    token: '7ce4b83f45c5d38063b5421d166cbbc57459d47b729ff3b5365c89cbc69e7048',
  })

  console.info = originalInfo

  // Verify log contains expected elements
  const log = consoleSpy[0]
  if (!log) throw new Error('No log output')
  if (!log.includes('[INFO]')) throw new Error('Missing [INFO] level')
  if (!log.includes('[Maintenance Bypass]'))
    throw new Error('Missing [Maintenance Bypass] label')
  if (!log.includes('Successful')) throw new Error('Missing "Successful"')
  if (!log.includes('***7048')) throw new Error('Missing masked token')
})

test('logBypassAttempt: failed bypass logs WARN', () => {
  const consoleSpy: string[] = []
  const originalWarn = console.warn
  console.warn = (...args: unknown[]) => {
    consoleSpy.push(args.join(' '))
  }

  logBypassAttempt(false, {
    token: 'INVALID_TOKEN',
    ip: '192.168.1.1',
  })

  console.warn = originalWarn

  // Verify log contains expected elements
  const log = consoleSpy[0]
  if (!log) throw new Error('No log output')
  if (!log.includes('[WARN]')) throw new Error('Missing [WARN] level')
  if (!log.includes('[Maintenance Bypass]'))
    throw new Error('Missing [Maintenance Bypass] label')
  if (!log.includes('Failed')) throw new Error('Missing "Failed"')
  if (!log.includes('IP: 192.168.1.1')) throw new Error('Missing IP address')
  if (!log.includes('***OKEN')) throw new Error('Missing masked token')
})

test('logBypassAttempt: failed bypass without IP', () => {
  const consoleSpy: string[] = []
  const originalWarn = console.warn
  console.warn = (...args: unknown[]) => {
    consoleSpy.push(args.join(' '))
  }

  logBypassAttempt(false, {
    token: 'BAD_TOKEN',
  })

  console.warn = originalWarn

  // Verify log contains expected elements (no IP field)
  const log = consoleSpy[0]
  if (!log) throw new Error('No log output')
  if (!log.includes('[WARN]')) throw new Error('Missing [WARN] level')
  if (!log.includes('Failed')) throw new Error('Missing "Failed"')
  if (log.includes('IP:')) throw new Error('Should not include IP when not provided')
  if (!log.includes('***OKEN')) throw new Error('Missing masked token')
})

// =============================================================================
// Test Summary
// =============================================================================

console.log('\n' + '='.repeat(80))
console.log('TEST SUMMARY')
console.log('='.repeat(80))
console.log(`Total: ${testsRun}`)
console.log(`Passed: ${testsPassed}`)
console.log(`Failed: ${testsFailed}`)
console.log('='.repeat(80))

if (testsFailed > 0) {
  console.error(`\n❌ ${testsFailed} test(s) failed`)
  process.exit(1)
} else {
  console.log('\n✅ All tests passed!')
  process.exit(0)
}
