# Biochemistry Teaching Laboratory Simulations 

Biochemistry Teaching Laboratory Simulations is a web application that can adequately simulate the usage of biochemistry lab equipment without the need for the equipment to be physically available. Its primary purpose is to provide students with an idea of how the equipment would work in real life in order to make such usage more efficient.

For development documentation, see [docs](docs)

## Release Notes

### Version 1.0

#### New Features

\- Added applet launch page

\- Added BTL Simulation Tutorial

\- Added Fluorescence Tutorial

\- Added Ligand Binding Simulation

\- Objects in simulations can now be interacted with

\- Measurements can be taken and produce the correct data

\- Added Cicrcular Dichroism Lab

#### Bug Fixes

\- Fixed gaps in fluorometer model

\- Fixed simulation movement issues

\- Fixed disappearing objects in simulation

\- Fixed overlapping applets on launch page

\- Popups no longer open over each other

\- Adjusted spacing for consistency

\- Tweaked UI to fix text overflow on smaller screens

#### Known Issues

\- Corrupted data for some Ligand Binding samples

\- Incomplete Circular Dichroism Tutorial

\- 404 errors on restart in apache server deployment




# BTL Installation Guide

## Pre-requisites

1. Install [Git](https://github.com/git-guides/install-git)
2. Copy the repository web URL using the "Code" button at the top right corner
3. Clone the repository locally by typing `git clone <URL>` in your terminal

## Local setup

1. Install [Node.js v19.1.0 (comes with NPM)](https://nodejs.org/en/)
2. Navigate to the cloned repository's directory
3. Open terminal in the directory
4. Run `npm ci` to install the packages
5. Start the local development server with `npm run develop` or `gatsby develop`


## Production deployment instructions (generic website)

1. Clear the local `public` folder at the root of the repository. If the folder doesn't exist, continue.
2. Navigate to the project's directory
3. Open terminal in the directory
4. Run `gatsby build` in your terminal
5. Move the files in the `public` folder to the root of the production web server.
