import inquirer from 'inquirer'
import normalizeQuestion from './normalize-question'
import chainQuestions from './chain'
import uid from './uid'

const prompt = (questions, options) => {
  const prompt = inquirer.prompt

  const answers = []
  answers._ = {}

  questions = questions
    .map(question => normalizeQuestion(question, options, answers))
    .map(question => ({ ...question, _alias: question.name, name: uid() }))
    .map(question => () => {
      return prompt(question)
        .then(answers => answers[question.name])
        .then(answer => {
          answers.push(answer)
          if (question._alias) {
            answers[question._alias] = answer
            answers._[question._alias] = answer
          }
        })
    })

  return chainQuestions(questions).then(() => answers)
}

export default prompt
