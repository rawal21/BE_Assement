import { Router } from "express";
import { EventController } from "./event.controller";
import { auth } from "../../common/middleware/auth.middleware";
import { upload } from "../../common/helper/multerConfig.helper";

const router = Router();

router.get("/", EventController.getAll);
router.get("/:id", EventController.getOne);


router.post("/", upload.single('image') ,auth , EventController.create);
router.patch("/:id" , upload.single("image") , auth , EventController.addImage);
router.put("/:id",auth , EventController.update);
router.post("/:eventId/reserve" , auth ,  EventController.reserveSeats)

export default router;
