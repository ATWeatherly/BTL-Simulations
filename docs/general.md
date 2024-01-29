# General Information
This document will describe general information involving both development of the application as well as usage.


# File structure
There is a specific file structure used for both standardization as well as organization.

- **data**: helper files for data processing
- **docs**: documentation
- **modeling**: 3D modeling assets
- **src**: source code
  - **components**: React components used on pages
    - **ComponentName**: folder for the component
      - **ComponentName**.js: component JS file
      - **styles**.scss: styles for the component
    - **images**: image assets
    - **labs**: lab templates & data
      - **index.json**: file to index lab ids and their directory
      - **Category/Lab Name**: directory for each specific lab simulation
        - **data.json**: basic data for the lab, including the name, description, and type
        - **icon.[png/jpg/etc]**: icon for the lab, used on the launch page
        - **sim.js**: template for simulation
        - **tutorial.js**: template for tutorial
    - **models**: 3D models and related content
      - **interactions**: interaction handlers
        - **handlers**: parent classes
        - **model.js**: interaction handler class for model
      - **model.json**: JSON-formatted 3D model
    - **pages**: pages of the application
    - **styles**: stylesheets for individual pages
    - **utils**: utility files, used to support other components/pages
- **static**: static content, such as pdfs.

