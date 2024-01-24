import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string): Promise<string> {
    // Generate a random salt
    const salt = randomBytes(8).toString('hex');

    // Hash the password and the salt together
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    // Return the hashed result
    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    // storedPassword -> password saved in our database. 'hashed.salt'
    const [hashedPassword, salt] = storedPassword.split('.');

    // Hash the supplied password and the salt
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    // Compare the two hashed passwords
    return buf.toString('hex') === hashedPassword;
  }
}
