-- Organizations Table
-- This table stores info about organizations
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    logo_filename VARCHAR(255)
);

-- these lines insert test data for organizations
INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
('Community Helpers United', 'Dedicated to community service and volunteer work', 'info@communityhelpers.org', 'logo1.png'),
('Wildlife Conservation Society', 'Protecting animal habitats and endangered species', 'contact@wildlifeconsoc.org', 'logo2.png'),
('Education for All', 'Providing education and mentorship to underserved communities', 'hello@educationforall.org', 'logo3.png');

-- Service Projects Table
-- table for service projects
-- has foreign key to organization
CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date DATE,
    FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
);

-- add sample projects
INSERT INTO service_projects (organization_id, title, description, location, date) VALUES
(1, 'Beach Cleanup Drive', 'Clean up local beaches and remove plastic waste', 'Miami Beach, FL', '2024-03-15'),
(1, 'Community Garden Project', 'Build and maintain a community vegetable garden', 'Downtown Park', '2024-04-20'),
(1, 'Food Bank Organization', 'Sort and distribute food to families in need', 'Central Food Bank', '2024-05-10'),
(1, 'After School Tutoring', 'Provide tutoring help to struggling students', 'Lincoln High School', '2024-06-01'),
(1, 'Senior Companion Program', 'Visit and spend time with senior citizens', 'Sunrise Retirement Home', '2024-06-15'),
(2, 'Animal Shelter Support', 'Help care for and rehabilitate rescued animals', 'County Animal Shelter', '2024-03-22'),
(2, 'Wildlife Habitat Restoration', 'Restore native habitats for endangered species', 'Pine Forest Reserve', '2024-04-18'),
(2, 'Pet Adoption Drive', 'Organize adoption events to find homes for animals', 'Community Center', '2024-05-25'),
(2, 'Dog Park Construction', 'Build a dog park for the community', 'Riverside Park', '2024-07-01'),
(2, 'Wildlife Education Workshop', 'Teach children about local wildlife conservation', 'Nature Center', '2024-07-15'),
(3, 'Reading Program for Kids', 'Teach reading skills to underprivileged children', 'Public Library', '2024-03-10'),
(3, 'Computer Lab Setup', 'Install and teach basic computer skills', 'Community Center', '2024-04-05'),
(3, 'Scholarship Fund Drive', 'Raise money for student scholarships', 'High School Auditorium', '2024-05-20'),
(3, 'STEM Workshop', 'Host hands-on STEM learning activities', 'Science Museum', '2024-06-10'),
(3, 'College Prep Mentoring', 'Mentor students preparing for college', 'High School', '2024-07-20');

-- Categories Table
-- different types of service projects
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- insert categories
INSERT INTO category (name) VALUES
('Community Service'),
('Environmental'),
('Education'),
('Animal Welfare'),
('Senior Care'),
('Youth Development');

-- Project Category Table
-- junction table to link projects with categories
-- many to many relationship
CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES service_projects(project_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- insert data linking projects to categories
INSERT INTO project_category (project_id, category_id) VALUES
(1, 2), (2, 2), (3, 1), (4, 3), (5, 5),
(6, 4), (7, 2), (8, 4), (9, 4), (10, 2),
(11, 3), (12, 3), (13, 6), (14, 3), (15, 6);