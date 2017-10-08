jQuery(document).ready(function () {

    // Gallery
    var ugGallery = $('.ug-gallery');

    if (ugGallery.length > 0) {

        ugGallery.unitegallery({
            gallery_theme: 'grid',
            grid_num_cols: 1,
            theme_panel_position: 'right',
            thumb_width: 60,
            thumb_height: 30,
            slider_enable_zoom_panel: false,
            slider_control_zoom: false
        });

        ugGallery.css('display', 'block');
    }

    // temporary workaround for invisible recapcha
    $('.g-recaptcha').on('click', function () {

        if (window.recapchaResolved) {

            window[$(this).data('callback')]();
        }
    });
});

function signInFormSubmitRecapcha() {

    formSubmitRecapcha('#sign-in-form');
}

function signUpFormSubmitRecapcha() {

    formSubmitRecapcha('#sign-up-form');
}

function CreateObjectSubmitRecapcha() {

    formSubmitRecapcha('#create-object-form');
}

function formSubmitRecapcha(formId) {

    window.recapchaResolved = true;

    setTimeout(function () {

        var form        = $(formId);
        var submitInput = form.find('input[type=submit]');

        if (submitInput.length === 0) {

            submitInput = $('<input type="submit">').hide().appendTo(form);
        }

        submitInput.click();

    }, 500);
}