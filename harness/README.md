# Harness — TicTacToe → local kind

Git Experience pipelines for this host's kind cluster (`demo-cluster`).

| File | Identifier | Trigger | Stages |
|------|------------|---------|--------|
| `pipeline-deploy-local-kind.yaml` | `Deploy_TicTacToe_Local_Kind` | Push → `main` | Build → Helm deploy (stable) |
| `pipeline-pr-preview.yaml` | `PR_Preview_TicTacToe_Local_Kind` | PR open/sync | Build → ephemeral preview deploy |
| `pipeline-pr-teardown.yaml` | `PR_Teardown_TicTacToe_Local_Kind` | PR close (incl. merge) | Delete preview namespace |

## Stable

- Service / infra: `tictactoe` / `kind_infra_tictactoe` (namespace `games`)
- URL: https://tictactoe.theburnsasylum.co.uk (NodePort `30081`)

## PR previews

- Namespace: `games-pr-tictactoe-<prNumber>`
- Helm release: `tictactoe-pr-<prNumber>`
- URL: `https://tictactoe-pr-<prNumber>.theburnsasylum.co.uk` (Ingress → kind ingress → Cloudflare wildcard)
- Torn down automatically when the PR is closed or merged to `main`
