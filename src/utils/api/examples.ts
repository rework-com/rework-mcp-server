/**
 * Examples of using the ReworkFetcher utility
 * 
 * This file demonstrates various ways to use the ReworkFetcher utility
 * for making API calls to the Rework API.
 */

import { reworkFetcher } from './fetcher.js';

/**
 * Example: List tasks from a board
 */
async function listTasksExample() {
  try {
    // Basic usage - just provide the board ID
    const tasks = await reworkFetcher.listTasks('11');
    console.log('Tasks:', tasks);
    
    // With additional filters
    const filteredTasks = await reworkFetcher.listTasks('11', {
      deadline_from: '1733477555'
    });
    console.log('Filtered tasks:', filteredTasks);
  } catch (error) {
    console.error('Error listing tasks:', error);
  }
}

/**
 * Example: Create a new task
 */
async function createTaskExample() {
  try {
    const newTask = await reworkFetcher.createTask({
      name: '🚀 New task created via API',
      board_id: '11',
      content: '<p>This is a task description with <strong>HTML formatting</strong></p>',
      deadline: '1735477555'
    });
    console.log('Created task:', newTask);
  } catch (error) {
    console.error('Error creating task:', error);
  }
}

/**
 * Example: Update an existing task
 */
async function updateTaskExample(taskId: string) {
  try {
    const updatedTask = await reworkFetcher.updateTask(taskId, {
      name: '✅ Updated task name',
      content: '<p>Updated task description</p>'
    });
    console.log('Updated task:', updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

/**
 * Example: Get task details
 */
async function getTaskExample(taskId: string) {
  try {
    const task = await reworkFetcher.getTask(taskId);
    console.log('Task details:', task);
  } catch (error) {
    console.error('Error getting task:', error);
  }
}

/**
 * Example: Using the generic call method for any API endpoint
 */
async function genericApiCallExample() {
  try {
    // List boards
    const boards = await reworkFetcher.call('/projects/v1/board/list', {
      // Any additional parameters can be added here
    });
    console.log('Boards:', boards);
    
    // Any other API endpoint can be called this way
    const customEndpoint = await reworkFetcher.call('/projects/v1/custom/endpoint', {
      param1: 'value1',
      param2: 'value2'
    });
    console.log('Custom endpoint result:', customEndpoint);
  } catch (error) {
    console.error('Error in generic API call:', error);
  }
}

// Export examples for potential use
export {
  listTasksExample,
  createTaskExample,
  updateTaskExample,
  getTaskExample,
  genericApiCallExample
};

// Run examples if this file is executed directly
if (require.main === module) {
  // Uncomment the examples you want to run
  // listTasksExample();
  // createTaskExample();
  // updateTaskExample('task-id-here');
  // getTaskExample('task-id-here');
  // genericApiCallExample();
  
  console.log('Examples file loaded. Uncomment the examples you want to run.');
}
