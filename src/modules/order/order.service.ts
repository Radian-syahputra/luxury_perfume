import prisma from "../../config/prisma";
import { OrderStatus } from "../../generated/prisma/enums";

export const createOrderService = async (
  userId: string,
  shippingAddress: string
) => {
  const cartUser = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        include: {
          productVariant: true,
        },
      },
    },
  });

  if (!cartUser) {
    throw new Error("Cart Tidak Di Temukan");
  }

  if (cartUser.cartItems.length === 0) {
    throw new Error("Cart Masih Kosong");
  }

  let totalPrice = cartUser.cartItems.reduce((total, item) => {
    return total + item.quantity * item.productVariant.price;
  }, 0);

  const newOrder = await prisma.order.create({
    data: {
      userId,
      totalPrice,
      shippingAddress,
    },
  });

  await prisma.orderItem.createMany({
    data: cartUser.cartItems.map((item) => ({
      orderId: newOrder.id,
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.productVariant.price,
    })),
  });

  for (const item of cartUser.cartItems) {
    await prisma.productVariant.update({
      where: { id: item.variantId },
      data: {
        stock: item.productVariant.stock - item.quantity,
      },
    });
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cartUser.id },
  });

  await prisma.notification.create({
    data: {
      userId,
      orderId: newOrder.id,
      message: `Pesanan #${newOrder.id} berhasil dibuat, menunggu konfirmasi.`,
      status: "UNREAD",
    },
  });

  return newOrder;
};

export const getMyOrderService = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId: userId },
    include: {
      orderItems: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};

export const getAllOrdersService = async () => {
  const allOrders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return allOrders;
};

export const getOrderByIdService = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order Tidak Ditemukan");
  }

  return order;
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const orderStatus = await prisma.order.update({
    where: { id },
    data: {
      status,
    },
  });

  await prisma.notification.create({
    data: {
      userId: orderStatus.userId,
      orderId: orderStatus.id,
      message: `Pesanan #${orderStatus.id} berubah menjadi ${status}`,
      status: "UNREAD",
    },
  });

  return orderStatus;
};
