import { CommercetoolsLoggerConfig, CommercetoolsLoggerFunction, CommercetoolsLoggerLevel } from '../types'
import { maskAllSensitiveData } from '../utils'

const levelNumbers = {
  silent: 0,
  debug: 1,
  warn: 2,
  error: 3,
}

/**
 * Controls the logging of messages and data.
 */
export class CommercetoolsLogger {
  private readonly level: CommercetoolsLoggerLevel = 'warn'
  private readonly levelNumber = levelNumbers.warn
  private readonly _debug?: CommercetoolsLoggerFunction
  private readonly _warn?: CommercetoolsLoggerFunction
  private readonly _error?: CommercetoolsLoggerFunction
  private readonly prefix = 'CommercetoolsLogger'

  constructor(options?: CommercetoolsLoggerConfig) {
    this._debug = options?.debug
    this._warn = options?.warn
    this._error = options?.error
    if (options?.level) {
      this.level = options?.level
    }
  }

  debug(message: string, data?: Record<string, unknown>) {
    if (this._debug && this.levelNumber >= levelNumbers.debug) {
      this.log(this._debug, message, data)
    }
  }

  warn(message: string, data?: Record<string, unknown>) {
    if (this._warn && this.levelNumber >= levelNumbers.warn) {
      this.log(this._warn, message, data)
    }
  }

  error(message: string, data?: Record<string, unknown>) {
    if (this._error && this.levelNumber >= levelNumbers.error) {
      this.log(this._error, message, data)
    }
  }

  log(logFn: CommercetoolsLoggerFunction, message: string, data?: Record<string, unknown>) {
    let maskedData
    if (data) {
      maskedData = maskAllSensitiveData(data)
    }
    logFn(`${this.prefix} - ${message}`, maskedData)
  }
}
