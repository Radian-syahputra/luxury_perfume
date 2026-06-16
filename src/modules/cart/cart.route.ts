import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import {
  getCart,
  addToCart,
  clearCart,
  updateCartItem,
  removeCartItem,
} from "./cart.controller";

const router = Router();

router.use(authenticate);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:cartItemId", updateCartItem);
router.delete("/:cartItemId", removeCartItem);
router.delete("/", clearCart);

export default router;
