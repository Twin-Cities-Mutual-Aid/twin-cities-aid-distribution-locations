/* A modal window that appears after language selection to alert users to critical information e.g. 
reduced functionality due to a hiatus */ 
// Used welcome.js as a template

class HiatusModal {
    constructor() {
        this.el = document.createElement('div');
        this.el.className = 'modal-wrap';
        this.el.innerHTML = this.render();
        this.closeButton = this.el.querySelector(".modal-close");
        this.isActive = true; //change this to 'false' to disable the modal

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
            if (evt.target == document.querySelector('.modal-wrap')){
                this.close()
                }
            })
    }
    render(){
        return `
        <div class="modal" id="hiatus" role="alertdialog" aria-labelledby="alert-title" aria-describedby="alert-desc">
        <header>TCMAP is on hiatus March 1 - March 7</header>
            <h1 id="alert-title">Hi friends! TCMAP is on break. Site hours are not up to date.</h1>
            <div id="alert-desc">
                <p class="bold"><i class="material-icons-round hiatus-alert-icon" aria-hidden="true">error</i>
                Information about a site's current needs, open status, and hours may not be accurate.</p>
                <p class="bold"><i class="material-icons-round hiatus-alert-icon" aria-hidden="true">check_box</i>
                Make sure to verify hours directly with the site! 
                Check the site’s Contact Info to find out how to reach them.
                </p>
                <p class="bold">
                <i class="material-icons-round hiatus-alert-icon" aria-hidden="true">calendar_today</i>
                Normal operations will resume Monday, March 8th. See you then!
                </p>
            </div>
                <button class="modal-close" autofocus>Got it! Take me to the map.</button>
        </div>
        `
    }

    open() {
        document.body.appendChild(this.el);
        // save to session storage
        sessionStorage.setItem("alertshown", true); //changing 'true' here shouldn't do anything?
    }
    close() {
        this.el.remove()
    }    
}

export default HiatusModal
