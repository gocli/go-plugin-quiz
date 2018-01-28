var Enquirer = require('enquirer')
var enquirer = new Enquirer()

enquirer.register('confirm', require('prompt-confirm'))
enquirer.register('list', require('prompt-list'))
enquirer.register('checkbox', require('prompt-checkbox'))
enquirer.register('autocomplete', require('prompt-autocompletion'))

function uid () { return uid.id = (uid.id || 0) + 1 }

function filter (input) {
  return function (state) {
    return new RegExp(input, 'i').exec(state) !== null
  }
}

function chainQuestions (questions, answers) {
  questions = questions || []
  answers = answers || []

  if (!questions.length) return Promise.resolve(answers)

  return questions[0]().then(function (answer) {
    return chainQuestions(questions.slice(1), answers.concat([answer]))
  })
}

function ask (type, message, options) {
  var name = 'goplugin/' + uid()

  var question = Object.assign({}, options, {
    name: name,
    message: message,
    type: type
  })

  enquirer.question(question)
  return enquirer.prompt(name)
    .then(function (answers) { return answers[name] })
}

function installQuizPlugin (proto) {
  proto.enquirer = enquirer

  proto.ask = function (questions, options) {
    options = options || {}
    var multipleAnswers = true

    if (!(questions instanceof Array)) {
      multipleAnswers = false
      questions = [questions]
    }

    var type, message, qOptions, question, qsChain = []
    for (var i = 0; i < questions.length; i++) {
      question = questions[i]
      qOptions = Object.assign({}, options)

      if (typeof question === 'string') {
        message = question
      } else {
        message = question.message
        Object.assign(qOptions, question)
      }

      if (question.type) {
        type = question.type
      } else if (qOptions.choices) {
        if (qOptions.multiple || qOptions.radio || !(qOptions.choices instanceof Array)) {
          type = 'checkbox'
        } else {
          type = 'list'
        }
      } else if (qOptions.source) {
        type = 'autocomplete'
        if (qOptions.source instanceof Array) {
          var acChoices = qOptions.source
          qOptions.source = function (input) {
            var suggestions = []
            var match = filter(input)
            for (var i = 0; i < acChoices.length; i++) {
              if (match(acChoices[i])) suggestions.push(acChoices[i])
            }
            return Promise.resolve(suggestions)
          }
        }
      } else {
        type = 'input'
      }

      if (typeof qOptions.source === 'function') {
        var originalSource = qOptions.source
        qOptions.source = function (answers, input) {
          return originalSource(input)
        }
      }

      if (typeof qOptions.validate === 'function') {
        var originalValidate = qOptions.validate
        qOptions.validate = function (input, key) {
          var entered = key.name === 'line' ? input || '' : void 0
          return originalValidate(input, key, entered)
        }
      }

      qsChain.push(ask.bind(null, type, message, qOptions))
    }

    return multipleAnswers ? chainQuestions(qsChain) : qsChain[0]()
  }

  proto.confirm = function (message, defaultValue) {
    var options = {}
    if (typeof defaultValue !== 'undefined') {
      options.default = defaultValue
    }
    return ask('confirm', message, options)
  }

  proto.registerQuestion = function (type, enquirerQuestion) {
    enquirer.register(type, enquirerQuestion)
  }
}

module.exports = { install: installQuizPlugin }
