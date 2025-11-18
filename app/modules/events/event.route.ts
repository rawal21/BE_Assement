import { Router } from "express";
import { EventController } from "./event.controller";
import { auth } from "../../common/middleware/auth.middleware";
import { upload } from "../../common/helper/multerConfig.helper";

const router = Router();

router.get("/", EventController.getAll);
router.get("/:id", EventController.getOne);


router.post("/", upload.single('image') ,auth , EventController.create);
router.put("/:id",auth , EventController.update);
router.post("/:eventId/seats", auth , EventController.addSeats)
router.post("/:eventId/reserve" , auth ,  EventController.reserveSeats)

export default router;
