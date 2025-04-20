# Design Principles for File Upload Platform

## 1. Consistency

- Use Tailwind utility classes for all styling; avoid custom CSS unless necessary.
- Stick to the color palette defined in `tailwind.config.mjs` (primary, gray, etc.).
- Use consistent spacing, border radius, and typography throughout the app.

## 2. Responsiveness

- All layouts must be mobile-first and fully responsive.
- Use Tailwind's responsive utilities (`sm:`, `md:`, `lg:`, `xl:`) for adaptive design.

## 3. Accessibility

- Use semantic HTML elements.
- Ensure sufficient color contrast for text and UI elements.
- All interactive elements must be keyboard accessible and have focus states.

## 4. Simplicity & Clarity

- Favor clear, readable layouts with plenty of whitespace.
- Use concise, descriptive text for buttons and headings.
- Avoid visual clutter; every element must have a clear purpose.

## 5. Reusable Components

- Build UI as reusable React components.
- Use Tailwind's `@apply` for repeated utility patterns in `globals.css`.

## 6. Animation & Feedback

- Use Tailwind's transition and animation utilities for smooth UI feedback.
- Loading, error, and success states must be visually distinct.

## 7. Branding

- Use the primary color palette for key actions and highlights.
- Maintain a modern, clean, and professional look.

---

**All new pages and components must adhere to these principles.**
