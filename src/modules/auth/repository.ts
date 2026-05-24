import { prisma } from "../../database/prisma";
import { Prisma, User, Role, UserStatus } from "../../generated/prisma";
import { AppError } from "../../core/error-handler";
import { HTTP_STATUS } from "../../core/http-status";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch {
      throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }
  }

  async softDelete(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.DELETED,
      },
    });
  }

  async findMany(params: {
    page?: number;
    size?: number;
    role?: Role;
    status?: UserStatus;
    state?: string;
  }): Promise<User[]> {
    const { page = 1, size = 20, role, status, state } = params;

    return prisma.user.findMany({
      skip: (page - 1) * size,
      take: size,
      where: {
        ...(role && { role }),
        ...(status && { status }),
        ...(state && { region: state }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async count(params: {
    role?: Role;
    status?: UserStatus;
    state?: string;
  }): Promise<number> {
    const { role, status, state } = params;

    return prisma.user.count({
      where: {
        ...(role && { role }),
        ...(status && { status }),
        ...(state && { region: state }),
      },
    });
  }
}

export const userRepository = new UserRepository();
