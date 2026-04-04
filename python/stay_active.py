"""Stay Active Script.

Simulates a Control key press every 5 minutes during work hours
(8:30 AM - 5:30 PM Eastern Time) to prevent the system from going idle.

Requires running with sudo on macOS (keyboard module needs root access).

Usage:
    sudo python stay_active.py
"""

import logging
import time
from datetime import datetime

import keyboard
from zoneinfo import ZoneInfo

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

EASTERN = ZoneInfo("America/New_York")
WORK_START_HOUR = 8
WORK_START_MINUTE = 30
WORK_END_HOUR = 17
WORK_END_MINUTE = 30
INTERVAL_SECONDS = 300  # 5 minutes


def is_within_work_hours() -> bool:
    """Check if the current time is within work hours (8:30 AM - 5:30 PM ET).

    Returns:
        True if current Eastern time is between 8:30 AM and 5:30 PM, False otherwise.
    """
    now = datetime.now(tz=EASTERN)
    work_start = now.replace(
        hour=WORK_START_HOUR, minute=WORK_START_MINUTE, second=0, microsecond=0
    )
    work_end = now.replace(
        hour=WORK_END_HOUR, minute=WORK_END_MINUTE, second=0, microsecond=0
    )
    return work_start <= now <= work_end


def simulate_keypress() -> None:
    """Simulate a Control key press and release to keep the system active."""
    keyboard.press_and_release("ctrl")
    logger.info("Pressed Control key")


def main() -> None:
    """Run the stay-active loop during work hours.

    Continuously checks if the current time falls within work hours.
    If so, simulates a Control key press every 5 minutes.
    Outside work hours, checks every 60 seconds until work hours resume.
    """
    logger.info(
        "Stay Active started. Work hours: %d:%02d AM - %d:%02d PM ET",
        WORK_START_HOUR,
        WORK_START_MINUTE,
        WORK_END_HOUR - 12,
        WORK_END_MINUTE,
    )
    logger.info("Press Ctrl+C to stop")

    try:
        while True:
            if is_within_work_hours():
                simulate_keypress()
                time.sleep(INTERVAL_SECONDS)
            else:
                now = datetime.now(tz=EASTERN)
                logger.info(
                    "Outside work hours (%s). Waiting...",
                    now.strftime("%I:%M %p %Z"),
                )
                time.sleep(60)
    except KeyboardInterrupt:
        logger.info("Stay Active stopped")


if __name__ == "__main__":
    main()
