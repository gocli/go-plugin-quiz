const { normalizeQuestion } = require('../../lib/helpers/normalize-question')

describe('normalizeQuestion()', () => {
  it('is a function', () => {
    expect(typeof normalizeQuestion).toBe('function')
  })

  it('creates question from string', () => {
    expect(normalizeQuestion('how?', {}, []))
      .toEqual({ type: 'input', message: 'how?' })
  })
})
