const signUp = document.getElementById('signUp');
const signIn = document.getElementById('signIn');
const container = document.getElementById('container');

signUp.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signIn.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

function startDictation(id) {

    if (window.hasOwnProperty('webkitSpeechRecognition')) {

      var recognition = new webkitSpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.lang = "en-US";
      recognition.start();

      recognition.onresult = function(e) {
        if (id === "name") {
            document.getElementById('name').value = event.results[0][0].transcript;
        } else if (id === "email1") {
            document.getElementById('email1').value = event.results[0][0].transcript;
        } else if (id === "password1") {
            document.getElementById('password1').value = event.results[0][0].transcript;
        } else if (id === "email2") {
            document.getElementById('email2').value = event.results[0][0].transcript;
        } else if (id === "password2") {
            document.getElementById('password2').value = event.results[0][0].transcript;
        } else if (id === "search1") {
            document.getElementById('search1').value = event.results[0][0].transcript;
        } else if (id === "search2") {
            document.getElementById('search2').value = event.results[0][0].transcript;
        } 
        recognition.stop();
      };

      recognition.onerror = function(e) {
        recognition.stop();
      }

    }
}

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