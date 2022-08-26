const TuvalSettings = {
    print: (function() {

        return function(text) {
          if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
          // These replacements are necessary if you render to raw HTML
          //text = text.replace(/&/g, "&amp;");
          //text = text.replace(/</g, "&lt;");
          //text = text.replace(/>/g, "&gt;");
          //text = text.replace('\n', '<br>', 'g');
          console.log(text);
          var element = document.getElementById('output');
         // if (element) element.value = ''; // clear browser cache
          if (element) {
            element.value += text;
            element.scrollTop = element.scrollHeight; // focus on bottom
          }
        };
      })()/* ,
      printl: (function() {
        return function(text) {
          if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
          console.log(text);
          var element = document.getElementById('output');
          if (element) {
            element.value += text + "\n";
            element.scrollTop = element.scrollHeight; // focus on bottom
          }
        };
      })(), */

}