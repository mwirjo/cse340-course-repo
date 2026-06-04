// Import any needed model functions
import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

// Shows the list of all categories
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

// Shows the details of a single category and all its service projects
const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    const title = category ? category.name : 'Category Details';

    res.render('category', { title, category, projects });
};

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };