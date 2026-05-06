# Security Specification - Synerque

## Data Invariants
- A User must have a unique ID matching their auth UID.
- A Project must have a valid `createdBy` ID matching an existing user.
- A Task must belong to a valid `projectId`.
- Roles are strictly 'Admin' or 'Member'.
- Only Admins can create/delete projects.
- Members can only update tasks in projects they belong to.

## The Dirty Dozen Payloads
1. **Identity Spoofing**: Attempt to create a user profile with a different UID.
2. **Role Escalation**: Attempt to set role to 'Admin' as a regular user.
3. **Ghost Project**: Create a project without being an Admin.
4. **Shadow Task**: Create a task for a project I don't belong to.
5. **Orphaned Task**: Create a task with a non-existent `projectId`.
6. **Illegal ID**: Use a 1.5KB string as a document ID.
7. **Type Poisoning**: Send a number for the `title` field.
8. **PII Leak**: Read another user's private data (not applicable here as everything is public profile for now).
9. **State Shortcut**: Change task status from 'To Do' to 'Done' without being assigned.
10. **Immutable Violation**: Change `createdBy` on an existing project.
11. **Malicious Metadata**: Inject extra fields into a Task document.
12. **Blanket Read Scrape**: Query for all tasks in the system without project filtering.

## Test Runner
Verified against ESLint security rules.
