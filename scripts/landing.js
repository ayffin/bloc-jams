  var pointsArray = document.getElementsByClassName('point');
  var animatePoints = function(points) {
    var revealPoint = function(index) {

      index.style.opacity = 1;
      index.style.transform = "scaleX(1) translateY(0)";
      index.style.msTransform = "scaleX(1) translateY(0)";
      index.style.WebkitTransform = "scaleX(1) translateY(0)";

    };

    forEach(points, revealPoint);


  };

  window.onload = function() {
    // automatically animate the point on a tall screen when scolling can't trigger the animation
    if (window.innerHeight > 950) {
      animatePoints(pointsArray);
    }
    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight +
      200;

    window.addEventListener('scroll', function(event) {
      if (document.documentElement.scrollTop || document.body.scrollTop >=
        scrollDistance) {
        animatePoints(pointsArray);
      }
    });
  };
