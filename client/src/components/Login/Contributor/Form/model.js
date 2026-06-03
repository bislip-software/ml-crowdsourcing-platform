const strInput = (value) => ({
  value: value,
  validation: [true, ""],
  validators: {
    required: [true, "Por favor, rellena este campo."],
  },
});

export default Object.freeze({
  username: strInput("Javier Zabala 1"),
  email: strInput("javier.zabala1@contributor.com"),
  password: strInput("123456"),
});
