import express from "express";
//import userController from "../controllers/userController.js";
import {
  login,
  protect,
  signup,
  logout,
  updatePassword,
  restriction,
  updateUser,
  deleteUser,
} from "../controllers/authController.js";
import {
  myProfile,
  updateUserProfile,
  getUsers,
  getUserById,
} from "../controllers/userController.js";
const router = express.Router();

/**
 * @description signup as user
 * @route POST/api/signup
 * @access Public
 */
router.post("/signup", signup());
/**
 * @description login user
 * @route POST/api/users/login
 * @access Public
 */

/**
 * @description logout user
 * @route GET/api/users/logout
 * @access Public
 */

router.post("/login", login()).post("/logout", logout);

router.use(protect);
router
  .route("/profile")
  .get(myProfile())
  .put(updateUserProfile())
  .patch(updatePassword());
/*router
  .get("/profile", myProfile())
  .put("/profile", updateUserProfile())
  .patch("/profile", updatePassword());
*/
router.use(restriction);
router.route("/:id").get(getUserById()).put(updateUser()).delete(deleteUser());

router.get("/", getUsers);

export default router;
