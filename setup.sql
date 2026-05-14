-- PostgreSQL Database Dump
-- Gegenereerd voor Render Database

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- ========================================
-- Tabelstructuur: organization
-- ========================================
CREATE TABLE public.organization (
    organization_id SERIAL PRIMARY KEY,
    name character varying(150) NOT NULL,
    description text NOT NULL,
    contact_email character varying(255) NOT NULL,
    logo_filename character varying(255) NOT NULL
);

-- ========================================
-- Testquery (Inclusief voor de volledigheid)
-- ========================================
-- SELECT * FROM public.organization;

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO public.organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Volgorde/Sequenceteller synchroniseren
-- ========================================
-- Zorgt ervoor dat de automatische ID-teller correct verdergaat bij id 4
SELECT pg_catalog.setval('public.organization_organization_id_seq', 3, true);
