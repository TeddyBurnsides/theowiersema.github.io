$(document).ready(function(){

     // Add smooth scrolling to all links
     $("a").on('click', function(event) {
          // Make sure this.hash has a value before overriding default behavior
          if (this.hash !== "") {
               // Prevent default anchor click behavior
               event.preventDefault();
               // Store hash
               var hash = this.hash;
               // Using jQuery's animate() method to add smooth page scroll
               $('html, body').animate({
                    scrollTop: $(hash).offset().top
               }, 800, function(){
                    // Add hash (#) to URL when done scrolling (default click behavior)
                    window.location.hash = hash;
               });
          } // End if
     });

     // "Hide/Show Content" button
     $(".post .footer .confidential").on('click',function() {
          // hide post content
          $(this).parent().siblings('.entry').animate({
               'height':"toggle",
               'padding-top':"toggle",
               'padding-bottom':"toggle"
          },300,"linear");
          // Toggle text (hide vs. show)
         $(this).closest('.post').toggleClass('min');
     });

     // Internal toggle for new post
     $('.post.new .footer .internal input').on('click',function() {
          // change new post header border-color
          $(this).closest('.post').find('.header').toggleClass('public');
     });

     // PHI button
     $(".post .header .phi .fa").on('click',function() {
          // change PHI icon
          $(this).toggleClass('fa-lock fa-unlock-alt');
          // change post class to toggle "Hide Content" text
          $(this).closest('.post').toggleClass('phi');
          // if post content is hidden, show again (otherwise you lose it!)
          if($(this).closest('.post').hasClass('min')) {
               $(this).closest('.post').children('.entry').animate({
                    'height':"toggle",
                    'padding-top':"toggle",
                    'padding-bottom':"toggle"
               },300,"linear");
               // toggle minimized post class
               $(this).closest('.post').toggleClass('min');
          }
     });

     // Hide All phi
     $(".navigation .phi").on('click',function() {
          // change behavior depending on button text
          if ($(this).find('.show').is(':hidden')) {
               // toggle minimized post class
               $('.post.phi').addClass('min');
               // hide post content
               $(this).parent().siblings('.phi').children('.entry').hide();
          } else {
               // toggle minimized post class
               $('.post.phi').removeClass('min');
               // show post content
               $(this).parent().siblings('.phi').children('.entry').show();
          }
          // toggle "Show/Hide PHI" button (on both nav menus)
          $(".navigation .phi").find('span').toggleClass('notVisible')
     });
     
     // Hide All Internal posts (note this removes post entirely)
     $(".navigation .internal").on('click',function() {
          // change button text (on both navigation menus)
          $(".navigation .internal").find('span').toggleClass('notVisible');
          // hide epic posts
          $(this).parent().siblings('.epic').toggle();
     });
});
