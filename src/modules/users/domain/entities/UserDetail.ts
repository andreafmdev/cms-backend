import { Uuid } from '@shared/value-object/uuid.vo';

export class UserDetail {
  private readonly id: Uuid;
  private readonly address?: string;
  private readonly phoneNumber?: string;
  private readonly profilePictureUrl?: string;
  private readonly biography?: string;

  constructor(
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
