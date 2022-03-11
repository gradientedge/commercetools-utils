describe('isNode', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should return true (as this test is run via node)', () => {
    const { isNode } = require('../../lib')
    expect(isNode()).toBe(true)
  })
})
