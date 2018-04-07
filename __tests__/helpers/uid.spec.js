const { uid } = require('../../lib/helpers/uid')

describe('uid', () => {
  it('is a function that always return uniq value', () => {
    expect(typeof uid).toBe('function')

    const stack = []
    for (let i = 0; i < 99; i++) {
      const newId = uid()
      expect(stack.indexOf(newId)).toBe(-1)
      stack.push(newId)
    }
  })
})
