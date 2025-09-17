import { BaseRepository } from 'src/common/interface';
import { Token, User, UserCreateInput } from './users.schema';

export interface UserRepositoryInterface
  extends BaseRepository<User, UserCreateInput, UserCreateInput> {
  findUserById(id: string): Promise<User | null>;
  findUserByPhone(phone: string): Promise<User | null>;
  findUserByGoogleId(googleId: string): Promise<User | null>;
  updateUser(id: string, data: Partial<UserCreateInput>): Promise<User>;
  deleteUser(id: string): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;

  createToken(userId: string): Promise<Token>;
  deleteToken(token: string): Promise<Token>;
  findToken(token: string): Promise<Token | null>;
}
