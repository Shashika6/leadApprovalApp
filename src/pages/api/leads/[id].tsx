import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

const updateLease = async (leadId: string, data: any): Promise<any> => {
  try {
    if (data) {
      const lead = await prisma.leads.update({
        where: { id: leadId },
        data,
      });
      return lead;
    }
  } catch (error) {
      console.log(error);
    return { error: `Error occured while updating lead` };
  }
};

export default async function handler(req: Request, res: Response) {
  const leadId = req.query.id as string;
  switch (req.method) {
    case "POST":
      const lead = await updateLease(leadId, req.body);
      return res.json(lead);
  }
}
