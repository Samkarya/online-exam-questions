# 📚 Online Exam Questions for Examify Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Examify](https://img.shields.io/badge/Used%20By-Examify-blue)](https://examify.web.app/)

This repository serves as the **Open Source Question Bank** for the [Examify Online Practice Platform](https://examify.web.app/). It decouples content from code, allowing for community-driven updates, transparent sourcing, and easy management of exam papers.

---

## 📖 Table of Contents

1.  [How It Works](#-how-it-works)
2.  [The Master Index (`config.json`)](#-the-master-index-configjson)
3.  [Question File Format](#-question-json-file-format)
4.  [Rich Content Guide (Math, Images, SVG)](#-rich-content-guide)
5.  [Using AI to Generate Questions](#-using-ai-to-generate-questions)
6.  [Contribution Guidelines](#-contribution-guidelines)

---

## 🛠 How It Works

The Examify application consumes this repository directly:

1.  **Discovery:** On startup, Examify fetches the **`config.json`** file from the root of this repository. This file acts as a registry, telling the app which exams are available (e.g., "NIMCET 2023", "JEE Main 2024").
2.  **Loading:** When a user selects an exam, Examify reads the corresponding **Question JSON file** (e.g., `NIMCET/nimcet_2023.json`) specified in the config.
3.  **Rendering:** The app parses the JSON and renders questions using a custom Markdown engine that supports LaTeX, syntax highlighting, and even sanitized HTML/SVG.

---

## ⚙️ The Master Index (`config.json`)

The `config.json` file at the root is the entry point. Every exam available in the app must be listed here.

### Schema

It is an array of objects, where each object represents a single exam paper.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | **Yes** | Unique identifier (e.g., `nimcet_2023`). Use lowercase snake_case. |
| `category` | `string` | **Yes** | Top-level grouping (e.g., `NIMCET`, `JEE Main`). |
| `year` | `number` | **Yes** | The year of the exam (e.g., `2023`). |
| `title` | `string` | **Yes** | Display title (e.g., `NIMCET 2023`). |
| `path` | `string` | **Yes** | Relative path to the question file (e.g., `NIMCET/nimcet_2023.json`). |
| `description` | `string` | No | Brief description of the exam. |
| `session` | `string` | No | E.g., `January`, `April`. |
| `shift` | `number` | No | E.g., `1`, `2`. |
| `paperType` | `string` | No | E.g., `Paper 1 (PCM)`. |
| `date` | `string` | No | ISO Date `YYYY-MM-DD`. |

### Example Entry

```json
{
  "id": "jeeMain_2024_jan_s1",
  "category": "JEE Main",
  "year": 2024,
  "title": "JEE Main 2024 (Jan 22, Shift 1)",
  "path": "JEEMains/2024/jeeMain_2024_jan_s1.json",
  "session": "January",
  "shift": 1,
  "paperType": "Paper 1"
}
```

---

## 📝 Question JSON File Format

Each exam file (e.g., `NIMCET/nimcet_2023.json`) contains the actual questions.

### Schema

The file must be a **JSON Array** of question objects.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `question_number` | `number` | **Yes** | Sequential integer starting from 1. |
| `question_text` | `string` | **Yes** | The question body. Supports Markdown, LaTeX, & HTML. |
| `options` | `object` | **Yes** | Key-value pairs (e.g., `"a": "Option text"`). |
| `correct_answer` | `string` | **Yes** | The key of the correct option (e.g., `"b"`). |
| `subject` | `string` | No | E.g., `Mathematics`. |
| `topic` | `string` | No | E.g., `Calculus`. |
| `difficulty` | `string` | No | `Easy`, `Medium`, or `Hard`. |
| `explanation` | `string` | No | Detailed solution. Supports rich content. |

### 💡 Best Practice: Case Sensitivity
*   **Option Keys:** Always use lowercase (`"a"`, `"b"`, `"c"`, `"d"`).
*   **Correct Answer:** Ensure the `correct_answer` value matches the option key exactly (e.g., `"b"`).
*   *Note: The Examify app is robust and handles case-insensitive matching, but maintaining strict consistency is recommended for data quality.*

### Example Question

```json
{
  "question_number": 1,
  "subject": "Physics",
  "question_text": "What is the escape velocity from Earth? $v_e = \\sqrt{2gR}$",
  "options": {
    "a": "11.2 km/s",
    "b": "9.8 km/s",
    "c": "3.0 km/s",
    "d": "42.0 km/s"
  },
  "correct_answer": "a",
  "explanation": "Escape velocity is given by $v_e = \\sqrt{2GM/R}$."
}
```

---

## ✨ Rich Content Guide

Examify's `MarkdownRenderer` is powerful. You can use the following features in `question_text`, `options`, and `explanation`.

### 1. Mathematical Notation (LaTeX)
Uses **KaTeX**.
*   **Inline:** `$ E = mc^2 $`
*   **Block:** `$$ \sum_{i=0}^n i^2 $$`
*   ⚠️ **Escaping:** You must escape backslashes in JSON.
    *   Write `\\frac{a}{b}` instead of `\frac{a}{b}`.
    *   Write `\\sqrt{x}` instead of `\sqrt{x}`.

### 2. Images
*   **Syntax:** `![Alt Text](URL)`
*   **Relative Paths:** You can link to images inside this repo!
    *   Use: `![Diagram](NIMCET/assets/q1_diagram.png)`
    *   The app automatically resolves this to the raw GitHub URL.
*   **Absolute URLs:** `![Diagram](https://example.com/image.png)` works too.

### 3. HTML & SVG (Advanced)
The renderer supports **raw HTML** and **SVG**, sanitized for security. This allows for drawing diagrams directly in the question!

**Supported Tags:** `<table>`, `<tr>`, `<td>`, `<svg>`, `<path>`, `<circle>`, `<rect>`, `<line>`, `<text>`, etc.

**Example (SVG in JSON):**
```json
"question_text": "Find the area of the shape below:\n\n<svg width='100' height='100'><circle cx='50' cy='50' r='40' stroke='black' stroke-width='3' fill='red' /></svg>"
```

### 4. Code Blocks
Use standard Markdown fenced code blocks.
*   ⚠️ **Escaping:** Escape newlines as `\n`.

```json
"question_text": "Output?\n\n```python\nprint('Hello')\n```"
```

---

## 🤖 Using AI to Generate Questions

You can use LLMs (ChatGPT, Gemini, Claude) to generate these JSON files. Use this prompt to ensure high quality:

> **Prompt:**
> "Generate a JSON array of 5 multiple-choice questions for [Subject/Exam].
>
> **Format Rules:**
> 1. Output strictly valid JSON.
> 2. Use this structure: `{"question_number": 1, "question_text": "...", "options": {"a": "...", "b": "..."}, "correct_answer": "a", "explanation": "..."}`.
> 3. **LaTeX:** Use `$` for inline math. **ESCAPE ALL BACKSLASHES** (e.g., `\\frac`, `\\alpha`).
> 4. **Newlines:** Use `\n` for line breaks.
> 5. **Option Keys:** Use lowercase 'a', 'b', 'c', 'd'.
> 6. **Content:** Make the questions challenging and include detailed explanations."

---

## 🙌 Contribution Guidelines

We welcome contributions! Whether it's adding a new year's paper or fixing a typo.

1.  **Fork & Branch:** Create a branch like `feat/add-jee-2025`.
2.  **Add Content:**
    *   Place new JSON files in the appropriate Category folder.
    *   Place assets in a `assets/` subfolder.
3.  **Update Config:** Add your new exam to `config.json`.
4.  **Validate:**
    *   Check JSON syntax (use a linter).
    *   Verify LaTeX rendering (look for unescaped backslashes).
5.  **Pull Request:** Submit your PR to the `main` branch.

---

### ✅ Data Quality Checklist
*   [ ] Is the JSON valid?
*   [ ] Are all LaTeX backslashes double-escaped (`\\`)?
*   [ ] Does `correct_answer` match an option key exactly?
*   [ ] Are image paths correct?
*   [ ] Did you add an entry to `config.json`?