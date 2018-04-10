const mockInquirer = { prompt: jest.fn() }
jest.mock('inquirer', () => mockInquirer)

const mockUid = { uid: jest.fn() }
jest.mock('../../lib/helpers/uid', () => mockUid)

const { prompt } = require('../../lib/helpers/prompt')

describe('Prompt', () => {
  it('is a function', () => {
    expect(typeof prompt).toBe('function')
  })

  it('resolves with empty list if no questions are given', () => {
    return expect(prompt([]))
      .resolves.toEqual(Object.assign([], { _: {} }))
  })

  it('collect prompt results to array', () => {
    let id = 1
    mockInquirer.prompt.mockImplementation(() => Promise.resolve({ id: `value${id++}` }))
    mockUid.uid.mockReturnValue('id')

    return prompt([
      { message: 'how?' },
      { message: 'how?' }
    ]).then(answers => {
      expect(answers.slice(0)).toEqual(['value1', 'value2'])
      expect(answers._).toEqual({})
    })
  })

  it('collect prompt results to array with aliased object', () => {
    let id = 1
    mockInquirer.prompt.mockImplementation(() => Promise.resolve({ id: `value${id++}` }))
    mockUid.uid.mockReturnValue('id')

    return prompt([
      { message: 'how?', name: 'answer1' },
      { message: 'how?', name: 'answer2' }
    ]).then(answers => {
      expect(answers.slice(0)).toEqual(['value1', 'value2'])
      expect(answers._).toEqual({ answer1: 'value1', answer2: 'value2' })
      expect(answers.answer1).toBe('value1')
      expect(answers.answer2).toBe('value2')
    })
  })
})
