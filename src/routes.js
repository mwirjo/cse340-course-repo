import express from 'express';
import { showLoginForm, processLoginForm, processLogout } from './controllers/users.js'
// Import controller functions for each page
import { showHomePage } from './controllers/index.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    deleteOrganization,
    organizationValidation
} from './controllers/organizations.js';
// Updated - added new project form controller functions to imports
// UPDATED - added edit project controller functions to imports

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './controllers/projects.js';

// UPDATED - added assign categories controller functions to imports
// UPDATED - added new and edit category controller functions to imports
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import { showUserRegistrationForm, processUserRegistrationForm , requireLogin, showDashboard } from './controllers/users.js'


// Create a new router instance
// This router will handle all routes and be exported to server.js
const router = express.Router();
router.get('/login', showLoginForm)
router.post('/login', processLoginForm)
router.get('/logout', processLogout)

router.get('/dashboard', requireLogin, showDashboard)
// Home page route
router.get('/', showHomePage);

// Organizations list page - shows all partner organizations
router.get('/organizations', showOrganizationsPage);

// Organization details page - shows a specific organization by ID
// :id is a route parameter that captures the organization ID from the URL
// For example: /organization/13 will pass 13 as req.params.id
router.get('/organization/:id', showOrganizationDetailsPage);

// Projects list page - shows all service projects
router.get('/projects', showProjectsPage);
// Route for service project details page
router.get('/project/:id', showProjectDetailsPage);

// Categories list page - shows all service project categories
router.get('/categories', showCategoriesPage);
// Route for category details page
router.get('/category/:id', showCategoryDetailsPage);
// NEW - GET route serves the new category form
router.get('/new-category', showNewCategoryForm);

// NEW - POST route processes the new category form, categoryValidation runs first
router.post('/new-category', categoryValidation, processNewCategoryForm);

// NEW - GET route serves the edit category form pre-filled with existing data
router.get('/edit-category/:id', showEditCategoryForm);

// NEW - POST route processes the edit category form submission
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

// NEW - GET route serves the assign categories form for a specific project
router.get('/project/:projectId/assign-categories', showAssignCategoriesForm);

// NEW - POST route processes the assign categories form submission
router.post('/project/:projectId/assign-categories', processAssignCategoriesForm);

router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

router.post('/delete-organization/:id', deleteOrganization);

// NEW - GET route serves the empty new project form with organization dropdown
router.get('/new-project', showNewProjectForm);

// NEW - POST route processes the form submission, projectValidation runs first as middleware
router.post('/new-project', projectValidation, processNewProjectForm);

// NEW - GET route serves the edit project form pre-filled with existing data
router.get('/edit-project/:id', showEditProjectForm);

// NEW - POST route processes the edit project form submission
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// Test route to simulate a 500 server error (development use only)
router.get('/test-error', testErrorPage);

router.get('/register', showUserRegistrationForm)
router.post('/register', processUserRegistrationForm)

// Silence Chrome DevTools probe
router.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.status(204).end();
});



// Export the router to be used in server.js
export default router;