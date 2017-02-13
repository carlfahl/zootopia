## Step 1: Setup the react app.

Fork the zootopia repository from fresh5447/zootopia to your GitHub account.
Clone from your fork of the zootopia repo:  `git clone <url`
checkout the react-start branch: `git checkout react-start`
create a react app: `create-react-app client`
Delete the unneeded files that were created by `create-react-app`, leave only index.js and index.css
commit this step to GitHub.

`git add -A`
`git commit -m 'Created a react project'`
`git push origin master`

## Step 2:  Create App.js to display components:
Created an App.js file `touch App.js` within src directory.
Made App a stateful component will render the desired view.
App.js uses a state variable to keep track of the view (`activeComp`)
and a variable to keep track of the current animal being updated
(`activeId`):

```
getInitialState: function () {
    return (
      {activeComp: 'home',
       activeId: null}
    );
  },
  ```

Created a funtion `renderProperComp` that use the `activeComp` state
variable to determine which component to return based on conditional
statements.  Created a function `updateActiveComp` to change the state
variables.

Commit the changes to GitHub.

## Step 3:
