/*
Component Variables:
 - rootElement : element ID (existing or new)
 - tag         : element tag (only used if new)
 - isNew       : true or false boolean important for creating a new element on the DOM
 - parentIfNew : parent element id to get append onto, can be null if not new
 - isShowing   : controls whether or not to show the component, defualt is true


*/

class Component {
    constructor(rootElement, tag, isNew, parentIfNew, isShowing = true) {
        this.isShowing = isShowing;
        this.tag = tag;
        this.isNew = isNew;
        if (isNew) {
            this.rootElement = this.createNewComponent(parentIfNew, rootElement)
            this.parentElement = this.parentElement;
        } else {
            this.rootElement = document.getElementById(`${rootElement}`)
            this.parentElement = this.rootElement.parentElement;
        }
        // These lines of code below work the same way as the above if and else statements
        // It uses ternary logic which is super useful but a bit confusing at first so I removed it but if you're curious
        // Here is the syntax !
        // condition ? value1(if true) : value2(if false) 
        // this.rootElement = isNew ? this.createNewComponent(parentIfNew,rootElement) : document.getElementById(`${rootElement}`);      
        // this.parentElement = isNew ? this.parentElement : this.rootElement.parentElement;
    }

    //Function to create a new component
    createNewComponent(parentID, id) {
        //Making sure it's new
        if (this.isNew) {
            //Creating a temp element on DOM
            let tempComponent = document.createElement(`${this.tag}`);
            //Setting id so we can keep track of it
            tempComponent.id = `${id}`;
            //Getting parent 
            let parent = document.getElementById(parentID);

            //Setting variables
            this.rootElement = document.getElementById(id);
            this.parentElement = parent;
            
            //Showing component if it's supposed to be
            if (this.isShowing) {
                parent.appendChild(tempComponent);
            }
            this.isNew = false;
            return tempComponent;
        }
    }


    hide() {
        //Making sure it's showing before removing
        if (this.isShowing) {
            this.parentElement.removeChild(this.rootElement);
            this.isShowing = false;
        }
    }

    show() {
        //Making sure it's not showing before showing it
        if (!this.isShowing) {
            this.parentElement.appendChild(this.rootElement);
            this.isShowing = true;
        }
    }

    //Allows for text to be added to elements 
    //clearText - Boolean to see whether to add to the text or replace
    addText(text, clearText) {
        if (clearText && this.isShowing) {
            this.rootElement.innerText = text;
        }
        else if (this.isShowing) {
            this.rootElement.innerText += text;
        }
    }
}