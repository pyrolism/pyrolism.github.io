/*
$ = function (id) {
    return document.getElementById(id);
}

var show = function (id) {
    $(id).style.display = 'block';
}
var hide = function (id) {
    $(id).style.display = 'none';
}
*/



function show(id) {
    document.getElementById(id).style.display = 'block';
}

function hide(id) {
    document.getElementById(id).style.display = 'none';
}

function showValue() {
    var name = document.getElementById('inp').value;
    document.getElementById('textProfile').innerHTML = name;
}

function showValue2() {
    var name = document.getElementById('inp2').value;
    document.getElementById('textProfile2').innerHTML = name;
}


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

/*
function readURL(input) {
    var file = input.files[0];
    var fileList = input.files;
    var reader = new FileReader();

    reader.onload = function (e) {
        $('#profilePic')
            .attr('src', e.target.result);
    };

    reader.readAsDataURL(file);
    console.log(fileList);
}

function readImage1(input) {

    var file = input.files[0];
    var fileList = input.files;
    var reader = new FileReader();

    reader.onload = function (e) {
        $('#item1Pic')
            .attr('src', e.target.result);
    };

    reader.readAsDataURL(file);

    console.log(fileList);
}
*/

//点击
var clickImg = function (obj) {
    $(obj).parent().find('.upload_input').click();
}
//删除
var deleteImg = function (obj) {
    $(obj).parent().find('input').val('');
    $(obj).parent().find('img.preview').attr("src", "");
    //IE9以下
    $(obj).parent().find('img.preview').css("filter", "");
    $(obj).hide();
    $(obj).parent().find('.addImg').show();
}
//选择图片
function change(file) {
    //预览
    var pic = $(file).parent().find(".addImg");
    //添加按钮
    var addImg = $(file).parent().find(".preview");
    //删除按钮
    var deleteImg = $(file).parent().find(".delete");

    var ext = file.value.substring(file.value.lastIndexOf(".") + 1).toLowerCase();

    // gif在IE浏览器暂时无法显示
    if (ext != 'png' && ext != 'jpg' && ext != 'jpeg') {
        if (ext != '') {
            alert("图片的格式必须为png或者jpg或者jpeg格式！");
        }
        return;
    }
    //判断IE版本
    var isIE = navigator.userAgent.match(/MSIE/) != null,
        isIE6 = navigator.userAgent.match(/MSIE 6.0/) != null;
    isIE10 = navigator.userAgent.match(/MSIE 10.0/) != null;
    if (isIE && !isIE10) {
        file.select();
        var reallocalpath = document.selection.createRange().text;
        // IE6浏览器设置img的src为本地路径可以直接显示图片
        if (isIE6) {
            pic.attr("src", reallocalpath);
        } else {
            // 非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现             
            pic.css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=\"" + reallocalpath + "\")");
            // 设置img的src为base64编码的透明图片 取消显示浏览器默认图片
            pic.attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
        }
        addImg.hide();
        deleteImg.show();
    } else {
        html5Reader(file, pic, addImg, deleteImg);
    }
}
//H5渲染
function html5Reader(file, pic, addImg, deleteImg) {
    var file = file.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        pic.attr("src", this.result);
    }
    addImg.hide();
    deleteImg.show();
}

function girlAvatar() {
    document.getElementById("girlAvatarOn").style.display = 'inline';
    document.getElementById("girlAvatarOff").style.display = 'none';
    document.getElementById("boyAvatarOn").style.display = 'none';
    document.getElementById("boyAvatarOff").style.display = 'inline';
    document.getElementById("offlineAvatarOn").style.display = 'none';
    document.getElementById("offlineAvatarOff").style.display = 'inline';

    document.getElementById("onlineSelf").style.display = 'inline';
    document.getElementById("offlineSelf").style.display = 'none';


    document.getElementById("hamburger").classList.toggle("change");
    $(".selectAvatar").hide();
};

function boyAvatar() {
    document.getElementById("girlAvatarOn").style.display = 'none';
    document.getElementById("girlAvatarOff").style.display = 'inline';
    document.getElementById("boyAvatarOn").style.display = 'inline';
    document.getElementById("boyAvatarOff").style.display = 'none';
    document.getElementById("offlineAvatarOn").style.display = 'none';
    document.getElementById("offlineAvatarOff").style.display = 'inline';

    document.getElementById("onlineSelf").style.display = 'inline';
    document.getElementById("offlineSelf").style.display = 'none';


    document.getElementById("hamburger").classList.toggle("change");
    $(".selectAvatar").hide();
};

function offlineAvatar() {
    document.getElementById("girlAvatarOn").style.display = 'none';
    document.getElementById("girlAvatarOff").style.display = 'inline';
    document.getElementById("boyAvatarOn").style.display = 'none';
    document.getElementById("boyAvatarOff").style.display = 'inline';
    document.getElementById("offlineAvatarOn").style.display = 'inline';
    document.getElementById("offlineAvatarOff").style.display = 'none';


    document.getElementById("onlineSelf").style.display = 'none';
    document.getElementById("offlineSelf").style.display = 'inline';

    document.getElementById("hamburger").classList.toggle("change");
    $(".selectAvatar").hide();
    //$('.bottomNav').css("background-color", "#333639");
};


$(function () {
    $(window).bind("scroll", function () {
        var sTop = $(window).scrollTop();
        var sTop = parseInt(sTop);
        if (sTop >= 700) {
            if (!$(".bottomNav").is(":visible")) {
                try {
                    $(".bottomNav").slideDown();
                } catch (e) {
                    $(".bottomNav").show();
                }
            }
        } else {
            if ($(".bottomNav").is(":visible")) {
                try {
                    $(".bottomNav").slideUp();
                } catch (e) {
                    $(".bottomNav").hide();
                }
            }
        }
    });
})