Ready to dive into focused exam practice with **Examify** ([https://examify.web.app/](https://examify.web.app/))? This comprehensive guide will walk you through every key step, from selecting individual tests and creating/joining group sessions, to configuring settings, taking exams, and understanding your results with new AI-powered insights!

## Step 0: Account & Login

While you can explore some without an account, **logging in** with your **MyServices Portal** account unlocks the full power of Examify:
*   Saving your individual attempt history to track progress ([Profile Page](/profile)).
*   Creating and hosting Group Exam Sessions.
*   Joining Group Exam Sessions hosted by others.
*   Access to premium features and higher limits based on your [account tier](https://bcaexamprep.web.app/perks). 

<!-- Placeholder for Screenshot: Login button on Examify Header -->

*   **If you have an account:** Click the "Login" button in the header.
*   **If you don't:** You can [register here](https://bcaexamprep.web.app/register) via the main MyServices Portal.

Your data is handled as per our [Privacy Policy](/privacy-policy).

## Step 1: Choosing Your Practice Mode (Select Exam Page)

Navigate to the ["Select Exam"](https://examify.web.app/select-exam) page. This is your central hub for starting any practice.

<!-- Placeholder for Screenshot: ExamSelectionPage showing Individual and Group options -->

You have two main pathways:

### Pathway A: Individual Practice

Perfect for solo study and focused preparation.

1.  **Select Source:**
    *   **Official Mock Tests:**
        *   Choose a category (e.g., "NIMCET").
        *   Select the year/specific test instance.
        *   These use question sets from our public [GitHub repository](https://github.com/Samkarya/online-exam-questions).
    *   **Custom Test (Upload or Paste):**
        *   **Upload:** Click "Choose JSON File" and select a `.json` file from your device. Ensure it follows the [required format](/select-exam#json-format-example) (an example is shown on the page).
        *   **Paste:** Click "Paste JSON Code," paste your JSON array into the text area, and click "Validate Pasted JSON."
        *   *(Remember: You are responsible for the content and rights for custom tests - [Terms of Service](/terms-of-service)).*

2.  **Proceed to Configuration:** Once a valid source is selected, the "Start Individual Session" button will become active (if you're logged in and within any attempt limits). Click it to move to session configuration.

### Pathway B: Group Exam Sessions (NEW!)

For collaborative or instructor-led practice.

1.  **Creating a New Group Session (as a Host):**
    *   Click "Create New Group Session."
    *   *(Login and potentially a specific [account tier](https://bcaexamprep.web.app/perks) are required for hosting).*
    *   You'll be navigated to the "Create Group Session" page.
    *   *(See "Step 2A: Hosting a Group Session" below for detailed setup).*
2.  **Joining an Existing Group Session (as a Participant):**
    *   Click "Join Existing Session."
    *   *(Login required).*
    *   You'll be navigated to the "Join Group Session" page.
    *   *(See "Step 2B: Joining a Group Session" below for details).*

## Step 2A: Hosting a Group Session (Setup Page)

If you chose "Create New Group Session":

<!-- Placeholder for Screenshot: GroupExamSetupPage with various fields -->

1.  **Session Details:**
    *   **Session Name:** Give your session a clear, descriptive name.
    *   **Exam Duration:** Set the time limit in minutes for each participant (leave blank or 0 for untimed).
    *   **Marks & Marking Scheme:** Define marks for correct answers and, if enabled, negative marks for incorrect ones.
    *   **Optional Start/End Times:**
        *   *Start Time:* When participants can begin the exam.
        *   *Entry Deadline (End Time):* The latest time a participant can join/start.
    *   **Result Visibility:** Control what participants see and when (e.g., self-results immediately, or leaderboard after the entry deadline).
2.  **Question Source:**
    *   Similar to individual practice, select an "Official Exam" or provide "Custom JSON" (upload/paste) for the group session.
3.  **Session Integrity Tools (Optional, based on your [account tier]((https://bcaexamprep.web.app/perks)):**
    *   **Enable Anti-Cheating Monitoring:** If available and enabled, this activates:
        *   Focus Tracking (tab/window switching).
        *   Copy/Paste Prevention.
        *   Restricted Key Logging.
    *   **Geolocation Restriction (Advanced):** If available, you can define a geographic area (center latitude, longitude, and radius in meters) from which participants can join. You can even use your current location to set the center.
        <!-- Placeholder for Screenshot: Geolocation setup with map visualizer (IF/WHEN LEAFLET IS ADDED) -->
4.  **Create Session:** Once all settings are configured, click "Create Session." You'll be redirected to a share page with the unique Session ID.

## Step 2B: Joining a Group Session (Join Page)

If you chose "Join Existing Session":

<!-- Placeholder for Screenshot: JoinGroupExamPage with Session ID input -->

1.  **Enter Session ID:** Type or paste the Session ID provided by the host.
2.  **Verify & Consent:**
    *   Click "Verify Session ID."
    *   If the session has monitoring or geolocation enabled, a **consent prompt** will appear detailing these measures. You must "Agree & Proceed" to continue.
    *   If geolocation is active, your browser will ask for location permission. You must be within the designated zone to proceed.
3.  **Enter Session:**
    *   If the session has a future start time, you'll be taken to a waiting page.
    *   Otherwise, the exam will begin immediately.

## Step 3: Configuring Your Individual Practice Session

This step applies after selecting an "Official" or "Custom" source for *Individual Practice* and clicking "Start Individual Session".

*   **Time Limit:** Enter desired duration in minutes (0/blank for untimed).
*   **Marks per Correct Answer.**
*   **Negative Marking:** Enable and specify deduction if desired.
*   **(Optional) Track Question Time:** Helpful for detailed review.

Click "Start Exam" to begin.

## Step 4: Taking the Exam – The Interface

The exam interface is consistent for both individual and group sessions:

<!-- Placeholder for Screenshot: ExamPage interface - question, options, palette, timer, controls -->

*   **Main Area:** Displays the current question and options. Select your answer.
*   **Timer:** Shows remaining/elapsed time. May change color when time is low.
*   **Navigation Palette:** Color-coded grid of question numbers (answered, unanswered, marked, not visited). Click to jump.
*   **Exam Controls:**
    *   `Previous` / `Next`.
    *   `Clear Response`.
    *   `Mark for Review` / `Unmark`.
    *   `Save & Next` (implicitly saves and moves).
*   **(IF GROUP MONITORING ACTIVE) Monitoring Indicator (NEW!):** A small, draggable indicator (e.g., <FaEye /> icon) may appear on screen to remind you that monitoring is active.

## Step 5: Submitting Your Exam

Click "Submit Exam" (usually near the palette). Confirm your submission in the prompt that summarizes your attempt.

## Step 6: Understanding Your Results (Results Page)

You'll be redirected to the Results page:

<!-- Placeholder for Screenshot: ResultsPage showing score, breakdown, pie chart -->

*   Overall score and percentage.
*   Breakdown: Correct, incorrect, unattempted (counts & pie chart).
*   Details: Time taken, settings used, session name (if group).
*   **Leaderboard (For Group Exams - NEW!):** If the host enabled leaderboard visibility and the session end time (if any) has passed, you may see a leaderboard ranking participants.

## Step 7: Reviewing Your Answers (Key Learning Step!)

From the Results page, click "Review Answers."
*(Note: For individual custom uploaded/pasted exams, this feature depends on your [account tier](https://bcaexamprep.web.app/perks). For official exams and most group exams (post-deadline, if configured), review is typically available).*

<!-- Placeholder for Screenshot: ReviewPage showing a question and its correct/user answer + AI helper button -->

*   Navigate using "Previous"/"Next", the Review Palette, or the jump-to-question dropdown.
*   See the question, options, your chosen answer, and the correct answer highlighted.
*   Read official explanations (if available).
*   **AI Explanation Helper (NEW!):** For any question, click "Explain with AI." Choose an AI tool (like ChatGPT, Perplexity) or copy the generated prompt to get an alternative, detailed explanation. This is fantastic for understanding complex solutions.
*   Filter questions (All, Incorrect, Unattempted) for focused review.

## Step 8: Checking Your History (Profile Page)

Visit your ["Profile"](/profile) (requires login) to:
*   View all saved individual and group exam attempts.
*   See your performance trends.
*   Revisit results pages.
*   Manage (delete) old attempts.
*   View your current account tier and limits.

## Step 9: Managing Hosted Sessions (Host Dashboard Page - NEW!)

If you've hosted group sessions, visit the ["Hosted Sessions"](/group-exam/dashboard) page:
*   View a list of all sessions you've created.
*   See session status (Pending, Active, Closed), timings, and settings.
*   **Session Details Modal:**
    *   View real-time participant status (Joined, Started, Completed, Score).
    *   If monitoring was enabled, see a summary of integrity flags per participant.
    *   Copy the Session ID/Join Link again.
    *   Download participant results as a CSV file (feature may depend on your [account tier](https://bcaexamprep.web.app/perks)), now including integrity flag summaries!
*   Close or Delete session configurations.

## Tips for Effective Practice

*   **Simulate Real Conditions:** Use the timer, minimize distractions.
*   **Strategic Marking:** Use "Mark for Review" effectively.
*   **Thorough Review:** Focus on *why* you made mistakes. Use the AI helper!
*   **Targeted Practice:** Leverage custom tests for weak areas.
*   **Group Study:** Use group sessions for shared learning and accountability.

You're now equipped to make the most of all Examify features! Happy practicing, and good luck with your exams!

[**➡️ Get Started with Examify Now!**](https://examify.web.app/select-exam)
