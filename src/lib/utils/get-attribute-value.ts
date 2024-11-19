import { Attribute } from '@commercetools/platform-sdk'

/**
 * Options interface for {@see getAttributeValue}
 */
export interface GetAttributeValueParams {
  /** Attribute list */
  attributes: Attribute[] | null | undefined
  /** Name of the attribute that you want to retrieve the value of */
  name: string
}

/**
 * Retrieve the value of the attribute for the given attribute name
 *
 * Returns `null` if no attribute is found
 */
export function getAttributeValue<T = any>(options: GetAttributeValueParams): T | null {
  if (options?.attributes?.length) {
    const attribute = options.attributes?.find((attribute) => attribute.name === options.name)
    if (attribute) {
      return attribute.value
    }
  }
  return null
}
