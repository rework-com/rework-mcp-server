import { BaseReworkService } from "./base.js";
import { CreateTaskData, ReworkProjectTask } from "./types.js";
import { ReworkServiceError, ErrorCode } from "./base.js";

export class TaskService extends BaseReworkService {


	/**
	 * Create a new task
	 * @param name The name of the task
	 * @param description The description of the task
	 * @param boardID The ID of the board to create the task in
	 */
	async createTask(name: string, taskData: CreateTaskData){
		try {
			return await this.makeRequest(async () => {
			  const response = await this.client.post<ReworkProjectTask | string>(
				`/projects/v1/task/create`,
				taskData
			  );
			  
			  // Handle both JSON and text responses
			  const data = response.data;
			  return data;
			});
		  } catch (error) {
			throw this.handleError(error, 'Failed to create task');
		  }
	}




	/**
 * Helper method to handle errors consistently
 * @param error The error that occurred
 * @param message Optional custom error message
 * @returns A ReworkServiceError
 */
	protected handleError(error: any, message?: string): ReworkServiceError {
	if (error instanceof ReworkServiceError) {
		return error;
	}
	
	return new ReworkServiceError(
		message || `Task service error: ${error.message}`,
		ErrorCode.UNKNOWN,
		error
	);
	}

}