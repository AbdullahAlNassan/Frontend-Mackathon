# UI Kit – Richtlijnen

## Naamgeving

- Components en bestanden → **PascalCase** (bijv. `Button.tsx`, `LoginPage.tsx`)
- Variabelen, functies, props → **camelCase**
- Hooks → beginnen met `use` (bijv. `useAuth`)

## Tokens & 4px grid

Gebruik variabelen uit `src/styles/tokens.css`:

- Spacing: `--space-4`, `--space-8`, `--space-12`, ...
- Kleuren: `--color-primary`, `--color-error`, `--color-border`
- Radii & Shadows: `--radius-sm/md/lg`, `--shadow-sm/md`

## Component API's

### 🟦 Button

**Props:**

- `variant?: "primary" | "ghost"`
- `isLoading?: boolean`
- alle standaard button props

**Voorbeeld:**

```tsx
<Button variant="primary">Opslaan</Button>
<Button variant="ghost" disabled>Annuleren</Button>
```
