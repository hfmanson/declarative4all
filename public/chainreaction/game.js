const
  xqeval = async function(xmldoc, xexpr, node, env) {
    try {
      return await xmldoc.evaluate(xexpr, node, env)
    } catch(e) {
    }
  }
  , myfetch = async (url) => {
    const
      response = await fetch(url)
	  ;
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }	  
	return response.text()
  }
  , getQueryVariable = (variable, defval) => {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
	return decodeURIComponent(defval);
  }
  ;

addEventListener("load", async () => {
  try {	
    const
	  domparser = new DOMParser()
	  , level = await myfetch(getQueryVariable("level", "chain-level1.xml"))
	  , xmldoc = domparser.parseFromString(level, "application/xml")
	  , xquery = await myfetch("chainreaction.xq")
	  , xqueryupdate = await myfetch("chainreaction-update.xq")
	  ;
	  
    xqeval(xmldoc, xquery).then((res) => {
      var el = res.iterateNext();
      if (el) {
        const
	        env = {
	          args: {
	            model: xmldoc
              }
 	        }
	      ;
	      
        document.getElementById("game").appendChild(el);
        xqeval(document, xqueryupdate, el, env);
      }          
    });
  } catch(e) {
    console.log("Exception!\n" + e.message);
  }
}, false);
