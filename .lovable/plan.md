# Requested Document Pop-up

## Changes
- Open the requested-document details inside the Application Review screen instead of a new browser window.
- Reuse the existing document preview, request history, and actions inside a large scrollable pop-up.
- Keep the application page updated after accepting, re-requesting, messaging, receiving, or cancelling a document.
- Remove the standalone document-request page route once the pop-up is connected.

## Technical details
- Make the current document request viewer reusable with an optional request ID and close/update callbacks.
- Embed it in the existing dialog system from the Requested Documents section.
- Verify the pop-up opens and the app builds successfully.
