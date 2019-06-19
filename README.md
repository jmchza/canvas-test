React app + JEST and Sinon Testing

## Available Scripts

### `Overview`

For peristency I have decided to opt for the localstorage approach, yes this can be placed into a Redis instance for a more eficient choice.
I would have liked to write the Pad class with hooks instead but I just wanted to get it across to you, and that is the fastest for now.
I will push up a new branch tonight with implementation with hooks if you are still interested

### `Installation`

Before you can run this, you need to clone the projet and install the required compoennts as per below:

git clone URL
npm install


In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

  this command will run nothing at the moment but I have otlined what the idea woudl be for this case.
  This will take a considerable amount of time to get it right in order to show it
  


### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!


### `Docker and more `

The ap is ready to be deployed into a docker container via docker compose with a nginx server to serve the static folder.

The idea is to use a reverse proxy to serve the static folder

### `Relevant Documentation`

https://airbnb.io/enzyme/
https://airbnb.io/enzyme/docs/api/mount.html

https://sinonjs.org/#get-started
https://sinonjs.org/releases/v7.3.2/spies/
https://github.com/domenic/sinon-chai

`video`

https://www.youtube.com/watch?v=U_Q7ss7wvoo


https://www.leighhalliday.com/testing-react-jest-enzyme-sinon


