# 🧠 Contributing to IARM

Thank you for considering contributing to **IARM (Intelligent Assistant for Medical Regulation)**.  
IARM is an AI-driven solution that assists emergency medical operators (ARM) by extracting and summarizing patient information from calls to improve triage, reduce response times, and save lives.  
We take every contribution seriously—because in our project, seconds matter.

---

## 🚀 Quick Start

1. **Fork** the repository.
2. Create a **feature branch** (`feature/your-feature-name`).
3. Make your changes.
4. Follow the **commit message guidelines** below.
5. Ensure tests (if applicable) are passing.
6. Open a **pull request**, describing clearly:
   - What was done
   - Why it was done
   - Any impact or dependency

---

## 📌 Branching Strategy

### 🔀 Branch Types

| Branch Prefix | Usage Example                | Description                            |
|---------------|------------------------------|----------------------------------------|
| `main`        | `main`                       | Production-ready, stable code only     |
| `dev`         | `dev`                        | Ongoing integration branch             |
| `feature/`    | `feature/audio-transcript`   | New features                           |
| `bugfix/`     | `bugfix/null-call-id`        | Bug fixes                              |
| `hotfix/`     | `hotfix/fix-deployment`      | Urgent fixes applied directly to `main`|
| `test/`       | `test/ui-load-tests`         | Experimental or QA test branches       |

### 🧾 Pull Request Requirements

| Target Branch | Required Approvals | Min. Reviewers | Mandatory Reviewer | Testing Required |
|---------------|--------------------|----------------|---------------------|------------------|
| `main`        | ✅ 2               | 🧑‍🤝‍🧑 At least 2 | 👤 One core member  | ✅ All tests pass |
| Any other     | ✅ 2               | 🧑‍🤝‍🧑 At least 2 | –                   | 🔁 Best effort    |

> ℹ️ Pull Requests to `main` must **pass all unit/integration tests** and show a **~100% success rate** in scenario simulations.

---

## ✅ Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) to keep our history readable and automation-friendly:

```
<type>(optional-scope): short summary

(optional body)

(optional footer)
```

### 🔖 Allowed `<type>` values:

| Type      | Use Case                                                             |
|-----------|----------------------------------------------------------------------|
| `feat`    | A new feature                                                        |
| `fix`     | A bug fix                                                            |
| `docs`    | Documentation only changes                                           |
| `style`   | Code style (formatting, missing semi-colons, etc.), no logic changes |
| `refactor`| Code changes that neither fix a bug nor add a feature                |
| `perf`    | A code change that improves performance                              |
| `test`    | Adding or fixing tests                                               |
| `revert`  | Reverts a previous commit                                            |
| `build`   | Changes to build process or dependencies                             |
| `ci`      | CI configuration files and scripts                                   |
| `chore`   | Routine tasks that don't modify app code                             |

### ✅ Examples:

```bash
feat(audio): add noise filtering during speech processing
fix(ui): prevent crash when no operator is available
docs(contributing): add commit message conventions
chore(deps): update Python and JS dependencies
```

---

## 🧪 Testing Expectations

- **All Pull Requests to `main`** must:
  - Pass the complete test suite (unit, integration, and scenario tests).
  - Ensure performance is **not degraded**.
  - Keep coverage level high (ideally above 90%).

- **Working branches** (e.g. `feature/*`, `bugfix/*`) should:
  - Include relevant test cases **when appropriate**.
  - Maintain a **reasonable success rate** for AI-related evaluations (~90%).

- You may use mock data, but **avoid including sensitive data**.

---

## 📏 Code Quality Rules

- Prefer **clean, modular, and well-commented code**.
- Avoid hardcoded constants; use config files or environment variables.
- Prioritize **readability and testability** over clever one-liners.
- Ensure all **new files and functions are documented**.
- Never leave **TODOs without an issue reference or task ID**.

---

## 🧠 Review & Merge Rules

- Don't merge your own PR unless it's been approved by required reviewers.
- Avoid large PRs mixing unrelated changes (split into atomic PRs).
- **Rebase over merge** whenever possible to keep history clean.
- Add relevant **labels** (e.g., `enhancement`, `bug`, `needs review`).

---

## 📎 Tagging and Releases

- Use **semantic versioning**: `v1.2.3`
- Tags are created by maintainers after major merges into `main`.
- Attach a **changelog** or link to release notes when tagging.

---

## 🔒 Security & Data Compliance

- Follow **GDPR guidelines**: do not push any real data, even in test.
- Ensure new modules anonymize or pseudonymize data as needed.
- Any contribution involving **data handling** or **user privacy** must be reviewed by a core member.

---

## 👥 Core Maintainers

Pull requests to `main` require review from one of:

- **YE Yvain** – yvain.ye@epitech.eu  
- **Alexandre Pereira de Almeida** – alexandre.pereira-de-almeida@epitech.eu  
- **Joris Francin** – joris.francin@epitech.eu  
- **Clément Martin** – clement.martin@epitech.eu  

---

## 💬 Community & Support

- Use GitHub Issues for bugs or feature suggestions.
- For roadmap or architecture discussions, reach out via Discord/Slack (internal only).
- Want to join the core team? Submit consistent, high-quality contributions and request sponsorship.

---

> 🧬 *With IARM, every second saved is a life saved. Thank you for helping us build a safer, faster emergency response system.*
