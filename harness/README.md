# Harness — TicTacToe → local kind

Git Experience pipeline for this host's kind cluster (`demo-cluster`).

| File | Identifier | Stages |
|------|------------|--------|
| `pipeline-deploy-local-kind.yaml` | `Deploy_TicTacToe_Local_Kind` | CI (Kaniko → Zot + Trivy) + CD (NativeHelm) |

## Targets

- Project: `default` / `default_project`
- Service: `tictactoe` (Helm chart `charts/tictactoe`)
- Env / infra: `local_kind` / `kind_infra_tictactoe` (namespace `games`)
- Registry: `local_zot` → `localhost:5001/tictactoe`
- Public URL: https://tictactoe.theburnsasylum.co.uk (Cloudflare tunnel → NodePort `30081`)

Push to `main` triggers build + deploy. Manual runs can use any branch; Deploy runs only when the codebase branch is `main`.
