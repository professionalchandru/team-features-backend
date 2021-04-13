import { DateTime } from 'luxon'

export function getTimestamp() {
    // Generate current time stamp in unix time stamp format
    return Math.floor(DateTime.local().toSeconds());
}