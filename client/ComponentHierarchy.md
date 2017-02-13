## Component Hierarchy

* App.js (main container.  renders proper component.  Container of containers.  
  includes state for which component to render and which animal is active for update.)
  * contains:  AnimalsContainer (Data component):
    * get animals from server.  delete animals.  Talk about componentDidMount and getInitialState.
    * Passes deleteMethod and Change view methods to AnimalsView via props.
    * Passes animals array to AnimalsView via props.
    * contains: AnimalsView (display component)
      * Displays List of Animals.  
  * contains: PostAnimalContainer (Data Component):
    * creates a state with animal name and species. 
    * provides methods to update name and species.
    * method to post new animal to the database.
    * contains: PostAnimalForm (Display Component):
      * Displays Form for input new Animal.
  * contains: EditAnimalContainer (Data Component):
    * gets id from the App.js container
    * gets animal from the server with that id.
    * onFeildchange function that abstracts the change name, species, etc functions.
    * contains: EditAnimalForm (Display Component):
      * Displays a form to edit an animal (prepopulates with the data from the animal we are editing). 
