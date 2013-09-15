
# jquery-transition.js (working)

$.fn.transition() like $.fn.animate()

## Features

- Calls $.fn.animate() if css3 transition is not supported
- Supports more easing functions with [jquery-easing](http://gsgd.co.uk/sandbox/jquery/easing/)

## Usage

```javascript
$(el).transition(
    { /* styles */ },
    {
        delay: 0,
        duration: 1000,
        easing: "ease",
        complete: function(){
            console.log("transition done");
        }
    }
);
```

## Options

- delay:Integer (0) - Delay time for animation
- duration:Integer (500) - Duration time for animation
- easing:String ("ease-in") - Easing function name for CSS3 Transition
- complete:Function ($.noop) - Callback function


## Author

mach3 @ http://github.com/mach3