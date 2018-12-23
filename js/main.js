/* Image LightBox*/

document.onkeydown = function(event) {
  var e = event || window.event || arguments.callee.caller.arguments[0];
  if (e && e.keyCode == 37) {
    plusSlides(-1);
  }
  if (e && e.keyCode == 39) {
    plusSlides(1);
  }
};

// Open the Modal
function openModal() {
  document.getElementById("myModal").style.display = "block";
}

// Close the Modal

$(document).ready(function() {
  $(".close").click(function() {
    $("#myModal").fadeOut(300);
  });
});

var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides((slideIndex += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";
}
