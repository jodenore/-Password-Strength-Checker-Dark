// DOM elements
const passwordInput = document.querySelector("#password-box-1");
const confirmPasswordInput = document.querySelector("#password-box-2");
const strengthLabel = document.querySelector(".password-category-label");
const requirementsList = document.querySelector("ul").children;
const togglePasswordButton = document.querySelector(".show-password-button");
// Password requirements
const [
  lengthRequirement,
  lowercaseRequirement,
  uppercaseRequirement,
  twoNumbersRequirement,
  specialCharacterRequirement,
  uncommonPasswordRequirement,
  matchedPasswordsRequirement,
] = requirementsList;

// stores the current pass/fail state for each p rule
let passwordRules = {
  hasMinimumLength: false,
  hasLowercase: false,
  hasUppercase: false,
  hasTwoNumbers: false,
  hasSpecialCharacter: false,
  // starts as true because the password field is empty
  hasUncommonPassword: true,
  hasMatchedPasswords: false,
};

// on page load pick a random minimum length from 8 to 13
let minimumPasswordLength = Math.floor(Math.random() * (8 - 14) + 14);
const lengthRequirementText = lengthRequirement.children[1];
lengthRequirementText.textContent = `At least ${minimumPasswordLength} characters`;

// passwords that fail the uncommon password requirement
let commonPasswords = ["password", "test", "letmein", "admin", "welcome"];

// current passed requirements
let strengthCount = 0;
const updateStrengthCount = () => {
  const successFullRules = Object.keys(passwordRules).filter((rule) => {
    return passwordRules[rule];
  });
  strengthCount = successFullRules.length;
};

// helpers for reading and updating requirement statuses
const setRule = (rule) => {
  if (passwordRules[rule] === undefined) {
    return;
  }
  passwordRules[rule] = true;
};

const failRule = (rule) => {
  if (passwordRules[rule] === undefined) {
    return;
  }
  passwordRules[rule] = false;
};

// update a requirement's icon and color in the checklist

const getRule = (rule) => {
  return passwordRules[rule];
};

function ruleSuccess(rule) {
  rule.children[0].classList.remove("fa-x");
  rule.children[0].classList.add("fa-check");
  rule.classList.remove("danger");
  rule.classList.add("success");
}

function ruleError(rule) {
  rule.children[0].classList.add("fa-x");
  rule.children[0].classList.remove("fa-check");
  rule.classList.remove("success");
  rule.classList.add("danger");
}

// check the password against randomized minimum lengths

function validateMinimumLength(inputValue) {
  inputValue.length >= minimumPasswordLength
    ? setRule("hasMinimumLength")
    : failRule("hasMinimumLength");
  getRule("hasMinimumLength")
    ? ruleSuccess(lengthRequirement)
    : ruleError(lengthRequirement);
}
// password character based requirements: lowercase, uppercase, numbers and special characters
const checkChars = (inputValue) => {
  let lowerCaseChars = inputValue.split("").filter((char) => {
    if (char >= "a" && char <= "z") {
      return char;
    }
  });
  let upperCaseChars = inputValue.split("").filter((char) => {
    if (char >= "A" && char <= "Z") {
      return char;
    }
  });

  let numberChars = inputValue.split("").filter((numberChar) => {
    if (numberChar >= "0" && numberChar <= "9") {
      return numberChar;
    }
  });

  let specialChars = inputValue.split("").filter((char) => {
    let charsToInclude = ["!", "@", "#", "$", "%", "*", "="];

    return charsToInclude.includes(char);
  });

  // store result of each requirement check

  lowerCaseChars.length > 0
    ? setRule("hasLowercase")
    : failRule("hasLowercase");
  upperCaseChars.length > 0
    ? setRule("hasUppercase")
    : failRule("hasUppercase");

  numberChars.length > 1 ? setRule("hasTwoNumbers") : failRule("hasTwoNumbers");

  specialChars.length > 0
    ? setRule("hasSpecialCharacter")
    : failRule("hasSpecialCharacter");

  getRule("hasLowercase")
    ? ruleSuccess(lowercaseRequirement)
    : ruleError(lowercaseRequirement);

  getRule("hasUppercase")
    ? ruleSuccess(uppercaseRequirement)
    : ruleError(uppercaseRequirement);

  getRule("hasTwoNumbers")
    ? ruleSuccess(twoNumbersRequirement)
    : ruleError(twoNumbersRequirement);

  getRule("hasSpecialCharacter")
    ? ruleSuccess(specialCharacterRequirement)
    : ruleError(specialCharacterRequirement);
};
// requirement fails if password contains any blocked common password
const checkCommonPasswords = () => {
  let passwordValue = passwordInput.value.toLowerCase();
  passwordRules.hasUncommonPassword = !commonPasswords.some(
    (commonPassword) => {
      return passwordValue.includes(commonPassword.toLowerCase());
    },
  );

  getRule("hasUncommonPassword")
    ? ruleSuccess(uncommonPasswordRequirement)
    : ruleError(uncommonPasswordRequirement);
};

