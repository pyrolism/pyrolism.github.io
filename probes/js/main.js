// remap jQuery to $
(function ($) {

    /* trigger when page is ready */
    $(document).ready(function () {

        // your functions go here
        $('.name-field').click(function () {
            $(this).addClass("active");
            $(this).attr('placeholder', 'Enter Your Name...');
        });

    });

})(window.jQuery);

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#profilePic')
                .attr('src', e.target.result)
                .width(200)
                .height(200);
        };

        reader.readAsDataURL(input.files[0]);
    }
}