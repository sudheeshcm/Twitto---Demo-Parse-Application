$(window).load(function(){
    $('#cover').fadeOut(1200);
})

var button = document.getElementById('passResetcancel'); // Assumes element with id='button'

button.onclick = function() {

    window.location.assign('/login');
    
};
