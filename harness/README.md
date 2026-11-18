# Harness — TicTacToe

Git Experience pipelines. Definitions in this directory are **REMOTE** on connector `account.Github`, repo `Ironmanburns/burnsy-tictactoe`. Merging to `main` is what Harness reads. This repo has no Terraform for these pipelines.

Identifiers are unchanged so the existing webhook triggers keep working.

| File | Identifier | Trigger | Default stages |
|------|------------|---------|----------------|
| `pipeline-deploy-local-kind.yaml` | `Deploy_TicTacToe_Local_Kind` | Push → `main` | Build on Contabo → Helm deploy to Contabo |
| `pipeline-pr-preview.yaml` | `PR_Preview_TicTacToe_Local_Kind` | PR open/sync | Build on Contabo + Trivy. No preview deploy |
| `pipeline-pr-teardown.yaml` | `PR_Teardown_TicTacToe_Local_Kind` | PR close (incl. merge) | No-op on Contabo. Does not call kind |

## Stable

- Service `tictactoe` (inline NativeHelm, chart `charts/tictactoe` on `main`)
- Environment `contabo`, infrastructure `contabo_infra_tictactoe` (namespace `games`, release `tictactoe`)
- Image `docker.io/ironmanburns/tictactoe:<pipeline.sequenceId>` (also tagged with the commit SHA). Connector `my_docker`, secret `docker_password`. The repo is public, so `imagePullSecretName` stays empty.
- Service type NodePort **30081** so cloudflared on the Contabo host can use `http://localhost:30081`
- URLs: https://tictactoe.theburnsasylum.co.uk and https://tictactoe.burnsy.me once that tunnel points at the host

## Build and deploy switches

Delegate selectors are AND, so a stage never lists both `contabo` and `local-kind`.

| Variable | Default | Effect |
|----------|---------|--------|
| `buildTarget` | `contabo` (`auto` is the same stage) | CI on `contabo_k8s` / namespace `harness-ci`. `local_kind` uses `local_kind_k8s` instead. |
| `deployTarget` | `contabo` | Helm to `contabo_infra_tictactoe`. `local_kind` or `all` also deploys to `kind_infra_tictactoe`. |

The kind deploy stage's failure strategy is **Ignore**, so a down home delegate does not fail the pipeline when that stage is selected. It is not selected while `deployTarget` is `contabo`. A failed Contabo deploy is **StageRollback**. The Trivy step still fails the build on any CRITICAL finding (`--exit-code 1`).

Deploy stages run for a manual execution, or when the trigger branch or codebase branch is `main`. `<+trigger.branch.default("")>` avoids treating a missing trigger branch as a hard failure.

## PR previews

Contabo CI builds and scans `docker.io/ironmanburns/tictactoe:pr-<prNumber>`. It does not deploy a preview. The home Ingress and Cloudflare wildcard are still the kind path, and the Contabo build service account is not granted rights to create `games-pr-*` namespaces.

Set `buildTarget=local_kind` on **both** the preview and teardown pipelines only after the home delegate is back. That restores the ephemeral release `tictactoe-pr-<prNumber>` in namespace `games-pr-tictactoe-<prNumber>` at `https://tictactoe-pr-<prNumber>.theburnsasylum.co.uk`.

## Already in Harness (do not recreate)

- Connector `contabo_k8s` (inherit from delegate, selector `contabo`)
- Environment `contabo`
- Infrastructure `contabo_infra_tictactoe`
- Connector `my_docker` and secret `docker_password`
- Connector `local_kind_k8s`, environment `local_kind`, infrastructure `kind_infra_tictactoe`
- Triggers `main_tictactoe_local_kind_cicd`, `pr_preview_tictactoe`, `pr_teardown_tictactoe` (they do not pass these variables; the YAML defaults apply)

Namespace `harness-ci` must exist on Contabo for the build pod. Namespace `games` must exist for the Helm release.
