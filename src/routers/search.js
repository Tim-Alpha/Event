import express from 'express';
import * as SearchController from '../controllers/search.js';

const router = express.Router();

router.get('/search', SearchController.SearchEvent);

export default router;
