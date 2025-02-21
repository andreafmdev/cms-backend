import { UuidGenerator } from '@shared/value-object/uuid.vo';
import { BaseDomainEntity } from '@/domain/BaseDomainEntity';

export class UserDetail extends BaseDomainEntity {
  private readonly address?: string;
  private readonly phoneNumber?: string;
  private readonly profilePictureUrl?: string;
  private readonly biography?: string;

  private constructor(
    id: string,
    address?: string,
    phoneNumber?: string,
    profilePictureUrl?: string,
    biography?: string,
  ) {
    super(id);
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
    return new UserDetail(
      UuidGenerator.generate().toString(),
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
    id: string,
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
