import { Request, Response } from "express";
import { adminUserRepository } from "../../repositories/repositories.js";

export const getSelfDetails = async (req: Request, res: Response) => {
  try {
    const user = await adminUserRepository.findOneBy({
      id: req?.body?.user?.userId,
    });
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error?.message || "Error fetching user details.",
    });
  }
};
