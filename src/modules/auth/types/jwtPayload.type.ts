export interface JwtPayload {
  sub: string; // ID utente
  email: string; // Email utente
  username?: string; // Username opzionale
  groups: string[]; // Gruppi dell'utente
  permissions: string[]; // Permessi dell'utente
  iat?: number; // Issued At timestamp
  exp?: number; // Expiration timestamp
}
