//A snippet for loading scripts dynamically
  this.loadProgrammingScript = function (){
    var scriptElements = document.getElementsByTagName('script');
    var visualEngineScriptElement;
    for (var i = 0; i < scriptElements.length; i++){
      if (scriptElements[i].getAttribute('src') == 'visualengine.js'){
        visualEngineScriptElement = scriptElements[i];
      }
    }

    var filesToLoad = ['programming.js', 'commandqueue.js', 'command.js'];

    var parentElement = visualEngineScriptElement.parentNode;
    var scriptToInsert;

    var previouslyInsertedScript = visualEngineScriptElement;
    for (var i = 0; i < filesToLoad.length; i++){
      scriptToInsert = document.createElement('script');
      scriptToInsert.setAttribute('async','false');
      scriptToInsert.setAttribute('type', 'text/javascript');
      scriptToInsert.setAttribute('src', filesToLoad[i]);

      parentElement.insertBefore(scriptToInsert,previouslyInsertedScript);
      previouslyInsertedScript = scriptToInsert;
    }
  }

