# go-plugin-quiz [![npm](https://img.shields.io/npm/v/go-plugin-quiz.svg?style=flat-square)](https://www.npmjs.com/package/go-plugin-quiz)

[Go](https://www.npmjs.com/package/go) plugin to collect user inputs with [Enquirer](https://www.npmjs.com/package/enquirer) prompts

![go-plugin-quiz example](https://raw.githubusercontent.com/gocli/go-plugin-quiz/master/docs/example.gif)

## Usage

```bash
$ npm install go go-plugin-quiz
```

```js
const go = require('go')
go.use(require('go-plugin-quiz'))
```

## API

This plugin is built on top of [Enquirer](https://www.npmjs.com/package/enquirer) prompt system. You can use all of it's features by addressing to `go.enquirer` that is an instance of `Enquirer` class.

### [Register](https://www.npmjs.com/package/enquirer#register) new [enquirer question](https://www.npmjs.com/package/prompt-question)

```js
go.registerQuestion( /* string */ type, /* constructor function */ enquirerQuestion )
```

Some of enquirer questions are bundled with plugin:

- [prompt-input](https://www.npmjs.com/package/prompt-input) — basic text input
- [prompt-confirm](https://www.npmjs.com/package/prompt-confirm) — confirm (yes/no)
- [prompt-list](https://www.npmjs.com/package/prompt-list) — list-style prompt
- [prompt-checkbox](https://www.npmjs.com/package/prompt-checkbox) — multiple-choice/checkbox prompt
- [prompt-autocompletion](https://www.npmjs.com/package/prompt-autocompletion) — autocompletes as you type

### General ask syntax

```js
var questionAsString = /* string */ message

var questionAsObject = /* object */ {
  message: /* required stirng */ message,
  type: /* string */ 'input',
  default: /* any */ undefined,
  validate: /* function */ (/* input */, /* options */) => true,
  choices: /* array|object|function */ [],
  source: /* array|function */ [],
  multiple: /* boolean */ false,
  radio: /* boolean */ false,
  transform: /* function */ (answer) => answer
}

var questions = /* array[string|object] */ [
  questionAsString,
  questionAsObject
]

var options = questionAsObject // options are just default values for question(s)

/* promise<answer|array[answer]> */ go.ask(
  /* string|object|array */ questions,
  /* optional object */ options
)
```

### Confirm-type question has it's own method

```js
/* promise<boolean> */ go.confirm(
  /* string */ message,
  /* optional boolean */ defaultValue
)
```

## Examples

### Ask for the basic text input

```js
go.ask('project name')
  .then(name => {
    console.log(`project ${name}`)
  })

// using async-await syntax
(async () => {
  const name = await go.ask('project name')
  console.log(`project ${name}`)
})()
```

### Ask a question with options

```js
go.ask('project name', { default: 'my-project' })
```

### Question as an object

```js
go.ask({ message: 'project name', default: 'my-project' })
```

### Ask a sequence of questions

```js
const [ name, dest ] = await go.ask([
  { message: 'project name', default: 'my-project' },
  'destination folder'
])

// with default options for each question

const [ name, dest ] = await go.ask([
  { message: 'project name' },
  'destination folder'
], { default: 'my-project' })
```

### Input validation

`validate` property can be used with any type to automate input validation.

Enquirer requires [odd validation process](https://github.com/enquirer/prompt-base/blob/22e7996165904db881c59c7c10b831fc548dce83/examples/ask.validate.js#L5). Not to change it's API and to add more oddities to validation process 3rd argument is passed to validate function:

```js
const isUndefined = value => typeof value === 'undefined'
const NAME_MIN = 4

const name = await go.ask({
  message: 'enter name',
  validate: (input, key, entered) => {
    /*
     * key {
     *   name - pressed key, e.g. 'x', 'space', 'line' (line stays for Return/Enter button)
     *   ctrl - boolean value to show if Ctrl was hold during input
     *   shift - boolean value to show if Shift was hold during input
     *   meta - boolean value to show if Meta was hold during input
     *   value - the result of input, e.g. 'S' for Shift + s and result of input when Return/Enter is pressed
     *   sequence - sequence of key combination
     * }
     * input - always a key name, but the string with result of input or undefined (if result is empty) for Return/Enter
     * entered - undefined unless Return/Enter pressed, and the string with result of input otherwise
     */

    if (isUndefined(entered)) return true
    if (!entered.trim()) return 'no skip option'
    if (entered.length < NAME_MIN) {
      return `enter ${NAME_MIN - entered.length} more character(s)`
    }
    return true
  }
})

// can return a promise

go.ask({
  message: 'enter name',
  validate: (input) => Promise.resolve(!/^[a-z]+$/i.test(input) ? 'invalid value' : true)
})
```

Another examples of validation can be seen under the section [Mixing different types](#mixing-different-types) and in [enquirer](https://github.com/enquirer/prompt-base/blob/22e7996165904db881c59c7c10b831fc548dce83/examples/ask.validate.js#L5) [examples](https://github.com/enquirer/prompt-base/blob/22e7996165904db881c59c7c10b831fc548dce83/examples/ask.validate-strength.js#L9).

### Answer transformation

```js
const keep = await go.ask({
  type: 'confirm',
  message: 'do you want to delete it?',
  transform: answer => !answer
})

// and with multiple answers
const { states, getCode } => require('./states')
const codes = await go.ask({
  message: 'select states',
  multiple: true,
  choices: states,
  transform: selected => selected.map(state => getCode(state))
})
```

### All pre-installed question types

#### Input ( [prompt-input](https://www.npmjs.com/package/prompt-input) ) — basic text input

```js
// input type is used by default, so there is no need to specift it
const version = await go.ask('which version?')
// or
const version = await go.ask({ message: 'which version?' })

// or if there is a need to explicitly specify the type
const version = await go.ask('which version?', { type: 'input' })
// or
const version = await go.ask({ message: 'which version?', type: 'input' })

// with default value
const version = await go.ask({ message: 'which version?', default: '1.0.0' })
```

#### Confirm ( [prompt-confirm](https://www.npmjs.com/package/prompt-confirm) ) — confirm (yes/no)

```js
// the easiest way
const shouldRemoved = await go.confirm('remove the component?')

// with default choice
const shouldRemoved = await go.confirm('remove the component?', false)

// ask syntax
const shouldRemoved = await go.ask({
  type: 'confirm',
  message: 'remove the component?',
  default: false
})
```

#### List ( [prompt-list](https://www.npmjs.com/package/prompt-list) ) — choose an option from the given list

```js
const languages = await go.ask({
  type: 'list',
  message: 'which syntax do you prefer?',
  choices: [ 'ES5', 'ES6' ],
  default: 'ES6'
})

// when choices are specified as an array, list-type is choosed automatically
const languages = await go.ask({
  message: 'which syntax do you prefer?',
  choices: [ 'ES5', 'ES6' ],
  default: 'ES6'
})
```

> List type is not always used in case with given choices, read about [chekbox type](#checkbox--prompt-checkbox---multiple-choicecheckbox) to see different behavior.

#### Checkbox ( [prompt-checkbox](https://www.npmjs.com/package/prompt-checkbox) ) — multiple-choice/checkbox

Basically, this one is like a [List](#list--prompt-list---choose-an-option-from-the-given-list), but with several extra options.

```js
const languages = await go.ask({
  type: 'checkbox',
  message: 'which languages do you use?',
  choices: [ 'javascript', 'php', 'python' ],
  default: 'javascript'
})

// you can avoid specifying a 'type' property if you 'multiple' set to true
const languages = await go.ask({
  message: 'which languages do you use?',
  multiple: true,
  choices: [ 'javascript', 'php', 'python' ],
  default: 'javascript'
})

// or if 'radio' is set to true
const languages = await go.ask({
  message: 'which languages do you use?',
  radio: true,
  choices: [ 'javascript', 'php', 'python' ],
  default: 'javascript'
})
// P.S. property 'radio' adds to the list options 'all' and 'none'

// or when 'choices' is an object (this way you can group choices)
const languages = await go.ask({
  message: 'which languages do you use?',
  choices: {
    'scripting languages': [ 'javascript', 'php', 'python' ],
    'compiled languages': [ 'go', 'c++', 'rust' ]
  },
  default: 'go'
})
// when using grouping of choices, group names are included to
// resulted array if all of nested options are selected

// or when 'choices' is a function (that returns an array or an object of choices)
const languages = await go.ask({
  message: 'which languages do you use?',
  choices: () => require('./languages'),
  default: 'javascript'
})
```

#### Autocomplete ( [prompt-autocompletion](https://www.npmjs.com/package/prompt-autocompletion) ) — autocompletes as you type

The version of [List](#list--prompt-list---choose-an-option-from-the-given-list) type with additional filtering option.

```js
const states = [ 'Alabama', 'Alaska', 'Arizona' /*, and many more */ ]

const state = await go.ask({
  type: 'autocomplete',
  message: 'choose state where parcel have to be delivered',
  source: states
})

// you can avoid 'type' option, as it's easy to guess when 'source' is specified
const state = await go.ask({
  message: 'choose state where parcel have to be delivered',
  source: states
})
```

By default, source is filtered using `new RegExp(input, 'i')` expression. You may want to change it...

```js
const state = await go.ask({
  message: 'choose state where parcel have to be delivered',
  source: (input) => Promise.resolve(
  	input ? states.filter(state => state.startsWith(input)) : states
  )
})
```

> When specifying source as a function, make sure it returns a promise.

### Mixing different types

```js
const isRepo = name => !!name.match(/^[-_\w]+\/[-_\w]+$/)
const invalidRepoMsg = 'the repository name may look like: "username/repo"'
const isUndefined = value => typeof value === 'undefined'

const [ service, repository, deploy ] = await go.ask([
  { message: 'choose preferable git service',
    choices: [ 'github', 'gitlab', 'bitbucket' ],
    default: 'github' },

  { message: 'enter repository name',
    validate: (input, key, entered) => !isUndefined(entered) && !isRepo(entered) && invalidRepoMsg || true },

  { message: 'do you want to deploy it now?', type: 'confirm' }
])
```

## License

MIT © [Stanislav Termosa](https://github.com/termosa)

