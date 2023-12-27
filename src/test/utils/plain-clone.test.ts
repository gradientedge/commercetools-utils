import { plainClone } from '../../lib/utils/plain-clone.js'

describe('plainClone', function () {
  it('should clone an entire object and non be affected by a change to a target string property', () => {
    const source = {
      prop1: {
        prop2: 'test',
      },
    }

    const result = plainClone(source)
    result.prop1.prop2 = 'changed'

    expect(source).toEqual({
      prop1: {
        prop2: 'test',
      },
    })
  })

  it('should clone an entire object and non be affected by a change to a target array item', () => {
    const source = {
      prop1: {
        prop2: ['test'],
      },
    }

    const result = plainClone(source)
    result.prop1.prop2[0] = 'changed'

    expect(source).toEqual({
      prop1: {
        prop2: ['test'],
      },
    })
  })

  it('should clone an entire object and non be affected by a change to a target object in an array item', () => {
    const source = {
      prop1: {
        prop2: ['test', { prop3: 'prop3' }],
      },
    }

    const result = plainClone(source)
    result.prop1.prop2[1].prop3 = 'changed'

    expect(source).toEqual({
      prop1: {
        prop2: ['test', { prop3: 'prop3' }],
      },
    })
  })

  it('should clone an entire object and non be affected by a change to a deeply nested target object', () => {
    const source = {
      prop1: {
        prop2: ['test', { prop3: 'prop3' }],
        prop4: {
          prop5: {
            prop6: 123,
          },
        },
      },
    }

    const result = plainClone(source)
    result.prop1.prop4.prop5.prop6 = 'changed'

    expect(source).toEqual({
      prop1: {
        prop2: ['test', { prop3: 'prop3' }],
        prop4: {
          prop5: {
            prop6: 123,
          },
        },
      },
    })
  })

  it('should clone an entire object including null, string, number, boolean and array types', () => {
    const source = {
      prop1: {
        prop2: ['prop2a', 'prop2b'],
        prop3: true,
        prop4: null,
        prop5: 123,
        prop6: 'prop6',
      },
    }

    const result = plainClone(source)
    result.prop1 = 'now a string, was an object'

    expect(source).toEqual({
      prop1: {
        prop2: ['prop2a', 'prop2b'],
        prop3: true,
        prop4: null,
        prop5: 123,
        prop6: 'prop6',
      },
    })
  })
})
