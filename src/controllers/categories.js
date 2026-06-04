// Import any needed model functions
// UPDATED - added getCategoriesByProjectId and updateCategoryAssignments to imports
import { getAllCategories, getCategoryById, getProjectsByCategoryId, getCategoriesByProjectId, updateCategoryAssignments } from '../models/categories.js';

// NEW - needed to get project details for the assign categories form
import { getProjectDetails } from '../models/projects.js';
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

// NEW - serves the assign categories form with all categories and currently assigned ones
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const project = await getProjectDetails(projectId);
    const allCategories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);
    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, project, allCategories, assignedCategories });
};

// NEW - processes the assign categories form and updates the junction table
const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    // categoryIds comes as an array of selected checkbox values, default to empty array if none checked
    const categoryIds = req.body.categoryIds || [];
    await updateCategoryAssignments(projectId, categoryIds);
    req.flash('success', 'Categories updated successfully!');
    res.redirect(`/project/${projectId}`);
};

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm };