/**
 * Gets all titles from the given tasks list.
 * @param tasksList  The div where all current/done tasks are placed.
 */
export function getTitlesInner(tasksList: Element): string[] {
    const titles = tasksList.querySelectorAll('h5')
    return Array.from(titles).map(title => title.innerHTML)
}