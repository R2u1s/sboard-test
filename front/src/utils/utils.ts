import axios from "axios";
import { IpResponse } from "../types/types";

export const getUserIp = async (): Promise<string> => {
  try {
    const response = await axios.get<IpResponse>('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Ошибка при получении IP:', error);
    throw error;
  }
};