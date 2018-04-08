const { chainQuestions } = require('../../lib/helpers/chain-questions')

describe('chainQuestions()', () => {
  it('is a function', () => {
    expect(typeof chainQuestions).toBe('function')
  })

  it('calls a list of promised functions in a sequence', () => {
    const results = []

    let i = 0
    const createCallback = () => {
      const callback = jest.fn()
      const id = i++
      callback.mockImplementation(() => {
        results.push(id)
        return Promise.resolve()
      })
      return callback
    }

    const list = Array(99).fill(0).map(createCallback)
    return chainQuestions(list)
      .then(() => expect(results).toEqual(Array(99).fill(0).map((v, i) => i)))
  })
})
