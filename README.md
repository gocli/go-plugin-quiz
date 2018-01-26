# go-plugin-quiz

[Go](https://www.npmjs.com/package/go) plugin to collect user inputs with [Enquirer](https://www.npmjs.com/package/enquirer) prompts

## Usage

```bash
$ npm install go go-plugin-quiz
```

```js
const go = require('go')
go.use(require('go-plugin-quiz'))
```

## API

### Ask user to confirm something

```js
var options = {
  default: /* any */ defaultValue
}

/* promise<boolean> */ go.confirm(
  /* string */ question,
  /* optional object */ options
)
```

### Ask user for basic text input

```js
var options = {
  default: /* any */ defaultValue,
  type: /* string, default: 'input' */ type,
  choices: /* array<strings> */ choices // used for type = 'list'
}

/* promise<string> */ go.ask(
  /* string */ message,
  /* optional object */ options
)
```

### Question as an object

```js
var options = {
  message: /* string */ message,
  default: /* any */ defaultValue,
  type: /* string, default: 'input' */ type,
  choices: /* array<strings> */ choices // used for type = 'list'
}

/* promise<any> */ go.ask(
  /* object */ options
)
```

### Ask sequence of questions

```js
/* promise<array<any>> */ go.ask(
  [
    /* string|object */ messageOrOptions,
  ],
  /* object */ defaultOptions
)
```

### Register new question type

```js
go.addQuestionType( /* string */ type, /* constructor function */ enquirerQuestion )
```

### More

This plugin is built on top of [Enquirer](https://www.npmjs.com/package/enquirer) prompt system. You can use all of it's features by addressing to `go.enquirer` that is an instance of `Enquirer` class.

## Examples

### Ask user for basic things

```js
var go = require('go')
go.use(require('go-plugin-quiz'))

go.ask([
  'how to name your project?',
  { message: 'where to put it?', default: '.' },
  { message: 'which size will be your project?', type: 'list', choices: [ 'small', 'large' ] }
]).then(function (answers) {
  var name = answers[0]
  var dest = answers[1]
  var size = answers[2]

  console.log(size + ' ' + name + ' will be created at ' + dest)
  return go.confirm('are you sure you want to do it?')
}).then(function (answer) {
  if (answer) {
    console.log('creating…')
  } else {
    console.log('alright, maybe next time')
  }
})

// or with es6 syntax

;(async () => {
  const [ name, dest, size ] = await go.ask([
    'how to name your project?',
    { message: 'where to put it?', default: '.' },
    { message: 'which size will be your project?', type: 'list', choices: [ 'small', 'large' ] }
  ])

  console.log(`${size} ${name} will be created at ${dest}`)

  if (await go.confirm('are you sure you want to do it?')) {
    console.log('creating…')
  } else {
    console.log('alright, maybe next time')
  }
})()
```

## License

MIT © [Stanislav Termosa](https://github.com/termosa)

