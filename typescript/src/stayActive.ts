/**
 * Stay Active Script.
 *
 * Simulates a Control key press every 5 minutes during work hours
 * (8:30 AM - 5:30 PM Eastern Time) to prevent the system from going idle.
 *
 * Usage: npm start
 */

import robot = require("robotjs");

const EASTERN_TIMEZONE = "America/New_York";
const WORK_START_HOUR = 8;
const WORK_START_MINUTE = 30;
const WORK_END_HOUR = 17;
const WORK_END_MINUTE = 30;
const INTERVAL_MILLISECONDS = 300_000; // 5 minutes
const IDLE_CHECK_MILLISECONDS = 60_000; // 1 minute

/**
 * Get the current time formatted in Eastern timezone.
 *
 * @returns The current time string in HH:MM AM/PM format.
 */
function getCurrentEasternTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: EASTERN_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get the current hour and minute in Eastern timezone.
 *
 * @returns An object containing the current hour (0-23) and minute (0-59).
 */
function getEasternHourMinute(): { hour: number; minute: number } {
  const now = new Date();
  const eastern = new Date(
    now.toLocaleString("en-US", { timeZone: EASTERN_TIMEZONE })
  );
  return { hour: eastern.getHours(), minute: eastern.getMinutes() };
}

/**
 * Check if the current time is within work hours (8:30 AM - 5:30 PM ET).
 *
 * @returns True if current Eastern time is between 8:30 AM and 5:30 PM.
 */
function isWithinWorkHours(): boolean {
  const { hour, minute } = getEasternHourMinute();
  const currentMinutes = hour * 60 + minute;
  const startMinutes = WORK_START_HOUR * 60 + WORK_START_MINUTE;
  const endMinutes = WORK_END_HOUR * 60 + WORK_END_MINUTE;
  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

/**
 * Simulate a Control key press and release to keep the system active.
 */
function simulateKeypress(): void {
  robot.keyTap("control");
  console.log(`[${new Date().toISOString()}] INFO - Pressed Control key`);
}

/**
 * Sleep for the specified number of milliseconds.
 *
 * @param milliseconds - The duration to sleep in milliseconds.
 * @returns A promise that resolves after the specified duration.
 */
function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Run the stay-active loop during work hours.
 *
 * Continuously checks if the current time falls within work hours.
 * If so, simulates a Control key press every 5 minutes.
 * Outside work hours, checks every 60 seconds until work hours resume.
 */
async function main(): Promise<void> {
  console.log(
    `[${new Date().toISOString()}] INFO - Stay Active started. Work hours: 8:30 AM - 5:30 PM ET`
  );
  console.log(
    `[${new Date().toISOString()}] INFO - Press Ctrl+C to stop`
  );

  process.on("SIGINT", () => {
    console.log(`\n[${new Date().toISOString()}] INFO - Stay Active stopped`);
    process.exit(0);
  });

  while (true) {
    if (isWithinWorkHours()) {
      simulateKeypress();
      await sleep(INTERVAL_MILLISECONDS);
    } else {
      console.log(
        `[${new Date().toISOString()}] INFO - Outside work hours (${getCurrentEasternTime()}). Waiting...`
      );
      await sleep(IDLE_CHECK_MILLISECONDS);
    }
  }
}

main();
