# Architecture rules

- Keep contact queries, newsletter drafts and consent records in the dedicated websiteCommunication store using the existing localStorage pattern; eligibility is computed centrally to prevent newsletter audiences from including contact queries, withdrawn consent or sample data.
- Keep website communication screens within the existing Super Admin route tree; email delivery must remain explicitly unavailable until a real server-side marketing service and authenticated authorization are configured, never simulate sent campaigns.

- Reuse the university details editor for both admin panels; university admins resolve their institution from the signed-in `universityAdmin.universityId`, never a route parameter or an arbitrary sample, so profile edits stay institution-specific.
- Persist university profile changes to the shared `acado_universities` localStorage collection so both panels read the same institution record.