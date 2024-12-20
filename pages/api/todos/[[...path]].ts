import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const
    { query, method } = req,
    id: number | undefined = Number(query?.path?.[0]);
   
  console.log('Был вызван метод:', method, { id }, req.body);
  try {
    switch (req.method) {
      case 'GET':
        res.setHeader('content-type', 'application/json; charset=utf-8');
        const ToDos = await prisma.todo.findMany({ orderBy: [{ id: 'asc' }] });
        return res.json(ToDos);
      case 'POST':
        const
          text:string = req.body.text;
        await prisma.todo.create({ data: { text } });
        return res.status(201).json({});
      case 'PUT':
        const updatedToDo = req.body.text;
        await prisma.todo.update({ where: { id }, data: { text: updatedToDo  } });
        return res.json({});
      case 'DELETE':
        await prisma.todo.delete({ where: { id } });
        return res.status(200).json({});
      case 'PATCH':
        const checked = req.body.checked;
        await prisma.todo.update({ where: { id }, data: { checked: checked } });
        return res.json({});
    }
  } catch(error: unknown) {
    if (error instanceof Error)
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
