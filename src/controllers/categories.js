// Import any needed model functions
// UPDATED - added getCategoriesByProjectId and updateCategoryAssignments to imports
// UPDATED - added createCategory and updateCategory to imports
import { getAllCategories, getCategoryById, getProjectsByCategoryId, getCategoriesByProjectId, updateCategoryAssignments, createCategory, updateCategory } from '../models/categories.js';

// NEW - import validation functions from express-validator
import { body, validationResult } from 'express-validator';
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


// NEW - validation rules for category forms, min 3 server-side only per assignment instructions
const categoryValidation = [
    body('name').trim().notEmpty().isLength({ min: 3, max: 100 })
];

// NEW - serves the new category form
const showNewCategoryForm = async (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

// NEW - processes the new category form submission and inserts into database
const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Category name must be between 3 and 100 characters.');
        return res.redirect('/new-category');
    }
    const { name } = req.body;
    await createCategory(name);
    req.flash('success', 'Category created successfully!');
    res.redirect('/categories');
};

// NEW - serves the edit category form pre-filled with existing category data
const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    res.render('edit-category', { title: 'Edit Category', category });
};

// NEW - processes the edit category form submission and updates the database
const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Category name must be between 3 and 100 characters.');
        return res.redirect(`/edit-category/${categoryId}`);
    }
    const { name } = req.body;
    await updateCategory(categoryId, name);
    req.flash('success', 'Category updated successfully!');
    res.redirect('/categories');
};

// Export any controller functions
// UPDATED - added showNewCategoryForm and processNewCategoryForm to exports
export {
    showCategoriesPage, showCategoryDetailsPage,
    showAssignCategoriesForm, processAssignCategoriesForm,
    showNewCategoryForm, processNewCategoryForm,
    showEditCategoryForm, processEditCategoryForm,
    categoryValidation
};