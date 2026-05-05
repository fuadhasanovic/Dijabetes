# GlucoGuard Security Specification

## Data Invariants
1. A user can only access their own profile, glucose measurements, and activity logs.
2. Measurements must have a level > 0.
3. Timestamps must be server-validated.
4. Food items can be either system-wide (read-only for all) or user-owned (full access for owner).

## The Dirty Dozen Payloads (Rejection Tests)
1. **Identity Theft**: Try to create a measurement for `userB` while logged in as `userA`.
2. **BMI Spoof**: Try to set a negative weight/height in profile.
3. **Ghost Level**: Try to set glucose level to -5.0.
4. **Time Travel**: Try to set `timestamp` to year 2099.
5. **PII Leak**: Try to read another user's profile metadata.
6. **System Food Hijack**: Try to delete a system-wide food item (userId: null).
7. **Resource Exhaustion**: Try to inject a 1MB string into a food name.
8. **Malicious ID**: Try to create a document with ID `../../etc/passwd`.
9. **Admin Spoof**: Try to set `isAdmin: true` on user profile.
10. **State Corruption**: Try to update `createdAt` field on an existing measurement.
11. **Orphaned Activity**: Try to create an activity log without a `userId`.
12. **Blanket Read Scam**: Try to list all glucose measurements from all users.

## Security Rules Draft (DRAFT_firestore.rules)
See below for implementation.
