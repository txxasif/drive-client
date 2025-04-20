# System Patterns: FileDrive Architecture

## Design Patterns

### 1. Component Patterns

#### Atomic Design Implementation

- **Atoms**: Buttons, inputs, icons, typography
- **Molecules**: File cards, folder cards, breadcrumb items, context menu items
- **Organisms**: File lists, navigation sidebar, search header, context menus
- **Templates**: Dashboard layout, modal templates
- **Pages**: Dashboard, shared files, settings

#### Component Composition

- Prefer composition over inheritance
- Components should be focused on single responsibilities
- Use of React's children prop for flexible component APIs
- Higher-order components used sparingly and only when necessary

### 2. State Management

#### Local vs. Global State

- **Local State**: Component-specific UI state (hover, focus, etc.)
- **Global State**: User data, file/folder structure, sharing info

#### Data Flow Patterns

- Unidirectional data flow (parent to child)
- Context API for theme and user preferences
- Custom hooks for reusable business logic

### 3. UI Patterns

#### Navigation Patterns

- Breadcrumb for hierarchy navigation
- Sidebar for main section navigation
- Tabs for sub-section switching
- "Back" navigation always available

#### Data Display Patterns

- Grid view for visual file browsing
- List view for detailed information
- Unified files and folders view (OS-like)
- Empty states for zero-data scenarios
- Loading states for asynchronous operations
- Error states for failed operations

#### Interaction Patterns

- Click for primary actions
- Hover for revealing secondary actions
- Right-click for context menus (OS-like)
- Long-press for context menus on touch devices
- Drag and drop for spatial operations
- Context menus for advanced actions
- Keyboard navigation for power users

### 4. Animation Patterns

#### Purpose-Driven Animation

- **Hierarchy**: Animations emphasize information hierarchy
- **Feedback**: Visual feedback for user actions
- **Continuity**: Maintain context during transitions
- **Attention**: Guide user focus to important elements

#### Animation Timing

- Quick animations (150-250ms) for UI feedback
- Medium animations (300-500ms) for transitions
- Staggered animations for lists and grids

## Architecture Patterns

### 1. Frontend Architecture

#### Folder Structure

```
src/
├── components/
│   ├── ui/          # Base UI components
│   ├── elements/    # Reusable element components
│   ├── layouts/     # Layout components
│   └── features/    # Feature-specific components
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── services/        # API service layer
├── context/         # React context providers
└── app/             # Next.js app router pages
```

#### Code Organization

- Feature-first organization for larger features
- Shared components in dedicated directories
- Page components at the app directory root

### 2. API Integration

#### Data Fetching Strategy

- React Query for data fetching, caching, and synchronization
- Custom API client with interceptors for auth and error handling
- Type-safe API responses with TypeScript interfaces

#### Error Handling

- Centralized error handling at API level
- Specific error handling at component level
- User-friendly error messages and recovery options

### 3. Performance Patterns

#### Bundle Optimization

- Dynamic imports for code splitting
- Lazy loading for non-critical components
- Image optimization using Next.js Image component

#### Rendering Optimization

- Memoization of expensive calculations
- Virtualization for long lists
- Throttling/debouncing for frequent events

### 4. Testing Strategy

#### Component Testing

- Unit tests for utility functions
- Component tests for UI components
- Integration tests for feature workflows

#### Test Organization

- Tests co-located with components
- Shared test utilities
- Mocked API responses

## Architecture Overview

The FileDrive application follows a component-based architecture using React and Next.js, with a focus on maintainability, performance, and user experience.

### Architecture Decisions

1. **Component Structure**

   - **Atomic Design Methodology**: Using atoms, molecules, organisms, templates, and pages
   - **Functional Components**: All components are functional with React hooks
   - **Component Co-location**: Related files (component, tests, styles) kept together
   - **Modal Pattern**: Using a modal system for user interactions like creating new folders and uploading files
   - **Context Menu Pattern**: Right-click context menus for OS-like file operations

2. **State Management**

   - **React Context API**: For global state management
   - **Local Component State**: For component-specific state
   - **Reducers**: For complex state logic in specific components

3. **Styling Approach**

   - **Tailwind CSS**: For utility-based styling
   - **CSS Modules**: For component-specific styles when needed
   - **CSS Variables**: For theme configuration
   - **Responsive Design**: Mobile-first approach using Tailwind breakpoints

4. **Data Handling**

   - **Data Fetching**: Using React Query for API interactions
   - **Loading States**: Skeleton loaders for content
   - **Error Handling**: Centralized error UI components
   - **Optimistic Updates**: For improved perceived performance

5. **Form Handling**

   - **Form Validation**: Client-side validation with helpful error messages
   - **Form Submission**: Handling both normal and error cases
   - **Input Components**: Reusable form elements with consistent styling

6. **File System Structure**
   - **Feature-Based Organization**: Components grouped by feature
   - **Shared Components**: Common UI elements in shared directory
   - **Utils**: Helper functions in utils directory
   - **Types**: TypeScript types in dedicated files

## Component Patterns

### Context Menu Component

