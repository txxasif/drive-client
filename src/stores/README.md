# Zustand State Management

This project uses [Zustand](https://github.com/pmndrs/zustand) for state management. Zustand is a small, fast and scalable bear-necessities state management solution.

## Store Structure

The state management is organized into the following stores:

### File Store (`fileStore.ts`)

Manages file and folder operations including:

- Navigation (current path, breadcrumbs)
- File operations (upload, share, delete)
- Folder operations (create, navigate)
- Modal states (upload, share, new folder)

### Display Store (`displayStore.ts`)

Manages UI related state including:

- View preferences (grid/list view)
- Sorting options (name, size, type, modified)
- Filtering (by file type)
- Search functionality
- Selection and context menu

### Theme Store (`themeStore.ts`)

Manages theme-related state:

- Current theme (light/dark)
- Theme toggling
- Theme persistence

## How to Use Stores

### Basic Usage

```tsx
import { useFileStore } from "../stores/fileStore";
import { useDisplayStore } from "../stores/displayStore";
import { useThemeStore } from "../stores/themeStore";

function MyComponent() {
  // Access state from the store
  const currentPath = useFileStore((state) => state.currentPath);

  // Access actions from the store
  const handleNavigate = useFileStore((state) => state.handleNavigate);

  // Theme state and actions
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div>
      <p>Current path: {currentPath}</p>
      <button onClick={() => handleNavigate("/")}>Go to root</button>
      <button onClick={toggleTheme}>Toggle theme (current: {theme})</button>
    </div>
  );
}
```

### Advanced Usage with Selectors

For performance optimization, use selectors to only re-render when specific parts of the state change:

```tsx
import { useFileStore } from "../stores/fileStore";

function FileList() {
  // This component will only re-render when files change
  const files = useFileStore((state) => state.files);

  return (
    <ul>
      {files.map((file) => (
        <li key={file.id}>{file.name}</li>
      ))}
    </ul>
  );
}
```

## Store Persistence

The theme store uses the `persist` middleware to save the theme preference to localStorage.

## Adding New State

To add new state or actions to an existing store:

1. Add the new state/action to the store interface
2. Implement the state/action in the store creation function
3. Use the new state/action in your components

Example:

```tsx
// 1. Update the interface
interface FileState {
  // existing state...
  isFileDetailOpen: boolean;
  openFileDetail: (fileId: string) => void;
  closeFileDetail: () => void;
  // ...
}

// 2. Implement in the store
export const useFileStore = create<FileState>((set) => ({
  // existing implementation...
  isFileDetailOpen: false,
  openFileDetail: (fileId) =>
    set({ isFileDetailOpen: true, selectedFileId: fileId }),
  closeFileDetail: () => set({ isFileDetailOpen: false }),
  // ...
}));

// 3. Use in components
const { isFileDetailOpen, openFileDetail } = useFileStore();
```

## Creating New Stores

To create a new store:

1. Create a new file in the `stores` directory
2. Define the state interface
3. Create the store using `create` from zustand
4. Export the store hook

For more information, refer to the [Zustand documentation](https://github.com/pmndrs/zustand).
