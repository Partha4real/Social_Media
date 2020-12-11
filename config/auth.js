exports.isUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error_msg', 'Please login!')
        res.redirect('/');
    }
}
