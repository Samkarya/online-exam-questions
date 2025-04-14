# 📚 Online Exam Questions for Examify Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Visit Examify:** [https://examify.web.app/](https://examify.web.app/)

**License:** MIT

This repository hosts the JSON formatted question sets used by the [Examify Online Practice Platform](https://examify.web.app/).

## Purpose

The goal of this repository is to:

*   **Decouple Content:** Separate question content from the main Examify application code for easier updates and management.
*   **Enable Collaboration:** Allow students, educators, and enthusiasts to contribute new question sets, improve existing ones, and add valuable explanations.
*   **Provide Transparency:** Offer clarity on the source and format of the practice questions used within Examify.

## How Examify Uses This Repository

Examify relies on **two key components** from this repository:

1.  **`config.json` (Root Level):** This file acts as the **master index**. Examify reads this file *first* to understand which official exams are available, how they are categorized, and where to find their specific question files. It drives the multi-step selection UI (Category -> Year -> Session -> Paper).
2.  **Question JSON Files (Category Directories):** These files contain the actual questions, options, answers, and explanations for each specific exam paper instance, following a defined format.

---

## ⚙️ `config.json` - The Master Exam Index

This file, located at the **root** of the repository, defines every official exam paper instance available in the Examify platform's "Official Mock Tests" section.

**➡️ IMPORTANT:** When adding a new official exam JSON file, you **MUST** add a corresponding entry to this `config.json` file for it to appear in the app.

### `config.json` Format:

An array `[]` of objects, where each object describes **one specific exam paper instance** (e.g., a particular year, session, shift, or subject paper).

```json
[
  {
    "id": "string",         // REQUIRED: Unique identifier for this specific paper instance (e.g., "nimcet_2023", "jeeMain_2024_jan_s1_d22_sh1"). Lowercase, underscore-separated is recommended.
    "category": "string",     // REQUIRED: Top-level exam group (e.g., "NIMCET", "JEE Main", "CUET-UG"). Used for the first selection step. Should ideally match the directory name.
    "year": number,           // REQUIRED: The numerical year the exam paper pertains to (e.g., 2023).
    "session": "string|null", // Optional: The specific session if applicable (e.g., "January", "April", 1, 2). Use `null` if not applicable or only one session exists for the year.
    "date": "string|null",    // Optional: The specific date (ISO format "YYYY-MM-DD") if relevant (e.g., "2024-01-22"). Use `null` if not date-specific.
    "shift": "string|number|null", // Optional: The specific shift if applicable (e.g., 1, 2, "Morning", "Afternoon"). Use `null` if not shift-specific.
    "paperType": "string|null",// Optional: Describes the paper type if multiple exist within a session/date/shift (e.g., "Paper 1 (PCM)", "B.Arch", "Physics", "General Test"). Use `null` if only one paper type exists for the combination.
    "title": "string",        // REQUIRED: Concise display title for this specific paper instance (e.g., "NIMCET 2023", "JEE Main 2024 (Jan 22nd, Shift 1)"). Derived from other fields.
    "description": "string",  // Optional: A short description shown in the app (e.g., "National Institute of Technology MCA Common Entrance Test 2023").
    "path": "string"          // REQUIRED: Relative path from the repository root to the corresponding question JSON file (e.g., "NIMCET/nimcet_2023.json", "JEEMains/2024/jeeMain_2024_jan_s1_d22_sh1.json").
  }
  // ... more exam configurations
]
```

### `config.json` Examples:

**Simple Exam (NIMCET):**

```json
 {
    "id": "nimcet_2023",
    "category": "NIMCET",
    "year": 2023,
    "session": null,
    "date": null,
    "shift": null,
    "paperType": null,
    "title": "NIMCET 2023",
    "description": "National Institute of Technology MCA Common Entrance Test 2023",
    "path": "NIMCET/nimcet_2023.json"
  }
```

**Complex Exam (JEE Main):**

```json
{
    "id": "jeeMain_2024_jan_s1_d22_sh1",
    "category": "JEE Main",
    "year": 2024,
    "session": "January",
    "date": "2024-01-22",
    "shift": 1,
    "paperType": "Paper 1 (PCM)",
    "title": "JEE Main 2024 (Jan 22nd, Shift 1)",
    "description": "Joint Entrance Examination Main 2024 - January Session",
    "path": "JEEMains/2024/jeeMain_2024_jan_s1_d22_sh1.json"
}
```

**Subject-Specific Exam (CUET-UG):**

```json
{
    "id": "cuet_ug_2024_phy_d15_sh2",
    "category": "CUET-UG",
    "year": 2024,
    "session": null,
    "date": "2024-05-15",
    "shift": 2,
    "paperType": "Physics",
    "title": "CUET-UG 2024 Physics (May 15, Shift 2)",
    "description": "Common University Entrance Test (UG) 2024 - Physics Paper",
    "path": "CUET/UG/2024/cuet_ug_2024_phy_d15_sh2.json"
}
```

---

## 📝 Question JSON File Format

Each `.json` file (e.g., `NIMCET/nimcet_2023.json`) contains the actual question data for a single paper instance listed in `config.json`.

*   **Structure:** The file MUST contain a single valid JSON array `[]`.
*   **Elements:** Each element within the array is an object `{}` representing a single question.

### Question Object Fields:

**Mandatory Fields:**

*   `question_number` (Number): Unique integer identifying the question (e.g., 1, 2,...). Must be sequential starting from 1 within the file.
*   `question_text` (String): The main question text. Supports complex content (see below).
*   `options` (Object): Key-value pairs where keys are option identifiers (e.g., `"a"`, `"b"`) and values are the option text (String). Option values also support complex content.
*   `correct_answer` (String): The key from the `options` object that is the correct answer (e.g., `"b"`). Must exactly match an options key.

**Optional Fields:**

*   `subject` (String): Subject area (e.g., "Mathematics", "Physics").
*   `topic` (String): Specific topic (e.g., "Calculus", "Optics").
*   `explanation` (String): Detailed explanation (highly encouraged!). Supports complex content.
*   `difficulty` (String): Difficulty level (e.g., "Easy", "Medium", "Hard").
*   `section_id` (String): Identifier for exams with sections (e.g., "Section A").

### Example Question Object (in JSON file):

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
  "explanation": "Subtract 5 from both sides: $x + 5 - 5 = 12 - 5 \\implies x = 7$.",
  "difficulty": "Easy"
}
```

### Example Complete `.json` File Structure:

```json
[
  {
    "question_number": 1,
    "question_text": "First question... $math$.",
    "options": { "a": "Opt A1", "b": "Opt B1" },
    "correct_answer": "b"
  },
  {
    "question_number": 2,
    "subject": "Physics",
    "question_text": "Second question... ![Diagram](ExamCategory/assets/image.png)",
    "options": { "a": "Opt A2", "b": "Opt B2" },
    "correct_answer": "a",
    "explanation": "Explanation with `code` or formulas like $$\\Delta V = IR$$."
  },
  {
    "question_number": 3,
    // ... more fields ...
    "question_text": "Analyze code:\n\n```c++\n#include <iostream>\nint main() {\n  std::cout << 1;\n  return 0;\n}\n```\n\nOutput?"
    // ... options, answer, explanation ...
  }
  // ... more question objects ...
]
```

---

## ✨ Handling Complex Content (LaTeX, Images, Code)

Use these formats within `question_text`, `options` values, and `explanation` strings:

### 1. Mathematical Notation (LaTeX via KaTeX)

*   **Syntax:** Standard LaTeX.
*   **Inline Math:** Use single dollar signs: `$ E = mc^2 $`
*   **Display Math:** Use double dollar signs: `$$ \int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2} $$`
*   **⚠️ JSON ESCAPING:** You **MUST** escape LaTeX backslashes (`\`) with another backslash (`\\`) within the JSON string.
    *   LaTeX `\frac{1}{2}` becomes `"$\\frac{1}{2}$"` in JSON.
    *   LaTeX `\sin(x)` becomes `"$\\sin(x)$"` in JSON.

### 2. Images (URL via Markdown)

*   **Syntax:** `![Alt Text](Image URL)`
*   **Supported URLs:**
    *   ✅ **Absolute HTTPS URLs (Recommended):** Publicly accessible image hosts. Most flexible.
        *   Example: `![Diagram](https://some-image-hosting.com/path/image.png)`
    *   ✅ **Relative Paths (For Repo Assets ONLY):** Use if adding images *to this repository*. Path must be relative *from the repo root*. Examify prepends the base URL automatically.
        *   Example: `![Circuit](NIMCET/assets/nimcet_2023_q2_circuit.png)` (Requires the file to exist at this path in the repo).
        *   **Convention:** Place assets in `ExamCategory/assets/`.
    *   ❌ **Blocked URLs:** `http://` (insecure), `file:///` (local paths) will **not** work.
*   **Alt Text:** Provide meaningful description.

### 3. Chemical Content

*   **Complex Structures:** Use **Images** (Markdown links).
*   **Simple Formulas:** Use **LaTeX** with `mhchem` package syntax (`$\ce{H2O}$`, `$$\ce{2H2 + O2 -> 2H2O}$$`). Remember `\\` escaping!

### 4. Code Snippets (Markdown Fenced Code Blocks)

*   **Syntax:** Triple backticks (``` ```) with optional language identifier (e.g., ```python```).
*   **⚠️ JSON ESCAPING:** Newlines within code **must** be escaped as `\n`.
*   **Example in JSON:**
    ```json
    "question_text": "What is the output?\n\n```python\ndef greet(name):\n  print(f\"Hello, {name}!\")\n\ngreet(\"Examify\")\n```"
    ```

---

## 🤖 Using AI to Generate Question JSON

AI models can assist, but require precise prompting and careful review.

**Key Principles for AI Prompts:**

1.  **Be Explicit:** Clearly state the required JSON structure (array of objects, mandatory/optional fields from above).
2.  **Specify Formatting:**
    *   Tell it to use **LaTeX** (`$`, `$$`) and **escape backslashes** (`\\`).
    *   Tell it to use **Markdown code fences** (```) and **escape newlines** (`\n`).
    *   Tell it to use **Markdown image syntax** (`![Alt Text](PLACEHOLDER_PATH)`) and mention you'll replace the placeholder path.
3.  **Provide Examples:** Include a full example of a question object demonstrating structure *and escaping*.
4.  **Specify Quantity & Context:** Ask for `[Number]` questions for `[Exam/Subject]`.
5.  **Request Validation:** Ask the AI to ensure the output is a valid JSON array.
6.  **Iterate:** Start small (2-3 questions) to test your prompt.
7.  **⚠️ Review Diligently:** **ALWAYS** manually review AI output for:
    *   **Correctness:** Questions, options, answers, explanations.
    *   **JSON Validity:** Use a validator.
    *   **Escaping:** Check for `\\` in LaTeX and `\n` in code blocks.
    *   **Image Placeholders:** Ensure `PLACEHOLDER_PATH` is used where expected.
    *   **Sequential `question_number`**.

**Example AI Prompt:**

```text
Generate a valid JSON array containing [Number] practice questions for the [Exam Name/Subject] exam.

Each question object in the array must strictly follow this structure:
{
  "question_number": Number, // REQUIRED: Unique, sequential integer starting from 1
  "question_text": String,   // REQUIRED: Question text
  "options": Object,         // REQUIRED: e.g., {"a": "Option A", "b": "Option B"}
  "correct_answer": String,  // REQUIRED: Key matching the correct option (e.g., "b")
  "subject": String | null,    // Optional: e.g., "Physics" or null
  "topic": String | null,      // Optional: e.g., "Kinematics" or null
  "explanation": String | null // Optional but preferred: Detailed explanation or null
}

Formatting Rules for ALL String Values:
1.  Use LaTeX for Math: Inline `$ ... $`, Display `$$ ... $$`. IMPORTANT: Escape all LaTeX backslashes as `\\` (e.g., use "\\frac", "\\sin").
2.  Use Markdown Code Blocks: Fenced ```language ... ```. IMPORTANT: Escape all newlines within code as `\\n`.
3.  Use Markdown Images: `![Alt Text](PLACEHOLDER_PATH)`. I will replace the placeholder later.

Here is ONE example object:
{
  "question_number": 1,
  "subject": "Mathematics",
  "topic": "Algebra",
  "question_text": "If $x + 5 = 12$, what is the value of $x$?",
  "options": { "a": "5", "b": "7", "c": "12", "d": "17" },
  "correct_answer": "b",
  "explanation": "Subtract 5 from both sides: $x + 5 - 5 = 12 - 5 \\\\implies x = 7$."
}

Generate [Number] question objects in a single valid JSON array, applying all rules, especially escaping.
```

**Manual Steps After AI:**

*   **Validate JSON**.
*   **Verify Correctness**.
*   **Check Escaping (`\\`, `\n`)**.
*   **Add Images:** Place image files in the correct `ExamCategory/assets/` folder.
*   **Update Image Paths:** Replace `PLACEHOLDER_PATH` with the correct relative path (e.g., `ExamCategory/assets/image.png`).
*   **Review `question_number`**.

---

## 📂 Repository Structure

Organize files by examination category.

```
/
├── ExamCategoryA/             # e.g., NIMCET/
│   ├── assets/                # Images specific to ExamCategoryA
│   │   └── image_name.png
│   └── paper_instance_1.json  # e.g., nimcet_2023.json
│   └── paper_instance_2.json
│
├── ExamCategoryB/             # e.g., JEEMains/
│   ├── 2024/                  # Optional sub-folder for year
│   │    └── paper_instance_3.json # e.g., jeeMain_2024_jan_s1_d22_sh1.json
│   └── assets/
│
├── config.json                # <--- Master index file (REQUIRED)
└── README.md
└── LICENSE
```

---

## 🙌 Contribution Guidelines

Contributions are welcome!

1.  **Fork:** Fork this repository.
2.  **Branch:** Create a descriptive branch (e.g., `feat/add-cat-2022` or `fix/nimcet-2023-q5-explanation`).
3.  **Add/Edit Files:**
    *   Create/modify exam `.json` files in the appropriate `ExamCategory/` directory.
    *   Follow the detailed **Question JSON File Format** and **Handling Complex Content** rules strictly.
    *   If adding images, place them in `ExamCategory/assets/` and use correct **relative paths** in the JSON.
    *   **✅ Validate your JSON!** Invalid JSON breaks the app.
    *   Add/improve `explanation` fields whenever possible.
4.  **Update `config.json`:** **➡️ If adding a new paper instance, add a corresponding entry to the root `config.json` file.** Ensure the `id` is unique and the `path` is correct.
5.  **Commit:** Use clear messages (e.g., `feat: Add CAT 2022 Question Paper`, `fix: Correct answer for NIMCET 2023 Q10`).
6.  **Pull Request (PR):** Create a PR to the `main` branch of *this* repository. Describe your changes clearly.
7.  **Review:** Your PR will be reviewed for correctness, formatting, and adherence to guidelines.

---

## License

This repository and its contents are licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
