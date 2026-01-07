# Template Contribution Guide

Welcome to the GenForm Template Library! We're building a comprehensive collection of 100+ form templates to help users create forms quickly and efficiently.

---

## Quick Start for Contributors

### What You Need to Do

**Add just ONE file!** That's it.

Create a new JSON file in the appropriate category folder:
```
templates/[Category]_Template/[number].json
```

**Examples:**
- `templates/Healthcare_Template/1.json`
- `templates/Event_Template/1.json`
- `templates/Restaurant_Template/2.json`

The system will automatically load your template and display it in the UI.

---

## Code Quality Requirements

### 1. Valid JSON
- Your file MUST be valid JSON
- Use [JSONLint](https://jsonlint.com/) to validate before submitting
- No trailing commas
- All strings must use double quotes

### 2. Naming Conventions

**Template ID:**
- Format: `category_purpose_number`
- Example: `healthcare_patient_1`, `event_rsvp_1`
- All lowercase, underscores only

**Field IDs:**
- Format: `field-category-purpose`
- Example: `field-personal-name`, `field-contact-email`
- All lowercase, hyphens only

**Field Names:**
- Format: `snake_case`
- Example: `full_name`, `phone_number`, `email_address`
- All lowercase, underscores only

### 3. Indian Format Guidelines

Use Indian formatting for all applicable fields:
- **Phone Numbers**: `+91 9876xxxxxx`
- **Dates**: `DD/MM/YYYY`
- **Addresses**: `House No., Street, Area, City, State, PIN Code`
- **Currency**: Use `₹` (rupee symbol), format: `₹6,00,000`

### 4. Template Requirements

Every template MUST have:
- `id` (string, unique)
- `category` (string)
- `name` (string)
- `description` (string, 1-2 sentences)
- `content` object with:
  - `formTitle` (string)
  - `formDescription` (string)
  - `formFields` (array, 5-15 fields)

Every field MUST have:
- `id` (string, unique within template)
- `name` (string, snake_case)
- `label` (string)
- `placeholder` (string)
- `type` (string, from allowed types)
- `required` (boolean)

---

## Template Structure

Templates are organized in category folders with numbered JSON files:

```
templates/
├── Job_Template/
│   ├── 1.json
│   ├── 2.json
│   └── ...
├── Student_Template/
│   ├── 1.json
│   └── ...
└── [Your_Category]_Template/
    └── 1.json
```

---

## Template File Format

Each template is a JSON file with the following structure:

```json
{
  "id": "unique_template_id",
  "category": "CategoryName",
  "name": "Template Display Name",
  "description": "Short description (1-2 sentences) of what this template is for",
  "content": {
    "formTitle": "The Form Title",
    "formDescription": "A brief description of the form",
    "formFields": [
      {
        "id": "field-unique-id",
        "name": "field_name",
        "label": "Field Label",
        "placeholder": "Placeholder text",
        "type": "text",
        "required": true
      }
    ]
  }
}
```

---

## Available Field Types

You can use the following field types in your templates:

- `text` - Single line text input
- `textarea` - Multi-line text input
- `email` - Email address input
- `tel` - Phone number input
- `number` - Numeric input
- `date` - Date picker
- `select` - Dropdown selection (requires `options` array)
- `file` - File upload
- `checkbox` - Checkbox
- `radio` - Radio buttons (requires `options` array)

---

## Field Properties

Each field should have:

- `id` (required): Unique identifier (use format: `field-category-purpose`)
- `name` (required): Technical name for the field (use snake_case)
- `label` (required): User-facing label
- `placeholder` (optional): Helpful placeholder text
- `type` (required): Field type from the list above
- `options` (required for select/radio): Array of string options
- `required` (required): Boolean - is this field mandatory?

---

## Best Practices

### 1. Naming Conventions
- Template ID: `category_purpose_number` (e.g., `job_basic_1`)
- Field IDs: `field-category-purpose` (e.g., `field-personal-email`)
- Field names: Use snake_case (e.g., `full_name`, `phone_number`)

### 2. Template Design
- Include 5-15 fields per template
- Order fields logically (e.g., personal info → specific info → optional fields)
- Use clear, descriptive labels
- Provide helpful placeholder text
- Mark essential fields as required

### 3. Descriptions
- Keep template descriptions concise (1-2 sentences)
- Focus on the use case, not the features
- Make it clear who should use this template

---

## How to Contribute

### Step 1: Fork the Repository

Fork the GenForm repository to your GitHub account.

### Step 2: Choose a Category

Choose an existing category or create a new one:
- Use format: `[Category]_Template`
- Examples: `Healthcare_Template`, `Event_Template`, `Restaurant_Template`

### Step 3: Create Your Template JSON File

- Use the next available number in the category folder
- Follow the structure shown above
- Validate your JSON using [JSONLint](https://jsonlint.com/)

### Step 4: Test Locally (Optional)

```bash
npm run dev
# Navigate to create form → Use Template
# Verify your template appears and works correctly
```

### Step 5: Submit a Pull Request

- **Title Format**: `[Template] Add [Category] - [Template Name]`
- **Description**: Briefly describe your template and its use case
- Link the related issue (if applicable)

---

## Checklist Before Submitting

- [ ] JSON is valid (tested on jsonlint.com)
- [ ] Template ID follows naming convention: `category_purpose_number`
- [ ] All field IDs are unique within the template
- [ ] All field names use snake_case
- [ ] Template has 5-15 fields
- [ ] Required fields are marked correctly
- [ ] Indian format used for phone/date/address/currency
- [ ] File is in correct category folder
- [ ] File name is next available number
- [ ] No trailing commas or syntax errors

---

## Example Template

Here's a complete example of a simple Contact Form template:

```json
{
  "id": "contact_basic_1",
  "category": "Contact",
  "name": "Basic Contact Form",
  "description": "Simple contact form for general inquiries and feedback",
  "content": {
    "formTitle": "Contact Us",
    "formDescription": "We'd love to hear from you! Please fill out the form below.",
    "formFields": [
      {
        "id": "field-contact-name",
        "name": "full_name",
        "label": "Full Name",
        "placeholder": "Enter your full name",
        "type": "text",
        "required": true
      },
      {
        "id": "field-contact-email",
        "name": "email",
        "label": "Email Address",
        "placeholder": "your.email@example.com",
        "type": "email",
        "required": true
      },
      {
        "id": "field-contact-subject",
        "name": "subject",
        "label": "Subject",
        "placeholder": "What is this about?",
        "type": "text",
        "required": true
      },
      {
        "id": "field-contact-message",
        "name": "message",
        "label": "Message",
        "placeholder": "Your message here...",
        "type": "textarea",
        "required": true
      },
      {
        "id": "field-contact-priority",
        "name": "priority",
        "label": "Priority Level",
        "placeholder": "Select priority",
        "type": "select",
        "options": ["Low", "Medium", "High", "Urgent"],
        "required": false
      }
    ]
  }
}
```

---

## Template Categories

Here are some suggested categories (feel free to propose new ones!):

- **Healthcare**: Patient forms, appointment bookings, medical history
- **Education**: Course registration, student applications, teacher evaluations
- **Event**: RSVP forms, registration, feedback surveys
- **Restaurant**: Reservations, catering orders, feedback
- **Real Estate**: Property inquiries, rental applications, maintenance requests
- **HR**: Employee onboarding, leave requests, performance reviews
- **Customer Service**: Support tickets, complaints, feedback
- **E-commerce**: Product inquiries, returns, wholesale orders
- **Fitness**: Gym memberships, personal training, class bookings
- **Travel**: Tour bookings, visa applications, hotel feedback

---

## Common Mistakes to Avoid

1. **Invalid JSON** - Most common issue. Always validate at jsonlint.com!
2. **Duplicate Field IDs** - Each field ID must be unique within the template
3. **Wrong Field Types** - Use only the allowed types listed above
4. **Missing Required Properties** - Every field needs all required properties
5. **US Format** - Remember to use Indian format (phone, date, address, currency)
6. **Too Many/Few Fields** - Keep it between 5-15 fields
7. **Unclear Labels** - Be specific and user-friendly
8. **Trailing Commas** - JSON doesn't allow trailing commas

---

## Examples to Reference

Check out these existing templates for guidance:
- [Job Application Template](./templates/Job_Template/1.json)
- [Student Admission Template](./templates/Student_Template/1.json)

---

## Need Help?

- Check existing templates in the `templates/` directory for reference
- Open an issue with the `question` label if you need clarification
- Review the examples above
- Join our community discussions

---

## For GitHub Issues

When creating issues for contributors, use this format:

**Title**: `[Template Needed] [Category] - [Template Name]`

**Example**: `[Template Needed] Healthcare - Patient Registration`

**Labels**: `swoc26`, `template`, `good-first-issue`, `hacktoberfest`

---

## SWoC26 Contributors

Special thanks to all SWoC26 participants contributing to our template library! Your work helps thousands of users create better forms.

---

**Happy Contributing!**
