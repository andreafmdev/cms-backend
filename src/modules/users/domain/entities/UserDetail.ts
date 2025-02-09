export class UserDetail {
  private readonly address?: string;
  private readonly phoneNumber?: string;
  private readonly profilePictureUrl?: string;
  private readonly biography?: string;

  constructor(
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

  getAddress(): string {
    return this.address ?? ''; // Se null, restituisce stringa vuota
  }

  getPhoneNumber(): string {
    return this.phoneNumber ?? '';
  }

  getProfilePictureUrl(): string {
    return this.profilePictureUrl ?? '';
  }

  getBiography(): string {
    return this.biography ?? '';
  }
}
