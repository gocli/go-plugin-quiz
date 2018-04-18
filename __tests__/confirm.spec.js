const mockPrompt = { prompt: jest.fn() }
jest.mock('../lib/helpers/prompt', () => mockPrompt)

const { confirm } = require('../lib/confirm')

describe('confirm()', () => {
  it('is a function', () => {
    expect(typeof confirm).toBe('function')
  })

  it('prompts confirm message', () => {
    mockPrompt.prompt.mockResolvedValueOnce([42])
    return confirm('MESSAGE', 'DEFAULT')
      .then((result) => {
        expect(result).toBe(42)
        expect(mockPrompt.prompt).toHaveBeenCalledTimes(1)
        expect(mockPrompt.prompt.mock.calls[0][0])
          .toEqual([{ type: 'confirm', message: 'MESSAGE', default: 'DEFAULT' }])
      })
  })

  it('pipes errors', () => {
    const error = new Error('Oops')
    mockPrompt.prompt.mockRejectedValueOnce(error)
    return expect(confirm('M')).rejects.toThrow(error)
  })
})
