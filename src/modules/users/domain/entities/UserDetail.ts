import { Uuid, UuidGenerator } from '@shared/value-object/uuid.vo';

export class UserDetail {
  private readonly id: Uuid;
  private readonly address?: string;
  private readonly phoneNumber?: string;
  private readonly profilePictureUrl?: string;
  private readonly biography?: string;

  private constructor(
    id: Uuid,
    address?: string,
    phoneNumber?: string,
    profilePictureUrl?: string,
    biography?: string,
  ) {
    this.id = id;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.profilePictureUrl = profilePictureUrl;
    this.biography = biography;
  }

  getId(): Uuid {
    return this.id;
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
    return new UserDetail(
      UuidGenerator.generate(),
      address,
      phoneNumber,
      profilePictureUrl,
      biography,
    );
  }
  /**
   * Factory method to create UserDetail with an existing ID (from persistence).
   */
  static createWithId(
    id: Uuid,
    address?: string,
    phoneNumber?: string,
    profilePictureUrl?: string,
    biography?: string,
  ): UserDetail {
    return new UserDetail(
      id,
      address,
      phoneNumber,
      profilePictureUrl,
      biography,
    );
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
