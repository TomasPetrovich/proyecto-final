const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller.js");
const authMiddleware = require("../middleware/authmiddleware.js");
const cartController = new CartController();

router.use(authMiddleware);

router.post("/", cartController.newCart);
router.get("/:cid", cartController.getProductsFromCart);
router.post("/:cid/product/:pid", cartController.addProduct);
router.delete('/:cid/product/:pid', cartController.deleteProduct);
router.put('/:cid', cartController.updateProductsInCart);
router.put('/:cid/product/:pid', cartController.updateQuantity);
router.delete('/:cid', cartController.emptyCart);
router.post('/:cid/purchase', cartController.finalizePurchase);


module.exports = router;