The visual engine is a collection of files that are used to render a 3-dimensional mathematical plot on a 2d computer screen.

To use it, put the line:
<script type='text/javascript' src='visualengine.js' ></script>

Then, after that, you can put in the lines:
<script type='text/javascript'>
    var visualEngine = new VisualEngine();
    visualEngine.open();
</script>

When you call the open function without any parameters, a new window opens up.
