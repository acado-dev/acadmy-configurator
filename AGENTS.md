# Architecture rules

- Reuse the university details editor for both admin panels; university admins resolve their institution from the signed-in `universityAdmin.universityId`, never a route parameter or an arbitrary sample, so profile edits stay institution-specific.
- Persist university profile changes to the shared `acado_universities` localStorage collection so both panels read the same institution record.