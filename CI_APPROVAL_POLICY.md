# 4SHOW CI/CD and production approval policy

## Branch and review rules
- Create feature or chore branches from `main`; submit pull requests.
- Run quality gates automatically on pull requests and main.
- **Never automatically deploy production from a push or pull request.**
- Production releases require explicit owner approval, a passing build, and a protected GitHub `production` environment with required reviewers.
- Restrict deployment secrets to protected environments; do not expose them to untrusted pull requests.
- Configure GitHub Settings → Environments → production → Required reviewers (select the owner) and disable self-review only if another approver is available.
- Configure Settings → Rules → Rulesets for `main`: require PR and the observed check names, disallow force pushes and deletion. Rulesets are GitHub repository settings and are **not activated by this document**.
- Protect Vercel production separately: connect only the intended production branch, and configure deployment approvals / promotion controls in Vercel. GitHub Actions alone cannot prevent Vercel's existing automatic deployments.
- Manual `workflow_dispatch` packaging is not equivalent to an approved public release. Do not upload/publish installers automatically.

## Rollout
The workflow in this PR adds **non-deploying** automated checks. It does not alter Vercel, Square, Supabase, AWS, production hosting or GitHub environment protection. Confirm CI succeeds, then enable required checks and reviewer settings before merging. If checks fail because of pre-existing formatting or build issues, fix those on the PR rather than bypassing the gate.

## Repository focus
Static storefront and Terraform checks; existing CodeQL continues. Square API tests require a mockable API client before adding them.
