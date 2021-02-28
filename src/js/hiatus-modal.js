/* A modal window that appears after language selection to alert users to critical information e.g. 
reduced functionality due to a hiatus */ 
// Based on welcome.js

class HiatusModal {
    constructor() {
        this.el = document.createElement('div');
        this.el.className = 'modal-wrap';
        this.el.innerHTML = this.render();
        this.closeButton = this.el.querySelector(".modal-close");
        this.isActive = true; //change this to 'false' to disable the modal!!

        //Add event listeners to close button
        //Add event listener to close button using escape key
        //Alternately, allow user to click outside modal to close
        this.closeButton.addEventListener('click', () => {
            this.close()})
         document.addEventListener('keyup', (evt) => {
            if (evt.key === 'Escape'){
            this.close()}
            })
        document.addEventListener('click', (evt) => {
            if (evt.target != document.querySelector('.modal')){
                this.close()
            }  
        })
    }

    render(){
        return `
        <div class="modal" id="hiatus" role="alertdialog" aria-labelledby="alertTitle" aria-describedby="alertDesc">
            <h1 id="alertTitle">Hi friends! TCMAP is on break! The map is not being updated.</h1>
            <div id="alertDesc">
                <i class="material-icons-round hiatus-alert-icon" aria-hidden="true">error</i>
                <p class="bold"><i class="material-icons-round hiatus-alert-icon" aria-hidden="true">error</i>
                Information about a site's needs, current open status, and hours may not be accurate!</p>
                <p><i class="material-icons-round hiatus-alert-icon" aria-hidden="true">check_box</i>
                Make sure to check the Contact Info for a site and go to their website
                or contact them directly to verify info!
                </p>
                <p>
                <i class="material-icons-round hiatus-alert-icon" aria-hidden="true">calendar_today</i>
                Normal operations will resume on Monday, 3/8. <br> See you then!
                </p>
                
            </div>
                <button class="modal-close" autofocus>Got it! Take me to the map.</button>
        </div>
        `
    }

    open() {
        document.body.appendChild(this.el);
        // save to session storage
        sessionStorage.setItem("alertshown", true); //changing 'true' here shouldn't do anything
    }

    close() {
        this.el.animate([
            {opacity: 1},
            {opacity: 0} 
        ], 400);
        setTimeout( () => {
            this.el.remove()}, 400);
    }    
}

export default HiatusModal
