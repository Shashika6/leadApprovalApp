/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())


app.put('/lead/:id', async (req, res) => {
  const { id } = req.params
  const {data} = req.body;
  
  try {
    const post = await prisma.leads.update({
      where: { id },
      data
    })

    res.json(post)
  } catch (error) {
    res.json({ error: `Error occured while updating lead` })
  }
})

const server = app.listen(4000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)