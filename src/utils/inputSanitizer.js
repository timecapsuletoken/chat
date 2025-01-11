// Utility function to sanitize input
const sanitizeInput = (input, showSnackBar) => {
    let originalInput = input; // Changed to `let` to allow reassignment
  
    // Remove <script> tags
    let sanitizedInput = input.replace(/<script.*?>.*?<\/script>/gim, '');
    if (sanitizedInput !== originalInput) {
      showSnackBar('Scripts are not allowed.', 'error');
    }
  
    // Remove angle brackets
    originalInput = sanitizedInput; // Reassigning is now allowed with `let`
    sanitizedInput = sanitizedInput.replace(/[<>]/g, '');
    if (sanitizedInput !== originalInput) {
      showSnackBar('Angle brackets are not allowed.', 'error');
    }
  
    return sanitizedInput;
  };  
  
  // Utility function to enforce character restrictions
  const enforceCharacterRestrictions = (input, allowedPattern, showSnackBar) => {
    const restrictedInput = input.replace(new RegExp(`[^${allowedPattern.source}]`, 'g'), '');
    
    if (restrictedInput !== input) {
      showSnackBar('Invalid characters are not allowed.', 'error');
    }
  
    return restrictedInput;
  };  
    
  export const secureInputHandler = (
    input,
    maxLength = 1000, // Increased max length for larger messages
    allowedPattern = /[a-zA-Z0-9@#$%!()* ]/g, // Updated allowed characters
    showSnackBar, // Snackbar function
    callback = null
  ) => {
  
// Enforce input length limit
let truncatedInput = input.slice(0, maxLength);
if (truncatedInput.length < input.length) {
  showSnackBar(`Input exceeds the maximum length of ${maxLength} characters.`, 'error');
}
  // Sanitize the input
  let sanitizedInput = sanitizeInput(truncatedInput, showSnackBar);

  // Enforce character restrictions
  let restrictedInput = enforceCharacterRestrictions(sanitizedInput, allowedPattern, showSnackBar);

  // Optional callback for additional processing
  if (callback) {
    callback(restrictedInput);
  }

  return restrictedInput;
};
  