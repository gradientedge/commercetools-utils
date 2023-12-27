import traverse from 'traverse'
import { AxiosHeaders } from 'axios'
import { plainClone } from './plain-clone.js'

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
export function maskSensitiveInput(data: unknown): any {
  return maskSensitiveData(data, SENSITIVE_PROPERTY_NAMES)
}

/**
 * Mask all properties matching those in {@see SENSITIVE_HEADER_NAMES}
 */
export function maskSensitiveHeaders(data: unknown): any {
  return maskSensitiveData(data, SENSITIVE_HEADER_NAMES)
}

/**
 * Mask all properties defined by {@see propertyNames} in the given {@see data} object
 * with the mask string defined by the {@see mask} parameter.
 */
export function maskSensitiveData(data: any, propertyNames: string[], mask = DEFAULT_MASKING_STRING): any {
  if (typeof data === 'object' && data !== null && data !== undefined) {
    let mutatedData: Record<string, any> = {}
    if (data instanceof AxiosHeaders) {
      mutatedData = plainClone(data.toJSON()) as Record<string, any>
    } else {
      mutatedData = plainClone(data) as Record<string, any>
    }
    traverse(mutatedData).forEach(function (this: any) {
      if (propertyNames.includes(this.key?.toLowerCase() ?? '')) {
        this.update(mask)
      }
    })
    return mutatedData
  } else {
    return data
  }
}
