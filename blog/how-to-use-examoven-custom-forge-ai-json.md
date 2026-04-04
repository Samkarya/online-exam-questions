---
title: "The Custom Forge: How to Build & Generate AI Mock Exams in ExamOven"
date: "2026-03-28"
author: "The ExamOven Team"
excerpt: "Learn how to turn any textbook or notes into a private, local mock exam using ExamOven’s Custom Forge and AI-generated JSON files."
tags: ["AI Learning", "JSON Exams", "Study Hacks", "Privacy"]
---

<section id="introduction">

Preparing for a standardized test is one thing, but what happens when you need to study for a highly specific university module, a niche certification, or a proprietary syllabus? Static, pre-made question banks often fall short of these specific needs.

You need a way to turn *your* specific study materials into a realistic testing environment. 

Welcome to **The Custom Forge**—ExamOven’s powerful, 100% local workshop designed to let you build your own custom exams in seconds. Whether you have an existing JSON question bank or you want to use advanced AI (like ChatGPT or Claude) to generate a hyper-specific test from your textbook notes, the Forge handles it all with zero surveillance and 100% privacy.

</section>

<section id="forge-mechanics">

## What is The Custom Forge?

Located on the Practice Selection page, the "Custom / Upload" tab is more than just a file loader; it is an intelligent validator. To ensure your exam session is stable, the Forge runs a series of integrity checks:

1.  **Structural Integrity:** Every input is validated against the ExamOven core schema.
2.  **Auto-Fixing Engine:** If question numbers are skipped or disordered, the Forge re-sequences them ($1, 2, 3...$) automatically.
3.  **Local-First Persistence:** Your "Forged" exam is saved to your browser's IndexedDB, meaning you can refresh the page without losing your progress.

<table width="100%" border="1" style="border-collapse: collapse; text-align: left; margin: 20px 0;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th style="padding: 12px;">Feature</th>
      <th style="padding: 12px;">Technical Implementation</th>
      <th style="padding: 12px;">Benefit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px;"><strong>Validation</strong></td>
      <td style="padding: 10px;">Schema Matching</td>
      <td style="padding: 10px;">Zero Crashes during Exam</td>
    </tr>
    <tr>
      <td style="padding: 10px;"><strong>Privacy</strong></td>
      <td style="padding: 10px;">No External API Calls</td>
      <td style="padding: 10px;">Data stays in your RAM/Disk</td>
    </tr>
    <tr>
      <td style="padding: 10px;"><strong>Formatting</strong></td>
      <td style="padding: 10px;">KaTeX & Prism.js</td>
      <td style="padding: 10px;">Professional Math & Code rendering</td>
    </tr>
  </tbody>
</table>

![The ExamOven Custom Forge interface highlighting the 'Paste JSON' and 'Upload' buttons for localized data processing.](/blog/assets/custom-forge-interface.png)

</section>

<section id="workflows">

## Three Simple Workflows

The Forge adapts to your technical level. Choose the workflow that fits your current situation.

### 1. No JSON? Use the "OvenMasterJSON" AI Prompt
If you only have raw notes, use our specialized prompt to turn any LLM (ChatGPT, Claude, etc.) into an exam author.

*   **Step A:** Copy the **OvenMasterJSON** prompt from the Forge tab.
*   **Step B:** Paste it into your AI with your study material.
*   **Step C:** The AI outputs a structured JSON that supports complex math:

$$\text{Confidence Level} = \int_{study}^{exam} \frac{practice}{anxiety} dx$$

### 2. Have a JSON? Instant Import
For those who already have a file, simply drag and drop. The Forge will parse the data and show you a summary of the topics covered. If you find your subject isn't listed in our main library, check out our [Request Exam](/exam-not-found) page.

### 3. Have Errors? Use the Companion Editor
If your AI-generated JSON has a missing comma or a broken bracket, don't worry. Click the **"Editor"** button to open the visual form-based authoring tool.

</section>

<section id="json-spec">

## The Deep Dive – The ExamOven Schema

Our renderer is built to handle professional-grade technical content. Below is the exact structure your JSON should follow to leverage full syntax highlighting and explanations.

```json
{
    "question_number": 1,
    "subject": "Cloud Architecture",
    "topic": "Data Consistency",
    "question_text": "Explain the following distributed computing concept using Python code. \n\n```python\ndef check_integrity(data):\n    return hash(data) == stored_hash\n```",
    "options": {
      "a": "Strong Consistency",
      "b": "Eventual Consistency",
      "c": "Check-Sum Validation",
      "d": "Read-after-write"
    },
    "correct_answer": "c",
    "explanation": "The code snippet illustrates a basic integrity check using hashing, which is fundamental in detecting data corruption.",
    "difficulty": "Medium"
  }
```

### Visualizing the Forge Process
Our local-first architecture ensures your data moves in a closed loop:

<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto; margin: 20px 0;"><rect x="50" y="50" width="120" height="60" rx="8" fill="#e3f2fd" stroke="#2196f3" stroke-width="2"/><text x="110" y="85" text-anchor="middle" font-family="sans-serif" font-size="12">Raw AI JSON</text><line x1="170" y1="80" x2="220" y2="80" stroke="#2196f3" stroke-width="2" marker-end="url(#arrowhead)"/><rect x="230" y="50" width="120" height="60" rx="8" fill="#fff3e0" stroke="#ff9800" stroke-width="2"/><text x="290" y="85" text-anchor="middle" font-family="sans-serif" font-size="12">Forge Validation</text><line x1="350" y1="80" x2="400" y2="80" stroke="#ff9800" stroke-width="2" marker-end="url(#arrowhead)"/><rect x="410" y="50" width="120" height="60" rx="8" fill="#e8f5e9" stroke="#4caf50" stroke-width="2"/><text x="470" y="85" text-anchor="middle" font-family="sans-serif" font-size="12">Local Session</text><defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#2196f3" /></marker></defs></svg>

</section>

<section id="summary">

## The Pro-Tip Summary

<div style="background-color: #f3e5f5; border-left: 5px solid #9c27b0; padding: 20px; border-radius: 8px;">
  <strong>🔥 Pro-Tip for Educators:</strong>
  <p>If you are managing a large bank of questions, use our <strong>Bulk sequence fixer</strong>. If your JSON questions are numbered 101, 102, 103, but you want them to start from 1, the Forge's local pre-processor handles this the moment you click 'Start,' ensuring your question palette is always intuitive.</p>
</div>

</section>

### Take Control of Your Practice
Stop relying on generic study sets. With ExamOven, you are the architect of your own growth. By combining the power of AI with our privacy-first local engine, you can simulate any test, anywhere, anytime.

**[Step Into the Forge & Start Practicing Now](/select-exam)**

*To see how others are building their JSON banks, check out our [Open Source Question Bank](https://github.com/Samkarya/online-exam-questions).*

</section>