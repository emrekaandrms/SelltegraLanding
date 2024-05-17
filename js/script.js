"use strict";

/* variables */
const anim_ms = 250;

/* non-anonymous functions */
function openAside(aside_id) {
  let current_width = "25%";
  current_width = window.innerWidth > 1400 ? current_width : "50%";
  current_width = window.innerWidth > 992 ? current_width : "100%";

  if (window.innerWidth > 992 && window.innerWidth < 1400) {
    current_width = "40%";
  } else if (window.innerWidth > 578 && window.innerWidth < 992) {
    current_width = "60%";
  } else if (window.innerWidth < 578) {
    current_width = "100%";
  }

  $(aside_id).find("form").css("opacity", 1);

  $(aside_id).animate(
    {
      width: current_width,
      opacity: "1",
    },
    anim_ms * 2
  );

  // if we have a payment button
  $("#paymentButton").css("width", `calc(${current_width} - 2rem)`);

  // stop scrolling
  $("html").css("overflow", "hidden");
}

function closeAside(aside_id) {
  $(aside_id).find("form").css("opacity", 0);

  $(aside_id).animate(
    {
      width: "0",
      opacity: "0",
    },
    anim_ms * 2
  );

  // start scrolling again
  $("html").css("overflow", "initial");
}

$(function () {
  /* go top button */
  $("#gotop")
    .hide(0)
    .on("click", function () {
      $("html").scrollTop(0);
    });

  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 500) {
      $("#gotop").fadeIn(anim_ms);
    } else {
      $("#gotop").fadeOut(anim_ms);
    }
  });

  /* slide effects for dropdowns */
  $(".dropdown").on("show.bs.dropdown", function () {
    $(this).find(".dropdown-menu").stop(true, true).slideDown(anim_ms);
  });

  $(".dropdown").on("hide.bs.dropdown", function () {
    $(this).find(".dropdown-menu").stop(true, true).slideUp(anim_ms);
  });

  /* swipers */
  const swiper_options = {
    direction: "horizontal",
    loop: true,
    autoplay: window.innerWidth > 768 ? true : false,
    spaceBetween: 10,
    slidesPerView: 1,
    speed: 1500,
  };

  const swiper_breakpoints_5 = {
    breakpoints: {
      576: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 32,
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 32,
      },
    },
  };

  const swiper_breakpoints_4 = {
    breakpoints: {
      576: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 32,
      },
    },
  };

  const swiper_breakpoints_3 = {
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  };

  const headerSwiper = {
    ...swiper_options,
    autoplay: false,

    pagination: {
      el: "#headerSwiperPagination",
      clickable: true,
    },

    navigation: {
      nextEl: "#headerSwiperNext",
      prevEl: "#headerSwiperPrev",
    },
  };

  const advantageSwiper = {
    ...swiper_options,

    pagination: {
      clickable: true,
    },
    breakpoints: {
      576: {
        slidesPerView: "1",
        spaceBetween: 10,
      },
    },
  };

  const marketPlaceSwiper = {
    ...swiper_options,

    pagination: {
      clickable: true,
    },
    breakpoints: {
      576: {
        slidesPerView: "4",
        spaceBetween: 32,
      },
    },
  };

  if (window.innerWidth > 768) {
    // headerSwiper.autoplay = {
    //     delay: 5000
    // }
  }

  const productSwiper = {
    ...swiper_options,
    ...swiper_breakpoints_3,
    pagination: {
      el: "#productSwiperPagination",
      clickable: true,
    },
    navigation: {
      nextEl: "#productSwiperNext",
      prevEl: "#productSwiperPrev",
    },
  };

  const bestSellerSwiper = {
    ...swiper_options,
    ...swiper_breakpoints_4,
    pagination: {
      el: "#bestSellerSwiperPagination",
      clickable: true,
    },
    navigation: {
      nextEl: "#bestSellerSwiperNext",
      prevEl: "#bestSellerSwiperPrev",
    },
  };

  const productsVerticalSwiper = {
    ...swiper_options,
    navigation: {
      nextEl: "#productsVerticalSwiperNext",
      prevEl: "#productsVerticalSwiperPrev",
    },
    breakpoints: {
      576: {
        direction: "vertical",
        slidesPerView: "auto",
        spaceBetween: 32,
      },
    },
  };

  productsVerticalSwiper.slidesPerView = 2;

  const productDetailSwiper = {
    ...swiper_options,
    ...swiper_breakpoints_5,
  };

  productDetailSwiper.slidesPerView = 3;
  productDetailSwiper.breakpoints[576].slidesPerView = 3;

  const productDetailOtherSwiper = {
    ...swiper_options,
    ...swiper_breakpoints_4,
    pagination: {
      el: "#productDetailOtherSwiperPagination",
      clickable: true,
    },
    navigation: {
      nextEl: "#productDetailOtherSwiperNext",
      prevEl: "#productDetailOtherSwiperPrev",
    },
  };

  const productDetailOther2Swiper = {
    ...swiper_options,
    ...swiper_breakpoints_4,
    pagination: {
      el: "#productDetailOther2SwiperPagination",
      clickable: true,
    },
    navigation: {
      nextEl: "#productDetailOther2SwiperNext",
      prevEl: "#productDetailOther2SwiperPrev",
    },
  };

  new Swiper("#headerSwiper", headerSwiper);
  new Swiper("#productSwiper", productSwiper);
  new Swiper("#bestSellerSwiper", bestSellerSwiper);
  new Swiper("#productsVerticalSwiper", productsVerticalSwiper);
  new Swiper("#productDetailSwiper", productDetailSwiper);
  new Swiper("#productDetailOtherSwiper", productDetailOtherSwiper);
  new Swiper("#productDetailOther2Swiper", productDetailOther2Swiper);
  new Swiper("#advantageSwiper", advantageSwiper);
  new Swiper("#marketPlaceSwiper", marketPlaceSwiper);

  /* inputmasks */
  $("input[type='tel']").inputmask("+9{1,4} 999 999 99 99");

  /* password toggler */
  $("input ~ .fa").on("click", function () {
    let password_hidden = $(this).siblings("input").attr("type") === "password";
    if (password_hidden) {
      $(this).removeClass("fa-eye-slash").addClass("fa-eye");
      $(this).siblings("input").attr("type", "text");
    } else {
      $(this).removeClass("fa-eye").addClass("fa-eye-slash");
      $(this).siblings("input").attr("type", "password");
    }
  });

  /* bs5 tooltip */
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  /* increase decrease buttons */
  $(".btn-plus").on("click", function () {
    const input = $(this).data("target-input");
    const input_max = parseInt($(input).attr("max"));
    let input_val = parseInt($(input).val());

    // if increased data is greater than max attribute
    if (input_val + 1 > input_max) {
      $(this).val(input_max);
    } else {
      // increase value
      $(input).val(input_val + 1);
    }
  });

  $(".btn-minus").on("click", function () {
    const input = $(this).data("target-input");
    const input_min = parseInt($(input).attr("min"));
    let input_val = parseInt($(input).val());

    // if decreased data is less than min attribute
    if (input_val - 1 < input_min) {
      $(this).val(input_min);
    } else {
      // decrease value
      $(input).val(input_val - 1);
    }
  });

  /* like button */
  $(".btn-like").on("click", function () {
    const heartElement = $(this).find(".fa");
    if (heartElement.hasClass("fa-heart-o")) {
      heartElement.addClass("fa-heart").removeClass("fa-heart-o");
    } else {
      heartElement.removeClass("fa-heart").addClass("fa-heart-o");
    }
  });

  /* filter aside */
  $("#filterButton").on("click", function () {
    openAside("#filterAside");
  });

  $("#filterCloseButton").on("click", function () {
    closeAside("#filterAside");
  });

  /* basket aside */
  $(".basket-button").on("click", function () {
    openAside("#basketAside");
  });

  $("#basketCloseButton").on("click", function () {
    closeAside("#basketAside");
  });

  /* basket aside */
  $("#mobileSubNavbarButton").on("click", function () {
    openAside("#mobileSubNavbarAside");
  });

  $("#mobileSubNavbarClose").on("click", function () {
    closeAside("#mobileSubNavbarAside");
  });

  /* mobile account aside */
  $("#mobileAccountAsideButton").on("click", function () {
    openAside("#mobileAccountAside");
  });

  $("#mobileAccountAsideClose").on("click", function () {
    closeAside("#mobileAccountAside");
  });

  /* sorting buttons */
  const sorting_classes = [
    "row-cols-6",
    "row-cols-lg-4",
    "row-cols-md-4",
    "row-cols-sm-2",
    "row-cols-3",
    "row-cols-2",
    "row-cols-1",
  ];
  const sorting_default = "row-cols-lg-4 row-cols-sm-2 row-cols-1";
  const products_row = "#productsRow";

  $("#sixFold").on("change", function () {
    if ($(this).is(":checked")) {
      // remove all classes
      $(products_row).removeClass(sorting_classes);

      // hide big product image
      $(".products-big").css("display", "none");

      // hide card footer
      $(products_row).find(".card-footer").css("display", "none");

      // hide size selector
      $(products_row).find(".body-size").css("display", "none");

      // show detail button
      $(products_row).find(".btn-detail").css("display", "initial");

      // hide fourfold column but show another one as sixfold
      $(products_row).find(".products-fourfold").css("display", "none");
      $(products_row).find(".product-fold").css("display", "block");

      // add six folding
      $(products_row).addClass("row-cols-6");
    }
  });

  $("#fourFold").on("change", function () {
    if ($(this).is(":checked")) {
      // remove all classes
      $(products_row).removeClass(sorting_classes);

      // add needed classes
      $(products_row).addClass(sorting_default);

      // show big product image
      $(".products-big").css("display", "initial");

      // show card footer
      $(products_row).find(".card-footer").css("display", "block");

      // show size selector
      $(products_row).find(".body-size").removeAttr("style"); // this will remove style attribute within display: none

      // hide detail button
      $(products_row).find(".btn-detail").removeAttr("style");

      // show fourfold column but hide another sixfold
      $(products_row).find(".products-fourfold").css("display", "block");
      $(products_row).find(".product-fold").css("display", "none");
    }
  });

  $("#threeFold").on("change", function () {
    if ($(this).is(":checked")) {
      // remove all classes
      $(products_row).removeClass(sorting_classes);

      // hide big product image
      $(".products-big").css("display", "none");

      // hide fourfold column but show another one as sixfold
      $(products_row).find(".products-fourfold").css("display", "none");
      $(products_row).find(".product-fold").css("display", "block");

      // add three folding
      $(products_row).addClass("row-cols-3");

      // show card footer
      $(products_row).find(".card-footer").show(0);

      // show size selector
      $(products_row).find(".body-size").removeAttr("style");

      // hide detail button
      $(products_row).find(".btn-detail").removeAttr("style");
    }
  });

  $("#twoFold").on("change", function () {
    if ($(this).is(":checked")) {
      // remove all classes
      $(products_row).removeClass(sorting_classes);

      // hide big product image
      $(".products-big").css("display", "none");

      // hide fourfold column but show another one as sixfold
      $(products_row).find(".products-fourfold").css("display", "none");
      $(products_row).find(".product-fold").css("display", "block");

      // hide card footer
      $(products_row).find(".card-footer").css("display", "none");

      // hide size selector
      $(products_row).find(".body-size").css("display", "none");

      // show detail button
      $(products_row).find(".btn-detail").css("display", "initial");

      // add two folding
      $(products_row).addClass("row-cols-2");
    }
  });

  $("#oneFold").on("change", function () {
    if ($(this).is(":checked")) {
      // remove all classes
      $(products_row).removeClass(sorting_classes);

      // show big product image
      $(".products-big").css("display", "initial");

      // hide fourfold column but show another one as sixfold
      $(products_row).find(".products-fourfold").css("display", "none");
      $(products_row).find(".product-fold").css("display", "block");

      // show card footer
      $(products_row).find(".card-footer").show(0);

      // show size selector
      $(products_row).find(".body-size").removeAttr("style");

      // hide detail button
      $(products_row).find(".btn-detail").removeAttr("style");

      // add one folding
      $(products_row).addClass("row-cols-1");
    }
  });

  $(".one-fold-swiper").on("change", function () {
    if ($(this).is(":checked")) {
      const target_swiper = $(this).data("swiper-target");
      const swiper = $(target_swiper)[0].swiper;
      swiper.params.slidesPerView = 1;
      swiper.update();

      // show every section of body-size
      const body_size = $(target_swiper).find(".body-size");
      body_size.find(".card-header").show(0);
      body_size.find(".card-body").show(0);
    }
  });

  $(".two-fold-swiper").on("change", function () {
    if ($(this).is(":checked")) {
      const target_swiper = $(this).data("swiper-target");
      const swiper = $(target_swiper)[0].swiper;
      swiper.params.slidesPerView = 2;
      swiper.update();

      // show only "add to basket" button
      const body_size = $(target_swiper).find(".body-size");
      body_size.find(".card-header").hide(0);
      body_size.find(".card-body").hide(0);
    }
  });

  /* navbar on scroll listener */
  const navbar = $("#navbarContainer");

  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 120) {
      if (!$(navbar).hasClass("shadow")) {
        $(navbar).addClass("shadow");
      }
    } else {
      $(navbar).removeClass("shadow");
    }
  });

  /* email input listener */
  $("input[type='email']").on("input", function () {
    let input_content = $(this).val();
    $(this).val(input_content.toLocaleLowerCase());
  });

  /* min - max price listener */
  $("#minPrice").on("input", function () {
    let min_price = parseFloat($(this).val());
    $("#priceRange").data("ionRangeSlider").update({
      from: min_price,
    });
  });

  $("#maxPrice").on("input", function () {
    let max_price = parseFloat($(this).val());
    $("#priceRange").data("ionRangeSlider").update({
      to: max_price,
    });
  });
});

