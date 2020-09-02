import moment from "moment";


/**
 * Get the human-friendly message informing how much time has passed since the given date.
 * @param date  The date and time (preferably in ISO format).
 */
export function getDateFromNow (date: string): string {
    return moment(date).fromNow()
}

/**
 * Get the current date and time in ISO format.
 */
export function getCurrentDate(): string {
    return new Date().toISOString()
}