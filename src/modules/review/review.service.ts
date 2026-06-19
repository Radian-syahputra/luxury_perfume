import prisma from "../../config/prisma";

export const createReviewService = async (
  userId: string,
  productId: string,
  rating: number,
  comment?: string
) => {
  const existProduct = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!existProduct) {
    throw new Error("Product Tidak Ditemukan");
  }

  const hasBought = await prisma.orderItem.findFirst({
    where: {
      order: {
        userId,
      },
      productVariant: {
        productId,
      },
    },
  });

  if (!hasBought) {
    throw new Error("Anda Harus Membeli Product Ini Terlebih Dahulu");
  }

  const existReview = await prisma.review.findFirst({
    where: {
      userId,
      productId,
    },
  });

  if (existReview) {
    throw new Error("Anda Sudah Pernah Mereview Product Ini");
  }

  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment,
    },
  });

  return review;
};

export const getReviewByProductService = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

export const deleteReviewService = async (
  reviewId: string,
  userId: string,
  role: string
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review Tidak Di Temukan");
  }

  if (review.userId !== userId && role !== "ADMIN") {
    throw new Error("Akses Ditolak");
  }

   return await prisma.review.delete({
      where: { id: reviewId },
    });
};
