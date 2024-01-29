# Modeling
This document describes basic Blender functionality, 3JS debugging, and how to store models in the code base.

## File Structure
When a model is created in blender, it saves as a .`blend` file type. A model should have its own subfolder within the “modeling” folder. This is where all `.blend` will
go.

When a model is completed and it is time to import it to 3JS, export the `.blend` as a `.dae`. You can optionally save the `.dae` file alongside the model’s `.blend`, but 
generally this should be avoided as you will not need the `.dae` once the model is imported to 3JS.

In 3JS, after you export the model as an object and get a `.json` file, place this file in the folder `src\models`. You can now refer to this model by its `.json` file 
name and easily add it to simulations as directed in the simulation documentation.

## Blender
Here are some general tips for using Blender to create 3D models.

Most often, you will start your modeling from a simple cube and mold it into the object you need. To get from a cube to your desired object, make sure you understand how 
to extrude, bevel, shift faces, edges, and vertices, and apply different colors and textures. Refer to Blender’s official documentation to help figure out key shortcuts 
and various commands. Google is your friend when using Blender!

[Blender documentation](https://docs.blender.org/)

## 3JS
3JS is a 3D, JavaScript modeling library that lets us take our Blender models, turn them into JSON files, and then display and interact with the models on our webpage.

[3JS](https://threejs.org/)

3JS is very simple to use for transforming your models into usable data. First, as mentioned in the above section, export your `.blend` model as a `.dae`. With this 
`.dae` we can now go onto 3JS’s editor and insert it through the import feature (click File, then Import will appear as a drop down). Once you import the `.dae` to the 
3JS editor, it will appear in the editing environment on your screen. From here there are only a couple remaining steps. First, delete any camera or light objects present 
in the model you just imported. If you forget to do this, it is likely that your simulation will end up having numerous lights and cameras which will alter the shading 
and lighting of the simulation. It also wastes storage and slows down the simulation on BTL. Once deleted extra lights and cameras, select the object you want to add to 
BTL, then export it as an object by clicking “File” and “Export Object”. This will download the object you selected as a `.json` file type. Simply name the downloaded 
`.json` appropriately and add to the code base!

[3JS Editor](https://threejs.org/editor/)

### Errors with 3JS
When importing blender models to the 3JS editor there was one issue we ran into, which was that various faces of the model were not being drawn in the editor and were 
invisible from certain perspectives. This is done because the normals of the Blender model are facing the wrong direction. To fix this, there are three things you 
should try:
1. Clean up the Blender model and delete any extra faces, edges, and vertices you might have generated while creating the model.
2. If 1. Cleaning up the model did not fix the issue, try flipping the normals of the faces that are not being drawn. To flip the normals, go on Blender, go in edit 
mode and select the face you want to fix, then either use the “Ctrl + N” shortcut or click “Mesh” to access the menu to flip the normals. Once the normals are flipped, 
the face should appear in the 3JS editor.
3. If this does not resolve the issue there is one remaining solution we have discovered. What you must do is extrude the face in question so that there is a duplicate 
face directly behind it. Having 2 faces stacked slightly above one another seems to help 3JS recognize the face is there and draw it properly. Note that you still may 
need to flip your normals once you stack the faces.

# 
At this point, you should have your Blender model as a `.blend` file in the `modeling` folder and its respective `.json` file in the `src\models` folder. You are now 
good to go and add your model to a simulation!
