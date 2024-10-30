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

//выдает массив из ключей, значения которых различаются в переданных объектах
export function getDifferentKeys<T extends Record<string, any>>(obj1: T, obj2: T): string[] {
  const differentKeys: string[] = [];

  for (const key in obj1) {
      if (obj1.hasOwnProperty(key) && (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key])) {
          differentKeys.push(key);
      }
  }

  for (const key in obj2) {
      if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
          differentKeys.push(key);
      }
  }

  return differentKeys;
}