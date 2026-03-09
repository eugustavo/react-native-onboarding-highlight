# Contributing to react-native-onboarding-highlight

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 🚀 Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/eugustavo/react-native-onboarding-highlight.git
   cd react-native-onboarding-highlight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests**
   ```bash
   npm test
   ```

4. **Build the package**
   ```bash
   npm run build
   ```

## 📝 Making Changes

### 1. Create a branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make your changes

Edit the source files in the `src/` directory.

### 3. Add a changeset

We use [Changesets](https://github.com/changesets/changesets) to manage versions. **Every PR that changes the code must include a changeset.**

```bash
npm run changeset
```

This will:
- Ask you to select the type of change (patch, minor, major)
- Ask for a description of the change
- Create a file in `.changeset/` directory

#### Types of changes:

- **patch**: Bug fixes, documentation improvements, small tweaks
- **minor**: New features, enhancements (backward compatible)
- **major**: Breaking changes (changes that require users to modify their code)

### 4. Write a good changeset description

Examples:
- ✅ `Add fade animation to spotlight overlay`
- ✅ `Fix tooltip positioning on small screens`
- ✅ `Update TypeScript types for better inference`
- ❌ `Fixed stuff`
- ❌ `Changes`

### 5. Commit your changes

```bash
git add .
git commit -m "feat: add fade animation to spotlight"
```

We follow [Conventional Commits](https://www.conventionalcommits.org/), but it's not strictly enforced.

### 6. Push and create a PR

```bash
git push origin feat/your-feature-name
```

Then create a Pull Request on GitHub.

## 🧪 Testing

- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Type check: `npm run typecheck`
- Lint: `npm run lint`

Please ensure all tests pass before submitting a PR.

## 🏷️ Release Process

Releases are handled automatically by GitHub Actions:

1. When you merge a PR with a changeset to `main`, a Release PR is automatically created
2. The Release PR contains:
   - Updated version in `package.json`
   - Updated `CHANGELOG.md`
   - Removed changeset files
3. When the Release PR is merged:
   - The package is published to npm automatically
   - A GitHub Release is created with the changelog

You don't need to manually bump versions or update changelogs!

## 🐛 Reporting Bugs

When reporting bugs, please include:

- React Native version
- Platform (iOS/Android)
- Steps to reproduce
- Expected behavior
- Actual behavior
- Code snippet or screenshot if applicable

## 💡 Feature Requests

Feature requests are welcome! Please:

- Check if the feature has already been requested
- Describe the use case clearly
- Explain why it would be useful

## 📋 Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Run `npm run lint` before committing
- Ensure no TypeScript errors (`npm run typecheck`)

## 🙏 Thank You!

Thank you for contributing to react-native-onboarding-highlight! Every contribution helps make this library better for everyone.
