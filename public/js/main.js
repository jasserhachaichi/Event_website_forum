(function($) { 
    "use strict";
     $('.review-slider').slick({
         infinite: true,
         slidesToShow: 1,
         slidesToScroll: 1,
         arrows: false,
         dots: false,
         rows: 0,
         autoplay: true,
         speed: 4000,
         loop: true,
         responsive: [{
             breakpoint: 991,
             settings: {
                 slidesToShow: 1,
                 arrows: false,
             }
         }]
     });
     $('.value_Counter').counterUp({
        delay: 10,
        time: 1000,
        formatter: function (n) {
            return n.replace(n, '+' + n);
          }
    });
     $('.selector4').animatedHeadline({
         animationType: 'rotate-3'
     });
     
 $("#owl-demo").owlCarousel({
   navigation: true,
   stagePadding: 2,
   itemsCustom : [
    [0, 1],
    [570, 2],
    [1000, 3],
    [1300, 4],
  ]

      ,
   navigationText: [
     '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path  d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="var(--color-white)" d="M7.94 13.06a1.5 1.5 0 0 1 0-2.12l5.656-5.658a1.5 1.5 0 1 1 2.121 2.122L11.121 12l4.596 4.596a1.5 1.5 0 1 1-2.12 2.122L7.938 13.06Z"/></g></svg>',
     '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="var(--color-white)" d="M16.06 10.94a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 1 1-2.121-2.122L12.879 12L8.283 7.404a1.5 1.5 0 0 1 2.12-2.122l5.658 5.657Z"/></g></svg>'
     ],


 });

 }
 )(jQuery);

 