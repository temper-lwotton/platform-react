import { FieldTemplate } from '@/types/form-builder';

export const BUILT_IN_TEMPLATES: FieldTemplate[] = [
  // Contact templates
  {
    id: 'template-email',
    name: 'Email Address',
    description: 'Email field with validation',
    category: 'contact',
    isBuiltIn: true,
    field: {
      type: 'email',
      label: 'Email Address',
      placeholder: 'you@example.com',
      required: true,
      validations: [
        {
          id: 'email-validation',
          type: 'required',
          message: 'Email is required',
        },
        {
          id: 'email-format',
          type: 'email',
          message: 'Please enter a valid email address',
        },
      ],
      width: 'full',
    },
  },
  {
    id: 'template-phone',
    name: 'Phone Number',
    description: 'Phone field with formatting',
    category: 'contact',
    isBuiltIn: true,
    field: {
      type: 'tel',
      label: 'Phone Number',
      placeholder: '(555) 123-4567',
      required: true,
      validations: [
        {
          id: 'phone-required',
          type: 'required',
          message: 'Phone number is required',
        },
      ],
      width: 'full',
    },
  },
  {
    id: 'template-full-name',
    name: 'Full Name',
    description: 'Single field for full name',
    category: 'contact',
    isBuiltIn: true,
    field: {
      type: 'text',
      label: 'Full Name',
      placeholder: 'John Doe',
      required: true,
      validations: [
        {
          id: 'name-required',
          type: 'required',
          message: 'Name is required',
        },
        {
          id: 'name-min',
          type: 'minLength',
          value: 2,
          message: 'Name must be at least 2 characters',
        },
      ],
      width: 'full',
    },
  },

  // Address templates
  {
    id: 'template-street-address',
    name: 'Street Address',
    description: 'Street address field',
    category: 'address',
    isBuiltIn: true,
    field: {
      type: 'text',
      label: 'Street Address',
      placeholder: '123 Main St',
      required: true,
      validations: [
        {
          id: 'address-required',
          type: 'required',
          message: 'Street address is required',
        },
      ],
      width: 'full',
    },
  },
  {
    id: 'template-city',
    name: 'City',
    description: 'City field',
    category: 'address',
    isBuiltIn: true,
    field: {
      type: 'text',
      label: 'City',
      placeholder: 'New York',
      required: true,
      validations: [
        {
          id: 'city-required',
          type: 'required',
          message: 'City is required',
        },
      ],
      width: 'half',
    },
  },
  {
    id: 'template-state',
    name: 'State/Province',
    description: 'State or province selector',
    category: 'address',
    isBuiltIn: true,
    field: {
      type: 'select',
      label: 'State',
      required: true,
      options: [
        { id: 'state-ny', label: 'New York', value: 'NY' },
        { id: 'state-ca', label: 'California', value: 'CA' },
        { id: 'state-tx', label: 'Texas', value: 'TX' },
        { id: 'state-fl', label: 'Florida', value: 'FL' },
      ],
      validations: [
        {
          id: 'state-required',
          type: 'required',
          message: 'State is required',
        },
      ],
      width: 'half',
    },
  },
  {
    id: 'template-zip',
    name: 'ZIP/Postal Code',
    description: 'ZIP or postal code field',
    category: 'address',
    isBuiltIn: true,
    field: {
      type: 'text',
      label: 'ZIP Code',
      placeholder: '10001',
      required: true,
      validations: [
        {
          id: 'zip-required',
          type: 'required',
          message: 'ZIP code is required',
        },
        {
          id: 'zip-pattern',
          type: 'pattern',
          value: '^[0-9]{5}(-[0-9]{4})?$',
          message: 'Please enter a valid ZIP code',
        },
      ],
      width: 'half',
    },
  },
  {
    id: 'template-country',
    name: 'Country',
    description: 'Country selector',
    category: 'address',
    isBuiltIn: true,
    field: {
      type: 'select',
      label: 'Country',
      required: true,
      options: [
        { id: 'country-us', label: 'United States', value: 'US' },
        { id: 'country-ca', label: 'Canada', value: 'CA' },
        { id: 'country-uk', label: 'United Kingdom', value: 'UK' },
        { id: 'country-au', label: 'Australia', value: 'AU' },
      ],
      validations: [
        {
          id: 'country-required',
          type: 'required',
          message: 'Country is required',
        },
      ],
      width: 'half',
    },
  },

  // Payment templates
  {
    id: 'template-card-number',
    name: 'Card Number',
    description: 'Credit card number field',
    category: 'payment',
    isBuiltIn: true,
    field: {
      type: 'text',
      label: 'Card Number',
      placeholder: '1234 5678 9012 3456',
      required: true,
      validations: [
        {
          id: 'card-required',
          type: 'required',
          message: 'Card number is required',
        },
        {
          id: 'card-length',
          type: 'pattern',
          value: '^[0-9]{13,19}$',
          message: 'Please enter a valid card number',
        },
      ],
      width: 'full',
    },
  },
  {
    id: 'template-cvv',
    name: 'CVV/CVC',
    description: 'Card security code',
    category: 'payment',
    isBuiltIn: true,
    field: {
      type: 'text',
      label: 'CVV',
      placeholder: '123',
      required: true,
      validations: [
        {
          id: 'cvv-required',
          type: 'required',
          message: 'CVV is required',
        },
        {
          id: 'cvv-pattern',
          type: 'pattern',
          value: '^[0-9]{3,4}$',
          message: 'Please enter a valid CVV',
        },
      ],
      width: 'third',
    },
  },

  // Date/Time templates
  {
    id: 'template-date-of-birth',
    name: 'Date of Birth',
    description: 'Birth date picker',
    category: 'date-time',
    isBuiltIn: true,
    field: {
      type: 'date',
      label: 'Date of Birth',
      required: true,
      validations: [
        {
          id: 'dob-required',
          type: 'required',
          message: 'Date of birth is required',
        },
      ],
      width: 'full',
    },
  },
  {
    id: 'template-appointment-date',
    name: 'Appointment Date',
    description: 'Future date picker',
    category: 'date-time',
    isBuiltIn: true,
    field: {
      type: 'date',
      label: 'Appointment Date',
      required: true,
      validations: [
        {
          id: 'appointment-required',
          type: 'required',
          message: 'Appointment date is required',
        },
      ],
      width: 'half',
    },
  },
  {
    id: 'template-appointment-time',
    name: 'Appointment Time',
    description: 'Time picker',
    category: 'date-time',
    isBuiltIn: true,
    field: {
      type: 'time',
      label: 'Appointment Time',
      required: true,
      validations: [
        {
          id: 'time-required',
          type: 'required',
          message: 'Appointment time is required',
        },
      ],
      width: 'half',
    },
  },

  // Personal templates
  {
    id: 'template-age',
    name: 'Age',
    description: 'Age number field',
    category: 'personal',
    isBuiltIn: true,
    field: {
      type: 'number',
      label: 'Age',
      placeholder: '25',
      required: true,
      min: 0,
      max: 120,
      validations: [
        {
          id: 'age-required',
          type: 'required',
          message: 'Age is required',
        },
        {
          id: 'age-min',
          type: 'min',
          value: 0,
          message: 'Age must be at least 0',
        },
        {
          id: 'age-max',
          type: 'max',
          value: 120,
          message: 'Age must be less than 120',
        },
      ],
      width: 'third',
    },
  },
  {
    id: 'template-gender',
    name: 'Gender',
    description: 'Gender selection',
    category: 'personal',
    isBuiltIn: true,
    field: {
      type: 'select',
      label: 'Gender',
      required: false,
      options: [
        { id: 'gender-male', label: 'Male', value: 'male' },
        { id: 'gender-female', label: 'Female', value: 'female' },
        { id: 'gender-other', label: 'Other', value: 'other' },
        { id: 'gender-prefer-not', label: 'Prefer not to say', value: 'prefer_not_to_say' },
      ],
      validations: [],
      width: 'half',
    },
  },

  // Other common templates
  {
    id: 'template-message',
    name: 'Message/Comments',
    description: 'Multi-line text area',
    category: 'other',
    isBuiltIn: true,
    field: {
      type: 'textarea',
      label: 'Message',
      placeholder: 'Enter your message here...',
      rows: 5,
      required: false,
      validations: [],
      width: 'full',
    },
  },
  {
    id: 'template-website',
    name: 'Website URL',
    description: 'Website URL field',
    category: 'other',
    isBuiltIn: true,
    field: {
      type: 'url',
      label: 'Website',
      placeholder: 'https://example.com',
      required: false,
      validations: [
        {
          id: 'url-format',
          type: 'url',
          message: 'Please enter a valid URL',
        },
      ],
      width: 'full',
    },
  },
  {
    id: 'template-terms-agreement',
    name: 'Terms Agreement',
    description: 'Terms & conditions checkbox',
    category: 'other',
    isBuiltIn: true,
    field: {
      type: 'checkbox',
      label: 'I agree to the terms and conditions',
      required: true,
      validations: [
        {
          id: 'terms-required',
          type: 'required',
          message: 'You must agree to the terms and conditions',
        },
      ],
      width: 'full',
    },
  },
  {
    id: 'template-rating',
    name: 'Rating (5 stars)',
    description: '5-star rating field',
    category: 'other',
    isBuiltIn: true,
    field: {
      type: 'rating',
      label: 'Rating',
      max: 5,
      required: false,
      validations: [],
      width: 'full',
    },
  },
];
