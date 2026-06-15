import prisma from "../../config/prisma";
import {
  BottleSize,
  Category,
  Concentration,
} from "../../generated/prisma/enums";
import cloudinary from "../../config/cloudinary";

export const createProductService = async (
  name: string,
  brand: string,
  description: string,
  category: Category,
  imageUrl: string,
  imagePublicId: string
) => {
  const product = await prisma.product.create({
    data: {
      name,
      brand,
      description,
      category,
      imageUrl,
      imagePublicId,
    },
  });

  return product;
};

export const getAllProductsService = async (
  search?: string,
  category?: Category
) => {
  const products = await prisma.product.findMany({
    where: {
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
      ...(category && { category }),
    },
    include: {
      variants: true,
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products;
};

export const getProductByIdService = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    throw new Error("Product Tidak Di Temukan");
  }

  return product;
};

export const updateProductService = async (
  id: string,
  data: {
    name?: string;
    brand?: string;
    description?: string;
    category?: Category;
    imageUrl?: string;
    imagePublicId?: string;
  }
) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new Error("Product Tidak Di Temukan");
  }

  if (data.imagePublicId && existingProduct.imagePublicId) {
    await cloudinary.uploader.destroy(existingProduct.imagePublicId);
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...data,
    },
  });

  return updatedProduct;
};

export const deleteProductService = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) {
    throw new Error("Product Tidak Ditemukan");
  }

  if (product.imagePublicId) {
    await cloudinary.uploader.destroy(product.imagePublicId);
  }

  await prisma.product.delete({
    where: { id },
  });

  return {
    message: "Berhasil Menghapus Product",
  };
};

export const createVariantService = async (
  productId: string,
  concentration: Concentration,
  bottleSize: BottleSize,
  price: number,
  stock: number
) => {
  // Check Product
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) {
    throw new Error("Product Tidak DItemukan");
  }

  // Product Variant
  const variant = await prisma.productVariant.create({
    data: {
      productId,
      concentration,
      bottleSize,
      price,
      stock,
    },
  });

  return variant;
};

export const getVariantByProductIdService = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) {
    throw new Error("Product Tidak Di Temukan");
  }

  const variants = await prisma.productVariant.findMany({
    where: { productId },
  });

  return variants;
};

export const updateVariantService = async (
  id: string,
  data: {
    concentration?: Concentration;
    bottleSize?: BottleSize;
    price?: number;
    stock?: number;
  }
) => {
  const variant = await prisma.productVariant.findUnique({
    where : {id}
  })
  if(!variant){
    throw new Error("Variant Tidak Di Temukan")
  }

  const updateProductVariant = await prisma.productVariant.update({
    where : {id},
    data : {
      ...data
    }
  })

  return updateProductVariant

};


export const deleteVariantService = async (id : string) => {
  const variant = await prisma.productVariant.findUnique({
    where : {id}
  })

  if(!variant) {
    throw new Error("Variant Tidak Di Temukan")
  }

  await prisma.productVariant.delete({
    where :{id}
  })

  return {message : "Success Delete"}
}