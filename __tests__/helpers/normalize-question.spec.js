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

  it('extends question with default', () => {
    expect(normalizeQuestion('how?', { type: 'confirm' }, []))
      .toEqual({ type: 'confirm', message: 'how?' })

    expect(normalizeQuestion({ message: 'how?' }, { type: 'confirm' }, []))
      .toEqual({ type: 'confirm', message: 'how?' })
  })

  it('wraps function options to call them with answers', () => {
    const answers = []
    const filterCallback = jest.fn()
    const { filter } = normalizeQuestion({ message: 'how?', filter: filterCallback }, {}, answers)

    filter('value')
    expect(filterCallback.mock.calls.length).toBe(1)
    expect(filterCallback.mock.calls[0][0]).toBe('value')
    expect(filterCallback.mock.calls[0][1]).toBe(answers)
  })

  it('wraps sources array', () => {
    const namesSource = [ 'Ashley', 'James', 'Jane', 'Samanta' ]
    const { source } = normalizeQuestion({ message: 'how?', source: namesSource }, {}, [])

    expect(typeof source).toBe('function')

    return Promise.all([
      expect(source()).resolves.toEqual([ 'Ashley', 'James', 'Jane', 'Samanta' ]),
      expect(source(null, 'ja')).resolves.toEqual([ 'James', 'Jane' ])
    ])
  })

  it('wraps sources function', () => {
    const sourceMock = jest.fn()
    const { source } = normalizeQuestion({ message: 'how?', source: sourceMock }, {}, [])

    sourceMock.mockResolvedValue([1, 2])

    return expect(source(null, 'input')).resolves.toEqual([1, 2])
      .then(() => expect(sourceMock).toHaveBeenCalledWith('input', []))
  })

  it('wraps disalbed property of choices array', () => {
    const answers = []
    const disabled = jest.fn()
    const choices = [
      { value: 'text', disabled: true },
      { value: 'txet', disabled }
    ]
    const resultedChoices = normalizeQuestion({ message: 'how?', choices }, {}, answers).choices

    expect(resultedChoices.length).toBe(2)
    expect(resultedChoices[0]).toEqual({ value: 'text', disabled: true })

    resultedChoices[1].disabled()
    expect(disabled).toHaveBeenCalledWith(answers)
  })

  it('wraps choices function', () => {
    const answers = []
    const disabled = jest.fn()
    const choices = [
      { value: 'text', disabled: true },
      { value: 'txet', disabled }
    ]
    const choicesFn = normalizeQuestion({ message: 'how?', choices: () => choices }, {}, answers).choices
    const resultedChoices = choicesFn()

    expect(resultedChoices.length).toBe(2)
    expect(resultedChoices[0]).toEqual({ value: 'text', disabled: true })

    resultedChoices[1].disabled()
    expect(disabled).toHaveBeenCalledWith(answers)
  })

  it('wraps choices function and resolve it even if result of it is not an array', () => {
    const choices = { myChoice: true }
    const choicesFn = normalizeQuestion({ message: 'how?', choices: () => choices }, {}, []).choices
    expect(choicesFn()).toEqual({ myChoice: true })
  })

  // TODO: test each wrapper to be called with properties in a correct order
})
