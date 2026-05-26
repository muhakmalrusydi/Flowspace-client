// Better Auth manages its own tables via its migration system.
// This file documents the expected schema for reference only.
// Do NOT manually create these — Better Auth handles them.
//
// Tables created by Better Auth:
//   - user        (id, name, email, emailVerified, image, createdAt, updatedAt)
//   - session     (id, expiresAt, token, createdAt, updatedAt, ipAddress, userAgent, userId)
//   - account     (id, accountId, providerId, userId, accessToken, refreshToken, ...)
//   - verification (id, identifier, value, expiresAt, createdAt, updatedAt)

export {};
