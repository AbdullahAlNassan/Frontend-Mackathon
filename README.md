Frontend Template – Mackathon Project

Dit is de frontend template voor het Mackathon-project.
Gebouwd met React, TypeScript en Vite, met een duidelijke en schaalbare structuur.
Het doel is om samenwerking eenvoudig te maken en herbruikbare UI-componenten te bieden.

📂 Folderstructuur
src/
┣ components/
┃ ┣ Layout/ # Header, Sidebar, Content, Layout
┃ ┗ ui/ # Button, Input, Select, Checkbox, Loader, Modal
┣ composables/ # Custom hooks
┣ pages/ # LoginPage, PlaceholderPage
┣ styles/ # globals.css, tokens.css
┗ types/ # ui.ts, auth.ts

🔤 Naamgeving
Type Notatie Voorbeeld
Component / bestand PascalCase Button.tsx, LoginPage.tsx
Variabelen / functies / props camelCase handleClick, userEmail
Hooks use + camelCase useAuth, useFetch
🎨 Styling & 4px Grid System

Gebruik de variabelen uit src/styles/tokens.css.

Spacing:
--space-4, --space-8, --space-12, --space-16, --space-24, --space-32, --space-40

Kleuren:
--color-primary, --color-error, --color-border, --color-surface, --color-text

Radii:
--radius-sm, --radius-md, --radius-lg

Shadows:
--shadow-sm, --shadow-md

Alle afstanden volgen het 4px-grid (4, 8, 12, 16, 20, 24 px, enz.)

⚙️ Importeren (Barrel)

Gebruik barrel exports voor compacte imports:

import { Button, Input, Checkbox, Select, Loader, Modal } from "@/components/ui";

🧱 UI Componenten
Button

Props:

Prop Type Default
variant "primary" | "ghost" "primary"
size "sm" | "md" | "lg" "md"
isLoading boolean false

Voorbeelden:

<Button variant="primary">Opslaan</Button>
<Button variant="ghost" size="sm">Annuleren</Button>
<Button size="lg" isLoading>Opslaan...</Button>
<Button disabled>Niet klikbaar</Button>

Input

Props:

Prop Type
label? string
error? string
helperText? ReactNode

Voorbeeld:

<Input
label="E-mail"
name="email"
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
error={errors.email}
/>

Select (controlled)

Props:

Prop Type
label? string
options { label: string; value: string }[]
value string
onChange (value: string) => void
placeholder? string
error? string

Voorbeeld:

const [role, setRole] = useState("");

<Select
label="Rol"
value={role}
onChange={setRole}
options={[
{ label: "Gebruiker", value: "user" },
{ label: "Beheerder", value: "admin" },
]}
/>

Checkbox

Props:

Prop Type
label? string
checked boolean
onChange (e: React.ChangeEvent<HTMLInputElement>) => void
error? string

Voorbeeld:

<Checkbox
label="Onthoud mij"
checked={remember}
onChange={(e) => setRemember(e.target.checked)}
/>

Modal

Props:

Prop Type
open boolean
onClose () => void
title? string
children ReactNode

Voorbeeld:

const [open, setOpen] = useState(false);

<>
<Button onClick={() => setOpen(true)}>Open modal</Button>
<Modal open={open} onClose={() => setOpen(false)} title="Voorbeeld">

<p>Inhoud van de modal</p>
<div className="inline">
<Button onClick={() => setOpen(false)}>Oké</Button>
<Button variant="ghost" onClick={() => setOpen(false)}>Annuleren</Button>
</div>
</Modal>
</>

🧩 TypeScript

Alle componenten zijn sterk getypeerd (geen any).
Herbruikbare types staan in /src/types.

Voorbeeld (Select):

export type Option = { label: string; value: string };

Validatie (zoals login) gebruikt Zod + z.infer voor automatische type-afleiding.

🧭 Layout Structuur

De layout is mobile-first en gebruikt een eenvoudig grid-systeem:

.app-shell {
display: grid;
grid-template-rows: auto 1fr;
min-height: 100vh;
}

.app-body {
display: grid;
grid-template-columns: 1fr; /_ mobiel _/
}

@media (min-width: 1024px) {
.app-body {
grid-template-columns: 260px 1fr; /_ desktop _/
}
}

Componenten:

Header – bovenbalk

Sidebar – navigatie (verborgen op mobiel)

Content – hoofdgedeelte

Layout – combineert alles

✅ Statusoverzicht
Onderdeel Status
4px grid & tokens ✅
Layout (Header, Sidebar, Content) ✅
Responsive structuur ✅
Globale CSS-variabelen ✅
Reusable components ✅
Strong TypeScript ✅
Documentatie & barrel exports ✅

Template volledig afgerond.
