import { Request, Response } from "express";
import cloudinary from "../../config/cloudinary";
import { successResponse, errorResponse } from "../../utils/response";
import {
  Category,
  Concentration,
  BottleSize,
} from "../../generated/prisma/enums";
import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  deleteProductService,
  updateProductService,
  createVariantService,
  getVariantByProductIdService,
  updateVariantService,
  deleteVariantService,
} from "./product.service";



const uploadToCloudinary = (buffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "parfum" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, brand, description, category } = req.body;

    if (!name || !brand || !description || !category) {
      return errorResponse(res, 400, "Semua Fields Harus Di isi");
    }

    let imageUrl = "";
    let imagePublicId = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const newProduct = await createProductService(
      name,
      brand,
      description,
      category,
      imageUrl,
      imagePublicId
    );

    return successResponse(
      res,
      201,
      "Berhasil Menambahkan Product",
      newProduct
    );
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { search, category } = req.query;

    const products = await getAllProductsService(
      search as string,
      category as Category
    );

    return successResponse(
      res,
      200,
      "Berhasil mengambil Semua Product",
      products
    );
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id as string);
    return successResponse(res, 200, "Berhasil Mengambil Product", product);
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, brand, description, category } = req.body;

    let imageUrl: string | undefined = undefined;
    let imagePublicId: string | undefined = undefined;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const product = await updateProductService(id as string, {
      name,
      brand,
      description,
      category,
      imageUrl,
      imagePublicId,
    });

    return successResponse(res, 200, "Berhasil Mengupdate Product", product);
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deleteProductService(id as string);

    return successResponse(res, 200, "Berhasil Mengapus Product");
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const createVariant = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { concentration, bottleSize, price, stock } = req.body;

    if (!concentration || !bottleSize || !price || !stock) {
      return errorResponse(res, 400, "Semua Fields Harus Disi");
    }

    const newVariant = await createVariantService(
      productId as string,
      concentration as Concentration,
      bottleSize as BottleSize,
      price,
      stock
    );

    return successResponse(
      res,
      201,
      "Berhasil Membuat Variant Product",
      newVariant
    );
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const getVariantByProductId = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const productVariant = await getVariantByProductIdService(
      productId as string
    );

    return successResponse(
      res,
      200,
      "Berhasil Mengambil Variant",
      productVariant
    );
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const updateVariant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { concentration, bottleSize, price, stock } = req.body;

    const updated = await updateVariantService(id as string, {
      concentration,
      bottleSize,
      price,
      stock,
    });

    return successResponse(res, 200, "Berhasil Mengupdate Variant", updated);
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const deleteVariant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteVariantService(id as string);

    return successResponse(res, 200, "Berhasil Menghapus Variant");
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};
