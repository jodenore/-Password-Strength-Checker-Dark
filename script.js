// DOM
const passwordInput = document.querySelector("#password-box-1");
const confirmPasswordBox = document.querySelector("#password-box-2");
const strengthLabel = document.querySelector(".password-category-label");
const requirementsList = document.querySelector("ul").children;
// requirements
const [
  lengthRequirement,
  lowercaseRequirement,
  uppercaseRequirement,
  twoNumbersRequirement,
  specialCharacterRequirement,
  uncommonPasswordRequirement,
  matchedPasswordsRequirement,
] = requirementsList;

let passwordRules = {
  hasMinimumLength: false,
  hasLowercase: false,
  hasUppercase: false,
  hasTwoNumbers: false,
  hasSpecialCharacter: false,
  hasUncommonPassword: true,
  hasMatchedPasswords: false,
};

let minimumPasswordLength = Math.floor(Math.random() * (8 - 14) + 14);
const lengthRequirementBox = lengthRequirement.children[1];
lengthRequirementBox.textContent = `At least ${minimumPasswordLength} characters`;

let commonPasswords = ["password", "test", "letmein", "admin", "welcome"];

let strengthCount = 0;
const incrementStrength = () => {
  const successFullRules = Object.keys(passwordRules).filter((rule) => {
    return passwordRules[rule];
  });
  console.log(successFullRules);
  strengthCount = successFullRules.length;
};

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

function checkCharacterMinimum(inputValue) {
  inputValue.length >= minimumPasswordLength
    ? setRule("hasMinimumLength")
    : failRule("hasMinimumLength");
  getRule("hasMinimumLength")
    ? ruleSuccess(lengthRequirement)
    : ruleError(lengthRequirement);
}

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

const checkCommonPasswords = () => {
  let passwordValue = passwordInput.value;
  passwordRules.hasUncommonPassword = !commonPasswords.some((char) => {
    return passwordValue.includes(char.toLowerCase());
  });

  getRule("hasUncommonPassword")
    ? ruleSuccess(uncommonPasswordRequirement)
    : ruleError(uncommonPasswordRequirement);
};

getRule("hasUncommonPassword")
  ? ruleSuccess(uncommonPasswordRequirement)
  : ruleError(uncommonPasswordRequirement);

const mainStrengthChecker = () => {
  incrementStrength();

  let everyRequirementTrue = Object.keys(passwordRules).every(
    (requirement) => passwordRules[requirement],
  );
  console.log("every requirement", everyRequirementTrue);
  switch (true) {
    case strengthCount >= 3 && strengthCount <= 5:
      strengthLabel.textContent = "Semi-secure";
      strengthLabel.classList.remove("danger");
      strengthLabel.classList.add("strong");
      strengthLabel.classList.remove("success");
      passwordInput.classList.remove("field-danger");
      passwordInput.classList.add("field-strong");
      passwordInput.classList.remove("field-success");
      break;
    case everyRequirementTrue:
      strengthLabel.textContent = "Strong 😁";
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
function comparePasswordBoxes() {
  if (!passwordInput.value) {
    return;
  }
  passwordInput.value === confirmPasswordBox.value
    ? setRule("hasMatchedPasswords")
    : failRule("hasMatchedPasswords");
  getRule("hasMatchedPasswords")
    ? (ruleSuccess(matchedPasswordsRequirement),
      confirmPasswordBox.classList.add("field-success"))
    : (ruleError(matchedPasswordsRequirement),
      confirmPasswordBox.classList.remove("field-success"));

  mainStrengthChecker();
}

function handlePasswordInput(event) {
  //   console.log(event.currentTarget);
  // At least minimumPasswordLength random range of  characters
  checkCharacterMinimum(event.target.value);
  checkChars(event.target.value);
  checkCommonPasswords();
  comparePasswordBoxes();
  mainStrengthChecker();
  //   console.log(checkPasswordCharacters(event.target.value));
  //   console.log(hasLowercase);
}

passwordInput.oninput = handlePasswordInput;
confirmPasswordBox.oninput = comparePasswordBoxes;
