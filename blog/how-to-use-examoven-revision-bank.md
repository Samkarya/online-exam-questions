---
title: "How to Filter and Retake Your Mistakes Across Multiple Tests"
date: "2026-10-01"
author: "ExamOven Team"
excerpt: "A practical guide to ExamOven's Revision Bank. Learn how to bundle your wrong and skipped questions from multiple tests into a single retake or review session."
tags: ["Revision", "How-To", "Study Guide", "Exam Prep", "Features"]
---
<section id="overview">

If you use ExamOven to practice for exams, you have probably run into this situation:

You have a large pool of questions—say, 1,000 questions for an upcoming exam—and you break them down into smaller practice sessions of 20 or 25 questions each. Over a week or two, you finish 20 different tests.

In each test, you missed 3 or 4 questions and skipped a couple you were not sure about. When it is time to revise, you just want one thing:

**Show me all the questions I got wrong across those 20 tests so I can retake them in one go.**

Until now, doing that meant clicking into Test 1's results page, writing down or reviewing your mistakes, backing out to your history, clicking into Test 2, repeating the process, and doing that 20 times. It was tedious, and nobody has the patience for that during exam prep.

We built the **Revision Bank** (`/revision`) to solve this exact problem. It lets you pick any set of completed tests, grab all your wrong or skipped questions at once, and either retake them as a fresh test or read through the explanations without a timer.

Here is a step-by-step walkthrough of how the feature works and how to get the most out of it.

</section>

---
<section id="how-tests-are-grouped">

## 1. How tests are grouped: Suites vs. Custom Series

When you open the Revision Bank, you will see your past attempts organized into two tabs on the left sidebar:

| Tab | What it is | When to use it |
|---|---|---|
| **Official Suites** | ExamOven automatically detects and groups attempts that belong to the same official syllabus (like CAT, NEET, JEE, or CompTIA). | When all your practice tests came from the same official exam and you want to bundle all of them with one click. |
| **My Series** | Custom groups you build yourself. You name the group and choose exactly which attempts go into it. | When you want to group specific practice runs—like "Week 1 Quizzes", "Pharmacology Only", or custom exams you created using JSON. |

> [!TIP]
> If you like how an Official Suite is organized but want to add or remove specific tests, click **Save as Custom** on that suite. It will copy the tests into a new custom series you can edit freely.

</section>

---

<section id="step-1-open-the-revision-bank">

## Step 1: Open the Revision Bank

There are two primary ways to get to the Revision Bank:

1. **Top Navbar:** Click **Revision** in the main navigation menu at the top of the site (accessible from any page).
2. **Exam Results Page:** When you finish any test, look for the Revision callout banner on your results page. If that test belongs to an official suite or series, clicking that banner takes you straight to that group in the Revision Bank.

You can also navigate directly to `/revision` at any time.

When you land on the page, the top stat cards give you a quick summary:
- **Tests Completed:** How many total attempts you have finished.
- **Missed Questions:** Total questions you answered incorrectly across your history.
- **Skipped Questions:** Questions you left unattempted.
- **Available Series:** Total custom series and official suites available to revise.

![Revision Bank dashboard overview with stat cards and left sidebar](/blog/assets/revisionGuide/revision-dashboard-overview.png)

</section>

---

<section id="step-2-pick-your-tests">

## Step 2: Pick your tests (or make a Custom Series)

### If you want to revise an Official Exam:
1. Click the **Official Suites** tab in the sidebar.
2. Click on your exam name from the list.
3. The detail panel on the right will immediately load all your attempts from that exam.

### If you want to bundle specific tests into a Custom Series:
1. Click the **+ New Series** button in the top right.
2. Type a name for your series (for example: *"Anatomy Quizzes 1 to 5"*).
3. Use the search bar to filter your attempts by title, or set a date range (From / To) if you took them during a specific week.
4. Click **Select All Filtered** (or check the boxes next to individual tests).
5. Click **Save Series**.

![Creating a custom series in the Series Picker modal](/blog/assets/revisionGuide/series-picker-modal.png)

Your new series will now appear under the **My Series** tab. You can click the pencil icon next to it anytime to add more tests or rename it, or the trash icon to delete it.

> [!NOTE]
> Deleting a custom series only removes the grouping. It will never delete your actual test history or exam scores.

### Shortcut: Tag your Custom Exams directly when creating them
If you regularly generate or paste custom practice tests on the **Create Custom Exam** page (`/custom-exam`), you don't even have to come back and manually build a series later.

