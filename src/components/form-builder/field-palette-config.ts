import { FieldPaletteItem, FieldType } from '@/types/form-builder';

export const FIELD_PALETTE_ITEMS: FieldPaletteItem[] = [
  {
    type: 'text',
    icon: 'Type',
    label: 'Text Input',
    description: 'Single line text input',
    defaultConfig: {
      label: 'Text Field',
      placeholder: 'Enter text...',
      validations: [],
      width: 'full',
    },
  },
  {
    type: 'textarea',
    icon: 'AlignLeft',
    label: 'Text Area',
    description: 'Multi-line text input',
    defaultConfig: {
      label: 'Text Area',
      placeholder: 'Enter your message...',
      rows: 4,
      validations: [],
      width: 'full',
    },
  },
  {
    type: 'email',
    icon: 'Mail',
    label: 'Email',
    description: 'Email address input',
    defaultConfig: {
      label: 'Email Address',
      placeholder: 'you@example.com',
      validations: [
        {
          id: 'email-pattern',
          type: 'email',
          message: 'Please enter a valid email address',
        },
      ],
      width: 'full',
    },
  },
  {
    type: 'number',
    icon: 'Hash',
    label: 'Number',
    description: 'Numeric input',
    defaultConfig: {
      label: 'Number',
      placeholder: '0',
      validations: [],
      width: 'full',
    },
  },
  {
    type: 'tel',
    icon: 'Phone',
    label: 'Phone',
    description: 'Phone number input',
    defaultConfig: {
      label: 'Phone Number',
      placeholder: '+1 (555) 000-0000',
      validations: [],
      width: 'full',
    },
  },
  {
    type: 'select',
    icon: 'ChevronDown',
    label: 'Select',
    description: 'Dropdown selection',
    defaultConfig: {
      label: 'Select an option',
      placeholder: 'Choose...',
      options: [
        { id: '1', label: 'Option 1', value: 'option1' },
        { id: '2', label: 'Option 2', value: 'option2' },
        { id: '3', label: 'Option 3', value: 'option3' },
      ],
      validations: [],
      width: 'full',
    },
  },
  {
    type: 'radio',
    icon: 'Circle',
    label: 'Radio Group',
    description: 'Single choice from options',
    defaultConfig: {
      label: 'Choose one',
      options: [
        { id: '1', label: 'Option 1', value: 'option1' },
        { id: '2', label: 'Option 2', value: 'option2' },
        { id: '3', label: 'Option 3', value: 'option3' },
      ],
      validations: [],
      width: 'full',
    },
  },
  {
    type: 'checkbox',
    icon: 'CheckSquare',
    label: 'Checkbox',
    description: 'Single checkbox',
    defaultConfig: {
      label: 'I agree to the terms and conditions',
      validations: [],
      width: 'full',
    },
  },
  {
    type: 'checkbox-group',
    icon: 'ListChecks',
    label: 'Checkbox Group',
    description: 'Multiple choice from options',
    defaultConfig: {
      label: 'Select all that apply',
      options: [
        { id: '1', label: 'Option 1', value: 'option1' },
        { id: '2', label: 'Option 2', value: 'option2' },
        { id: '3', label: 'Option 3', value: 'option3' },
      ],
      validations: [],
      width: 'full',
    },
  },
  {
    type: 'date',
    icon: 'Calendar',
    label: 'Date',
    description: 'Date picker',
    defaultConfig: {
      label: 'Select a date',
      validations: [],
      width: 'full',
    },
  },
  {
    type: 'time',
    icon: 'Clock',
    label: 'Time',
    description: 'Time picker',
    defaultConfig: {
      label: 'Select a time',
      validations: [],
      width: 'full',
    },
  },
  {
    type: 'file',
    icon: 'Upload',
    label: 'File Upload',
    description: 'File upload input',
    defaultConfig: {
      label: 'Upload file',
      helpText: 'Max file size: 10MB',
      validations: [],
      width: 'full',
    },
  },
  {
    type: 'switch',
    icon: 'ToggleRight',
    label: 'Switch',
    description: 'Toggle switch',
    defaultConfig: {
      label: 'Enable notifications',
      validations: [],
      width: 'full',
    },
  },
  {
    type: 'rating',
    icon: 'Star',
    label: 'Rating',
    description: 'Star rating input',
    defaultConfig: {
      label: 'Rate your experience',
      max: 5,
      validations: [],
      width: 'full',
    },
  },
  {
    type: 'slider',
    icon: 'SlidersHorizontal',
    label: 'Slider',
    description: 'Range slider',
    defaultConfig: {
      label: 'Select a value',
      min: 0,
      max: 100,
      step: 1,
      validations: [],
      width: 'full',
    },
  },
  {
    type: 'signature',
    icon: 'PenTool',
    label: 'Signature',
    description: 'Signature pad for drawing',
    defaultConfig: {
      label: 'Your Signature',
      helpText: 'Draw your signature in the box below',
      validations: [],
      width: 'full',
    },
  },
  {
    type: 'color',
    icon: 'Palette',
    label: 'Color Picker',
    description: 'Color selection input',
    defaultConfig: {
      label: 'Choose a color',
      defaultValue: '#3b82f6',
      validations: [],
      width: 'half',
    },
  },
  {
    type: 'url',
    icon: 'Link',
    label: 'URL',
    description: 'Website URL input',
    defaultConfig: {
      label: 'Website URL',
      placeholder: 'https://example.com',
      validations: [
        {
          id: 'url-pattern',
          type: 'url',
          message: 'Please enter a valid URL',
        },
      ],
      width: 'full',
    },
  },
  {
    type: 'currency',
    icon: 'DollarSign',
    label: 'Currency',
    description: 'Monetary value input',
    defaultConfig: {
      label: 'Amount',
      placeholder: '0.00',
      helpText: 'Enter amount in USD',
      validations: [],
      width: 'half',
    },
  },
  {
    type: 'file-multiple',
    icon: 'Files',
    label: 'Multi-File Upload',
    description: 'Multiple file upload',
    defaultConfig: {
      label: 'Upload files',
      helpText: 'You can upload multiple files (max 10MB each)',
      multiple: true,
      validations: [],
      width: 'full',
    },
  },
];

export function getFieldPaletteItem(type: FieldType): FieldPaletteItem | undefined {
  return FIELD_PALETTE_ITEMS.find((item) => item.type === type);
}
