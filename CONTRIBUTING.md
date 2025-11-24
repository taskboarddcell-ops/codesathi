# Contributing to CodeSathi

Thank you for your interest in contributing to CodeSathi! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:
- Be respectful and considerate
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards others

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/codesathi.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Build for production
npm run build
```

## Coding Standards

### TypeScript
- Use TypeScript for all new files
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Use enums for fixed sets of values

Example:
```typescript
// ✅ Good
interface UserProfile {
  name: string;
  age: number;
}

// ❌ Bad
const user: any = { name: "John", age: 30 };
```

### React Components
- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components focused and small (<300 lines)
- Use proper prop types

Example:
```typescript
// ✅ Good
interface ButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, label, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

// ❌ Bad - missing types
export const Button = ({ onClick, label, disabled }) => {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
};
```

### Error Handling
- Use custom error types from `lib/errors.ts`
- Always validate inputs
- Provide descriptive error messages
- Handle errors at appropriate levels

Example:
```typescript
// ✅ Good
import { AppError } from '../lib/errors';

export const fetchUser = async (userId: string): Promise<User> => {
  if (!userId) {
    throw new AppError('User ID is required', 'INVALID_USER_ID');
  }
  
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new AppError('Failed to fetch user', 'FETCH_USER_ERROR');
  }
};

// ❌ Bad
export const fetchUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};
```

### Styling
- Use Tailwind CSS utility classes
- Follow existing design patterns
- Keep styles in className (no inline styles unless necessary)
- Use custom classes in `index.css` for reusable styles

Example:
```typescript
// ✅ Good
<button className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
  Click me
</button>

// ❌ Bad
<button style={{ backgroundColor: '#2F6BFF', color: 'white', padding: '8px 16px' }}>
  Click me
</button>
```

## Git Commit Messages

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add password reset functionality

Implemented password reset flow using Supabase Auth.
Users can now request a password reset email.

Closes #123
```

```
fix(lesson): correct XP calculation for completed lessons

Fixed a bug where XP was being added multiple times
for the same lesson completion.
```

## Pull Request Process

1. **Update Documentation**: If you add features, update README.md and ARCHITECTURE.md
2. **Add Tests**: If applicable, add unit or integration tests
3. **Run Checks**: Ensure `npm run lint` and `npm run type-check` pass
4. **Build Successfully**: Verify `npm run build` completes without errors
5. **Update CHANGELOG**: Add your changes to CHANGELOG.md (if exists)
6. **Write Clear PR Description**: Explain what changed and why

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added (if applicable)
- [ ] All tests pass
```

## Testing Guidelines

### Manual Testing
1. Test happy path
2. Test error cases
3. Test edge cases
4. Test on different screen sizes
5. Test keyboard navigation
6. Test with screen readers (accessibility)

### Automated Testing (Future)
- Write unit tests for utilities and services
- Write component tests for UI components
- Write integration tests for user flows
- Write E2E tests for critical paths

## Reporting Bugs

Create an issue with:
- Clear title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment (browser, OS, etc.)

Example:
```markdown
## Bug: Login button not working on mobile

**Steps to Reproduce:**
1. Open app on mobile device
2. Navigate to login page
3. Enter credentials
4. Tap login button

**Expected:** User should be logged in
**Actual:** Nothing happens

**Environment:**
- Browser: Safari 16.3
- Device: iPhone 12
- OS: iOS 16.3
```

## Feature Requests

Create an issue with:
- Clear title
- Problem description
- Proposed solution
- Alternatives considered
- Additional context

## Questions?

- Open a discussion on GitHub
- Check existing documentation
- Review closed issues

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
