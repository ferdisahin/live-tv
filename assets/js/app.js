// Config.json'ı çektik

$.getJSON( "assets/data/config.json", function(data){
    // Logoya Site Adını Aktardık
    $('#header .logo').html(data['siteName']);

    // Metayı Head Alanına Ekledik
    $('head').append('<meta name="description" content="'+data['meta']['desc']+'"/>');

    // Site Başlığını Değiştirdik
    document.title = data['siteName'] + ' - ' + data['siteDesc'];

    // Telif Hakkı Yazımızı Ekledik
    $('#footer .copyright').html(data['copyright']);
});

// Başlık Fonksiyon
function getTitle(name){
    $.getJSON( "assets/data/config.json", function(data){
        // Site Başlığını Değiştirdik
        document.title = data['siteName'] + ' - ' + data['siteDesc'];

        if(name){
            document.title =  name + ' - ' + data['siteName'];
        }
    });    
}

// URL Son Eleman Fonksiyon
function getLastChild(){
    var Location = window.location.href;
    var BL = Location.split(/[\s/]+/);
    return LE = BL[BL.length-1];    
}

// Kategori Elemanı Fonksiyon
function getCategoryChild(){
    $('.menu .nav-link').each(function(){
        var a = $(this).attr('href');
        var b = a.split(/[\s/]+/);
        var c = b[b.length-1];
        
        if(c == getLastChild()){
            $(this).addClass('active');
        }else{
            $(this).removeClass('active');
        }
    });
}

// Kanal Fonksiyon
function getChannel(){
    $.getJSON('assets/data/channel.json', function(data){
        var items = [];
        $.each( data, function( key, val ) {
          items.push( "<div class='col-12 col-md-2'><a href='#!/kanal/"+val['channelSlug']+"' class='channel' data-navigo>"+val['channelName']+"</a></div>" );
        });
    
        $('.channel-list').html(items);
    });
}

function getListChannel(){
    $.getJSON('assets/data/channel.json', function(data){
        var items = [];
        
        $.each(data, function(key, val){
            items.push( "<div class='col-12 col-md-6'><a href='#!/kanal/"+val['channelSlug']+"' class='channel' data-navigo>"+val['channelName']+"</a></div>" );
        });

        if (items.length > 4) items.length = 10;

        $('.channel-inside-list .row').html(items);
    });
}

// Kanal İçerik Fonksiyon
function getChannelContent(){
    $.getJSON('assets/data/channel.json', function(data){
        var item = [];
        var channel = $.each(data,function(key,val){
            if(val['channelSlug'] == getLastChild()){
               item.push('<iframe style="width:100%; height: 400px;" width="560" height="315" src="https://www.youtube.com/embed/'+val['channelYT']+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
               getTitle(val['channelName']);
            }
            $('.channel-player').html(item);
        });
    });
}

// Kategori İçerik Fonksiyon
function getCategoryContent(){
    $.getJSON('assets/data/channel.json', function(data){
        var items = [];
        var list = $.each(data, function(key, val){
            if(val['channelCat'] == getLastChild()){
                items.push( "<div class='col-12 col-md-2'><a href='#!/kanal/"+val['channelSlug']+"' class='channel' data-navigo>"+val['channelName']+"</a></div>" );
            }

            var catTitle = getLastChild();
            var catTitleC = catTitle.charAt(0).toUpperCase() + catTitle.slice(1);
            getTitle(catTitleC);

            $('.channel-list').html(items);

            if( $('.channel-list').is(':empty') ) {
                $('.channel-list').html('<p class="col-12 text-center empty">Bu kategoriye henüz içerik eklenmemiş!</p>');
            }
        });
        
    });
}

// Arama Fonksiyon
$(function(){
    $('#main .container').prepend('<div class="no-content text-center" style="display: none">Arama sonucuna uygun kanal bulunamadı!</div>');
})
$("#search").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#main .channel-list .col-md-2").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);   
    });

    if($('#main .channel-list > .col-md-2:visible').length == 0){
        $('#main .no-content').show();
    }else{
        $('#main .no-content').hide();
    }
});

// Router
var router = new Navigo(null, true, '#!');
router.on(
    '/kategori/:id',
    function () {
        getCategoryContent();
        getCategoryChild();
    },
    {
      leave: function (params) {
        $('.menu .nav-link').removeClass('active');
        $('#main .no-content').hide();
      }
    }
);

router.on(
    '/kanal/:id',
    function () {
        $('#main .row').html('<div class="col-12 col-md-8 channel-player"></div><div class="col-12 col-md-4 channel-inside-list"><div class="row"></div></div>');
       getChannelContent();
       getListChannel();
       $('#header .search-form').hide();
    },
    {
      leave: function (params) {
        $('#header .search-form').show();
      }
    }
);

router.on({
    '*': function () {
        getChannel();
        getTitle();
    },

  })
  .resolve();
