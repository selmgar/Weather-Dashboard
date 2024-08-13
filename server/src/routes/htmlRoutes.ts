import path from 'node:path';
import { Router } from 'express';

const router = Router();


// Define the route to serve index.html
router.get('/', (_, res) => {
  const filePath = path.resolve(process.cwd(), '..', 'client', 'dist', 'index.html');
  res.sendFile(filePath);
});

export default router;
