'use client';

import * as Select from '@radix-ui/react-select';
import { Icon } from './Icon';
import { getMonthName } from '@/lib/calendar-utils';

interface MonthYearSelectorProps {
  currentMonth: number; // 0-11
  currentYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export function MonthYearSelector({
  currentMonth,
  currentYear,
  onMonthChange,
  onYearChange,
}: MonthYearSelectorProps) {
  // Generate year options (current year ± 5 years)
  const currentYearActual = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 11 },
    (_, i) => currentYearActual - 5 + i
  );

  // Month options (0-11)
  const monthOptions = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="month-year-selector">
      {/* Month Selector */}
      <Select.Root
        value={currentMonth.toString()}
        onValueChange={(value) => onMonthChange(parseInt(value))}
      >
        <Select.Trigger className="month-year-selector-trigger" aria-label="Select month">
          <Select.Value>
            {getMonthName(currentMonth)}
          </Select.Value>
          <Select.Icon className="month-year-selector-icon">
            <Icon icon="chevronDown" size={14} />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="month-year-selector-content" position="popper">
            <Select.Viewport className="month-year-selector-viewport">
              {monthOptions.map((month) => (
                <Select.Item
                  key={month}
                  value={month.toString()}
                  className="month-year-selector-item"
                >
                  <Select.ItemText>{getMonthName(month)}</Select.ItemText>
                  <Select.ItemIndicator className="month-year-selector-indicator">
                    ✓
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {/* Year Selector */}
      <Select.Root
        value={currentYear.toString()}
        onValueChange={(value) => onYearChange(parseInt(value))}
      >
        <Select.Trigger className="month-year-selector-trigger" aria-label="Select year">
          <Select.Value>
            {currentYear}
          </Select.Value>
          <Select.Icon className="month-year-selector-icon">
            <Icon icon="chevronDown" size={14} />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="month-year-selector-content" position="popper">
            <Select.Viewport className="month-year-selector-viewport">
              {yearOptions.map((year) => (
                <Select.Item
                  key={year}
                  value={year.toString()}
                  className="month-year-selector-item"
                >
                  <Select.ItemText>{year}</Select.ItemText>
                  <Select.ItemIndicator className="month-year-selector-indicator">
                    ✓
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
