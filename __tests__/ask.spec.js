const mockInquirer = { Separator: jest.fn() }
jest.mock('inquirer', () => mockInquirer)

const mockPrompt = { prompt: jest.fn() }
jest.mock('../lib/helpers/prompt', () => mockPrompt)

const { ask } = require('../lib/ask')

describe('ask()', () => {
  it('is a function', () => {
    expect(typeof ask).toBe('function')
  })

  it('can prompt questions', () => {
    mockPrompt.prompt.mockResolvedValueOnce(['cause', 'somebody'])
    ask(['why?', 'who?'])
    expect(mockPrompt.prompt).toHaveBeenLastCalledWith(['why?', 'who?'], {})

    mockPrompt.prompt.mockResolvedValueOnce(['cause', 'somebody'])
    ask(['why?', 'who?'], { option: true })
    expect(mockPrompt.prompt).toHaveBeenLastCalledWith(['why?', 'who?'], { option: true })
  })

  it('can prompt a question', () => {
    mockPrompt.prompt.mockResolvedValueOnce(['cause'])
    ask('why?')
    expect(mockPrompt.prompt).toHaveBeenLastCalledWith(['why?'], {})

    mockPrompt.prompt.mockResolvedValueOnce(['somebody'])
    ask('who?', { option: true })
    expect(mockPrompt.prompt).toHaveBeenLastCalledWith(['who?'], { option: true })
  })

  it('throws if questions are not given', () => {
    expect(() => ask()).toThrowError('has nothing to ask')
  })

  it('pipes prompt errors', () => {
    const error = new Error('Oops')
    mockPrompt.prompt.mockRejectedValueOnce(error)
    return expect(ask('why?')).rejects.toThrow(error)
  })

  it('can generate separator', () => {
    const result = {}
    mockInquirer.Separator.mockImplementation(() => result)

    expect(ask.separator()).toBe(result)
    expect(ask.separator('one')).toBe(result)
    expect(ask.separator(1, 'two')).toBe(result)

    expect(mockInquirer.Separator).toHaveBeenCalledTimes(3)
    expect(mockInquirer.Separator).toHaveBeenCalledWith()
    expect(mockInquirer.Separator).toHaveBeenCalledWith('one')
    expect(mockInquirer.Separator).toHaveBeenCalledWith(1, 'two')
  })
})
