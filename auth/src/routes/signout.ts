import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = undefined;

  res.status(200).send({ message: "Sucessfully signed out!" });
});

export { router as signOutRouter };
