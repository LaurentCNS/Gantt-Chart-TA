# Taigaforopenscop

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.7.  
Author: [Laurent Cantos](https://laurentcantos.fr/), my [Github](https://github.com/LaurentCNS). For [OpenScop](https://www.openscop.fr/)

# Need to run this project

You need to install the new backend project edit [Taiga-backend-edit-version-for-diagram-task](https://openscop.dev/Laurent/taiga-back-for-diagram).


# Configuration to access the API in development

In the file `src/environments/environment.ts` you can configure the URL of the API.  
![Alt text](https://openscop.dev/Laurent/taiga-diagram/-/raw/master/src/assets/screen0Git.png)

# Install dependencies

Run `npm install` to install all dependencies.  

## Development server

First, you need to run the backend project edit [Taiga-backend-edit-version-for-diagram-task](https://openscop.dev/Laurent/taiga-back-for-diagram).  
Then, run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Need to authenticate

At this time, this application can't create a new user. You need to create a new user in the original frontend project [Taiga original frontend project](https://github.com/taigaio/taiga-front).  
Then, you can login with this user. to access service of this project.
![Alt text](https://openscop.dev/Laurent/taiga-diagram/-/raw/master/src/assets/screen1Git.png)  

## Build for production

Change the URL of the API in the file `src/environments/environment.prod.ts`  

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

Deploy the `dist/` folder on your server in root folder.  

If you want to deploy in a subfolder, you need to edit the file `src/index.html` and change the line `<base href="/">` by `<base href="/subfolder/">`.  
In this case, you can got a problem with the routing, css and js files. you need to find out on the internet how to configure this. 
