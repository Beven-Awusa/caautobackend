import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User } from '../users/users.schema';
@Injectable()
export class AuthService {
  constructor(private database: DatabaseService) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    // TODO: Implement user validation logic

    // This is a placeholder implementation
    const user = await this.database.user.findUnique({
      where: { email: username },
    });

    if (user && user.passwordHash === password) {
      return user;
    }
    return null;
  }
}
