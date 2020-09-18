/**
 * The constants the app most commonly uses.
 */

/** Mapping from hex colors to their human-friendly equivalents. */
export const COLORS_MAPPING =
    new Map().set("#0000ff", "blue")
             .set("#008000", "green")
             .set("#ffff00", "yellow")
             .set("#ff0000", "red")

/** Number of milliseconds for how long the unmounting animation lasts. */
export const ANIMATION_UNMOUNT_DURATION = 500