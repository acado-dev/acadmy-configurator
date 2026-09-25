# Inbox recipient visibility

## Goal
Make the Sent list readable without opening each conversation.

## Changes
- Show `To: learner name` for individual messages.
- Save group type, group name, and the full recipient list when sending to a group.
- Display one Sent-list entry per group send, including every learner name.
- Keep older sent messages working as individual entries.
- Include group and learner names in inbox search.

## Technical details
- Extend stored inbox messages with optional audience metadata and a group-send identifier.
- Add structured type/name labels to existing event, university, community, learner, and platform audiences.
- Collapse duplicate per-recipient delivery records only in the admin Sent list; individual learner inbox delivery remains unchanged.
- Verify the result in the admin inbox at desktop size and confirm the current build is healthy.
