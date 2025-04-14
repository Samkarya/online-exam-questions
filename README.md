# Online Exam Questions for Examify Platform

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Visit Examify: [https://examify.web.app/](https://examify.web.app/)

**License:** MIT

This repository hosts the JSON formatted question sets used by the [Examify Online Practice Platform](https://examify.web.app/).

## Purpose

The goal of this repository is to:

*   **Decouple Content:** Separate question content from the main Examify application code for easier updates and management.
*   **Enable Collaboration:** Allow students, educators, and enthusiasts to contribute new question sets, improve existing ones, and add valuable explanations.
*   **Provide Transparency:** Offer clarity on the source and format of the practice questions used within Examify.

## JSON Question Format

Each `.json` file within the category directories represents a single exam paper or question set. The file **must** contain a valid JSON array (`[]`) where each element is an object representing a single question.

### Mandatory Fields per Question Object:

*   `question_number` (Number): A unique integer identifying the question within the set (e.g., 1, 2, ...). Must be sequential and start from 1.
*   `question_text` (String): The main text/body of the question. Can include plain text, LaTeX for math, Markdown for images/code. See [Handling Complex Content](#handling-complex-content).
*   `options` (Object): An object where keys are the option identifiers (e.g., `"a"`, `"b"`, `"c"`, `"d"`) and values are the corresponding option text (String). Option values can also include LaTeX, Markdown images/code.
*   `correct_answer` (String): The key (e.g., `"a"`, `"b"`) from the `options` object that represents the correct answer. Must exactly match one of the keys in `options`.

### Optional Fields per Question Object:

*   `subject` (String): The subject area the question belongs to (e.g., "Mathematics", "Physics", "Chemistry", "Computer Science").
*   `topic` (String): A more specific topic within the subject (e.g., "Calculus", "Optics", "Organic Chemistry", "Data Structures").
*   `explanation` (String): A detailed explanation for the correct answer. **Highly encouraged** for learning! Can include LaTeX, Markdown images/code.
*   `difficulty` (String): Suggested difficulty level (e.g., "Easy", "Medium", "Hard").
*   `section_id` (String): Identifier if the question belongs to a specific section within the exam (useful for exams with distinct sections like "Section A", "Section B").

### Example Question Object:

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
  "explanation": "To find the value of $x$, subtract 5 from both sides of the equation: $x + 5 - 5 = 12 - 5$. This simplifies to $x = 7$.",
  "difficulty": "Easy"
}
```

### Example `.json` File Structure:

```json
[
  {
    "question_number": 1,
    "question_text": "First question text, potentially with $math$.",
    "options": { "a": "Option A1", "b": "Option B1", "c": "Option C1", "d": "Option D1" },
    "correct_answer": "b"
  },
  {
    "question_number": 2,
    "subject": "Physics",
    "question_text": "Second question text, maybe with an image:\n\n![Circuit Diagram](NIMCET/assets/nimcet_2023_q2_circuit.png)\n\nWhat is the equivalent resistance?",
    "options": { "a": "Option A2 with $$\\frac{1}{R}$$ formula", "b": "Option B2", "c": "Option C2", "d": "Option D2" },
    "correct_answer": "a",
    "explanation": "Detailed explanation for Q2, maybe including `code` or formulas like $\\Delta V = IR$."
  },
  {
    "question_number": 3,
    "subject": "Computer Science",
    "topic": "Programming",
    "question_text": "Analyze the following code snippet:\n\n```c++\n#include <iostream>\n\nint main() {\n  int x = 5;\n  std::cout << ++x << std::endl;\n  return 0;\n}\n```\n\nWhat will be the output?",
    "options": { "a": "5", "b": "6", "c": "Compilation Error", "d": "Undefined behavior" },
    "correct_answer": "b",
    "explanation": "The pre-increment operator `++x` increments `x` to 6 *before* its value is used in the `std::cout` statement. Therefore, 6 is printed."
  }
  // ... more question objects
]
```

## Handling Complex Content

To represent mathematical formulas, images, chemical equations, and code correctly, please use the following formats within the string values of `question_text`, `options`, and `explanation`:

### 1. Mathematical Notation (LaTeX via KaTeX)

*   Examify uses **KaTeX** for rendering mathematical expressions.
*   Use standard LaTeX syntax.
*   **Inline Math:** Enclose LaTeX expressions within single dollar signs (`$...$`).
    *   Example: `"The formula is $E = mc^2$."`
*   **Display Math:** Enclose LaTeX expressions within double dollar signs (`$$...$$`) for centered, block-level equations.
    *   Example: `"Solve the integral: $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$"`
*   **JSON Escaping:** Remember that backslashes (`\`) are special characters in JSON strings. **You MUST escape backslashes by doubling them up (`\\`)**.
    *   Correct: `"$\\frac{1}{2}$"` becomes `"$\\frac{1}{2}$"` in the JSON file.
    *   Correct: `"$\\sin(x)$"` becomes `"$\\sin(x)$"` in the JSON file.

### 2. Images (Markdown Links to Repo Assets)

*   Use standard **Markdown image syntax**: `![Alt Text](Relative Path to Image)`
*   **Hosting:** Images **must** be hosted within this GitHub repository.
*   **File Structure:** Place images in an `assets` sub-directory within the corresponding Exam Category directory. Organize further by exam paper if needed.
    *   Example Path: `NIMCET/assets/nimcet_2023_q2_diagram.png`
*   **Relative Path:** The path used in the Markdown link **must** be relative *from the root of this repository*.
    *   Correct Example: `![Circuit Diagram](NIMCET/assets/nimcet_2023_q2_diagram.png)`
*   **Alt Text:** Provide meaningful alternative text for accessibility.
*   **Use Case:** Ideal for diagrams, graphs, figures, complex chemical structures, etc.

### 3. Chemical Content

*   **Complex Structures/Reactions:** Use **Images** (Markdown Links as described above).
*   **Simple Formulas/Equations:** Use **LaTeX** with `mhchem` syntax (rendered via KaTeX). Enclose expressions in `$...$` or `$$...$$` as needed.
    *   Example: `"Balance the reaction: $$\\ce{2H2 + O2 -> 2H2O}$$"`
    *   Example: `"The formula for water is $\\ce{H2O}$."` (Remember `\\` escaping!)

### 4. Code Snippets (Markdown Fenced Code Blocks)

*   Use standard **Markdown fenced code blocks** with triple backticks (```).
*   Optionally, specify the language after the opening backticks for syntax highlighting in Examify.
    *   Example:
        ```python
        def hello():
          print("Hello")
        ```

*   **JSON Escaping:** Newlines within the code block **must** be escaped as `\n` in the JSON string.
    *   Example in JSON:
        ```json
        "question_text": "What is the output?\n\n```python\ndef greet(name):\n  print(f\"Hello, {name}!\")\n\ngreet(\"Examify\")\n```"
        ```

## Using AI to Generate Question JSON

AI language models can be helpful in generating question sets, but they require specific prompting to produce the correct JSON format and adhere to the content guidelines (LaTeX, Markdown Images/Code).

**Key Principles for AI Prompts:**

1.  **Be Explicit:** Clearly state the *exact* required JSON structure, including all mandatory fields (`question_number`, `question_text`, `options`, `correct_answer`) and optional fields you want (`subject`, `topic`, `explanation`, etc.).
2.  **Specify Formatting:** Instruct the AI on *how* to format complex content:
    *   Mention **LaTeX** for math using `$` and `$$` delimiters. Crucially, tell it to **escape backslashes** (e.g., use `\\frac` instead of `\frac`).
    *   Explain **Markdown** for code blocks (```language ... ```) and instruct it to use `\n` for newlines within the JSON string value.
    *   Explain **Markdown** for images (`![Alt Text](Relative Path)`). *Note: AI cannot create the actual image file or determine the correct relative path. You will need to add the image file to the repo and update the path manually after generation.*
3.  **Provide Examples:** Include a complete example of a single question object in the prompt, demonstrating the structure and formatting.
4.  **Specify Quantity:** Tell the AI how many questions to generate.
5.  **Request Validation:** Ask the AI to ensure the output is a valid JSON array of objects.
6.  **Iterate and Refine:** You might need to refine your prompt or correct the AI's output. Start with a small number of questions (e.g., 2-3) to test the prompt before asking for a large set.
7.  **Review Carefully:** **ALWAYS** manually review the AI-generated output for:
    *   **Correctness:** Are the questions, options, and correct answers accurate?
    *   **JSON Validity:** Is the overall structure a valid JSON array?
    *   **Formatting:** Are LaTeX backslashes escaped (`\\`)? Are code block newlines escaped (`\n`)? Are image paths placeholders requiring manual update?
    *   **Sequential `question_number`:** Ensure the numbers are correct and sequential starting from 1.

**Example AI Prompt:**

```text
Generate a valid JSON array containing [Number] practice questions for the [Exam Name/Subject] exam, targeting [Difficulty Level/Topic] if applicable.

Each question object in the array must strictly follow this structure:
{
  "question_number": Number, // Unique, sequential integer starting from 1
  "question_text": String, // The question itself
  "options": Object, // Key-value pairs, e.g., {"a": "Option A", "b": "Option B"}
  "correct_answer": String, // The key corresponding to the correct option (e.g., "b")
  "subject": String, // Optional: e.g., "Physics"
  "topic": String, // Optional: e.g., "Kinematics"
  "explanation": String // Optional but preferred: Detailed explanation
}

Formatting Rules for String Values (question_text, options values, explanation):
1.  LaTeX for Math: Use single dollar signs ($...$) for inline math and double dollar signs ($$...$$) for display math. IMPORTANT: Escape all LaTeX backslashes within the JSON string (e.g., use "\\frac", "\\sin", "\\sqrt").
2.  Code Blocks: Use Markdown fenced code blocks (```language ... ```). IMPORTANT: Use "\n" for newline characters within the code block inside the JSON string.
3.  Images: Use Markdown image syntax `![Alt Text](PLACEHOLDER_PATH)`. I will replace PLACEHOLDER_PATH manually later.

Here is an example of ONE question object:
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

Please generate [Number] question objects in a single valid JSON array, ensuring all formatting rules, especially backslash and newline escaping, are correctly applied.
```

**Manual Steps After AI Generation:**

*   **Validate JSON:** Use an online JSON validator.
*   **Verify Correctness:** Check questions, answers, and explanations.
*   **Check Escaping:** Ensure `\\` for LaTeX and `\n` for code newlines are correct.
*   **Add Images & Update Paths:** If you prompted for image placeholders, add the actual image files to the correct `assets` directory and update the `PLACEHOLDER_PATH` in the JSON with the correct relative path from the repository root.
*   **Review `question_number`:** Make sure they are sequential and unique.

Using AI effectively requires careful prompting and diligent review, but it can significantly speed up the process of creating initial drafts of question sets.

## Repository Structure

Questions are organized into directories based on the examination category. Image assets should be placed within these directories.

```
/
├── ExamCategoryA/             # e.g., NIMCET/
│   ├── assets/                # Directory for images related to ExamCategoryA
│   │   └── exam_year_qN_image.png # e.g., nimcet_2023_q2_diagram.png
│   └── exam_year_paper.json   # e.g., nimcet_2023.json
│
├── ExamCategoryB/             # e.g., JEE_Main/
│   ├── assets/
│   └── exam_year_paper.json   # e.g., jee_main_2023_p1.json
│
├── ExamCategoryC/             # e.g., GATE_CS/
│   ├── assets/
│   └── exam_year_paper.json   # e.g., gate_cs_2023.json
│
├── config.json                # <--- IMPORTANT: Index of all exams
└── README.md
└── LICENSE
```

## `config.json` - The Exam Index

The `config.json` file in the root of this repository acts as the master index for the Examify application. It lists all available **official** exams and points to their respective JSON files. Examify reads this file to populate the "Official Mock Tests" section.

**When adding a new official exam JSON file, you MUST also add a corresponding entry to this `config.json` file.**

### `config.json` Format:

An array of objects, where each object describes one exam paper.

```json
[
  {
    "id": "nimcet_2023", // Unique identifier string (lowercase, underscore-separated) used internally by the app.
    "title": "NIMCET 2023", // User-friendly display name shown in the app.
    "description": "National Institute of Technology MCA Common Entrance Test 2023", // Optional: Short description shown in the app.
    "category": "NIMCET", // Required: The main category for grouping/filtering in the app (e.g., "NIMCET", "JEE Main", "GATE CS"). Should match the directory name.
    "path": "NIMCET/nimcet_2023.json" // Required: Relative path from the repository root to the exam's JSON file.
  },
  {
    "id": "jee_main_2023_p1",
    "title": "JEE Main 2023 (Paper 1)",
    "description": "Joint Entrance Examination (Main) 2023 - Physics, Chemistry, Maths",
    "category": "JEE Main",
    "path": "JEE_Main/jee_main_2023_p1.json"
  }
  // ... more exam configurations
]
```

## Contribution Guidelines

Contributions are highly welcome! Help us grow this resource for everyone.

**How to Contribute:**

1.  **Fork:** Fork this repository to your GitHub account.
2.  **Branch:** Create a new, descriptive branch for your changes (e.g., `git checkout -b feat/add-gate-cs-2022` or `git checkout -b fix/nimcet-2023-q15-typo`).
3.  **Add/Edit Files:**
    *   Create or modify exam `.json` files within the appropriate `ExamCategory/` directory. Use a consistent naming convention (e.g., `examname_year_papernumber.json`).
    *   If adding images, place them in the corresponding `ExamCategory/assets/` directory and use relative paths in your JSON as described above.
    *   **Strictly adhere** to the JSON format and complex content guidelines (LaTeX, Markdown Images/Code).
    *   **Validate your JSON** before committing (use an online validator or editor plugin). Invalid JSON will break processing in Examify.
    *   Double-check the correctness of questions, options, and especially the `correct_answer`.
    *   Adding explanations via the `explanation` field is **strongly encouraged** and greatly increases the learning value.
4.  **Update `config.json`:** **Crucially**, if you add a new exam file, add a corresponding entry to the root `config.json` following the specified format.
5.  **Commit:** Commit your changes with clear, conventional commit messages (e.g., `feat: Add GATE CS 2022 Question Paper`, `fix: Correct answer for NIMCET 2023 Q45`, `docs: Add explanation for JEE Main 2023 Q10`).
6.  **Pull Request (PR):** Push your branch to your fork and create a Pull Request back to the `main` branch of this repository.
    *   Clearly describe the changes made in the PR description.
    *   Mention the source of the questions if applicable (e.g., "Official paper from exam website").
7.  **Review:** Your PR will be reviewed for correctness, formatting, and adherence to guidelines. Feedback may be provided before merging.

**Thank you for helping make the Examify platform a better resource for students!**

## License

This repository and its contents (question files, configuration, etc.) are licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
