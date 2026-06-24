# UI Components

This directory contains reusable UI components organized for maintainability and clarity.

## Structure

- **Buttons**: Button-related components
- **Forms**: Form-related components (input, textarea, select, etc.)
- **Modals**: Modal and dialog-related components
- **Root Level**: Core components (Card, Badge, Alert, etc.)

## Usage

Import components using their PascalCase names:

```tsx
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
```

## Component Naming Convention

All components follow PascalCase naming:

- `Button.tsx` - Button component
- `Input.tsx` - Input component
- `DropdownMenu.tsx` - Dropdown menu component
- etc.

This ensures consistency and makes it easy to identify components as React components.
