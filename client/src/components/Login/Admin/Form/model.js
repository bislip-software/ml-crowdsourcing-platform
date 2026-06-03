const strInput = (value) => ({
  value: value,
  validation: [true, ""],
  validators: {
    required: [true, "Por favor, rellena este campo."],
  },
});

export default Object.freeze({
  username: strInput("Javier J Zabala B"),
  email: strInput("javier.zabala@bislip-software.com"),
  password: strInput("123456"),
});
