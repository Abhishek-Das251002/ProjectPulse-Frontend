export function CalcDueDate(dueTime, taskCreationDate){
    let currDate = new Date(taskCreationDate)
    return new Date(currDate.setDate(currDate.getDate() + Number(dueTime))).toDateString()
}

export default CalcDueDate;