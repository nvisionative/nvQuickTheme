When you start a new theme project, you will need to edit **project-details.json** with your project information.

```javascript
// project-details.json
	"project": "Project Name",
	"version": "1.0.0",
	"author": "Author &amp; Author",
	"company": "My Company",
	"url": "www.mysite.com",
    "email": "support@mysite.com",
    "description": "Theme based on nvQuickTheme"
```

Make sure you use html codes for any symbols used in these variables, as seen in the author value above. After you've completed and saved the file, in the node command prompt within your root, you will need to run `gulp manifest`. This will take your information and populate the DNN manifest file with the information provided.