- **Base Implementation**: Foundation for OS-like right-click menus
- **Portal Rendering**: Using React Portals for proper z-index handling
- **Position Adjustment**: Auto-adjustment to stay within viewport
- **Animation**: Smooth entrance/exit animations
- **Accessibility**: Keyboard navigation and screen reader support
- **Event Handling**: Click outside detection and escape key support

### Modal Components

- **Base Modal**: Foundation for all modal components
- **NewFolderModal**: For creating new folders
- **FileUploadModal**: For uploading files with progress tracking
- **Animations**: Consistent enter/exit animations with Framer Motion

### File Upload Components

- **Dropzone**: Drag and drop area for file uploads
- **FileList**: Shows files queued for upload
- **ProgressBar**: Visualizes upload progress
- **FileTypeValidation**: Client-side validation of file types
- **Error Messaging**: Clear user feedback on upload issues

### Layout Components

- **Dashboard Layout**: Main application layout with sidebar and content area
- **Sidebar**: Navigation and filter options
- **Header**: App header with search and user menu
- **Content Area**: Main content display with file grid or list

### File/Folder Display Components

- **Unified View**: Combined files and folders in a single view
- **List View**: Detailed tabular view with metadata columns
- **Grid View**: Visual card-based view for files and folders
- **EmptyState**: Shown when no files/folders exist
- **Sorting & Filtering**: Controls for organizing content

### Navigation Components

- **Breadcrumbs**: Show current location in folder hierarchy
- **Pagination**: For navigating large file lists
- **SortControls**: For changing sort order of files/folders
- **FilterControls**: For filtering files by type

### Search Components

- **SearchBar**: Input for search queries
- **SearchResults**: Display of search results
- **FilterOptions**: Refinement of search results

## Design System

### Colors

- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Background: White (#FFFFFF) / Dark Gray (#1F2937) for dark mode

### Typography

- Headings: Inter, sans-serif
- Body: Inter, sans-serif
- Monospace: Roboto Mono, monospace

### Spacing

- 4px base unit
- Consistent spacing scale using Tailwind's default scale

### Shadows

- sm: Small shadow for cards
- md: Medium shadow for modals
- lg: Large shadow for dropdowns

### Borders

- Radius: 8px for cards, 12px for modals
- Width: 1px for subtle borders, 2px for emphasis

### Animations

- Transitions: 150ms for hover states, 300ms for modals
- Easing: Ease-in-out for natural movement
- Loading: Skeleton loaders with pulse animation

## Integration Patterns

### API Interactions

- RESTful API calls with consistent error handling
- File upload using FormData and progress tracking
- Caching strategies for improved performance

### Authentication

- JWT-based authentication
- Protected routes with redirect to login
- Session management with refresh tokens

### Error Handling

- Client-side validation to prevent unnecessary API calls
- Toast notifications for user feedback
- Fallback UI for error states
- Retry mechanism for transient failures

## Context Menu Implementation

### Architecture

- **Portal-Based Rendering**: Context menus render at the document root level for proper stacking
- **Position Calculation**: Adjusts menu position to stay within viewport boundaries
- **Event Delegation**: Uses bubbling for efficient event handling
- **Item Configuration**: Declarative menu item configuration with icons and actions

### Interaction Model

- **Right-Click Trigger**: Standard desktop activation method
- **Long-Press Alternative**: For touch devices
- **Keyboard Support**: Escape to dismiss, arrow keys to navigate (planned)
- **Click Outside**: Automatically dismisses when clicking elsewhere

### Type Handling

- **Dynamic Item Generation**: Different menu items based on file/folder context
- **Type-Safe Props**: Strong TypeScript typing for menu items and handlers
- **Icon Integration**: Visual indicators for different actions

### Styling Approach

- **Consistent Design Language**: Matches OS-native menus in style
- **Animation**: Subtle scale and fade animations for natural feel
- **Mobile Considerations**: Adjusts for touch targets on smaller screens

## Unified File Browser Pattern

### Architecture

- **Combined Data Structure**: Files and folders in a single unified list
- **Consistent Item Interface**: Common properties across both types
- **Type Differentiation**: Type discriminators for specialized handling
- **View Switching**: Toggle between list and grid presentations

### Sorting & Filtering

- **Multi-property Sorting**: By name, date, size, type
- **Direction Toggle**: Ascending/descending sort order
- **Type Filtering**: Filter by file type or folders only
- **Search Integration**: Text-based filtering across all items

### Interaction Model

- **Right-Click Context**: OS-like context menus for both file and folder items
- **Grid/List Toggle**: User preference for visual density
- **Breadcrumb Navigation**: For folder hierarchy traversal
- **Bulk Selection**: Select multiple items for batch operations (planned)

## Performance Considerations

- **Code Splitting**: Dynamic imports for larger components
- **Image Optimization**: Next.js Image component with proper sizing
- **Bundle Size Monitoring**: Regular checks on bundle size
- **Virtualization**: For large lists of files/folders
- **Debouncing**: For search and other frequent user inputs
- **Memoization**: For expensive calculations and renders
