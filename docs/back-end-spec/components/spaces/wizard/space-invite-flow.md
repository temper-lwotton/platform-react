# Component: SpaceInviteFlow

## Description
Member invitation step for the space creation wizard. Supports searching existing users, email invites with role assignment, invite link sharing, and CSV upload.

## Location
`src/components/spaces/wizard/SpaceInviteFlow.tsx`

## Props Interface

```typescript
interface SpaceInviteFlowProps {
  spaceData: SpaceData;
  setSpaceData: (data: SpaceData) => void;
  useAIDefaults: boolean;
}
```

## Data Requirements

### ExistingUser Type
```typescript
interface ExistingUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  username: string;
}
```

### Invite Type
```typescript
interface Invite {
  email: string;
  role: 'admin' | 'moderator' | 'member';
  name?: string;
  avatar?: string;
  userId?: string;
}
```

## Internal State

| State Variable | Type | Purpose |
|----------------|------|---------|
| `emailInput` | `string` | Bulk email input |
| `linkCopied` | `boolean` | Copy confirmation state |
| `userSearchQuery` | `string` | User search input |
| `searchResults` | `ExistingUser[]` | Search results |
| `isSearching` | `boolean` | Search loading state |

## Dependencies

### Icons
- `lucide-react` - Mail, UserPlus, Copy, CheckCircle, Upload, Sparkles, Users, Search, X

### Libraries
- None

## Events & Callbacks

| Event | Trigger | Description |
|-------|---------|-------------|
| `handleAddEmail` | Add button | Parses and adds email invites |
| `handleRemoveInvite` | Remove button | Removes invite from list |
| `handleRoleChange` | Role select | Updates invite role |
| `handleCopyLink` | Copy button | Copies invite link |
| `handleUserSearch` | Search input | Searches existing users |
| `handleAddExistingUser` | Add button | Adds existing user to invites |

## Styling
- **CSS Module**: `SpaceInviteFlow.module.scss`

## Features
- Search existing platform users
- Bulk email input (comma/newline separated)
- Role assignment (admin, moderator, member)
- Shareable invite link
- Copy link to clipboard
- CSV upload option
- Optional step (can skip)
- AI growth tips

## Email Parsing
```typescript
const handleAddEmail = () => {
  const emails = emailInput
    .split(/[\n,;]/)
    .map((e) => e.trim())
    .filter((e) => e && e.includes('@'));

  const newInvites = emails.map((email) => ({
    email,
    role: 'member' as const,
  }));

  setSpaceData({
    ...spaceData,
    invites: [...spaceData.invites, ...newInvites],
  });
};
```

## User Search (Simulated)
```typescript
const handleUserSearch = (query: string) => {
  // Simulate search delay
  setTimeout(() => {
    const results = existingUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  }, 300);
};
```

## UI Sections

### Header
- Title and description (optional step note)

### Layout (Two Columns)

#### Main Section
- **Search Existing Users**
  - Search input with clear button
  - Search results with:
    - Avatar
    - Name and username
    - Email
    - Add button (disabled if already added)
  - Empty/loading states

- **Email Invites**
  - Bulk email textarea
  - Add to Invite List button

- **Pending Invites List**
  - Invite count
  - Invite items with:
    - Avatar (if existing user)
    - Name (if available)
    - Email
    - Role dropdown
    - Remove button

- **CSV Upload Button**

#### Quick Options
- **Share Invite Link**
  - Link input (readonly)
  - Copy button with confirmation

- **Invite Later Card**
  - Skip note and reassurance

- **AI Tip**
  - Growth statistic about founding members

## Related Components
- Parent: `SpaceCreationWizard`
- Previous: `SpaceStructureBuilder`
- Next: `SpacePreview`
