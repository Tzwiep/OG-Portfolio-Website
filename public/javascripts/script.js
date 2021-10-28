
$(function(){
// create regexp to match current url pathname and remove trailing slash if present
// as it could collide with the link in navigation in case trailing slash wasn't present there
    var url = window.location.pathname,
        urlRegExp = new RegExp(url == '/' ? window.location.origin + '/?$' : url.replace(/\/$/,''));
    // now grab every link from the navigation
    $('.btn-group a').each(function(){
        // and test its normalized href against the url pathname regexp
        if(urlRegExp.test(this.href.replace(/\/$/,''))){
            $(this).addClass('active');
        }
    });
});

$(function(){
    $('#aniB').AniView({
        animateClass: 'animate__animated',
        animateThreshold: 30
    });
    $('#aniC').AniView({
        animateClass: 'animate__animated',
        animateThreshold: 30
    });
    $('#aniD').AniView({
        animateClass: 'animate__animated',
        animateThreshold: 20
    });
    $('#aniE').AniView({
        animateClass: 'animate__animated',
        animateThreshold: 30
    });
    $('#aniF').AniView({
        animateClass: 'animate__animated'
    });
});