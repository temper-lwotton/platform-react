'use client';

interface TypingIndicatorProps {
    names?: string[];
}

export function TypingIndicator({ names = [] }: TypingIndicatorProps) {
    if (names.length === 0) return null;

    const displayText = names.length === 1
        ? `${names[0]} is typing`
        : names.length === 2
            ? `${names[0]} and ${names[1]} are typing`
            : `${names[0]} and ${names.length - 1} others are typing`;

    return (
        <div className="typing-indicator">
            <div className="typing-indicator-dots">
                <span className="typing-indicator-dot" />
                <span className="typing-indicator-dot" />
                <span className="typing-indicator-dot" />
            </div>
            <span className="typing-indicator-text">{displayText}</span>
        </div>
    );
}