// show uncommon password requirement as pass before the user types.
getRule("hasUncommonPassword")
  ? ruleSuccess(uncommonPasswordRequirement)
  : ruleError(uncommonPasswordRequirement);

// update the strength label and password input color from the current rule status.
const mainStrengthChecker = () => {
  updateStrengthCount();

  let hasPassedEveryRequirement = Object.keys(passwordRules).every(
    (requirement) => passwordRules[requirement],
  );
  console.log(hasPassedEveryRequirement);
  //

  switch (true) {
    case strengthCount >= 3 && strengthCount <= 5:
      strengthLabel.textContent = "Kinda Strong 😁";
      strengthLabel.classList.remove("danger");
      strengthLabel.classList.add("strong");
      strengthLabel.classList.remove("success");
      passwordInput.classList.remove("field-danger");
      passwordInput.classList.add("field-strong");
      passwordInput.classList.remove("field-success");
      break;

    case strengthCount >= 6 && strengthCount <= 7:
      strengthLabel.textContent = "Strong 💪";
      break;
    case hasPassedEveryRequirement:
      strengthLabel.textContent = "Very Strong 🔒";
      strengthLabel.classList.remove("danger");
      strengthLabel.classList.remove("strong");
      strengthLabel.classList.add("success");
      passwordInput.classList.remove("field-danger");
      passwordInput.classList.remove("field-strong");
      passwordInput.classList.add("field-success");
      break;
    default:
      strengthLabel.textContent = "Weak";
      strengthLabel.classList.add("danger");
      strengthLabel.classList.remove("strong");
      strengthLabel.classList.remove("success");
      passwordInput.classList.add("field-danger");
      passwordInput.classList.remove("field-strong");
      passwordInput.classList.remove("field-success");
      break;
  }
};
// confirm confirmation password matches the main password
function checkPasswordInputs() {
  // wait until the user has entered a password / is not empty before comparing password inputs
  if (!passwordInput.value) {
    return;
  }

  passwordInput.value === confirmPasswordInput.value
    ? setRule("hasMatchedPasswords")
    : failRule("hasMatchedPasswords");

  getRule("hasMatchedPasswords")
    ? (ruleSuccess(matchedPasswordsRequirement),
      confirmPasswordInput.classList.add("field-success"))
    : (ruleError(matchedPasswordsRequirement),
      confirmPasswordInput.classList.remove("field-success"));

  mainStrengthChecker();
}

function handlePasswordInput(event) {
  console.log(passwordRules);
  validateMinimumLength(event.target.value);
  checkChars(event.target.value);
  checkCommonPasswords();
  checkPasswordInputs();
  mainStrengthChecker();
}

// toggle Password visibility depending on password input's type

function toggleVisibility() {
  passwordInput.type === "password"
    ? (passwordInput.type = "text")
    : (passwordInput.type = "password");
  toggleEye(togglePasswordButton);
}

function toggleEye(element) {
  element.children[0].classList.toggle("fa-eye-slash");
  element.children[0].classList.toggle("fa-eye");
}
// DOM events
passwordInput.oninput = handlePasswordInput;
confirmPasswordInput.oninput = checkPasswordInputs;
togglePasswordButton.onclick = toggleVisibility;
