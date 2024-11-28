// Store generic functions here
import bcrypt from 'bcrypt';
import passwordValidator from 'password-validator';

// Hash (encrypt) the password
async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    console.log(hash);
    return hash;
}

// Validate the hashed password against plaintext
async function comparePassword(plaintextPassword, hash) {
    return await bcrypt.compare(plaintextPassword, hash);
}

// Password validation upon signup (password-validator module)
async function validatePassword(plaintextPassword) {
    // Create schema
    var schema = new passwordValidator();

    // Add properties (min. of: 8 chars, 1 #, 1 upper, 1 lower)
    schema
    .is().min(8)
    .has().digits(1)
    .has().lowercase()
    .has().uppercase()

    //return await schema.validate(plaintextPassword);
    //console.log(schema.validate(plaintextPassword, { details: true }));
    //return await schema.validate(plaintextPassword, { details: true });

    const validatedPassword = await schema.validate(plaintextPassword);
    //console.log(JSON.stringify(validatedPassword));

    // Check if result is true (valid pw) or if it is an array (invalid, with error messages)
    if(!validatedPassword) {
        //console.log(schema.details)
        //console.log(validatedPassword)
        //return await JSON.parse(validatedPassword);
        //return await JSON.parse(details);
        console.log(validatedPassword);
        return await validatedPassword;
        
    }

    return await validatedPassword;
}



// Since it is a module, need to export the functions
export { hashPassword, comparePassword, validatePassword }