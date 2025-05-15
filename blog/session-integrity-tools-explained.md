
At Examify ([https://examify.web.app/](https://examify.web.app/)), we understand the importance of creating a focused and fair environment for practice, especially in group settings. That's why we've introduced **Session Integrity Tools** that hosts can optionally enable for their Group Exam Sessions.

This post dives deep into what these tools are, how they work, and how they contribute to more meaningful and reliable practice outcomes, while respecting participant transparency. These features may be part of our [premium tiers](https://bcaexamprep.web.app/perks).

## Why Session Integrity Tools?

When conducting group practice tests or mock exams, ensuring participants are engaging genuinely and minimizing distractions or potential shortcuts is key to:

*   **Accurate Assessment:** Getting a truer picture of knowledge and preparedness.
*   **Fair Comparison:** If leaderboards or group analysis is used, it's important that results reflect fair attempts.
*   **Developing Good Exam Habits:** Encouraging participants to practice under conditions that promote focus and self-reliance.

Examify's Session Integrity Tools are designed as **deterrents and informational aids for hosts**, not as infallible proctoring solutions. They provide insights into participant behavior during the exam.

## How it Works: Host Configuration & Participant Consent

1.  **Host Opt-In:** When [creating a Group Exam Session](/blog/guide-group-exams-examify), hosts can choose to enable "Anti-Cheating Monitoring." This typically activates a core set of tools. Advanced options like Geolocation Restriction might also be available depending on the host's [account tier](https://bcaexamprep.web.app/perks).
    <!-- Placeholder: Screenshot of the 'Session Integrity' section in GroupExamSetupPage -->
2.  **Participant Transparency & Consent:** Before a participant joins a session with these tools active, Examify clearly informs them about which measures are enabled. Proceeding to join the session requires their acknowledgment and consent to these specific monitoring activities for that session.
    <!-- Placeholder: Screenshot of the consent prompt shown to participants on JoinGroupExamPage -->

## Exploring the Defense Layers:

Here’s a breakdown of the current Session Integrity Tools available in Examify:

### 1. Focus Tracking (Tab/Window Switch Detection)

*   **What it does:** Detects if the browser tab or window containing the Examify exam loses focus. This typically happens if a participant navigates to another website, opens a different application, or minimizes the exam window.
*   **What's logged:**
    *   Each instance of focus loss (`focus_lost`).
    *   When focus is regained (`focus_regained`).
    *   The duration (in milliseconds) for which focus was lost.
    *   Events if the user navigates away from the exam page within the app (`navigation_away`).
*   **Why it's useful for Hosts:** Repeated or lengthy periods of lost focus might indicate a participant is looking up answers or is significantly distracted. It provides a data point for engagement.
*   **Participant Experience:** A small, draggable "Monitoring Active" (<FaEye />) indicator is usually visible on-screen during the exam. While some systems might give warnings, Examify primarily logs this for host review to minimize disruption to the exam-taker.

### 2. Clipboard Lockdown (Copy/Paste Prevention)

*   **What it does:** Actively blocks attempts to:
    *   Copy text from the exam interface (questions, options).
    *   Paste text into any input fields within the exam (though Examify's exam interface typically doesn't have pasteable fields for answers).
*   **What's logged:**
    *   Each blocked copy attempt (`copy_attempt_blocked`).
    *   Each blocked paste attempt (`paste_attempt_blocked`).
*   **Why it's useful for Hosts:** Deters participants from easily copying questions for later distribution or pasting pre-prepared answers (if such an input method were relevant).
*   **Participant Experience:** The copy/paste action will simply not work. A brief, one-time toast notification might inform the user that the action is restricted.

### 3. Restricted Key Press Logging

*   **What it does:** Monitors and logs attempts to use certain keyboard shortcuts often associated with circumventing exam integrity or capturing content.
*   **Examples of Logged Keys (and default actions if possible):**
    *   `Ctrl+P` / `Cmd+P` (Print): Attempts to open the print dialog are usually blocked, and the attempt is logged.
    *   `PrintScreen` / `Snapshot`: Attempts are logged. Reliably blocking the OS-level PrintScreen functionality is very difficult in a browser, so logging the intent is the primary action.
    *   `Ctrl+S` / `Cmd+S` (Save Page): Blocked and logged.
*   **What's logged:**
    *   The specific restricted key combination detected (`restricted_key_logged` with `keyDetail`).
*   **Why it's useful for Hosts:** Provides an indication if participants are trying to capture or print exam content.
*   **Participant Experience:** For keys like `Ctrl+P`, the default browser action is prevented, and a toast might inform them it's disabled. For `PrintScreen`, it's logged silently as blocking is unreliable.

### 4. Geolocation Restriction (Optional Advanced Feature)

*   **What it does:** If enabled by the host, this feature requires participants to be within a specific geographic area (defined by a center point and radius) to start the exam.
*   **How it works:**
    1.  The host defines the allowed zone during session setup.
    2.  Before starting the exam (after consent), the participant's browser is asked for location permission.
    3.  Examify checks if the reported location is within the defined zone.
*   **What's logged:**
    *   Successful verification (`geo_check_success`).
    *   Permission denied by user (`geo_check_failed_permission`).
    *   Location determined to be outside the zone (`geo_check_failed_outside_zone`, often with approximate distance).
*   **Why it's useful for Hosts:** Useful for assessments intended for a specific physical location (e.g., an on-site workshop, a regional test group).
*   **Participant Experience:** They are prompted by their browser for location access. If permission is denied or they are outside the zone, they cannot proceed with the exam until the issue is resolved. Clear messages guide them.

<!-- Placeholder: Conceptual image/diagram showing data flow from participant actions to host report -->

## Host Insights: The Integrity Report

When a host views the details of a group session (via the [Host Dashboard](/group-exam/dashboard)) for which monitoring was active, they can access an "Integrity Report" area (often within the `SessionMonitor` component). This report summarizes:

*   Total focus losses and cumulative time away for each participant.
*   Number of blocked copy/paste attempts per participant.
*   Count of restricted key presses per participant.
*   (If Geo-restriction was active) Status of geo-checks.

This data is presented factually, allowing hosts to make their own informed judgments. For more detailed analysis, hosts with appropriate [account tiers](https://bcaexamprep.web.app/perks) can often download a CSV report which includes these integrity flag counts alongside participant scores and timings.

## Privacy and Transparency

We believe in transparency.
*   **Clear Consent:** Participants are always informed *before* joining if monitoring tools are active for a session and must consent to proceed.
*   **Data Specificity:** Monitoring data is tied only to that specific group exam session and is primarily for the host's review.
*   **Our Goal:** These tools are not about invasive surveillance but about fostering a more focused and fair practice environment for everyone involved.

For more detailed information on how Examify handles all user data, please see our comprehensive [Privacy Policy](/privacy-policy) and the Examify-specific privacy information within it.

## Conclusion

Examify's Session Integrity Tools offer hosts a valuable way to enhance the quality and perceived fairness of their group practice sessions. By understanding how these tools work, both hosts and participants can contribute to a more effective and honest preparation experience.

Have questions about these features or how to best utilize them? [Contact Us](https://bcaexamprep.web.app/contact)!

[**➡️ Explore Hosting a Group Session**](https://examify.web.app/group-exam/setup)
