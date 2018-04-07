const inquirer = require('inquirer')
const { prompt } = require('./prompt')
const { fail } = require('./fail')
const autocompletePrompt = require('inquirer-autocomplete-prompt')

inquirer.registerPrompt('autocomplete', autocompletePrompt)

const QuizPlugin = (proto = {}) => {
  const ask = (questions, options = {}) => {
    if (!questions) {
      throw fail(ask, `ask(${JSON.stringify(questions)}) has nothing to ask`)
    }

    const multipleAnswers = Array.isArray(questions)
    if (!Array.isArray(questions)) questions = [questions]

    return prompt(questions, options)
      .then((answers) => multipleAnswers ? answers : answers[0])
      .catch((error) => { throw fail(ask, error) })
  }

  const confirm = (message, defaultValue) =>
    prompt([{ type: 'confirm', message: message, default: defaultValue }])
      .then(([ answer ]) => answer)
      .catch((error) => { throw fail(confirm, error) })

  const registerQuestion = (type, question) => {
    try {
      inquirer.registerPrompt(type, question)
    } catch (error) {
      throw fail(registerQuestion, error)
    }
  }

  ask.separator = (...args) => new inquirer.Separator(...args)

  proto.inquirer = inquirer
  proto.ask = ask
  proto.confirm = confirm
  proto.registerQuestion = registerQuestion

  return proto
}

exports.QuizPlugin = QuizPlugin
exports.install = QuizPlugin
