// To add your own validation functions:
// Any function will work fine here as long as it...
//     * Takes 1 string as a parameter.
//     * Returns a boolean.

validations.any = function (input) {
  // Accepts any non-empty input.
  return !!input;
};

validations.lettersOnly = function (input) {
  // Only accepts alphabetical characters and spaces. Case insensitive.
  if (
    input.length > 0 &&
    /^[a-zA-Z\'\s]*$/.test(input)
  ) {
    return true;
  }
  return false;
};

validations.emailFormat = function (input) {
  // Only accepts strings formatted as emails --> somebody@somewhere.something
  if (
    input.length > 0 &&
    input.includes('.') &&
    input.includes('@')
  ) {
    return true;
  }
  return false;
};

validations.noLetters = function (input) {
  // Only accepts numbers and other non-alphabetical characters.
  if (
    input.length > 0 &&
    /^[^a-zA-Z]*$/.test(input)
  ) {
    return true;
  }
  return false;
};
