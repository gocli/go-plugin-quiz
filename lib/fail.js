class QuizError extends Error {
  constructor (caller, error) {
    const message = error instanceof Error ? error.message : error ? error.toString() : error
    super(message)
    this.name = 'QuizError'
    this.message = message
    Error.captureStackTrace(this, caller)
  }
}

const fail = (caller, error) => new QuizError(caller, error)

exports.fail = fail
