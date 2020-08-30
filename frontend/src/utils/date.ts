import moment from "moment";

export function getDateFromNow (date: string) {
    return moment(date).fromNow()
}