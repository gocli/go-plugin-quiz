const mockInquirer = { registerPrompt: jest.fn() }
jest.mock('inquirer', () => mockInquirer)

const { registerQuestion } = require('../lib/register-question')

describe('registerQuestion()', () => {
  it('is a function', () => {
    expect(typeof registerQuestion).toBe('function')
  })

  it('registers new prompt', () => {
    registerQuestion('TYPE', 'QUESTION')
    expect(mockInquirer.registerPrompt).toHaveBeenCalledTimes(1)
    expect(mockInquirer.registerPrompt).toHaveBeenLastCalledWith('TYPE', 'QUESTION')

    registerQuestion('TYPE 2', 'QUESTION 2')
    expect(mockInquirer.registerPrompt).toHaveBeenCalledTimes(2)
    expect(mockInquirer.registerPrompt).toHaveBeenLastCalledWith('TYPE 2', 'QUESTION 2')
  })

  it('pipes the error', () => {
    const error = new Error('Oops')
    mockInquirer.registerPrompt.mockImplementationOnce(() => { throw error })
    expect(() => registerQuestion('T', 'Q')).toThrow(error)
  })
})
