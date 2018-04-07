import inquirer from 'inquirer'
import prompt from './prompt'
import fail from './fail'
import autocompletePrompt from 'inquirer-autocomplete-prompt'

inquirer.registerPrompt('autocomplete', autocompletePrompt)

const QuizPlugin = (proto) => {
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

  proto._inquirer = inquirer
  proto.ask = ask
  proto.confirm = confirm
  proto.registerQuestion = registerQuestion
}

const install = QuizPlugin
export { install, QuizPlugin }