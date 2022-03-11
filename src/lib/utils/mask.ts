import cloneDeep from 'lodash.clonedeep'
import traverse from 'traverse'

/**
 * List of property names that we want to mask.
 * Names are not case sensitive.
 */
export const SENSITIVE_PROPERTY_NAMES = ['password', 'refresh_token']

/**
 * List of HTTP header names that we want to mask.
 * Names are not case sensitive.
 */
export const SENSITIVE_HEADER_NAMES = ['authorization']

/**
 * The string mask to use if none explicitly provided.
 */
export const DEFAULT_MASKING_STRING = '********'

/**
 * Mask all properties matching those in {@see SENSITIVE_PROPERTY_NAMES}
 */
export function maskSensitiveInput(data: unknown) {
  return maskSensitiveData(data, SENSITIVE_PROPERTY_NAMES)
}

/**
 * Mask all properties matching those in {@see SENSITIVE_HEADER_NAMES}
 */
export function maskSensitiveHeaders(data: unknown) {
  return maskSensitiveData(data, SENSITIVE_HEADER_NAMES)
}

/**
 * Mask all properties defined by {@see propertyNames} in the given {@see data} object
 * with the mask string defined by the {@see mask} parameter.
 */
export function maskSensitiveData(data: unknown, propertyNames: string[], mask = DEFAULT_MASKING_STRING) {
  if (typeof data === 'object') {
    const mutatedData = cloneDeep(data)
    traverse(mutatedData).forEach(function (this: any) {
      if (propertyNames.includes(this.key?.toLowerCase() ?? '')) {
        this.update(mask)
      }
    })
    return mutatedData
  }
  return data
}
