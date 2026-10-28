# Architecture rules

- Keep contact queries, newsletter drafts and consent records in the dedicated websiteCommunication store using the existing localStorage pattern; eligibility is computed centrally to prevent newsletter audiences from including contact queries, withdrawn consent or sample data.
- Keep website communication screens within the existing Super Admin route tree; email delivery must remain explicitly unavailable until a real server-side marketing service and authenticated authorization are configured, never simulate sent campaigns.

- Reuse the university details editor for both admin panels; university admins resolve their institution from the signed-in `universityAdmin.universityId`, never a route parameter or an arbitrary sample, so profile edits stay institution-specific.
- Persist university profile changes to the shared `acado_universities` localStorage collection so both panels read the same institution record.

- Communities uses a dedicated seeded localStorage prototype store; never bypass or weaken Cloud policies to make demo screens accessible, because live data must remain isolated.
- Keep the legacy Posts module at /communities separate from Communities management at /community-management; shared admin screens preserve the /university prefix.
- Prototype Communities uses the current dashboard context for institution-scoped presentation only; it does not authenticate against or read/write Cloud records.
- Student Life uses a dedicated university-keyed prototype store with independent draft/published snapshots; resolve university admins from their existing account context, reuse one renderer for admin preview and the internal learner page, and never mutate the university profile or Cloud data while saving content.
- City Life uses a dedicated Cloud row keyed by university, structured ordered collections in separate draft/published snapshots and a published-only RPC; resolve write scope from verified Cloud user_roles, never prototype account flags, so drafts and media remain private. Reuse the City Life renderer for draft preview and the internal learner route.