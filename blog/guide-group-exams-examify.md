
Examify ([https://examify.web.app/](https://examify.web.app/)) is not just for solo practice! Our **Group Exam Sessions** feature transforms how students, study groups, and educators can approach exam preparation collaboratively and conduct effective mock assessments.

Whether you're looking to create a timed practice test for your study buddies, administer a quiz for your students, or simply join a session hosted by someone else, this guide will walk you through everything you need to know.

## Why Use Group Exam Sessions?

Group practice offers unique advantages:

*   **Simulated Peer Environment:** Practicing alongside others, even remotely, can mimic the slight pressure and focus of a real exam hall.
*   **Accountability & Motivation:** Scheduled group sessions can keep everyone on track with their preparation.
*   **Comparative Insights (for Hosts):** Understand how your group is performing collectively and identify common areas of difficulty. (Leaderboards can offer a glimpse to participants too, if enabled).
*   **Efficient Assessment (for Educators):** Quickly create and administer mock tests using official papers or your own custom content.
*   **Shared Learning:** Post-session discussions about challenging questions can be incredibly beneficial.

## For Hosts: Creating and Managing Your Group Session

Ready to lead a practice session? Here's how to get started from the ["Select Exam" page](/select-exam):

<!-- Placeholder for Screenshot: Select Exam page with "Create New Group Session" button highlighted -->

1.  **Initiate Creation:** Click the "Create New Group Session" button. *(Note: Hosting may be tied to specific [account tiers/perks](https://bcaexamprep.web.app/perks)).*
2.  **Navigate to Setup:** You'll be taken to the "Create Group Exam Session" page.

### Configuring Your Session:

<!-- Placeholder for Screenshot: GroupExamSetupPage highlighting key sections -->

*   **1. Session Details:**
    *   **Session Name:** Make it clear and recognizable for your participants (e.g., "NIMCET Mock - Set 3 - Evening Batch").
    *   **Exam Duration:** The time limit (in minutes) each participant gets *after they start their individual attempt*. Leave blank for no time limit.
    *   **Marking Scheme:** Set marks for correct answers and (optionally) enable negative marking with a specific deduction for incorrect ones.
    *   **Optional Start Time:** The earliest time participants can begin their attempt. If not set, they can start as soon as they join and the session is active.
    *   **Optional Entry Deadline:** The latest time a participant can *join and start* the exam. After this, new participants cannot begin.
    *   **Result Visibility:** Crucial for controlling what participants see:
        *   `Self Only Immediate`: Participants see their own detailed results right after they submit.
        *   `Self Only After End Time`: Own results are visible only after the "Entry Deadline" passes.
        *   `Leaderboard After End Time`: A ranked leaderboard (name, score) becomes visible to participants after the "EntryDeadline." Individual detailed review might still be restricted until later or not available, depending on other settings.
        *   `Full Review After End Time`: Participants can access their detailed results *and* the question review page after the "Entry Deadline."

*   **2. Question Source:**
    *   **Official Exam:** Select from available categories and papers (e.g., NIMCET 2023).
    *   **Custom JSON:** Upload your own `.json` file or paste JSON code, just like for individual practice. Ensure it meets the [specified format](/select-exam#json-format-example). *You are responsible for the content you use.*

*   **3. Session Integrity (Optional, may depend on [Host Perks](https://bcaexamprep.web.app/perks)):**
    *   **Enable Anti-Cheating Monitoring:** Toggle this ON to activate:
        *   Focus Tracking (detects tab/window switching).
        *   Copy/Paste Prevention.
        *   Logging of certain restricted key presses (e.g., PrintScreen attempts).
    *   **Geolocation Restriction:** If this advanced feature is enabled by you (and available on your tier), specify a geographic center (Latitude, Longitude) and an allowed radius (in meters). Participants outside this zone won't be able to start. You can use the "Use My Current Location" button for easy center-point setup.
        <!-- Placeholder for Screenshot: Geolocation setup within GroupExamSetupPage -->

*   **4. Create!**
    *   Click "Create Session." You'll be redirected to the **Share Page**.

### Sharing & Monitoring Your Session (Share Page & Host Dashboard):

<!-- Placeholder for Screenshot: GroupExamSharePage showing Session ID and Join Link -->

*   **Share Page:**
    *   You'll get a unique **Session ID** and a direct **Join Link**. Share these with your intended participants.
    *   You can see participants join in real-time.
*   **Host Dashboard ([/group-exam/dashboard](/group-exam/dashboard)):**
    *   All your created sessions are listed here.
    *   **View Details:** Click "Details" on a session to open a modal.
        *   **Participant Status:** See who has joined, started, or completed, along with their scores (based on visibility settings).
        *   **Integrity Flags:** If monitoring was enabled, see a summary of any flags (e.g., focus losses, copy attempts) for each participant.
        *   **Download CSV:** If your [tier supports it](https://bcaexamprep.web.app/perks), download participant results and monitoring summaries as a CSV file.
    *   **Manage Session:**
        *   **Close Session:** Prevents new participants from joining. Useful after the intended start window or if issues arise.
        *   **Delete Session:** Removes the session configuration from your dashboard. *Note: This doesn't delete attempts already saved to participants' personal histories.*

## For Participants: Joining and Taking a Group Exam

Ready to join a session hosted by your instructor or study group leader?

1.  **Get the Session ID or Join Link:** The host will provide this to you.
2.  **Navigate to Join:**
    *   If you have the link, opening it will usually take you to the join page with the ID pre-filled.
    *   Otherwise, go to the ["Select Exam" page](/select-exam) on Examify and click "Join Existing Session."
3.  **Enter Session ID:** Type or paste the Session ID.

<!-- Placeholder for Screenshot: JoinGroupExamPage with a user entering an ID -->

4.  **Verify & Consent:**
    *   Click "Verify Session ID" (or similar, button text might vary).
    *   **Crucial:** If the host has enabled **Monitoring or Geolocation Restriction**, a prompt will appear detailing these measures.
        *   You'll see what's being monitored (e.g., tab focus, copy/paste).
        *   If geolocation is active, it will state that your location needs to be verified.
    *   You must click **"Agree & Proceed"** (or similar) to consent and continue. If you don't agree, you can cancel.
        <!-- Placeholder for Screenshot: Consent modal shown to participant -->
5.  **Geolocation Check (if active):**
    *   Your browser will ask for permission to access your location. You must grant it.
    *   Examify will check if you're within the host-defined zone. If not, you'll be informed and won't be able to proceed until you are.
6.  **Waiting Page or Exam Start:**
    *   If the host set a future **Start Time**, you'll land on a waiting page. The exam will begin automatically when the time comes. (Optionally enable browser notifications for a reminder!)
    *   If no future start time (or it has passed) and you've passed all checks, the exam interface will load, and your time will begin!
7.  **Taking the Exam:** The interface (palette, controls, timer) is the same as for individual practice. Focus and do your best!
    *   If monitoring is active, a small **"Monitoring Active" indicator** (<FaEye />) may be visible on your screen.
8.  **Results & Review:** After submitting (or time runs out), your access to results and the review page depends on the **Result Visibility** settings chosen by the host. You might see your score immediately, or have to wait until the session's "Entry Deadline" has passed.

## Tips for a Smooth Group Session Experience

*   **Hosts:**
    *   Clearly communicate the Session ID, start/end times, and any active monitoring to participants beforehand.
    *   Choose result visibility settings appropriate for your session's purpose.
    *   Use the Host Dashboard to monitor progress.
*   **Participants:**
    *   Ensure a stable internet connection.
    *   Read consent prompts carefully. If monitoring is active, understand what it entails and try to stay focused on the exam window.
    *   If geolocation is required, ensure your device's location services are enabled and you've granted browser permission.

Group Exam Sessions in Examify offer a dynamic way to prepare. Whether hosting or participating, leverage these tools to make your practice more effective and engaging!

[**➡️ Host or Join a Group Session Now!**](https://examify.web.app/select-exam)
