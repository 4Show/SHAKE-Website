# 4SHOW development-first branching strategy

- `feature/*`: active work, frequent commits, **no PR per change**. Work stays here until the owner deliberately integrates it.
- `dev`: shared integration/testing branch. **A manual git push to dev triggers the full development-validation workflow**. `workflow_dispatch` is also available for reruns.
- `main`: stable release branch. Promotion from dev to main requires explicit owner approval; do not automatically deploy or merge.
- `fix/*` and `hotfix/*`: targeted fixes; integrate into dev before release where practical.
- Pull requests are optional for feature work. Use a single dev-to-main release PR when review/history is useful; do not open a PR for every feature.
- CI cannot distinguish whether a push to dev was performed manually by a human or by automation. Limit who can push to dev if you need that guarantee.
- Set GitHub main branch rules and required reviewers, and configure Vercel production approval/promotion separately. Workflow YAML alone does not enforce release approval or prevent external auto-deploys.
- The existing workflows on main and old draft PRs are not automatically removed by this dev-only change; reconcile them during the next approved release.
- No Terraform validation, AWS infrastructure deployment, Square payments, Supabase migrations, or public app releases are performed by these workflows.

## Suggested local commands
```bash
git fetch origin
git switch dev
git merge --no-ff feature/my-feature
git push origin dev
```
Only merge work into dev when you want the full validation pipeline to run.

## SHAKE-Website
Static website source checks; no Terraform or AWS validation.
