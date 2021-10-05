import { hash, compare } from "bcrypt";
export default class Password {
  static async hashPassword(plainPassword: string) {
    return await hash(plainPassword, 12);
  }

  static async compare(plainPassword: string, hashedPassword: string) {
    return await compare(plainPassword, hashedPassword);
  }
}
