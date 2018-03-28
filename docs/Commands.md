Make sure you have navigated to your project root within your node command line. From this point you can use several commands. There are a few main dev commands, and then several smaller commands for more granular control.
## Main Dev Commands

### gulp manifest
You should recognize this command from setting up your project. This command will update your manifest with the information provided in `gulpfile.js`. Anytime you need to update this information, for example, when changing the version number, you will need to run this command.

### gulp build
This command error checks, concatenates, compiles and minifies all your js and scss into the `dist/` folder, as well as copies your containers to the correct folder.

### gulp watch
This sets your node instance to watch all the js and scss in the src folder for any changes, as well as your containers. Upon changes it will automatically run the build command. Note: This command will take over your node instance, you may need to start a new instance if you want to run other commands.

### gulp package
A bit confusing with all the package talk earlier, but here we're not talking about dev packages anymore. This command builds and packages up what you've created into a DNN theme installation package (zip file). It will deposit the zip file under the `[root]/build/` folder using the information provided in `gulpfile.js`: `[project]_[version]_install.zip`.


***

## SubTask Commands
These commands are mostly used within the 3 over arching commands, but can be used individually if desired.

### gulp js
Error checks, concatenates, compiles, and minifies all js in the `src/js/` folder and outputs into the `dist/js/` folder.

### gulp scss
Error checks, concatenates, compiles, and minifies all scss in the `src/scss/` folder and outputs into the `dist/css/` folder.

### gulp images
Compresses images in the `src/images/` folder and output into the `dist/images/` folder.

### gulp containers
Copies the containers to the correct folder for DNN.


***

## Process Commands
These commands are used within other commands, or for special cases. We recommend use of these only for advanced users.

### gulp update
Pulls Bootstrap, Font-Awesome, and Normalize assets from the node_modules. So if you update your dependencies, you'll want to run this. Note that this will overwrite any changes you've done to the _normalize.scss file.

### gulp buildzips
Zips each dist folder. Used to prep theme packaging.

### gulp zipfiles
Collects all the zip files and project root files needed into the main theme zip file.

### gulp cleanup
Deletes all the zip files under the project root. Used to cleanup the individual zip files created in the theme packaging task.