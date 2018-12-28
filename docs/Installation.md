### Intro (Video)
[![nvQuickTheme Video Series - Intro](https://img.youtube.com/vi/-w0qSTZfBUU/0.jpg)](https://www.youtube.com/watch?v=-w0qSTZfBUU)

### Install Node
Node is a server framework that we use to keep track of all our dependencies and help run our scripts. Head over to [https://nodejs.org/en/](https://nodejs.org/en/) to find out how to install Node.

Once you have Node installed, load up the Node command prompt. This is where you will be running all commands for the environment.


***

### Install Yarn
Yarn is a package manager that we use to manage all our dependencies quickly and securely.

Refer to the [yarn installation page](https://yarnpkg.com/en/docs/install) for details on your specific operating system.

***

### Install Gulp
Gulp is our task script manager and executor. In order for us to run this on command line in any project we're doing, from the node command line, you will need to run: `npm install gulp -g`. This will install Gulp globally on your machine. Note that if you run several installations of nvQuickTheme, you will only need to run this command on the first install.

***

### Clone Repository
The dev environment is setup to be run directly in a DNN instance under: `Portals\_default\Skins\[your theme name]`. Setup your empty Skin folder and clone our repo to that.

Alternatively, if you are not able to run this in a DNN instance, or don't want to run it in an instance, you can set it up as is, wherever you would like. To test your theme, you would run the packaging command, then install your theme package on your testing instance. 

We recommend running it directly in a DNN instance for full ease-of-use.

***

### Install Dependencies
With Yarn & Gulp installed, and the repo cloned, we can now use that package file.

Run: `yarn` or `yarn install`

This will read the package file and pull the necessary dependencies required for the environment.

NOTE: Yarn will notify you that Bootstrap is missing some dependencies. Please ignore this warning. Bootstrap 4 includes all it's dependencies in the "bundle" version that we use.

With all the dependencies installed and the repo cloned, your dev environment is ready to go!