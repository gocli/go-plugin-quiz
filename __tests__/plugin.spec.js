const plugin = require('../lib/plugin')

describe('Plugin', () => {
  it('exists', () => {
    expect(typeof plugin.install).toBe('function')
    expect(typeof plugin.QuizPlugin).toBe('function')
    expect(plugin.install).toBe(plugin.QuizPlugin)
    expect(plugin.install()).toHaveProperty('ask')
    expect(plugin.install()).toHaveProperty('confirm')
    expect(plugin.install()).toHaveProperty('registerQuestion')
    expect(() => plugin.install({})).not.toThrow()
  })

  it('export API', () => {
    const obj = {}
    plugin.install(obj)

    expect(typeof obj.ask).toBe('function', 'exports ask()')
    expect(typeof obj.confirm).toBe('function', 'exports confirm()')
    expect(typeof obj.registerQuestion).toBe('function', 'exports registerQuestion()')
  })
})
