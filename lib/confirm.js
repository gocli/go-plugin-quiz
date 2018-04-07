const { prompt } = require('./helpers/prompt')

const confirm = (message, defaultValue) =>
  prompt([{ type: 'confirm', message: message, default: defaultValue }])
    .then(([ answer ]) => answer)
    .catch((error) => { throw new Error(error) })

exports.confirm = confirm
