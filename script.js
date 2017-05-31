var game = {
   isOn: false,
   strict: false,
   level: 1,
   sections: ["section-1", "section-2", "section-3", "section-4"],
   combo: [],
   playerCombo: [],
   isPlayerTurn: false,
   speed: 500,
   waitTime: 8000 //1000 = 1 second
};
var waitForResponse;

var maxWidth  = $('.wrapper').width();
var maxHeight = $('.wrapper').height();


function resize() {
   var $window = $(window);
   var width = $window.width();
   var height = $window.height();
   var scale;

   // early exit
   if(width >= maxWidth && height >= maxHeight) {
      $('.wrapper').css({'-webkit-transform': '', '-moz-transform': '', 'transform': ''});
      $('#wrap').css({ width: '700px', height: '700px' , margin: '20px auto'});
      return;
   } else {
      scale = Math.min(width/maxWidth, height/maxHeight);
      $('.wrapper').css({'-webkit-transform': 'scale(' + scale + ')', '-moz-transform': 'scale(' + scale + ')', 'transform': 'scale(' + scale + ')'});
      $('#wrap').css({ width: maxWidth * scale, height: maxHeight * scale, margin: 0 });
   }
}


function playLevel() {
   var level = game.level;
   game.isPlayerTurn = false;
   
   clearInterval(waitForResponse);
   
   if (level > 12) {
      game.speed = 300;
   } else if (level > 6) {
      game.speed = 400;
   }
   
   if (level <= 20) {
      $("#msg").fadeOut(1000);
      $(".level").html(level < 10 ? "0" + level : level); //display current level
      var i = 0, y = 0, length = game.combo.length;

      playCombo = setInterval(function() {
         if (i === 0 || i % 2 === 0) {
            if (i !== 0) {
               $("." + game.combo[y - 1]).toggleClass(game.combo[y - 1] + "-active");
            }
         } else {
            $("." + game.combo[y]).toggleClass(game.combo[y] + "-active");
            $("#" + game.combo[y])[0].play();
            y += 1;
         }
         if (i === length * 2) {
            clearInterval(playCombo);
            game.isPlayerTurn = true;
            var waitTime = game.waitTime;
            waitForResponse = setInterval(function() {
               if (waitTime <= 0) {
                  clearInterval(waitForResponse);
                  playLevel();
               } else if (waitTime <= 600) {
                  playAllSounds();
               }
               waitTime -= 500;
            }, 500);
         }
         i += 1;
      }, game.speed);
   } else {
      var blink = 1;
     $("#msg").hide(0).html("Congratulations you WON!").fadeIn(1000);
      win = setInterval(function() {
         if (blink % 2 > 0) {
            $("#section-1")[0].play();
            $(".level").html("WIN");
         } else {
            $("#section-2")[0].play();
            $(".level").html("=)");
         }
         blink += 1;
      }, 700);
   }
}


function newCombo() {
   var level = game.level;
   var c = game.sections[Math.floor(Math.random() * 4)];
   game.combo.push(c);
}


function playAllSounds() {
   $("#section-1")[0].play();
   $("#section-2")[0].play();
   $("#section-3")[0].play();
   $("#section-4")[0].play();
}


function stopTimers() {
   for (var i = 1; i < 99999; i++) {
      window.clearInterval(i);
   }
}


$(document).ready(function() {
   resize();
   $(window).resize(resize);
  
   $("#msg").hide(0).html("Welcome to Simon Game!").fadeIn(1000);
   $("#msg").delay(3000).fadeOut(1000);
   
   $(".switcher").click(function() {
      var align;
      if (game.isOn) {
         stopTimers();
         
         align = "left";
         game.isOn = false;
         game.level = 1;
         $(".level").css("color", "#710909");
         $(".level").html("––");
         game.strict = false;
         $(".led").css("background-color", "#000");
         game.playerCombo = [];
         game.combo = [];
         $(".section-1").attr("class", "section section-1");
         $(".section-2").attr("class", "section section-2");
         $(".section-3").attr("class", "section section-3");
         $(".section-4").attr("class", "section section-4");
      } else {
         align = "right";
         game.isOn = true;
         $(".level").css("color", "#d00101");
      }
      $(this).css("text-align", align);
   });
   
   
   $(".strict").click(function() {
      if (game.isOn) {
         var color;
         if (game.strict) {
            color = "#000";
            game.strict = false;
         } else {
            color = "#00D326";
            game.strict = true;
         }
         $(".led").css("background-color", color);
      }
   });
   
   
   $(".start").click(function() {
     if (game.isOn) {
       $("#msg").fadeOut(1000);
        stopTimers();
        game.playerCombo = [];
        game.combo = [];
        game.level = 1;
        $(".section-1").attr("class", "section section-1");
        $(".section-2").attr("class", "section section-2");
        $(".section-3").attr("class", "section section-3");
        $(".section-4").attr("class", "section section-4");
        newCombo();
        playLevel();
     }
     else{
       $("#msg").hide(0).html("The game is not turned ON!").fadeIn(1000);
     }
   });
   
   $(".section").mousedown(function() {
      var clicked = $(this).attr("class").split(" ")[1];
      if (game.isPlayerTurn) {
         $("." + clicked).toggleClass(clicked + "-active");
         $("#" + clicked)[0].play();
      }
   });
   
   
   $(".section").mouseup(function() {
      var clicked = $(this).attr("class").split(" ")[1];
      if (game.isPlayerTurn) {
         $("." + clicked).toggleClass(clicked + "-active");
      }
   });
   
   
   
   
   $(".section").click(function() {
      var clicked = $(this).attr("class").split(" ")[1];
      clearInterval(waitForResponse);
      var waitTime = game.waitTime;
      waitForResponse = setInterval(function() {
         if (waitTime <= 0) {
            clearInterval(waitForResponse);
            playLevel();
         } else if (waitTime <= 600) {
            playAllSounds();
         }
         waitTime -= 500;
      }, 500);
      
      if (game.isPlayerTurn) {
         game.playerCombo.push(clicked);
         var goal = game.combo[game.playerCombo.length - 1];
         console.log(game.playerCombo.length + " " + game.combo.length);
         if (clicked === goal && game.playerCombo.length === game.combo.length) {
            clearInterval(waitForResponse);
            game.playerCombo = [];
            game.level += 1;
            newCombo(); 
            playLevel();
            
         } else if (clicked !== goal) {
            playAllSounds();
            
            $(".section-1").attr("class", "section section-1 section-1-active");
            $(".section-2").attr("class", "section section-2 section-2-active");
            $(".section-3").attr("class", "section section-3 section-3-active");
            $(".section-4").attr("class", "section section-4 section-4-active");
            
            var end = false;
            wrongTurn = setInterval(function() {
               if (end) {
                  $(".section-1").attr("class", "section section-1");
                  $(".section-2").attr("class", "section section-2");
                  $(".section-3").attr("class", "section section-3");
                  $(".section-4").attr("class", "section section-4");
                  clearInterval(wrongTurn);
                  if (game.strict) {
                     game.level = 1;
                     game.combo = [];
                     newCombo();
                  }
                  playLevel();
               }
               end = true;
            }, 1000);
            
            game.playerCombo = [];
            game.isPlayerTurn = false;
            //console.log("false");
         }  
      }
   }); 
});