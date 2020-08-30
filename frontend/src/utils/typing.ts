export type Color = "blue" | "green" | "yellow" | "red"

export interface Item {
    id: number,
    name: string,
    description: string,
    created_at: string,
    last_modified: string,
    is_finished: boolean,
    color: Color
}