---
description: Create a pull request from changes made in this session. Stages session files, creates a branch, commits, pushes, opens a PR, then waits for it to be merged and cleans up.
---

Create a pull request for the changes made in this session by following these steps without asking for individual approvals:

1. **Identify session files**: Run `git status` to see all changes. Cross-reference with the conversation to determine which files were touched *this session*. Exclude any files that were already modified at the start of the conversation (visible in the `gitStatus` block at the top of the context). If it's ambiguous, list the candidates and ask the user to confirm before proceeding.

2. **Propose a branch name**: Suggest a short kebab-case branch name that describes the changes (e.g. `fix/resolve-instruction-conflicts`, `feat/add-datepicker`). Ask the user to confirm or suggest an alternative.

3. **Run the full workflow**:
   - `git checkout -b <branch-name>`
   - `git add <session-files-only>`
   - `git commit -m "<concise summary of the session's work>"`
   - Determine which project(s) the session files belong to and run the relevant tests (e.g. `ng test gamifyworkout --watch=false`, `ng test fullswing-blog --watch=false`). If tests fail, stop and report the failures to the user — ask whether to fix them before continuing or skip tests and push anyway.
   - `git push -u origin <branch-name>`
   - `gh pr create` with a title and bullet-point body summarising what changed and why

4. **Return the PR URL** and begin polling every 30 seconds:
   ```
   gh pr view <pr-number> --json state -q .state
   ```

5. **Once the state is `MERGED`**, notify the user and ask for confirmation before running the cleanup: "PR has been merged. Run `git checkout main && git pull`?"

6. **If the user confirms**, run:
   - `git checkout main`
   - `git pull`

   Notify the user that main is up to date.
