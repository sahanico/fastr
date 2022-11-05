export const blankObject = () => ({
  label: '',
  name: '',
  description: '',
  fields: [],
  templates: [],
  primaryField: '',
  meta: {},
});

export const blankField = () => ({
  label: '',
  name: '',
  type: null,
  description: '',
  unique: false,
  meta: {},
});
export const blankTemplate = () => ({
  label: '',
  name: '',
  description: '',
  path: '',
});

// export const fieldTypes = {
//   display_image: 'Display Image', // todo: add field meta.image
//   text: 'Text',
//   textarea: 'Text Area',
//   number: 'Number',
//   date: 'Date',
//   checkbox: 'Checkbox',
//   signature: 'Signature',
//   object: 'Object',
//   object_array: 'Object Array',
//   user: 'User',
//   user_array: 'User Array',
//   radio: 'Radio Buttons',
//   time: 'Time',
//   date_time: 'Date Time',
//   currency: 'Currency',
//   dropdown: 'Dropdown',
//   dropdown_array: 'Dropdown Array',
//   email: 'Email',
//   phone: 'Phone',
//   display_text: 'Display Text', // todo: add field meta.data
//   percent: 'Percent',
//   // display_image: 'Display Image', // todo: add field meta.image
//   array: 'Array',
//   address: 'Address',
// };
export const fieldTypes = [
  {
    text: 'Display Image',
    value: 'display_image',
  },
  {
    text: 'Text',
    value: 'text',
  },
  {
    text: 'Text Area',
    value: 'textarea',
  },
  {
    text: 'Number',
    value: 'number',
  },
  {
    text: 'Date',
    value: 'date',
  },
  {
    text: 'Check Box',
    value: 'checkbox',
  }, {
    text: 'Signature',
    value: 'signature',
  }, {
    text: 'Object',
    value: 'object',
  }, {
    text: 'Object Array',
    value: 'object_array',
  }, {
    text: 'User',
    value: 'user',
  }, {
    text: 'Radio',
    value: 'radio',
  }, {
    text: 'Time',
    value: 'time',
  }, {
    text: 'Date Time',
    value: 'date_time',
  }, {
    text: 'Currency',
    value: 'currency',
  }, {
    text: 'Dropdown',
    value: 'dropdown',
  }, {
    text: 'Dropdown Array',
    value: 'dropdown_array',
  }, {
    text: 'Email',
    value: 'email',
  }, {
    text: 'Phone',
    value: 'phone',
  }, {
    text: 'Display Text',
    value: 'display_text',
  }, {
    text: 'Percent',
    value: 'percent',
  }, {
    text: 'Address',
    value: 'address',
  }, {
    text: 'Attachment',
    value: 'attachment',
  }, {
    text: 'Computed',
    value: 'computed',
  }, {
    text: 'Design',
    value: 'design',
  }, {
    text: 'Parametric',
    value: 'parametric',
  },
];

export const currencyTypes = [
  'usd',
  'cad',
];
