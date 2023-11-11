import { Response } from 'express';

class ApiResponse {
  status: number;
  data?: any;
  message: string;

  constructor(status: number, data: any, message: string) {
    this.status = status;
    this.data = data;
    this.message = message;
  }

  send(res: Response) {
    res.status(this.status).json({ status: this.status, data: this.data, message: this.message });
  }
}

export default ApiResponse;
