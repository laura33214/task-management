## 📦 Commands to Run

Run these **3 commands** in order:

```bash
# 1. Install all dependencies
pnpm install

# 2. Generate Prisma Client
pnpm prisma:generate

# 3. Start development server
pnpm dev
```

**That's it!** Your app will run at `http://localhost:3000`

---

## 🔧 Optional Setup

### Initialize Git Hooks (Husky)

```bash
pnpm prepare
```

### Run Database Migrations (if needed)

```bash
pnpm prisma:migrate
```

---

## 📋 Available Scripts

| Script                 | Description               |
| ---------------------- | ------------------------- |
| `pnpm dev`             | Start development server  |
| `pnpm build`           | Build for production      |
| `pnpm start`           | Start production server   |
| `pnpm lint`            | Run ESLint                |
| `pnpm format`          | Format code with Prettier |
| `pnpm format:check`    | Check code formatting     |
| `pnpm type-check`      | TypeScript type checking  |
| `pnpm prisma:generate` | Generate Prisma Client    |
| `pnpm prisma:migrate`  | Run database migrations   |
| `pnpm prisma:studio`   | Open Prisma Studio GUI    |
| `pnpm prepare`         | Initialize Husky          |

---

## 🎨 Tailwind CSS v4

This project uses **Tailwind CSS v4** (the latest version) with the new `@import 'tailwindcss'` syntax.

## 🗄️ Database Setup

Ensure your `.env` file has `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

Then run:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```
