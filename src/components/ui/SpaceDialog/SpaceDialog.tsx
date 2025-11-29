'use client';

import * as Dialog from '@radix-ui/react-dialog';
import styles from './SpaceDialog.module.scss';

interface SpaceDialogProps {
    triggerLabel: string;
    title: string;
    description?: string;
}

export function SpaceDialog({ triggerLabel, title, description }: SpaceDialogProps) {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button type="button">
                    {triggerLabel}
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={styles.content}>
                    <Dialog.Title>{title}</Dialog.Title>
                    {description && <Dialog.Description>{description}</Dialog.Description>}
                    <Dialog.Close asChild>
                        <button type="button">
                            Close
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
