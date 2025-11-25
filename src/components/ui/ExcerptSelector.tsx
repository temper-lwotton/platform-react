'use client';

import { useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Label from '@radix-ui/react-label';

interface ExcerptSelectorProps {
    excerpts: string[];
    value: string;
    onChange: (value: string) => void;
    onCustomChange: (value: string) => void;
    customExcerpt: string;
}

export function ExcerptSelector({
    excerpts,
    value,
    onChange,
    onCustomChange,
    customExcerpt,
}: ExcerptSelectorProps) {
    const [selectedOption, setSelectedOption] = useState<string>(
        value || (excerpts.length > 0 ? excerpts[1] : 'custom')
    );

    const handleValueChange = (newValue: string) => {
        setSelectedOption(newValue);
        if (newValue === 'custom') {
            onChange(customExcerpt);
        } else {
            onChange(newValue);
        }
    };

    const handleCustomInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        onCustomChange(newValue);
        if (selectedOption === 'custom') {
            onChange(newValue);
        }
    };

    const getCharacterCount = (text: string) => {
        return text.length;
    };

    const isCustomSelected = selectedOption === 'custom';
    const displayText = isCustomSelected ? customExcerpt : selectedOption;
    const charCount = getCharacterCount(displayText);
    const isWithinLimit = charCount >= 30 && charCount <= 200;

    return (
        <div className="excerpt-selector">
            <Label.Root className="excerpt-selector-label">
                Choose an Excerpt
            </Label.Root>

            <RadioGroup.Root
                value={selectedOption}
                onValueChange={handleValueChange}
                className="excerpt-selector-options"
            >
                {excerpts.map((excerpt, index) => (
                    <label
                        key={index}
                        className="excerpt-option"
                        htmlFor={`excerpt-${index}`}
                    >
                        <RadioGroup.Item
                            value={excerpt}
                            id={`excerpt-${index}`}
                            className="excerpt-radio"
                        >
                            <RadioGroup.Indicator className="excerpt-radio-indicator" />
                        </RadioGroup.Item>
                        <div className="excerpt-text">
                            {excerpt}
                        </div>
                    </label>
                ))}

                <label
                    className="excerpt-option excerpt-option-custom"
                    htmlFor="excerpt-custom"
                >
                    <RadioGroup.Item
                        value="custom"
                        id="excerpt-custom"
                        className="excerpt-radio"
                    >
                        <RadioGroup.Indicator className="excerpt-radio-indicator" />
                    </RadioGroup.Item>
                    <div className="excerpt-custom-content">
                        <div className="excerpt-custom-header">
                            <span className="excerpt-custom-icon">✏️</span>
                            <span className="excerpt-custom-label">Write your own</span>
                        </div>
                        {isCustomSelected && (
                            <textarea
                                className="excerpt-custom-input"
                                placeholder="Enter your custom excerpt..."
                                value={customExcerpt}
                                onChange={handleCustomInput}
                                rows={3}
                                maxLength={200}
                            />
                        )}
                    </div>
                </label>
            </RadioGroup.Root>

            <div className="excerpt-character-count" data-valid={isWithinLimit}>
                {charCount}/200 characters
                {!isWithinLimit && charCount < 30 && (
                    <span className="excerpt-count-hint"> (minimum 30)</span>
                )}
                {!isWithinLimit && charCount > 200 && (
                    <span className="excerpt-count-hint"> (maximum 200)</span>
                )}
            </div>
        </div>
    );
}
