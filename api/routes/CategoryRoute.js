// api/routes/CategoryRoute.js
import express from 'express';
import { addCategory, deleteCategory, getAllCategory, showCategory, updateCategory } from '../controllers/Category.controller.js';
import { Onlyadmin } from '../middleware/Onlyadmin.js';


const CategoryRoute = express.Router();

CategoryRoute.post('/add',Onlyadmin, addCategory);
CategoryRoute.put('/update/:categoryid', Onlyadmin, updateCategory);
CategoryRoute.get('/show/:categoryid', Onlyadmin, showCategory);
CategoryRoute.delete('/delete/:categoryid', Onlyadmin, deleteCategory);
CategoryRoute.get('/all-category',  getAllCategory);

export default CategoryRoute;