As soon as your questions are validated, an optional **Add to Test Series** input appears right above the "Start Session" button:
- **Auto-suggests existing series:** Type a brand-new series name (like *"Calculus Sprints"*) or pick an existing series from the dropdown list.
- **Remembers your last series:** ExamOven automatically remembers your last used series name so you don't have to retype it across multiple 20-question batches.
- **Auto-tags upon completion:** When you finish and submit the test, it is automatically added to that series in the background.

When you open the Revision Bank later, all those custom tests are already waiting grouped together under that series.

![Tagging a custom exam with a Test Series on the Create Custom Exam page](/blog/assets/revisionGuide/custom-exam-series-tag.png)

</section>

---

<section id="step-3-choose-your-question-filters">

## Step 3: Choose your question filters

Once you click on a suite or series, the right-hand panel shows you a preview of how many wrong and skipped questions are in that group.

Below the preview, you have two simple controls to tune your bundle:

![The Revision Filters panel with question status options and deduplication toggle](/blog/assets/revisionGuide/revision-filters-panel.png)

### 1. Question status chips
Click one of the four options depending on what you want to practice:
- **Wrong + Skipped (Default):** Includes both the questions you answered incorrectly and the ones you left blank.
- **Wrong only:** Focuses strictly on the questions you got wrong.
- **Skipped only:** Focuses only on questions you skipped, which is great for working on questions you ran out of time on or felt unsure about.
- **All questions:** Pulls every single question from all selected tests into one giant mega-test.

### 2. Deduplicate identical questions
If you took practice tests that pulled from the same question pool, the same question might have shown up in two different tests.

- Leave this switch **ON** (default) if you only want to see each unique question once.
- Turn it **OFF** if you want to see every instance, even if a question was repeated.

### The Live Match Count
Notice the counter below the filters:
```
42 wrong + skipped questions in this bundle
```
As you toggle filters, this number updates in real time so you know exactly how many questions you are about to work with before launching.

</section>

---

<section id="step-4-pick-your-mode">

## Step 4: Pick your mode — Retake or Just Review

At the bottom of the panel, you will see two launch buttons:

![The two launch buttons: Retake These Questions and Just Review](/blog/assets/revisionGuide/revision-filters-panel.png)

### Option A: Retake These Questions (Timed, Scored Test)
Use this when you want to actually test yourself again.

- It builds a brand new, sequential test ($1, 2, 3 \dots$) containing only your filtered questions.
- It opens in the normal ExamOven testing screen with a countdown timer, question palette, and submit button.
- When you finish and submit, ExamOven grades your answers and records a new attempt so you can see if your score improved.

### Option B: Just Review (Untimed, Read-Only)
Use this when you don't want test pressure and just want to read through the solutions.

- It opens the **Review Room** (`/revision/review`) with no timer running.
- Each question card shows the question text, what answer you originally picked, what the correct answer actually is, and the written explanation.
- It does **not** record a new attempt or affect your stats.
- If you need a deeper explanation, each question has an **Explain with AI** dropdown that can open a ready-made prompt in ChatGPT, Claude, Perplexity, or Phind.

</section>

---

<section id="comparison-table">

## Side-by-side comparison: Retake vs. Just Review

| Feature | Retake These Questions | Just Review |
|---|---|---|
| **Best for** | Testing if you actually remember the material | Studying explanations and understanding concepts |
| **Timer** | Yes, runs a normal exam timer | No timer (take as long as you want) |
| **Answers shown** | Only after you submit the test | Immediately visible on every question |
| **Saves a new score?** | Yes, saves an attempt to your history | No, completely read-only |
| **AI explanation prompts** | Available on the final results page | Available right on each question card |

</section>

---

<section id="helpful-details">

## Helpful details to know

Here are a few small but important things to keep in mind when using the Revision Bank:

1. **Everything stays on your device:** All your attempts, series, and mistake collections are stored locally in your browser (using IndexedDB). ExamOven does not upload your study history to an external server.
2. **Backing up your data:** Because data is saved locally, if you switch browsers, use Incognito mode, or clear your browser data, your local history will reset. Use the **Google Drive Backup** option in your Profile page if you want to sync your history across devices.
3. **Self-healing series:** If you delete an old test from your history that was part of a custom series, you don't need to manually fix the series. The Revision Bank will quietly remove that deleted attempt the next time you open the series without showing broken errors.
4. **Best revision habit:** A great way to use this feature is the **48-hour rule**. Take your tests, do a quick pass using **Just Review** on the same day to understand why you missed each question, and then wait 2 days before using **Retake These Questions**. Retaking after a short delay tests real understanding instead of immediate short-term memory.

---

Ready to clean up your mistakes? Head over to the [Revision Bank](/revision) and see how many of your wrong answers you can turn into correct ones today.

</section>
