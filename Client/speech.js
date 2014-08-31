var finalTranscript = '';
var recognizing = false;
var recognition = new webkitSpeechRecognition();
var socket = io.connect("http://localhost:8001/");

$(document).ready(function() {

    // check that your browser supports the API
    if (!('webkitSpeechRecognition' in window)){
        alert("Sorry, your Browser does not support the Speech API");
    } else{
        // Create the recognition object and define the event handlers

        socket.on();

        recognition.continuous = true;         // keep processing input until stopped
        recognition.interimResults = true;     // show interim results
        recognition.lang = 'es-CO';           // specify the language

        recognition.onstart = function() {
            recognizing = true;
            $('#instructions').html('Speak slowly and clearly');
            $('#start_button').html('Click to Stop');
        };

        recognition.onerror = function(event) {
            console.log("There was a recognition error...");
        };

        recognition.onend = function() {
            recognizing = false;
            $('#instructions').html('&nbsp;');
        };

        recognition.onresult = function(event) {
            var interimTranscript = '';

            // Assemble the transcript from the array of results
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // update the page and emit final transcript information

            if(finalTranscript.length > 0) {
                socket.emit('information', {
                    'finalTranscript': finalTranscript
                });
                console.log("final:    " + finalTranscript);
                $('#transcript').html(finalTranscript);
                recognition.stop();
                $('#start_button').html('Click to Start Again');
                recognizing = false;
            }
        };

        $("#start_button").click(function(e) {
            e.preventDefault();

            if (recognizing) {
                recognition.stop();
                $('#start_button').html('Click to Start Again');
                recognizing = false;
            } else {
                finalTranscript = '';
                // Request access to the User's microphone and Start recognizing voice input
                recognition.start();
                $('#instructions').html('Allow the browser to use your Microphone');
                $('#start_button').html('waiting');
                $('#transcript').html('&nbsp;');
            }
        });
    }
   
});