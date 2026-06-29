# LinkedIn Skills

10 LinkedIn marketing skills for Claude Code, installed from
[sergebulaev/linkedin-skills](https://github.com/sergebulaev/linkedin-skills) (MIT licensed).

Skills are auto-discovered from this `.claude/skills/` directory and activate
automatically when you ask about LinkedIn tasks (writing posts, drafting
comments/replies, auditing drafts, analyzing engagement, optimizing your profile,
planning content, etc.).

## Included skills

| Skill | Purpose |
|---|---|
| `linkedin-post-writer` | Draft a new post from a 2026 hook formula |
| `linkedin-comment-drafter` | Draft a comment on someone else's post |
| `linkedin-reply-handler` | Draft a reply to an existing comment |
| `linkedin-humanizer` | Scrub AI tells / audit a draft against algorithm rules |
| `linkedin-hook-extractor` | Reverse-engineer the hook formula of a viral post |
| `linkedin-content-planner` | Generate a 7-day content plan |
| `linkedin-engager-analytics` | Segment likers/commenters by ICP fit |
| `linkedin-thread-monitor` | Track which comments earned author replies |
| `linkedin-profile-optimizer` | Audit and rewrite a profile end-to-end |
| `linkedin-employee-advocacy` | Stand up a team advocacy program |

## Shared resources

Some skills reference shared files installed alongside this folder:

- `.claude/references/` — shared hook formulas, algorithm heuristics, voice rules
- `.claude/lib/` — Python helpers (Apify / Publora clients, URL parser)
- `.claude/scripts/` — shared CLI utilities

These paths preserve the upstream repo layout so the skills' relative references
(e.g. `../../references/hook-formulas.md`) resolve correctly.

Some skills optionally use external services (Apify, Publora) and need API keys.
See the upstream repo's `.env.example` for the variables involved.
