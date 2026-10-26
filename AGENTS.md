# Architecture rules

- Keep contact queries, newsletter drafts and consent records in the dedicated websiteCommunication store using the existing localStorage pattern; eligibility is computed centrally to prevent newsletter audiences from including contact queries, withdrawn consent or sample data.
- Keep website communication screens within the existing Super Admin route tree; email delivery must remain explicitly unavailable until a real server-side marketing service and authenticated authorization are configured, never simulate sent campaigns.

- Reuse the university details editor for both admin panels; university admins resolve their institution from the signed-in `universityAdmin.universityId`, never a route parameter or an arbitrary sample, so profile edits stay institution-specific.
- Persist university profile changes to the shared `acado_universities` localStorage collection so both panels read the same institution record.

- Communities management uses Cloud tables, private image storage and protected user_roles university assignments; demo localStorage login must never grant community access because these records are shared across users.
- Keep the legacy Posts module at /communities separate from Communities management at /community-management; shared admin screens preserve the /university prefix.
- Community universities are explicitly imported from existing institution records by a verified Super Admin; never infer account roles or university assignments from browser data.