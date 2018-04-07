const inquirer = require('inquirer')

const registerQuestion = (type, question) => {
  try {
    inquirer.registerPrompt(type, question)
  } catch (error) {
    throw new Error(registerQuestion, error)
  }
}

exports.registerQuestion = registerQuestion
