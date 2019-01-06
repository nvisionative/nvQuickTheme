Make sure you have navigated to your project root within your node command line. From this point you can use several commands. There are a few main dev commands, and then several smaller commands for more granular control.
## Main Dev Commands

### gulp init
This command initializes all third-party dependencies utilized within **nvQuickTheme**.  More specifically, it executes the following SubTask Commands in series (completes each task before the next):
* **gulp fontsInit**
* **gulp faFontsInit**
* **gulp faCssInit**
* **gulp slimMenuInit**
* **gulp normalizeInit**
* **gulp bsCssInit**
* **gulp bsJsInit**

### gulp build
This command error checks, concatenates, compiles and minifies all your JS and SCSS into the `./dist/` folder, as well as copies your containers to the correct folder. More specifically, it executes the following commands in series (completes each task before the next):
* **gulp init**
* **gulp styles**
* **gulp scripts**
* **gulp images**
* **gulp containers**
* **gulp manifest**

### gulp watch
This sets your node instance to watch all changes of images, JS and SCSS in the `./src/` folder, as well as containers in the `./containers/` folder. Upon changes it will automatically run the **gulp build** command. 

**Note:** _This command will take over your node instance (in Command Prompt, PowerShell, Git Bash, VS Code Terminal, etc.).  Therefore, you may want to start a new instance if you need to run other commands at the same time._

### gulp package
This command builds and packages your custom theme into a DNN theme installation package (ZIP file). It will place the ZIP file in the `./build/` folder using the following naming convention: `[project]_[version]_install.zip`


***

## SubTask Commands
These commands are mostly used within the four Main Dev Commands, but can be used individually if desired.

### gulp manifest
You should recognize this command from setting up your project. This command will update your manifest with the information provided in `project-details.json`. Anytime you need to update this information, like when changing the version number, you will need to run this command. This command is also executed as a part of the **gulp build** and **gulp package** commands.

### gulp scripts
Error checks, concatenates, compiles, and minifies all JS in the `./src/js/` folder and distributes to the `./dist/js/` folder.

### gulp styles
Error checks, concatenates, compiles, and minifies all SCSS in the `./src/scss/` folder and distributes to the `./dist/css/` folder.

### gulp images
Compresses images in the `./src/images/` folder and distributes to the `./dist/images/` folder.

### gulp containers
Copies containers to the correct folder within your DNN instance (assuming you are developing within a DNN instance).  This translates to `../../Containers/[your theme project name]/`.


***

## Process Commands
These commands are used within other commands and for other special situations. _We recommend use of these only for advanced users._

### gulp zipdist
ZIPs contents of `./dist/` folder. Used to prepare for theme packaging.

### gulp zipcontainers
ZIPs contents of `./containers/` folder. Used to prepare for theme packaging.

### gulp zipelse
ZIPs contents of `./menus/` folder, `./partials/` folder, and all ASCX, XML, HTML and HTML files withinthe root folder (`./`). Used to prepare for theme packaging.

### gulp zippackage
ZIPs all subset ZIP files and other pertinent project files into theme package installation file using the following naming convention: `[project]_[version]_install.zip`

### gulp cleanup
Deletes all temporary ZIP and project files used in package tasks.