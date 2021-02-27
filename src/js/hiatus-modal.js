/* A modal window that appears after language selection to alert users to critical information e.g. 
reduced functionality due to a hiatus */ 

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
        <div class = "modal" role="alertdialog" aria-labelledby="alertTitle" aria-describedby="alertDesc">
            <h1 id="alertTitle">Hi friends! TCMAP is on break 3/1 -3/7 so the map is not being updated.</h1>
            <p id="alertDesc">Information about a siteâ€™s needs, current open status, and hours may not be accurate!
            <br>
            Make sure to check the Notes and Contact info for a site and go to their website 
            or contact them directly to verify info!
            <br>
            Normal operations will resume on Monday, 3/8.
            <br>
            See you then!
            </p>
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
