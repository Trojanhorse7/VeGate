# Contributing to VeGate

Thank you for your interest in contributing to VeGate! 🎉

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, Node version, etc.)

### Suggesting Features

We love new ideas! Open an issue with:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach

### Pull Requests

1. **Fork the repository**
2. **Create a branch**: `git checkout -b feature/your-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**: `git commit -m "feat: add amazing feature"`
6. **Push to your fork**: `git push origin feature/your-feature`
7. **Open a Pull Request**

### Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/vegate.git
cd vegate

# Install dependencies
pnpm install

# Set up environment
cp apps/web/.env.example apps/web/.env
cp packages/contract/.env.example packages/contract/.env

# Start development server
pnpm dev
```

### Code Style

- Use TypeScript for all new code
- Follow existing code style (Prettier + ESLint)
- Write clear, descriptive variable names
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Test on VeChain TestNet before production

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on what's best for the community

## 🙏 Thank You!

Your contributions make VeGate better for everyone. We appreciate your time and effort! ❤️
