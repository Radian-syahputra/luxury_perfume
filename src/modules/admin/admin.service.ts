import prisma from "../../config/prisma";
import { Role } from "../../generated/prisma/enums";

export const getDashboardStatsService = async () => {
  const [totalUser, totalProducts, totalOrders, orders] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({
      select: {
        totalPrice: true,
        status: true,
      },
    }),
  ]);

  const totalRevenue = orders
    .filter((order) => order.status === "DELIVERED")
    .reduce((acc, order) => acc + order.totalPrice, 0);

  const orderByStatus = {
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    PROCESSING: orders.filter((o) => o.status === "PROCESSING").length,
    SHIPPED: orders.filter((o) => o.status === "SHIPPED").length,
    DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
  };

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return {
    totalUser,
    totalOrders,
    totalProducts,
    totalRevenue,
    orderByStatus,
    recentOrders,
  };
};

export const getAllUsersService = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

export const updateUserRoleService = async (userId: string, role: Role) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User Tidak Di Temukan");
  }

  if (user.role === "ADMIN") {
    throw new Error("Role User Sudah ADMIN Tidak Bisa Di Ubah");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updated;
};

export const deleteUserService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User Tidak Di Temukan");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return {
    message: "Berhasil Menghapus User",
  };
};
