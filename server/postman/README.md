# SpendWise Phase 2 — Postman Collection & Runner Guide

This directory contains the automated Postman collections and environment files for verifying SpendWise authentication endpoints.

## Files Included

1. **`SpendWise_Phase2_Auth_Collection.json`**:
   - Complete Postman 2.1 collection containing:
     - `01 - System Health Check` (`GET /api/health`)
     - `02 - User Registration` (`POST /api/auth/register`)
     - `03 - User Login` (`POST /api/auth/login`)
     - `04 - Get User Profile (Cookie)` (`GET /api/auth/me`)
     - `05 - Get User Profile (Bearer)` (`GET /api/auth/me`)
     - `06 - User Logout` (`POST /api/auth/logout`)

2. **`SpendWise_Auth_Environment.json`**:
   - Environment variables:
     - `baseUrl`: `http://localhost:5000`
     - `authToken`: Automatically populated by registration/login scripts
     - `registeredEmail`: Default test email account
     - `registeredPassword`: Default test password

## How to Import & Run in Postman

1. Open Postman.
2. Click **Import** in the top left.
3. Drag and drop both JSON files from `server/postman/`.
4. Select the active environment in the top right dropdown: **SpendWise Local Environment**.
5. Click on the collection name **SpendWise — Phase 2 Authentication API** and click **Run collection**.
6. All automated assertions will execute and report passing tests.