/* preloader */
$(window).on("load", () => {
  const Preload = new Promise((resolve, reject) => {
    const preloader = $("#preloader");
    if (preloader.length > 0) {
      preloader.fadeOut(anim_ms);
      resolve("ok");
    } else {
      reject("Preloader not found!");
    }
  });

  Preload.then((value) => {
    if (value == "ok") {
      $("html").css("overflow", "auto");
    }
  }).catch((reason) => {
    alert("Error: " + reason.toString());
  });
});

function videoStop(id) {
  document.getElementById("video" + id + "Banner").style.display = "block";
  /*document.getElementById("video"+id+"Btn").style.display="block";*/
  if (id == 1) {
    player1.pauseVideo();
  } else if (id == 2) {
    player2.pauseVideo();
  }
}

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player1;

function playVideoPopup(ytlink) {
  document.getElementById("popup-1").style.display = "block";
  if (document.getElementById("popupVideo")) {
    player1 = new YT.Player("popupVideo", {
      height: "100%",
      width: "100%",
      videoId: ytlink,
      playerVars: {
        playsinline: 1,
      },
      events: {
        onStateChange: onPlayerStateChange1,
      },
    });
  }
}

function onPlayerStateChange1(event) {
  if (event.data == 2) {
    var fark1 = parseInt(player1.getCurrentTime()) - parseInt(player1Time);
    if (fark1 > 3 || fark1 < -3) {
    } else {
      videoStop(1);
    }
  }
}

var player1Time = 0;

function videoStop(id) {
  document.getElementById("video" + id + "Banner").style.display = "block";
  /*document.getElementById("video"+id+"Btn").style.display="block";*/
  if (id == 1) {
    player1.pauseVideo();
  }
}

function popupClose(id) {
  document.getElementById(id).style.display = "none";
  player1.destroy();
}
