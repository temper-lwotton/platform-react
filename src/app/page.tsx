// src/app/page.tsx
import { SpaceDialog } from '@/components/ui/SpaceDialog';

export default function HomePage() {
    return (
        <main>
            <h1>Spaces Frontend</h1>
            <SpaceDialog
                triggerLabel="Open intro"
                title="Welcome to Spaces"
                description="This is a Radix-based dialog."
            />
        </main>
    );
}
