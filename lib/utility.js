// Store generic functions here
import bcrypt from 'bcrypt';

// Hash (encrypt) the password
async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    console.log(hash);
    return hash;
}

// Validate the password
async function comparePassword(plaintextPassword, hash) {
return await bcrypt.compare(plaintextPassword, hash);
}

// Since it is a module, need to export the functions
export { hashPassword, comparePassword }