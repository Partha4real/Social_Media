
$(function() {

    // text editor
    if($('textarea#editor').length) {
        CKEDITOR.replace('editor'); 
    }

    // confirm Deletion
    // $('a.confirmDelete').on('click', function() {
    //     if(!confirm('Confirm deletion'))
    //         return false;
    // });
});
