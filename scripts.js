$(document).ready(function(){

/*
SIDEBAR LINKS
*/

// make sidebar links work
$("#sidebar li.link").click(function() {
     $("#sidebar li").removeClass('active'); // make all links inactive
     $(".page").hide(); // hide all pages
     $(this).toggleClass('active'); // make the clicked link active
});
// Show each individual page
$("#sidebar .posts").click(function() {
     $("#posts").show();
});
$("#sidebar .details").click(function() {
     $("#details").show();
});
$("#sidebar .attachments").click(function() {
     $("#attachments").show();
});

// Add smooth scrolling to new post link
$("li.newpost a").click(function(event) {
     $("#sidebar li").removeClass('active'); // make all limks inactive
     $(".page").hide(); // hide all pages
     $("#sidebar li.posts").addClass('active'); // make discussion link active
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

/*
PHI RELATED
*/

// "Hide/Show Content" post footer button
$(".post .footer .confidential").on('click',function() {
     // smooth hide motion
     $(this).parent().siblings('.entry').animate({
          'height':"toggle",
          'padding-top':"toggle",
          'padding-bottom':"toggle"
     },200,"linear");
     // Toggle text (hide vs. show)
    $(this).closest('.post').toggleClass('min');
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
          $(this).parent().siblings('#postContainer').children('.phi').children('.entry').hide();
     } else {
          // toggle minimized post class
          $('.post.phi').removeClass('min');
          // show post content
          $(this).parent().siblings('#postContainer').children('.phi').children('.entry').show();
     }
     // toggle "Show/Hide PHI" button (on both nav menus)
     $(".navigation .phi").children('span').children('span').toggleClass('notVisible')
});

/*
INTERNAL Filter
*/

// Hide All Internal posts
$(".navigation .internal").on('click',function() {
     // change button text (on both navigation menus)
     $(".navigation .internal").children('span').children('span').toggleClass('notVisible');
     // hide epic posts
     $(this).parent().siblings('#postContainer').children('.epic').toggle();
     // if no posts are visible (except new post), show the placeholder
     if ($('.post:visible').length == 1) {
          $('#postContainer .placeholder').show();
     } else {
          $('#postContainer .placeholder').hide();
     }
});

// Internal toggle for new post
$('.post.new .footer .internal input').on('click',function() {
     $(this).closest('.post').toggleClass('public');
});

/*
FILTER DRODPOWN
*/

// Hide all dropdowns when clicking outside of them
$(document).click(function(event) {
     // stop hiding from happening when clicking on button
     if (!$(event.target).closest('.flag, .filter').length) {
          $('.dropdown').hide();
     }
});

// Show filter dropdown for navigation and posts
$('.navigation .filter > span, .flag .fa-flag').click(function() {
     $('.dropdown').hide();
     $(this).siblings('.dropdown').fadeIn(200);
});

// hold over until advanced filtering
$('.filter .closeDropdown').click(function() {
     // hide dropdown
     $(this).closest('.dropdown').hide();
     var selectedTags = "";
     var visibleTag = "";
     var quit = ""
     // generate string of selected filters
     $(this).siblings('label').children('input:checked').each(function() {
          selectedTags += $(this).attr('class') + ",";
     });
     // if no filters selected, show all posts
     if (selectedTags == "") {
          $('.post').show();
     // else determine what posts to show
     } else {
          // loop through all posts
          $('.post').each(function() {
               // don't ever hide the new post
               if (($(this).attr('id') === 'newpost')) {
                    return false;
               }
               // loop through visible tags
               quit = ""
               $(this).find('.header .tags.active').each(function() {
                    // remove "tag" class - only want unique class name
                    visibleTag = $(this).attr('class').slice(0,-12);
                    // if tag is in generated string of selected filters quit
                    if (selectedTags.search(visibleTag) > -1) {
                         quit = 1;
                         return false;
                    }
               });
               // if we never found the string, hide the post
               if (quit != 1) {
                    $(this).hide();
               // otherwise we'll show it
               } else {
                    $(this).show();
               }
          });
     }
     // if no posts are visible (except new post), show the placeholder
     if ($('.post:visible').length == 1) {
          $('#postContainer .placeholder').show();
          // change button text  for "Hide internal" button
          $(".navigation .internal").find('.hide').addClass('notVisible');
          $(".navigation .internal").find('.show').removeClass('notVisible');
     } else {
          $('#postContainer .placeholder').hide();


     }
});

// filter cancel button
$('.filter .cancel').click(function() {
     // uncheck all active checkboxes
     $(this).siblings('label').find('input:checked').prop('checked', false);
     // hide dropdown
     $(this).closest('.dropdown').hide();
     // show all posts again
     $('.post').show();
     // hide placeholder if it's visible
     $('#postContainer .placeholder').hide();
});

// flag stuff upon APPLY button in post filter dropdown
$('.post .dropdown button.closeDropdown').click(function() {
     // close the dropdowns
     $(this).closest('.dropdown').fadeOut(50);
     // make flag active if checked
     if ($(this).siblings('label').children('input:checked').length > '0') {
          $(this).closest('.dropdown').siblings('.fa').addClass('active');
     }
     // make flag inactive if no boxes checked
     if ($(this).siblings('label').children('input:checked').length == '0') {
          $(this).closest('.dropdown').siblings('.fa').removeClass('active');
     }
     // show Tags
     $(this).siblings('label').children('input:checked').each(function() {
          var tagClass = "." + $(this).attr('class');
          $(this).closest('.header').children(tagClass).addClass('active');
     });
     // hide Tags
     $(this).siblings('label').children('input').not(':checked').each(function() {
          var tagClass = "." + $(this).attr('class');
          $(this).closest('.header').children(tagClass).removeClass('active');
     });
});

// Restore post dropdown to original state on Cancel
$('.post .dropdown button.cancel').click(function() {
     // close the dropdowns
     $(this).closest('.dropdown').fadeOut(50);
     // restore currently active checkboxes
     $(this).closest('.header').children('.tags:visible').each(function() {
          var tagClass = '.' + $(this).attr('class').split(' ',1);
          $(this).siblings('.flag').find(tagClass).prop('checked', true);
     });
     // restore currently inactive checkboxes
     $(this).closest('.header').children('.tags:hidden').each(function() {
          var tagClass = '.' + $(this).attr('class').split(' ',1);
          $(this).siblings('.flag').find(tagClass).prop('checked', false);
     });
});

/*
SIDEBAR RELATED
*/

// Remove related records
// adjust h4 count
$('.record .fa-trash').click(function() {
     var cnt = $(this).closest('.record').prevAll('h4:first').children('.count').html();
     var total=cnt-1;
     $(this).closest('.record').prevAll('h4:first').children('.count').html(total);
     $(this).closest('.record').remove();
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
     if ($(this).val() === '1') {
          $(this).siblings('input').attr("placeholder","Search for support logs");
     }
     if ($(this).val() === '2') {
          $(this).siblings('input').attr("placeholder","Search for release authorizations");
     }
     if ($(this).val() === '3') {
          $(this).siblings('input').attr("placeholder","Search for release notes");
     }
     if ($(this).val() === '4') {
          $(this).siblings('input').attr("placeholder","Search for reportable issues");
     }
     if ($(this).val() === '5') {
          $(this).siblings('input').attr("placeholder","Search for checklists");
     }
});

// Add yourself to the sidebar and disable button
$('button.addme').click(function() {
     $('#sidebar .me').fadeIn();
     $(this).addClass('disabled');
});

/*
Header
*/

// Show/Hide Hidden header navigation
$('#menu > i').click(function() {
     $('#menu > i').toggleClass('fa-angle-down fa-angle-up');
     if ($('#hiddenMenu').is(':hidden')) {
          $('#hiddenMenu').slideDown();
     } else {
          $('#hiddenMenu').slideUp();
     }
});

/*
DETAILS Forms
*/

// highlight label on Details Forms
$('#details form :input').bind({
     focus: function () {
        var id = $(this).attr('id').toString();
        var add = $("label[for='" + this.id + "']").addClass('labelfocus');
        switch (id) {
            case 'title':add;break;
            case 'RefNum':add;break;
            case 'ReportedOn':add;break;
            case 'ReportedBy':add;break;
            case 'SentToEpic':add;break;
            case 'NextUpdate':add;break;
            case 'type':add;break;
        }
     },
     blur: function () {
        $('label').removeClass('labelfocus');
     }
});

});
