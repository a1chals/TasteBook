# Contributing to HomeBeli

Thank you for your interest in contributing to HomeBeli! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/HomeBeli.git`
3. Follow the setup instructions in [SETUP_GUIDE.md](./SETUP_GUIDE.md)
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Code Style

We use ESLint and Prettier to maintain code quality and consistency.

Before committing:
```bash
npm run lint       # Check for linting errors
npm run format     # Auto-format code
```

## Commit Messages

Use clear, descriptive commit messages:
- `feat: Add drag-and-drop reordering`
- `fix: Resolve image upload issue`
- `docs: Update README with deployment instructions`
- `refactor: Simplify score calculation logic`
- `test: Add tests for bucket scoring`

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Ensure all tests pass: `npm test`
3. Make sure your code follows the project's code style
4. Create a pull request with a clear description of your changes
5. Link any relevant issues

## Areas for Contribution

### Features
- [ ] Dark mode support
- [ ] Export dishes to PDF/CSV
- [ ] Share dishes with friends
- [ ] Meal planning integration
- [ ] Recipe import from URLs
- [ ] Nutrition information tracking

### Improvements
- [ ] Mobile app (React Native)
- [ ] Better image compression
- [ ] Advanced filtering and search
- [ ] Dish categories/tags
- [ ] Cooking difficulty ratings
- [ ] Cost tracking per dish

### Documentation
- [ ] Video setup tutorial
- [ ] API documentation
- [ ] Deployment guides for various platforms
- [ ] Troubleshooting guide expansion

## Testing

Add tests for new features:
- Place tests in `__tests__/` directory
- Follow existing test patterns
- Run tests: `npm test`

## Questions?

Feel free to open an issue for any questions about contributing!

