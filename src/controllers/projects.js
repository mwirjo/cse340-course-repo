// Import any needed model functions
// NEW - import createProject model function and getAllOrganizations for the dropdown


import { getAllProjects, getUpcomingProjects, getProjectDetails, createProject, updateProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
// NEW - import validation functions from express-validator
import { body, validationResult } from 'express-validator';
import { isUserVolunteered } from '../models/volunteers.js'

// Number of upcoming projects to display on the projects page
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Shows the next 5 upcoming service projects
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

// Shows the details of a single service project
// Also fetches the categories for that project to display as tags


const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);
    const title = 'Service Project Details';

    let isVolunteered = false
    if (req.session.user) {
        isVolunteered = await isUserVolunteered(req.session.user.user_id, projectId)
    }

    res.render('project', { title, project, categories, isVolunteered });
};


// NEW - serves the new project form, passes organizations for the dropdown menu
const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    res.render('new-project', { title: 'Add New Service Project', organizations });
};

// NEW - validation rules for new project form, runs as middleware before processNewProjectForm
const projectValidation = [
    body('title').trim().notEmpty().isLength({ min: 3, max: 200 }),
    body('description').trim().notEmpty().isLength({ max: 1000 }),
    body('location').trim().notEmpty().isLength({ max: 200 }),
    body('date').notEmpty().isDate(),
    body('organizationId').notEmpty().isInt()
];

// NEW - processes the new project form submission and inserts into database
// UPDATED - now checks for validation errors before inserting into database
const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Please fill out all fields correctly.');
        return res.redirect('/new-project');
    }
    const { organizationId, title, description, location, date } = req.body;
    await createProject(title, description, location, date, organizationId);
    req.flash('success', 'New service project added successfully!');
    res.redirect('/projects');
};

// NEW - serves the edit project form, pre-filled with existing project data and organization dropdown
const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    const title = 'Edit Service Project';

    res.render('edit-project', { title, project, organizations });
};

// NEW - processes the edit project form submission and updates the database
const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Please fill out all fields correctly.');
        return res.redirect(`/edit-project/${projectId}`);
    }
    const { organizationId, title, description, location, date } = req.body;
    await updateProject(projectId, title, description, location, date, organizationId);
    req.flash('success', 'Service project updated successfully!');
    res.redirect(`/project/${projectId}`);
};

// UPDATED - added projectValidation to exports
export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, showEditProjectForm, processEditProjectForm, projectValidation };