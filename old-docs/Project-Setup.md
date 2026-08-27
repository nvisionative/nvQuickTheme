### Project Setup (Video)
[![nvQuickTheme Video Series - Project Setup](https://img.youtube.com/vi/7UhpbUaeFQc/0.jpg)](https://www.youtube.com/watch?v=7UhpbUaeFQc)

When you start a new theme project, you will need to edit **project-details.json** with your project information.

```javascript
var project       = '[project name]',
    author        = '[author]',
    company       = '[company]',
    url           = '[website]',
    email         = '[email]',
    description   = '[short description]';
```

Make sure you use html codes for any symbols used in these variables. After you've completed and saved the file, in the node command prompt within your root, you will need to run `gulp manifest`. This will take your information and populate the DNN manifest file with the information provided.