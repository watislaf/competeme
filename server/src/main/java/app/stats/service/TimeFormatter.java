package app.stats.service;

import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.Period;

@Component
public class TimeFormatter {

    public String formatDayOfWeek(DayOfWeek day) {
        return capitalizeFirstLetter(day.toString().toLowerCase());
    }

    public String formatPeriod(Period period) {
        return formatDays(period.getDays());
    }

    public String formatDuration(Duration duration) {
        long hours = duration.toHours();
        long minutes = duration.toMinutesPart();
        return formatDurationString(hours, minutes);
    }

    private String capitalizeFirstLetter(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        return text.substring(0, 1).toUpperCase() + text.substring(1);
    }

    private String formatDays(int days) {
        return days + (days == 1 ? " day" : " days");
    }

    private String formatDurationString(long hours, long minutes) {
        if (hours > 0) {
            return minutes > 0 ? hours + "h " + minutes + "min" : hours + "h";
        }
        return minutes + "min";
    }
}