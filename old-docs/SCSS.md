Our scss is located under `[root]/src/scss/`. For basic information on scss we recommend [this](https://css-tricks.com/sass-style-guide/) article. We will outline our scss organization methodology below.

### Adding custom .scss files
Our organization is solid, but it won't always cover what you have. You will need to add your own .scss files for your projects, just try to keep with the organization! SCSS needs to be compiled, and to do so, there are instruction files setup to tell it how to compile, so when you add a new .scss file, you need to make sure you setup the instruction file to include your file. For almost all of them, they are named after the folder they are in. `/components/_components.scss` for instance:
```scss
@import 'dnn';
@import 'buttons';
@import 'fonts';
@import 'forms';
@import 'grid';
@import 'helpers';
@import 'nav';
@import '[your new file]';
```

### Import Order
It's important to keep in mind that order matters when compiling because that's the order it will be in the final css document. If you have scss that is dependent on previous scss, you will need to make sure that it's compiling in the correct order. The current order is as such:

```scss
// needs variables first
@import 'variables/variables';
  @import 'breakpoints';
  @import 'colors';
  @import 'type';

// mixins will take variables but then needs to be before any mixin calls
@import 'mixins/mixins';

// our baseline file
@import 'base';

// components next in case page overrides on specific components are needed
@import 'components/components';
  @import 'dnn';
  @import 'buttons';
  @import 'fonts';
  @import 'forms';
  @import 'grid';
  @import 'helpers';
  @import 'nav';

// pages for template-wide specific styling
@import 'pages/pages';
  @import 'globals';

// and lastly sections with specific styling
@import 'sections/sections';
  @import 'header';
  @import 'footer';
  @import 'bannerpane';
```

### _base.scss
This file is used for base element styling. Ex:
```scss
// all nested lists have no margin
ul ul,
ol ol,
ul ol,
ol ul {
  margin:0;
}
```

### /variables/
Most scss variables should be located here. Any widely used variables created should be added here. Ex:
```scss
$primary-color: rgb(236, 61, 70) !default;
$secondary-color: rgb(0, 165, 225) !default;
$tertiary-color: rgb(70, 42, 43) !default;
```

### /mixins/_mixins.scss
This file has all the scss mixins used, or any that you want to add. For clarity, mixins are shortcuts used within scss and should not be confused with helper css which are classes setup to use within the DOM. Ex:
```scss
@mixin font-size($sizeValue) {
  font-size: $sizeValue + px;
  font-size: ($sizeValue / 16) + rem;
}
```
Note: Don't add prefix mixins as gulp-autoprefixer adds all the prefixes needed upon compilation.

### /components/
Any website component styling should be done in this folder. We already have it broken down into several components, but you should add more if it makes sense, for instance, if you added an FAQ module with your own custom styling, you could add a `_faq.scss` to this folder.

### /pages/
This is where any page/template specific styling should be done.

### /sections/
Any section specific styling should be here. Ex: `_bannerpane.scss` was created here because it was possible this section would be reused on multiple templates.
```scss
.bannerpane {
  background:$secondary-color;
  background:linear-gradient(135deg, darken($secondary-color, 20%) 0%, $secondary-color 50%, lighten($secondary-color, 20%) 100%);
  color:white;
  
  div[class*='col-'] {
    padding-top:6rem;
    padding-bottom:6rem;
  }
}
```