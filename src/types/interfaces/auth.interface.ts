import { Request } from 'express'
import { User } from '@/types/interfaces/user.interface'

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
}

export interface RequestWithUser extends Request {
  user: User;
}
