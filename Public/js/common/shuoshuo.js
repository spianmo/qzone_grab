jQuery(document).ready(function () {

    Metronic.init(); // init metronic core componets
    Layout.init(); // init layout
    Demo.init(); // init demo features
    //元素固定
    $('.pinconsole').pin();
    $('.pinshuoshuo ').pin();
    //好友列表
    $(".myfriend").select2()
    $(".myfriend").change(function () {
        //$(".well").hide(1000)
        val = $(this).val();
        $("#friendQq").val(val)
        $("#friendQq").attr("readonly","readonly")
    })
    //选择好友
    $(".findfriend").click(function(){
        var btn = $(this)
        btn.button('loading')
        //校验合法性
        var uqq = $("#friendQq").val();
        if(!uqq){
            layer.msg('请先选择好友',function(){$(".findfriend").button('reset')});
            return false;
        }
        $("#iframe").attr("src","/home/console/getshuoshuoall?uqq="+uqq+"&r="+new Date().getTime())
    })

});

//初始参数
var lodingSsOver = false;
function lodingSs(){
    lodingSsOver = true;
}
//获取说说
function getShuoshuo(uin){
    if(!lodingSsOver){
        return false
    }
    $(".scroller").html("")
    //加载拉取状态
    Metronic.blockUI({
        target: '.scroller',
        boxed: true
    });
    $.ajax({
        "url":"/home/home/showShuoshuoList",
        "dataType":"json",
        "type":"post",
        "data":{uin:uin},
        "success":function(d){
            var html = "";
            $.each(d,function(n,v) {
                //拼接说说评论与回复
                var user = v.user.realname?v.user.realname:v.user.nickname;
                html+="<div class='media'> <a href='#' class='pull-left'><img alt='' src='http://q.qlogo.cn/headimg_dl?bs=qq&dst_uin="+ v.user.uin+"&src_uin=www.xietaotao.cn&fid=blog&spec=100'style='width: 50px;height: 50px' class='media-object img-circle'></a><div class='media-body'><h6 class='media-heading'>"+user+"<span>&nbsp&nbsp"+ v.timeline+"</span></h6><h4>"+ v.summary+"</h4><div class='clearfix'><span class='btn'><i class='fa  fa-comments-o'></i>评论("+ v.cntnum+")</span><span class='btn'><i class='fa fa-thumbs-o-up'></i>("+ v.likenum+")</span></div>";

                if(v.likenum>0){
                    html+="<div class='clearfix'><span class='btn'><i class='fa fa-thumbs-up'></i>"
                    $.each(v.likemansArr,function(n2,v2) {
                        html+=v2+","
                    })
                    if(v.likemansAndNum){
                        html+="等"+v.likemansAndNum+"人觉得很赞"
                    }
                }
                html+="</span></div><hr/>";
                if(v.comment){
                    $.each(v.comment,function(n3,v3){
                        var user = v3.user.realname?v3.user.realname:v3.user.nickname
                        html+="<div class='media'><a href='#' class='pull-left'><img alt=''src='http://q.qlogo.cn/headimg_dl?bs=qq&dst_uin="+ v3.user.qq+"&src_uin=www.xietaotao.cn&fid=blog&spec=100' style='width: 50px;height: 50px' class='media-object img-circle'></a><div class='media-body'><h6 class='media-heading'>"+user+"<span>&nbsp&nbsp"+v3.date+" / <a href='javascript:;' onclick='comment(this)'>评论 </a> </span></h6><h4>"+v3.content+"</h4></div></div>";
                        if(v3.replys){
                            $.each(v3.replys,function(n4,v4){
                                var user = v4.user.realname?v4.user.realname:v4.user.nickname
                                html+="<div class='media'><a href='#' class='pull-left'><img alt='' src='http://q.qlogo.cn/headimg_dl?bs=qq&dst_uin="+ v4.user.qq+"&src_uin=www.xietaotao.cn&fid=blog&spec=100' style='width: 50px;height: 50px' class='media-object img-circle'></a><div class='media-body'><h6 class='media-heading'>"+user+"<span>&nbsp&nbsp"+v4.date+" / <a href='javascript:;' onclick='comment(this)'>评论 </a> </span></h6><h4>回复:"+v4.content+"</h4></div></div>";

                            })
                        }

                    })
                }
                html +="<div class='chat-form'><div class='input-cont'><input class='form-control' type='text' placeholder='我也说一句'/></div><div class='btn-cont'><span class='arrow'></span><a href='' class='btn blue icn-only'><i class='fa fa-check icon-white'></i></a></div></div></div></div>";
                $(".scroller").html(html)
            });

        }
    })
    //还原状态
    $(".findfriend").button('reset')
    Metronic.unblockUI('.scroller');
}

function closeComment(z){

    layer.confirm('你要关闭评论吗？', {
        btn: ['是','否'] //按钮
    }, function(index){
        f =  $(z).parent().parent().parent()
        f.find(".reComment").remove()
        $(z).attr("ison",false)
        layer.close(index)
    }, function(index){
        layer.close(index)
    });
}

//回复其它好友评论
function comment(z){
    if($(z).attr("ison") && $(z).attr("ison")!="undefined"){
        closeComment(z)
    }
    //加载回复评论区域  隐藏主评论区域
    tpl = "<div class='input-group input-medium reComment'><input type='text' class='form-control' placeholder='输入...'><span class='input-group-btn'><button class='btn  blue' type='button'>回复</button></span></div>";
    f =  $(z).parent().parent().parent()
    f.find(".reComment").remove()
    f.append(tpl);
    $(z).attr("ison",true)

}















