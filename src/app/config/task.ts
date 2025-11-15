// Examples of cron expressions:
//
// ┌──────────────────────────────────────────────────┐
// │  minute  hour  day-of-month  month  day-of-week  │
// └──────────────────────────────────────────────────┘
//
// Examples:
//  - Every day at midnight:
//      time = "0 0 * * *"
//      period = ""
//      expression = "0 0 * * *"
//
//  - Every Monday at 8 AM:
//      time = "0 8 * *"
//      period = "1"
//      expression = "0 8 * * 1"
//
//  - Every weekday at 9 AM (Monday to Friday):
//      time = "0 9 * *"
//      period = "MON-FRI"
//      expression = "0 9 * * MON-FRI"
//
//  - Every minute:
//      time = "* * * * *"
//      period = ""
//      expression = "* * * * *"


/**
 * Represents a list of scheduled tasks with their respective configurations.
 * Each task contains the following details:
 * - `name`: A string that specifies the name or description of the task.
 * - `time`: A cron-style string that defines when the task is scheduled to run.
 * - `task`: An asynchronous function to be executed at the specified time.
 */
export const tasks = [
    {name: "hello world", time: "43 13 * * *", task: async () => test(), period: ""}
];


// Function to be executed at the scheduled time you can change it
function test() {}



