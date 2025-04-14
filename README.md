# Online Exam Questions for Examify Platform

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Visit Examify:** [https://examify.web.app/](https://examify.web.app/)

This repository hosts the JSON-formatted question sets used by the [Examify Online Practice Platform](https://examify.web.app/), an open-source tool to help students prepare for standardized exams.

## 📋 Contents
- [Purpose](#purpose)
- [Repository Structure](#repository-structure)
- [The Master Exam Index](#the-master-exam-index)
- [Question Format](#question-format)
- [Handling Complex Content](#handling-complex-content)
- [Using AI to Generate Questions](#using-ai-to-generate-questions)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

## 🎯 Purpose

The goals of this repository are to:

* **Decouple Content:** Separate question content from the main Examify application code for easier updates and management
* **Enable Collaboration:** Allow students, educators, and enthusiasts to contribute new question sets, improve existing ones, and add valuable explanations
* **Provide Transparency:** Offer clarity on the source and format of the practice questions used within Examify
* **Power Dynamic Selection:** Provide a structured index (`config.json`) that allows the Examify platform to offer a flexible, multi-step exam selection process

## 📁 Repository Structure

Questions are organized into directories based on the exam category and further organized by year, session, etc. The structure mirrors the paths defined in `config.json`:

```
/
├── NIMCET/                    # Exam category
│   ├── 2023/                  # Year
│   │   ├── assets/            # Images for this exam
│   │   │   └── diagram.png
│   │   └── nimcet_2023.json   # Question set file
│   └── 2022/
│       └── nimcet_2022.json
│
├── JEEMains/
│   └── 2024/
│       └── jan_s1/           # session subdivision
│           ├── assets/
│           └── jeeMain_2024_jan_s1_d22_sh1.json
│
├── CUET/
│   ├── UG/
│   │   └── 2024/
│   │       └── Physics/      # Paper type subdivision
│   │           └── cuet_ug_2024_phy_d15_sh2.json
│   └── PG/
│       └── ...
│
├── config.json              # The master exam index
├── README.md
└── LICENSE
```

## 🔑 The Master Exam Index

The `config.json` file is **crucial** - it serves as the master index for the Examify application and is the **only** file the application reads to populate the "Official Mock Tests" selection interface.

### Format

`config.json` contains a JSON array where each object represents one specific exam paper:

```json
[
  {
    "id": "nimcet_2023",
    "category": "NIMCET",
    "year": 2023,
    "session": null,
    "date": "2023-06-11",
    "shift": null,
    "paperType": null,
    "title": "NIMCET 2023",
    "description": "National Institute of Technology MCA Common Entrance Test 2023",
    "path": "NIMCET/2023/nimcet_2023.json"
  },
  {
    "id": "jee_main_2024_jan_s1_d22_sh1",
    "category": "JEE Main",
    "year": 2024,
    "session": "January",
    "date": "2024-01-22",
    "shift": 1,
    "paperType": "Paper 1 (PCM)",
    "title": "JEE Main 2024 (Jan 22nd, Shift 1)",
    "description": "Joint Entrance Examination Main 2024 - January Session, Paper 1",
    "path": "JEEMains/2024/jan_s1/jeeMain_2024_jan_s1_d22_sh1.json"
  }
]
```

### Required Fields

* `id`: A globally unique identifier (lowercase, underscore-separated)
* `category`: Top-level exam group (e.g., "NIMCET", "JEE Main")
* `year`: The numerical year (e.g., 2023, 2024)
* `title`: Human-readable title displayed in the app
* `description`: Longer description providing context
* `path`: Relative path from repository root to the question file

### Optional Fields

* `session`: Specific session if applicable (e.g., "January", 1, 2)
* `date`: Specific date in YYYY-MM-DD format
* `shift`: Shift number or name if applicable
* `paperType`: Specific paper type if the exam has multiple types

## 📝 Question Format

Each question file (e.g., `nimcet_2023.json`) contains a JSON array of question objects:

### Required Fields

* `question_number`: Sequential integer starting from 1
* `question_text`: The main text/body of the question
* `options`: Object with option identifiers as keys and option text as values
* `correct_answer`: Key from the options object representing the correct answer

### Optional Fields

* `subject`: Subject area (e.g., "Mathematics")
* `topic`: Specific topic (e.g., "Calculus")
* `explanation`: Detailed explanation of the correct answer (**highly encouraged**)
* `difficulty`: Suggested level (e.g., "Easy", "Medium", "Hard")
* `section_id`: Identifier if the question belongs to a specific section

### Example Question

```json
{
  "question_number": 1,
  "subject": "Mathematics",
  "topic": "Algebra",
  "question_text": "If $x + 5 = 12$, what is the value of $x$?",
  "options": {
    "a": "5",
    "b": "7",
    "c": "12",
    "d": "17"
  },
  "correct_answer": "b",
  "explanation": "To find the value of $x$, subtract 5 from both sides of the equation: $x + 5 - 5 = 12 - 5 \\implies x = 7$.",
  "difficulty": "Easy"
}
```

## 📊 Handling Complex Content

Questions often require special formatting for math, images, chemical equations, and code.

### 1. Mathematical Notation (LaTeX via KaTeX)

Use standard LaTeX syntax with proper JSON escaping:

* **Inline Math:** Single dollar signs - `$...$`
  * Example: `"The formula is $E = mc^2$."`
* **Display Math:** Double dollar signs - `$$...$$`
  * Example: `"Solve: $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$"`
* **⚠️ Important:** Escape backslashes by doubling them in JSON
  * `\frac` becomes `\\frac`, `\sin` becomes `\\sin`

### 2. Images (Markdown Syntax)

Use standard Markdown image syntax:

```
![Alt Text](Image URL)
```

* **Absolute URLs (Recommended):**
  * Example: `![Diagram](https://some-cdn.com/path/image.png)`
* **Relative Paths (For repo-hosted images):**
  * Example: `![Circuit](NIMCET/2023/assets/circuit.png)`
  * Must be relative from repository root
  * The image file must exist at that location

### 3. Chemical Content

* **Complex Structures:** Use images (Markdown syntax)
* **Simple Formulas:** Use LaTeX with `mhchem` (via KaTeX)
  * Example: `"Water is $\\ce{H2O}$."`
  * Example: `"Reaction: $$\\ce{2H2 + O2 -> 2H2O}$$"`

### 4. Code Snippets (Markdown Fenced Code Blocks)

```
```language
code here

```

* **JSON Escaping:** Newlines within code must be escaped as `\n`
  * Example in JSON:
    ```json
    "question_text": "What is the output?\n\n```python\ndef greet(name):\n  print(f\"Hello, {name}!\")\n\ngreet(\"Examify\")\n```"
    ```

## 🤖 Using AI to Generate Questions

AI language models can help generate question sets, but require specific prompting for correct JSON format:

### Suggested AI Prompt

```
Generate a valid JSON array containing [Number] practice questions for the [Exam Name/Subject] exam.

Each question object must follow this structure:
{
  "question_number": Number, // Sequential integer starting from 1
  "question_text": String,
  "options": Object, // e.g., {"a": "Option A", "b": "Option B"}
  "correct_answer": String, // e.g., "b"
  "subject": String, // Optional
  "topic": String, // Optional
  "explanation": String // Optional but preferred
}

Formatting Rules:
1. LaTeX for Math: Use $...$ for inline math and $$...$$ for display math. IMPORTANT: Escape all LaTeX backslashes (use "\\frac" not "\frac").
2. Code Blocks: Use ```language ... ```. IMPORTANT: Use "\n" for newlines within JSON strings.
3. Images: Use Markdown syntax ![Alt Text](PLACEHOLDER_PATH).

Example question object:
{
  "question_number": 1,
  "subject": "Mathematics",
  "topic": "Algebra",
  "question_text": "If $x + 5 = 12$, what is the value of $x$?",
  "options": {
    "a": "5",
    "b": "7",
    "c": "12",
    "d": "17"
  },
  "correct_answer": "b",
  "explanation": "Subtract 5 from both sides: $x + 5 - 5 = 12 - 5 \\implies x = 7$."
}
```

### Post-Generation Steps

1. **Validate JSON** using an online tool
2. **Verify correctness** of questions and answers
3. **Check escaping** of backslashes and newlines
4. **Add images & update paths** if applicable
5. **Update `config.json`** to include your new exam file

## 👥 Contribution Guidelines

Contributions are highly welcome! Here's how to contribute:

1. **Fork & Branch:** Fork this repository and create a descriptive branch
2. **Add/Edit Files:**
   * Create or modify exam files within appropriate directories
   * Strictly adhere to the JSON format and content guidelines
   * Validate your JSON before committing
   * Add explanations where possible (they greatly enhance learning value)
3. **Update `config.json`:**
   * **⚠️ CRUCIAL STEP:** Add a new entry if adding a new exam file
   * Include all required fields and appropriate optional fields
4. **Submit PR:** Create a Pull Request with a clear description of your changes

## 📄 License

This repository and its contents are licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
