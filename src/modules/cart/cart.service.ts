import prisma from "../../config/prisma";

export const getCartService = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
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

  if (!cart) {
    return { cartItems: [] };
  }

  return cart;
};

export const addToCartService = async (
  userId: string,
  variantId: string,
  quantity: number
) => {
  // Check variant
  const existVariant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  });

  if (!existVariant) {
    throw new Error("Product Variant Tidak Ditemukan");
  }

  let cartUser = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cartUser) {
    cartUser = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  // check cart item
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cartUser.id, // atau cart yang baru dibuat
      variantId,
    },
  });

  if (existingItem) {
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
    return updatedItem;
  } else {
    // tambah item baru ke cart
    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cartUser.id,
        variantId,
        quantity,
      },
    });

    return newItem;
  }
};

export const updateCartItemService = async (
  userId: string,
  cartItemId: string,
  quantity: number
) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!cartItem) {
    throw new Error("Cart Item Tidak Ditemukan");
  }

  //  CartItem → Cart → userId
  const cart = await prisma.cart.findUnique({
    where: { id: cartItem.cartId },
  });

  if (cart?.userId !== userId) {
    throw new Error("Anda Tidak Memiliki Akses ke Cart Item Ini");
  }

  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return { message: "Cart Item Dihapus" };
  }

  const updatedItem = await prisma.cartItem.update({
    where: { id: cartItem.id },
    data: {
      quantity,
    },
  });

  return updatedItem;
};

export const removeCartItemService = async (
  userId: string,
  cartItemId: string
) => {
  const existCartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!existCartItem) {
    throw new Error("Cart Item Tidak Ditemukan");
  }

  const cart = await prisma.cart.findUnique({
    where: { id: existCartItem.cartId },
  });

  if (cart?.userId !== userId) {
    throw new Error("Anda Tidak Memiliki Akses ke Cart Item Ini");
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  return { message: "Success Delete Item" };
};

export const clearCartService = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new Error("Cart Tidak Di Temukan");
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return { message: "Berhasil Menghapus Semua Cart" };
};
