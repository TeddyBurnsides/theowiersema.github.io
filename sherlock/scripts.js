$(document).ready(function(){

     // make sidebar links work
     $("#sidebar li.link").on('click',function() {
          $("#sidebar li").removeClass('active'); // make all links inactive
          $(".page").hide(); // hide all pages
          $(this).toggleClass('active'); // make the clicked link active
     });
     // Show each individual page
     $("#sidebar .discussion").on('click',function() {$("#posts").show();});
     $("#sidebar .details").on('click',function() {$("#details").show();});
     $("#sidebar .attachments").on('click',function() {$("#attachments").show();});

     // Add smooth scrolling to new post link
     $("li.newpost a").on('click', function(event) {
          $("#sidebar li").removeClass('active'); // make all limks inactive
          $(".page").hide(); // hide all pages
          $("#sidebar li.discussion").addClass('active'); // make discussion link active
          $("#posts").show(); // show discussion page
          // Make sure this.hash has a value before overriding default behavior
          if (this.hash !== "") {
               // Prevent default anchor click behavior
               event.preventDefault();
               // Store hash
               var hash = this.hash;
               // Using jQuery's animate() method to add smooth page scroll
               $('html, body').animate({
                    scrollTop: $(hash).offset().top
               }, 500, function(){
                    // Add hash (#) to URL when done scrolling (default click behavior)
                    window.location.hash = hash;
               });
          } // End if
     });

     // "Hide/Show Content" post footer button
     $(".post .footer .confidential").on('click',function() {
          // smooth hide motion
          $(this).parent().siblings('.entry').animate({
               'height':"toggle",
               'padding-top':"toggle",
               'padding-bottom':"toggle"
          },100,"linear");
          // Toggle text (hide vs. show)
         $(this).closest('.post').toggleClass('min');
     });

     // Internal toggle for new post
     $('.post.new .footer .internal input').on('click',function() {
          $(this).closest('.post').toggleClass('public');
     });

     // PHI post button
     $(".post .header .phi").on('click',function() {
          // change PHI icon
          $(this).find('.fa').toggleClass('fa-lock fa-unlock-alt');
          // change post class to toggle "Hide Content" text
          $(this).closest('.post').toggleClass('phi');
          // if post content is hidden, show again (otherwise you lose it!)
          if($(this).closest('.post').hasClass('min')) {
               // smooth hide motion
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
          if ($(this).children('span').children('.show').is(':hidden')) {
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
          $(".navigation .phi").children('span').children('span').toggleClass('notVisible')
     });

     // Hide All Internal posts
     $(".navigation .internal").on('click',function() {
          // change button text (on both navigation menus)
          $(".navigation .internal").children('span').children('span').toggleClass('notVisible');
          // hide epic posts
          $(this).parent().siblings('.epic').toggle();
     });

     // Remove related records
     $('.record .fa-trash').on('click',function() {
          $(this).closest('.record').remove();
     });

     // Show filter dropdown for navigation and posts
     $('.navigation .filter span, .flag .fa-flag').on('click',function() {
          $(this).siblings('.dropdown').fadeIn(200);
     });

     // Hide all dropdowns when clicking outside of them
     $(document).click(function(event) {
          // stop hiding from happening when cliking on button
          if (!$(event.target).closest('.flag, .filter').length) {
               if ($('.dropdown').is(':visible')) {
                    $('.dropdown').hide();
               }
          }
     });
     // Hide dropdown when clicking cancel/apply buttons
     $('.dropdown button').on('click',function() {
          $(this).closest('.dropdown').fadeOut(50);
     });

     // Show "Add Others" text field
     $('.newPeople button.others').on('click',function() {
          $(this).siblings('input, .fa').show();
     });

     // Change color of priority select
     $('.meta .priority').change(function() {
          if ($(this).val() === 'High') {
               $(this).css({"background-color": "#FEB64D"});
          }
          if ($(this).val() === 'Critical') {
               $(this).css({"background-color": "#FB889D"});
          }
          if ($(this).val() === 'Medium') {
               $(this).css({"background-color": "#5894FF"});
          }
          if ($(this).val() === 'Low') {
               $(this).css({"background-color": "#777"});
          }
     });

     // show new record search box
     $('.newRecord .button').change(function() {
          if ($(this).val() > '0') {
               $(this).siblings('input, i').show();
          }
     });

});
