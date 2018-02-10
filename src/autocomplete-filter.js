const autocompleteFilter = (input) =>
  (option) => new RegExp(input, 'i').exec(option) !== null

export default autocompleteFilter
