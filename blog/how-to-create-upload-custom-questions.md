---
title: "Tutorial: How to Create and Upload Your Own Question Papers"
date: "2025-06-20"
author: "The Examify Team"
excerpt: "Want to practice with your own questions? Learn how to create custom JSON question papers and upload them to Examify for a personalized exam experience."
tags: ["Tutorial", "Custom Exams", "JSON Format", "Teachers", "Self Study", "Examify Features"]
---

## Take Control of Your Practice
One of Examify's most powerful features is the ability to **upload your own question papers**. Whether you are a student wanting to practice a specific set of questions from a coaching institute, or a teacher creating a mock test for your students, Examify's custom upload feature gives you complete flexibility.

This guide will walk you through the simple process of creating a compatible JSON file and uploading it to the platform.

## Step 1: Understand the JSON Format
Examify uses a standard **JSON (JavaScript Object Notation)** format to read questions. Don't worry if you aren't a coder; it's just a structured way of writing text.

### The Structure
Your file should be a list (array) of question objects. Here is a simple template you can copy:

```json
[
  {
    "id": 1,
    "question": "What is the capital of France?",
    "options": [
      "London",
      "Berlin",
      "Paris",
      "Madrid"
    ],
    "correctAnswer": "Paris",
    "section": "General Knowledge",
    "explanation": "Paris is the capital and most populous city of France."
  },
  {
    "id": 2,
    "question": "Solve for x: 2x + 5 = 15",
    "options": [
      "5",
      "10",
      "2.5",
      "7.5"
    ],
    "correctAnswer": "5",
    "section": "Mathematics",
    "explanation": "Subtract 5 from both sides: 2x = 10. Divide by 2: x = 5."
  }
]
```

### Key Fields Explained:
*   `id`: A unique number for each question.
*   `question`: The text of the question. You can use Markdown here!
*   `options`: A list of 4 answer choices.
*   `correctAnswer`: The exact text of the correct option. **Must match exactly.**
*   `section`: (Optional) The subject category (e.g., "Mathematics", "English").
*   `explanation`: (Optional) Text shown during the review phase.

## Step 2: Create Your File
1.  Open any text editor (Notepad, VS Code, etc.).
2.  Copy the template above.
3.  Replace the questions and options with your own.
4.  Save the file with a `.json` extension (e.g., `my-mock-test.json`).

> **Pro Tip:** You can use ChatGPT to generate this JSON for you! Just ask: *"Create a JSON array of 10 multiple choice questions on Computer Science for Examify, with fields: id, question, options, correctAnswer, section, explanation."*

## Step 3: Upload to Examify
1.  Go to the [**Select Exam**](https://examify.web.app/select-exam) page.
2.  Scroll down to the **"Custom Test"** section.
3.  Click **"Choose JSON File"** and select the file you just created.
4.  Alternatively, you can copy the text from your file and paste it into the "Paste JSON Code" box.

## Step 4: Validate and Start
Examify will instantly check your file for errors.
*   **If valid:** You will see a success message. You can then set your time limit and marking scheme.
*   **If invalid:** An error message will tell you what went wrong (usually a missing comma or quote).

## Why Use Custom Uploads?
*   **Targeted Practice:** Create a test containing *only* the questions you got wrong in previous attempts.
*   **Share with Friends:** Create a tough paper and share the JSON file with your study group.
*   **Digitize Books:** Type out questions from your physical textbooks to practice them in a realistic CBT environment.

Start building your personal question bank today!
