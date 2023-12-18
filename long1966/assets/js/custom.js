$(document).ready(function(){
	"use strict";
    


    // 1. scroll-Top
		$(window).on('scroll',function () {
			if ($(this).scrollTop() > 900) {
				$('.run-top').fadeIn();
			} else {
				$('.run-top').fadeOut();
			}
		});
		$('.run-top').on('click',function(){
				$('html, body').animate({
				scrollTop: 0
			}, 500);
			return false;
		});
	
	
	
	// 2. Smooth Scroll Menu
		
		$('.header-area').sticky({
           topSpacing:0
        });

		$('li.smooth-menu a').bind("click", function(event) {
			event.preventDefault();
			var anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $(anchor.attr('href')).offset().top - 0
			}, 300,'easeInOutExpo');
		});
		
		$('body').scrollspy({
			target:'.navbar-collapse',
			offset:0
		});

	// 3. Progress-bar 
	
		var dataToggleTooTip = $('[data-toggle="tooltip"]');
		var progressBar = $(".progress-bar");
		if (progressBar.length) {
			progressBar.appear(function () {
				dataToggleTooTip.tooltip({
					trigger: 'manual'
				}).tooltip('show');
				progressBar.each(function () {
					var each_bar_width = $(this).attr('aria-valuenow');
					$(this).width(each_bar_width + '%');
				});
			});
		}
	

	

    // 5. welcome animation title

        $(window).load(function(){
        	$(".header-text h2,.header-text p").removeClass("animated fadeInUp").css({'opacity':'3'});
            $(".header-text a").removeClass("animated fadeInDown").css({'opacity':'3'});
        });

        $(window).load(function(){
        	$(".header-text h2,.header-text p").addClass("animated fadeInUp").css({'opacity':'0'});
            $(".header-text a").addClass("animated fadeInDown").css({'opacity':'0'});
        });

});	
	