import { getAttributeValue } from '../../lib/utils/get-attribute-value.js'

describe('getAttributeValue', () => {
  it('should return null if the attribute list is undefined', () => {
    expect(getAttributeValue({ attributes: undefined, name: 'test' })).toBeNull()
  })

  it('should return null if the attribute list is null', () => {
    expect(getAttributeValue({ attributes: null, name: 'test' })).toBeNull()
  })

  it('should return null if the attribute list is empty', () => {
    expect(getAttributeValue({ attributes: [], name: 'test' })).toBeNull()
  })

  it('should return null if the attribute does not exist in the attribute list', () => {
    const result = getAttributeValue({
      attributes: [
        {
          name: 'example1',
          value: 'test',
        },
      ],
      name: 'test',
    })

    expect(result).toBeNull()
  })

  it('should return the attribute string value if the attribute exists in the attribute list', () => {
    const result = getAttributeValue({
      attributes: [
        {
          name: 'test',
          value: 'my-value',
        },
      ],
      name: 'test',
    })

    expect(result).toBe('my-value')
  })

  it('should return the attribute array value if the attribute exists in the attribute list', () => {
    const result = getAttributeValue({
      attributes: [
        {
          name: 'test',
          value: ['my-value-1', 'my-value-2'],
        },
      ],
      name: 'test',
    })

    expect(result).toEqual(['my-value-1', 'my-value-2'])
  })
})
