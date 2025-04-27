import * as bcrypt from 'bcrypt';
import { ValueObject } from '@shared/kernel/ValueObject';
import * as dotenv from 'dotenv';

dotenv.config();
/**
 * Interface defining the properties of the Password value object
 */
interface PasswordProps {
  hashedValue: string;
}

/**
 * Password Value Object
 *
 * This class handles password hashing and verification securely using bcrypt.
 * It follows a one-way hashing approach where:
 * 1. Plaintext passwords are converted to secure hashes and stored
 * 2. Password verification is done by comparing plaintext against stored hashes
 * 3. Original passwords can never be retrieved from hashes (one-way function)
 */
export class Password extends ValueObject<PasswordProps> {
  private readonly hashedValue: string;
  private static readonly DEFAULT_SALT_ROUNDS = 10;

  private constructor(props: PasswordProps) {
    super(props);
    this.hashedValue = props.hashedValue;
  }

  /**
   * Creates a Password object from an existing hash.
   * Used when retrieving a password from the database where it's already hashed.
   *
   * @param hash - The existing hashed password from database
   * @returns A new Password object containing the hash
   */
  static fromHashed(hash: string): Password {
    return new Password({ hashedValue: hash });
  }

  /**
   * Creates a Password object from plaintext by generating a secure hash.
   * Used during registration or password change operations.
   *
   * The plaintext password is:
   * 1. Combined with a randomly generated salt
   * 2. Hashed using bcrypt algorithm
   * 3. Stored as a secure hash that cannot be reversed
   *
   * @param plaintext - The plaintext password provided by the user
   * @returns A new Password object containing the generated hash
   */
  static fromPlaintext(plaintext: string): Password {
    const salt = bcrypt.genSaltSync(this.getSaltRounds());
    const hashed = bcrypt.hashSync(plaintext, salt);
    return new Password({ hashedValue: hashed });
  }

  /**
   * Verifies if a plaintext password matches the stored hash.
   * Used during login to validate user credentials.
   *
   * This is how authentication works:
   * 1. User provides plaintext password during login attempt
   * 2. System retrieves the user's hashed password from database
   * 3. This method uses bcrypt to check if the plaintext, when hashed
   *    with the same salt, matches the stored hash
   * 4. Returns true only if they match, false otherwise
   *
   * The plaintext password is never stored and the hash is never decoded back
   * to plaintext (which is cryptographically impossible with proper hashing).
   *
   * @param plaintext - The plaintext password to verify
   * @returns boolean - True if password matches, false otherwise
   */
  verify(plaintext: string): boolean {
    return bcrypt.compareSync(plaintext, this.hashedValue);
  }

  /**
   * Returns the hashed value of the password.
   * Used when storing the password in the database.
   *
   * @returns The securely hashed password value
   */
  getValue(): string {
    return this.hashedValue;
  }

  /**
   * Determines how many salt rounds to use for hashing,
   * taking the value from environment or using a default of 10.
   *
   * Higher salt rounds = more secure but slower hashing
   *
   * @returns The number of salt rounds to use
   */
  private static getSaltRounds(): number {
    const envSaltRounds = process.env.PASSWORD_SALT_ROUNDS;
    return envSaltRounds
      ? parseInt(envSaltRounds, 10)
      : this.DEFAULT_SALT_ROUNDS;
  }
}
