'use client';

import { useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Label from '@radix-ui/react-label';
import { Icon } from '../Icon';
import styles from './ExcerptSelector.module.scss';

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
        <div className={styles.selector}>
            <Label.Root className={styles.label}>
                Choose an Excerpt
            </Label.Root>

            <RadioGroup.Root
                value={selectedOption}
                onValueChange={handleValueChange}
                className={styles.options}
            >
                {excerpts.map((excerpt, index) => (
                    <label
                        key={index}
                        className={styles.option}
                        htmlFor={`excerpt-${index}`}
                    >
                        <RadioGroup.Item
                            value={excerpt}
                            id={`excerpt-${index}`}
                            className={styles.radio}
                        >
                            <RadioGroup.Indicator className={styles.radioIndicator} />
                        </RadioGroup.Item>
                        <div className={styles.text}>
                            {excerpt}
                        </div>
                    </label>
                ))}

                <label
                    className={`${styles.option} ${styles.optionCustom}`}
                    htmlFor="excerpt-custom"
                >
                    <RadioGroup.Item
                        value="custom"
                        id="excerpt-custom"
                        className={styles.radio}
                    >
                        <RadioGroup.Indicator className={styles.radioIndicator} />
                    </RadioGroup.Item>
                    <div className={styles.customContent}>
                        <div className={styles.customHeader}>
                            <Icon icon="pencil" size={16} className={styles.customIcon} />
                            <span className={styles.customLabel}>Write your own</span>
                        </div>
                        {isCustomSelected && (
                            <textarea
                                className={styles.customInput}
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

            <div className={styles.characterCount} data-valid={isWithinLimit}>
                {charCount}/200 characters
                {!isWithinLimit && charCount < 30 && (
                    <span className={styles.countHint}> (minimum 30)</span>
                )}
                {!isWithinLimit && charCount > 200 && (
                    <span className={styles.countHint}> (maximum 200)</span>
                )}
            </div>
        </div>
    );
}
