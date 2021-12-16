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
 * Combination of both sensitive property names and header names
 */
export const SENSITIVE_DATA_PROPERTY_NAMES = [...SENSITIVE_PROPERTY_NAMES, ...SENSITIVE_HEADER_NAMES]

/**
 * The string mask to use if none explicitly provided.
 */
export const DEFAULT_MASKING_STRING = '********'

/**
 * Mask all properties matching those in {@see SENSITIVE_PROPERTY_NAMES}
 */
export function maskSensitiveInput<T = any>(data: T) {
  return maskSensitiveData<T>(data, SENSITIVE_PROPERTY_NAMES)
}

/**
 * Mask all properties matching those in {@see SENSITIVE_HEADER_NAMES}
 */
export function maskSensitiveHeaders<T = any>(data: T) {
  return maskSensitiveData<T>(data, SENSITIVE_HEADER_NAMES)
}

/**
 * Mask all properties matching those in {@see SENSITIVE_DATA_NAMES}
 */
export function maskAllSensitiveData<T>(data: T): T {
  return maskSensitiveData<T>(data, SENSITIVE_DATA_PROPERTY_NAMES)
}

/**
 * Mask all properties defined by {@see propertyNames} in the given {@see data} object
 * with the mask string defined by the {@see mask} parameter.
 */
export function maskSensitiveData<T>(data: T, propertyNames: string[], mask = DEFAULT_MASKING_STRING): T {
  if (typeof data === 'object') {
    const mutatedData = cloneDeep<T>(data)
    traverse(mutatedData).forEach(function () {
      if (propertyNames.includes(this.key?.toLowerCase() ?? '')) {
        this.update(mask)
      }
    })
    return mutatedData
  }
  return data
}
