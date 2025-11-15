import cron from "node-cron";
import {tasks} from "../../app/config/task";
import {otterlogs} from "./otterlogs";

/**
 * Initializes and schedules tasks configured in the system.
 * Checks if there are any tasks available. If no tasks are defined,
 * logs a debug message indicating absence of tasks. Otherwise, iterates
 * over the task list and schedules each task by invoking the `taskSchedule`
 * function with task-specific parameters.
 *
 * @return {void} This function does not return a value.
 */
export function otterbots_initTask(): void {

    if (tasks.length === 0) {
        otterlogs.debug('No tasks found in config/task.ts');
        return;
    }

    try {
        let successCount = 0;
        let failCount = 0;
        const successNames: string[] = [];
        const failNames: string[] = [];

        tasks.forEach(task => {
            if (taskSchedule(task.name, task.time, task.task, task.period)) {
                successCount++;
                successNames.push(task.name);
            } else {
                failCount++;
                failNames.push(task.name);
            }
        });

        otterlogs.success(`${successCount} tasks initialized successfully (${successNames.join(', ')}) and ${failCount} tasks failed (${failNames.join(', ')})`)

    } catch (error) {
        otterlogs.error(`Error initializing tasks: ${error}`);
    }
}

/**
 * Schedules a task to run at a specific time or interval using a cron expression.
 *
 * @param {string} name - The name of the task, used for logging or identification.
 * @param {string} time - The time or cron expression at which the task should run.
 * @param {() => Promise<void>} task - The asynchronous function to execute as the task.
 * @param {string} [period] - Optional period to append to the time parameter for creating a complete cron expression.
 * @return {boolean} This function does not return a value.
 */
function taskSchedule(name: string, time: string, task: () => Promise<void>, period?: string): boolean {
    const expression = period ? `${time} ${period}` : time;

    if (!cron.validate(expression)) {
        otterlogs.error(`Invalid cron expression for task ${name}: ${expression}`);
        return false;
    }
    
    try {
        cron.schedule(expression, async () => {
            try {
                await task();
            } catch (error) {
                otterlogs.error(`Error executing task ${name}: ${error}`);
            }
        });
        return true;

    } catch (error) {
        otterlogs.error(`Error scheduling task ${name}: ${error}`);
        return false;
    }
}