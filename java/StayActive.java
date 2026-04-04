import java.awt.Robot;
import java.awt.AWTException;
import java.awt.event.KeyEvent;
import java.time.ZonedDateTime;
import java.time.ZoneId;
import java.time.LocalTime;
import java.util.logging.Logger;
import java.util.logging.ConsoleHandler;
import java.util.logging.SimpleFormatter;

/**
 * Stay Active Script.
 *
 * <p>Simulates a Control key press every 5 minutes during work hours
 * (8:30 AM - 5:30 PM Eastern Time) to prevent the system from going idle.</p>
 *
 * <p>Usage: java StayActive</p>
 */
public class StayActive {

    private static final Logger LOGGER = Logger.getLogger(StayActive.class.getName());
    private static final ZoneId EASTERN = ZoneId.of("America/New_York");
    private static final LocalTime WORK_START = LocalTime.of(8, 30);
    private static final LocalTime WORK_END = LocalTime.of(17, 30);
    private static final int INTERVAL_MILLISECONDS = 300_000; // 5 minutes
    private static final int IDLE_CHECK_MILLISECONDS = 60_000; // 1 minute

    /**
     * Check if the current time is within work hours (8:30 AM - 5:30 PM ET).
     *
     * @return true if current Eastern time is between 8:30 AM and 5:30 PM, false otherwise
     */
    private static boolean isWithinWorkHours() {
        LocalTime now = ZonedDateTime.now(EASTERN).toLocalTime();
        return !now.isBefore(WORK_START) && !now.isAfter(WORK_END);
    }

    /**
     * Simulate a Control key press and release to keep the system active.
     *
     * @param robot the AWT Robot instance used to generate key events
     */
    private static void simulateKeypress(Robot robot) {
        robot.keyPress(KeyEvent.VK_CONTROL);
        robot.keyRelease(KeyEvent.VK_CONTROL);
        LOGGER.info("Pressed Control key");
    }

    /**
     * Run the stay-active loop during work hours.
     *
     * <p>Continuously checks if the current time falls within work hours.
     * If so, simulates a Control key press every 5 minutes.
     * Outside work hours, checks every 60 seconds until work hours resume.</p>
     *
     * @param args command line arguments (not used)
     * @throws AWTException if the Robot instance cannot be created
     */
    public static void main(String[] args) throws AWTException {
        ConsoleHandler handler = new ConsoleHandler();
        handler.setFormatter(new SimpleFormatter());
        LOGGER.addHandler(handler);
        LOGGER.setUseParentHandlers(false);

        Robot robot = new Robot();

        LOGGER.info("Stay Active started. Work hours: 8:30 AM - 5:30 PM ET");
        LOGGER.info("Press Ctrl+C to stop");

        Runtime.getRuntime().addShutdownHook(new Thread(() ->
            LOGGER.info("Stay Active stopped")
        ));

        while (true) {
            try {
                if (isWithinWorkHours()) {
                    simulateKeypress(robot);
                    Thread.sleep(INTERVAL_MILLISECONDS);
                } else {
                    ZonedDateTime now = ZonedDateTime.now(EASTERN);
                    LOGGER.info(String.format("Outside work hours (%s). Waiting...", now.toLocalTime()));
                    Thread.sleep(IDLE_CHECK_MILLISECONDS);
                }
            } catch (InterruptedException exception) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
}
