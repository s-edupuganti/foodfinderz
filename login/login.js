const signUp = document.getElementById('signUp');
const signIn = document.getElementById('signIn');
const container = document.getElementById('container');

signUp.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signIn.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

/*
idk
    <script>

        // Bind all a href clicks to this function
        $(document).on('click', 'a', function(event){

            // Prevent default events
            event.preventDefault();

            // Animate the body (html page) to scroll to the referring element 
            $('html, body').animate({
                scrollTop: $( $.attr(this, 'href') ).offset().top
            }, 1000);

        });

    </script>

*/