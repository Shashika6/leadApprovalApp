/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

const fetchLeads = async():Promise<any> =>{
  try {
    const leads = await prisma.leads.findMany()
  return leads;
  } catch (error) {
   return { error: `Error occured while fetching leads` }
  }
}

export default async function handler(req: Request,res: Response) {
  switch(req.method){
    case "GET": 
    const leads = await fetchLeads();
    return res.json(leads);
  }
}
