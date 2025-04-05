# Online Exam Questions for ExamSim Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Optional License Badge -->

This repository hosts the JSON formatted question sets used by the [ExamSim Online Practice Platform](link-to-your-deployed-app-or-main-repo).

The goal of this repository is to:

1.  **Decouple** question content from the main application code.
2.  Enable **collaboration** by allowing students, educators, and enthusiasts to contribute new question sets, improve existing ones, and add explanations.
3.  Provide **transparency** regarding the source and format of the practice questions.

## JSON Question Format

Each `.json` file within the category directories represents a single exam paper or question set. The file **must** contain a JSON array (`[]`) where each element is an object representing a single question.

**Mandatory Fields per Question Object:**

*   `question_number`: (Number) A unique integer identifying the question within the set (e.g., `1`, `2`, ...).
*   `question_text`: (String) The main text/body of the question. Plain text is preferred.
*   `options`: (Object) An object where keys are the option identifiers (e.g., `"a"`, `"b"`, `"c"`, `"d"`) and values are the corresponding option text (String).
*   `correct_answer`: (String) The key (e.g., `"a"`, `"b"`) from the `options` object that represents the correct answer.

**Optional Fields per Question Object:**

*   `subject`: (String) The subject area the question belongs to (e.g., `"Mathematics"`, `"Physics"`).
*   `topic`: (String) A more specific topic within the subject (e.g., `"Calculus"`, `"Optics"`).
*   `explanation`: (String) A detailed explanation for the correct answer (Highly encouraged for learning!).
*   `difficulty`: (String) Suggested difficulty level (e.g., `"Easy"`, `"Medium"`, `"Hard"`).
*   `section_id`: (String) Identifier if the question belongs to a specific section within the exam (useful for exams with distinct sections).

**Example Question Object:**

```json
{
  "question_number": 1,
  "subject": "Mathematics",
  "topic": "Algebra",
  "question_text": "If x + 5 = 12, what is the value of x?",
  "options": {
    "a": "5",
    "b": "7",
    "c": "12",
    "d": "17"
  },
  "correct_answer": "b",
  "explanation": "To find the value of x, subtract 5 from both sides of the equation: x + 5 - 5 = 12 - 5. This simplifies to x = 7.",
  "difficulty": "Easy"
}
```

**Example `.json` File Structure:**

```json
[
  {
    "question_number": 1,
    "question_text": "First question text...",
    "options": { "a": "Opt A1", "b": "Opt B1", "c": "Opt C1", "d": "Opt D1" },
    "correct_answer": "b"
  },
  {
    "question_number": 2,
    "subject": "Physics",
    "question_text": "Second question text...",
    "options": { "a": "Opt A2", "b": "Opt B2", "c": "Opt C2", "d": "Opt D2" },
    "correct_answer": "a",
    "explanation": "Detailed explanation for Q2."
  }
  // ... more question objects
]
```

## Repository Structure

Questions are organized into directories based on the examination category.

```
/
├── ExamCategoryA/             # e.g., NIMCET
│   └── exam_year_paper.json   # e.g., nimcet_2023.json
│   └── exam_year_paper.json
├── ExamCategoryB/             # e.g., JEE_Main
│   └── exam_year_paper.json   # e.g., jee_main_2023_p1.json
├── ExamCategoryC/             # e.g., NEET
│   └── exam_year_paper.json   # e.g., neet_ug_2023.json
├── config.json                # <--- IMPORTANT: Index of all exams
└── README.md
└── LICENSE
```

### `config.json` - The Exam Index

The `config.json` file in the **root** of this repository acts as the master index for the ExamSim application. It lists all available official exams and points to their respective JSON files.

**When adding a new exam JSON file, you MUST also add a corresponding entry to this `config.json` file.**

**`config.json` Format:** An array of objects, each describing an exam.

```json
[
  {
    "id": "nimcet_2023", // Unique identifier used by the app
    "title": "NIMCET 2023", // User-friendly display name
    "description": "National Institute of Technology MCA Common Entrance Test 2023", // Short description
    "category": "NIMCET", // Optional: Used for grouping/filtering
    "path": "NIMCET/nimcet_2023.json" // *Required*: Relative path from repo root to the JSON file
  },
  // ... more exam configurations
]
```

## Contribution Guidelines

Contributions are highly welcome! You can help by adding new question sets, fixing errors in existing ones, or adding explanations.

**How to Contribute:**

1.  **Fork:** Fork this repository to your own GitHub account.
2.  **Branch:** Create a new branch for your changes (e.g., `git checkout -b add-cat-2022` or `git checkout -b fix-jee-typo`).
3.  **Add/Edit Files:**
    *   Place new exam files in the appropriate `ExamCategory/` directory, following the naming convention (e.g., `examname_year_papernumber.json`).
    *   Ensure your JSON strictly follows the format defined above. Validate your JSON using an online validator or editor plugin.
    *   Please double-check the correctness of questions and answers. Adding explanations is strongly encouraged!
4.  **Update `config.json`:** **If you add a new exam file, you MUST add a corresponding entry to the root `config.json` file.**
5.  **Commit:** Commit your changes with clear and concise commit messages (e.g., `feat: Add CAT 2022 Question Paper` or `fix: Correct answer for NIMCET 2023 Q45`).
6.  **Pull Request (PR):** Push your branch to your fork and create a Pull Request back to this main repository.
    *   Clearly describe the changes you made in the PR description.
    *   Link to any relevant source material if applicable.
7.  **Review:** Your PR will be reviewed, and feedback may be provided before merging.

Thank you for helping make the ExamSim platform a better resource for students!

## License

This repository and its contents are licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
