export class UserDetail {
  private readonly address?: string;
  private readonly phoneNumber?: string;
  private readonly profilePictureUrl?: string;
  private readonly biography?: string;

  private constructor(
    address?: string,
    phoneNumber?: string,
    profilePictureUrl?: string,
    biography?: string,
  ) {
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.profilePictureUrl = profilePictureUrl;
    this.biography = biography;
  }

  /**
   * Factory method to create a new UserDetail with a generated ID.
   */
  static create(
    address?: string,
    phoneNumber?: string,
    profilePictureUrl?: string,
    biography?: string,
  ): UserDetail {
    return new UserDetail(address, phoneNumber, profilePictureUrl, biography);
  }
  /**
   * Factory method to create UserDetail with an existing ID (from persistence).
   */

  static createDefault(): UserDetail {
    return this.create();
  }
  getAddress(): string | undefined {
    return this.address;
  }

  getPhoneNumber(): string | undefined {
    return this.phoneNumber;
  }

  getProfilePictureUrl(): string | undefined {
    return this.profilePictureUrl;
  }

  getBiography(): string | undefined {
    return this.biography;
  }
}
