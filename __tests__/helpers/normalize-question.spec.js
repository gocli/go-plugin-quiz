const { normalizeQuestion } = require('../../lib/helpers/normalize-question')

describe('normalizeQuestion()', () => {
  it('is a function', () => {
    expect(typeof normalizeQuestion).toBe('function')
  })

  it('creates question from string', () => {
    expect(normalizeQuestion('how?', {}, []))
      .toEqual({ type: 'input', message: 'how?' })
  })

  it('creates question from object', () => {
    expect(normalizeQuestion({ message: 'how?' }, {}, []))
      .toEqual({ type: 'input', message: 'how?' })
  })

  it('automatically set the type', () => {
    expect(normalizeQuestion({ message: 'how?' }, {}, []).type).toBe('input')
    expect(normalizeQuestion({ message: 'how?', choices: [] }, {}, []).type).toBe('list')
    expect(normalizeQuestion({ message: 'how?', choices: [], multiple: true }, {}, []).type).toBe('checkbox')
    expect(normalizeQuestion({ message: 'how?', source: [] }).type).toBe('autocomplete')
  })

  it('extend question with default', () => {
    expect(normalizeQuestion('how?', { type: 'confirm' }, []))
      .toEqual({ type: 'confirm', message: 'how?' })

    expect(normalizeQuestion({ message: 'how?' }, { type: 'confirm' }, []))
      .toEqual({ type: 'confirm', message: 'how?' })
  })

  it('wrap function options to call them with answers', () => {
    const answers = []
    expect(normalizeQuestion({ message: 'how?', default: jest.fn() }, { type: 'confirm' }, []))
  })
})
