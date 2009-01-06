var Attacklab = Attacklab || {};
Attacklab.wmdBase = function(){
	
	var self = top;
	var wmd = self["Attacklab"];
	var doc = self["document"];
	var re = self["RegExp"];
	var nav = self["navigator"];
	
	wmd.Util = {};
	wmd.Position = {};
	wmd.Command = {};
	
	var util = wmd.Util;
	var position = wmd.Position;
	var command = wmd.Command;
	
	wmd.Util.IE =( nav.userAgent.indexOf("MSIE") != -1);
	wmd.Util.oldIE = (nav.userAgent.indexOf("MSIE 6.") != -1 || nav.userAgent.indexOf("MSIE 5.") != -1);
	wmd.Util.newIE = !wmd.Util.oldIE&&(nav.userAgent.indexOf("MSIE") != -1);
	
	// DONE - jslint clean
	//
	// Creates and returns a new HtmlElement.
	// If noStyle is false a default style is applied.
	// This should be refactored to take a Style object or
	// something instead of the weird noStyle argument.
	util.makeElement = function(type, noStyle){
		
		var elem = doc.createElement(type);
		
		// I hate the double negative here.
		if(!noStyle){
			var style = elem.style;
			style.margin = "0";
			style.padding = "0";
			style.clear = "none";
			style.cssFloat = "none";
			style.textAlign = "left";
			style.position = "relative";
			style.lineHeight = "1em";
			style.border = "none";
			style.color = "black";
			style.backgroundRepeat = "no-repeat";
			style.backgroundImage = "none";
			style.minWidth = style.minHeight = "0";
			style.maxWidth = style.maxHeight = "90000px";		// kinda arbitrary but ok
		}
		
		return elem;
	};
	
	// UNFINISHED - cleaned up - jslint clean
	// This is always used to see if "display" is set to "none".
	// Might want to rename it checkVisible() or something.
	// Might want to return null instead of "" on style search failure.
	util.getStyleProperty = function(elem, property){
		
		// IE styles use camel case so we have to convert the first letter of
		// a word following a dash to uppercase.
		var convertToIEForm = function(str){
			return str.replace(/-(\S)/g,
				function(_, m1){
					return m1.toUpperCase();
				});
		};
		
		// currentStyle is IE only.  Everything else uses getComputedStyle().
		if(self.getComputedStyle){
			return self.getComputedStyle(elem, null).getPropertyValue(property);
		}
		else if(elem.currentStyle){
			property = convertToIEForm(property);
			return elem.currentStyle[property];			
		}
		
		return "";
	};
	
	// DONE - cleaned up - jslint clean
	// Like getElementsByTagName() but searches for a class.
	util.getElementsByClass = function(searchClass, searchTag){
		
		var results = [];
		
		if(searchTag === null){
			searchTag = "*";
		}
		
		var elements = doc.getElementsByTagName(searchTag);
		var regex = new re("(^|\\s)" + searchClass + "(\\s|$)");
		
		for(var i = 0; i < elements.length; i++){
			if(regex.test(elements[i].className.toLowerCase())){
				results.push(elements[i]);
			}
		}
		
		return results;
	};
	
	// DONE - jslint clean
	util.addEvent = function(elem, event, listener){	
		if(elem.attachEvent){
			// IE only.  The "on" is mandatory.
			elem.attachEvent("on" + event, listener);
		}
		else{
			// Other browsers.
			elem.addEventListener(event, listener, false);
		}
	};
	
	// DONE - jslint clean
	util.removeEvent = function(elem, event, listener){
		if(elem.detachEvent){
			// IE only.  The "on" is mandatory.
			elem.detachEvent("on" + event, listener);
		}
		else{
			// Other browsers.
			elem.removeEventListener(event, listener, false);
		}
	};
	
	// UNFINISHED
	// Um, this doesn't look like it really makes a string...
	// Maybe strings (plural)?
	util.regexToString = function(regex){
		var result = {};
		var str = regex.toString();
		result.expression = str.replace(/\/([gim]*)$/, "");
		result.flags = re.$1;
		result.expression = result.expression.replace(/(^\/|\/$)/g, "");
		return result;
	};
	
	// UNFINISHED
	// Um, this doesn't look like it really takes a string...
	// Maybe strings (plural)?
	util.stringToRegex = function(str){
		return new re(str.expression, str.flags);
	};
	
	// DONE - jslint clean
	// Check to see if a node is not a parent and not hidden.
	util.elementOk = function(elem){
		if(!elem || !elem.parentNode){
			return false;
		}
		if(util.getStyleProperty(elem, "display") === "none"){
			return false;
		}
		return true;
	};
	
	// DONE
	// Adds a skin to the button "bar" at the top of the textarea.
	util.skin = function(elem, imgPath, height, width){
		
		var style;
		var isIE = (nav.userAgent.indexOf("MSIE") != -1);
		
		if(isIE){
			util.fillers = [];
		}
		
		var halfHeight = height / 2;
		
		for(var corner = 0; corner < 4; corner++){
			
			var div = util.makeElement("div");
			
			style = div.style;
			style.overflow = "hidden";
			style.padding = "0";
			style.margin = "0";
			style.lineHeight = "0px";
			style.height = halfHeight + "px";
			style.width = "50%";
			style.maxHeight = halfHeight + "px";
			style.position = "absolute";
			
			if(corner & 1){
				style.top = "0";
			}
			else{
				style.bottom = -height + "px";
			}
			
			style.zIndex = "-1000";
			
			if(corner & 2){
				style.left = "0";
			}
			else{
				style.marginLeft = "50%";
			}
			
			if(isIE){
				var span = util.makeElement("span");
				
				style = span.style;
				style.height = "100%";
				style.width = width;
				style.filter = "progid:DXImageTransform.Microsoft." + "AlphaImageLoader(src='" + wmd.basePath + "images/bg.png')";
				style.position = "absolute";
				
				if(corner & 1){
					style.top = "0";
				}
				else{
					style.bottom = "0";
				}
				
				if(corner & 2){
					style.left = "0";
				}
				else{
					style.right = "0";
				}
				
				div.appendChild(span);
			}
			else{
				style.backgroundImage = "url(" + imgPath + ")";
				style.backgroundPosition = (corner & 2 ? "left" : "right") + " " + (corner & 1 ? "top" : "bottom");
			}
			
			elem.appendChild(div);
		}
		
		// This is a terrible name for something that returns a div.
		var fill = function(left){
			
			var div = util.makeElement("div");
			
			if(util.fillers){
				util.fillers.push(div);
			}
			
			style = div.style;
			style.overflow = "hidden";
			style.padding = "0";
			style.margin = "0";
			style.marginTop = halfHeight + "px";
			style.lineHeight = "0px";
			style.height = "100%";
			style.width = "50%";
			style.position = "absolute";
			style.zIndex = "-1000";
			
			if(isIE){
				
				var span = util.makeElement("span");
				
				style = span.style;
				style.height = "100%";
				style.width = width;
				style.filter = "progid:DXImageTransform.Microsoft." + "AlphaImageLoader(src='" + wmd.basePath + "images/bg-fill.png',sizingMethod='scale')";
				style.position = "absolute";
				div.appendChild(span);
				
				if(left){
					style.left = "0";
				}
				if(!left){
					style.right = "0";
				}
			}
			
			if(!isIE){
				
				style.backgroundImage = "url(" + wmd.basePath + "images/bg-fill.png)";
				style.backgroundRepeat = "repeat-y";
				if(left){
					style.backgroundPosition = "left top";
				}
				if(!left){
					style.backgroundPosition = "right top";
				}
			}
			
			if(!left){
				div.style.marginLeft = "50%";
			}
			
			return div;
		};
		
		elem.appendChild(fill(true));
		elem.appendChild(fill(false));
	};
	
	// DONE - cleaned up - jslint clean
	// Sets the image for a "button" on the WMD editor.
	util.setImage = function(elem, imgPath){
		
		imgPath = wmd.basePath + imgPath;
		
		if(nav.userAgent.indexOf("MSIE") != -1){
			// Internet Explorer
			var child = elem.firstChild;
			var style = child.style;
			style.filter = "progid:DXImageTransform.Microsoft." + "AlphaImageLoader(src='" + imgPath + "')";
		}
		else{
			// Regular browser
			elem.src = imgPath;
		}
		
		return elem;
	};
	
	// DONE - reworked slightly and jslint clean
	util.createImage = function(img, width, height){
		
		img = wmd.basePath + img;
		var elem;
		
		if(nav.userAgent.indexOf("MSIE")!== -1){
			
			// IE-specific
			elem = util.makeElement("span");
			var style = elem.style;
			style.display = "inline-block";
			style.height = "1px";
			style.width = "1px";
			elem.unselectable = "on";
			
			var span = util.makeElement("span");
			style = span.style;
			style.display = "inline-block";
			style.height = "1px";
			style.width = "1px";
			style.filter = "progid:DXImageTransform.Microsoft." + "AlphaImageLoader(src='" + img + "')";
			span.unselectable = "on";
			elem.appendChild(span);
		}
		else{
			
			// Rest of the world
			elem = util.makeElement("img");
			elem.style.display = "inline";
			elem.src = img;
		}
		
		elem.style.border = "none";
		elem.border = "0";
		
		if(width && height){
			elem.style.width = width + "px";
			elem.style.height = height + "px";
		}
		return elem;
	};
	
	util.prompt = function(text, _42, callback){
		
		var style;
		var frame;
		var background;
		var input;
		
		var _48 = function(_49){
			var _4a = (_49.charCode || _49.keyCode);
			if(_4a == 27){
				_4b(true);
			}
		};
		
		var _4b = function(_4c){
			util.removeEvent(doc.body, "keydown", _48);
			var _4d = input.value;
			if(_4c){
				_4d = null;
			}
			frame.parentNode.removeChild(frame);
			background.parentNode.removeChild(background);
			callback(_4d);
			return false;
		};
		
		if(_42 === undefined){
			_42 = "";
		}
		
		var showBackground = function(){
			
			background = util.makeElement("div");
			style = background.style;
			doc.body.appendChild(background);
			style.position = "absolute";
			style.top = "0";
			style.left = "0";
			style.backgroundColor = "#000";
			style.zIndex = "1000";
			var isKonqueror = /konqueror/.test(nav.userAgent.toLowerCase());
			
			if(isKonqueror){
				style.backgroundColor = "transparent";
			}
			else{
				style.opacity = "0.5";
				style.filter = "alpha(opacity=50)";
			}
			
			var _50 = position.getPageSize();
			style.width = "100%";
			style.height = _50[1] + "px";
		};
		
		var _51 = function(){
			
			frame = doc.createElement("div");
			frame.style.border = "3px solid #333";
			frame.style.backgroundColor = "#ccc";
			frame.style.padding = "10px;";
			frame.style.borderTop = "3px solid white";
			frame.style.borderLeft = "3px solid white";
			frame.style.position = "fixed";
			frame.style.width = "400px";
			frame.style.zIndex = "1001";
			var _52 = util.makeElement("div");
			style = _52.style;
			style.fontSize = "14px";
			style.fontFamily = "Helvetica, Arial, Verdana, sans-serif";
			style.padding = "5px";
			_52.innerHTML = text;
			frame.appendChild(_52);
			var _53 = util.makeElement("form");
			
			_53.onsubmit = function(){
				return _4b();
			};
			
			style = _53.style;
			style.padding = "0";
			style.margin = "0";
			style.cssFloat = "left";
			style.width = "100%";
			style.textAlign = "center";
			style.position = "relative";
			frame.appendChild(_53);
			input = doc.createElement("input");
			input.value = _42;
			style = input.style;
			style.display = "block";
			style.width = "80%";
			style.marginLeft = style.marginRight = "auto";
			style.backgroundColor = "white";
			style.color = "black";
			_53.appendChild(input);
			var _54 = doc.createElement("input");
			_54.type = "button";
			
			_54.onclick = function(){
				return _4b();
			};
			
			_54.value = "OK";
			style = _54.style;
			style.margin = "10px";
			style.display = "inline";
			style.width = "7em";
			var _55 = doc.createElement("input");
			_55.type = "button";
			
			_55.onclick = function(){
				return _4b(true);
			};
			
			_55.value = "Cancel";
			style = _55.style;
			style.margin = "10px";
			style.display = "inline";
			style.width = "7em";
			
			if(/mac/.test(nav.platform.toLowerCase())){
				_53.appendChild(_55);
				_53.appendChild(_54);
			}
			else{
				_53.appendChild(_54);
				_53.appendChild(_55);
			}
			
			util.addEvent(doc.body, "keydown", _48);
			frame.style.top = "50%";
			frame.style.left = "50%";
			frame.style.display = "block";
			if(wmd.Util.oldIE){
				var _56 = position.getPageSize();
				frame.style.position = "absolute";
				frame.style.top = doc.documentElement.scrollTop + 200 + "px";
				frame.style.left = "50%";
			}
			doc.body.appendChild(frame);
			frame.style.marginTop =- (position.getHeight(frame) / 2) + "px";
			frame.style.marginLeft =- (position.getWidth(frame) / 2) + "px";
		};
		
		showBackground();
		
		self.setTimeout(function(){
			
			_51();
			var _57 = _42.length;
			
			if(input.selectionStart !== undefined){
				input.selectionStart = 0;
				input.selectionEnd = _57;
			}
			else{
				if(input.createTextRange){
					var _58 = input.createTextRange();
					_58.collapse(false);
					_58.moveStart("character", -_57);
					_58.moveEnd("character", _57);
					_58.select();
				}
			}
			input.focus();
		}, 0);
	};
	
	// UNFINISHED - almost a direct copy of original function
	// except that I use !== and flip a and b in the second test block.
	util.objectsEqual = function(a, b){
        for (var key in a) {
            if (a[key] !== b[key]) {
                return false;
            }
        }
        for (key in b) {
            if (b[key] !== a[key]) {
                return false;
            }
        }
        return true;
	};
	
	// UNFINISHED - direct copy of the original function
	util.cloneObject = function(obj){
        var result = {};
        for (var key in obj) {
            result[key] = obj[key];
        }
        return result;
	};
	
	// DONE - updated - jslint clean
	position.getPageSize = function(){
		
		var scrollWidth, scrollHeight;
		var innerWidth, innerHeight;
		
		// It's not very clear which blocks work with which browsers.
		if(self.innerHeight && self.scrollMaxY){
			scrollWidth = doc.body.scrollWidth;
			scrollHeight = self.innerHeight + self.scrollMaxY;
		}
		else if(doc.body.scrollHeight > doc.body.offsetHeight){
			scrollWidth = doc.body.scrollWidth;
			scrollHeight = doc.body.scrollHeight;
		}
		else{
			scrollWidth = doc.body.offsetWidth;
			scrollHeight = doc.body.offsetHeight;
		}
		
		if(self.innerHeight){
			// Non-IE browser
			innerWidth = self.innerWidth;
			innerHeight = self.innerHeight;
		}
		else if(doc.documentElement && doc.documentElement.clientHeight){
			// Some versions of IE (IE 6 w/ a DOCTYPE declaration)
			innerWidth = doc.documentElement.clientWidth;
			innerHeight = doc.documentElement.clientHeight;
		}
		else if(doc.body){
			// Other versions of IE
			innerWidth = doc.body.clientWidth;
			innerHeight = doc.body.clientHeight;
		}
		
        var maxWidth = Math.max(scrollWidth, innerWidth);
        var maxHeight = Math.max(scrollHeight, innerHeight);
        return [maxWidth, maxHeight, innerWidth, innerHeight];
	};
	
	// DONE - jslint clean
	position.getPixelVal = function(val){
		if(val && /^(-?\d+(\.\d*)?)px$/.test(val)){
			return re.$1;
		}
		return undefined;
	};
	
	// UNFINISHED
	// The assignment in the while loop makes jslint cranky.
	// I'll change it to a for loop later.
	position.getTop = function(elem, isInner){
		var result = elem.offsetTop;
		if(!isInner){
			while(elem = elem.offsetParent){
				result += elem.offsetTop;
			}
		}
		return result;
	};
	
	// DONE - updated
	position.setTop = function(elem, newTop, isInner){
		var curTop = position.getPixelVal(elem.style.top);
		if(curTop === undefined){
			elem.style.top = newTop + "px";
			curTop = newTop;
		}
		
		var offset = position.getTop(elem, isInner) - curTop;
		elem.style.top = (newTop - offset) + "px";
	};
	
	// UNFINISHED
	// The assignment in the while loop makes jslint cranky.
	// I'll change it to a for loop later.
	position.getLeft = function(elem, isInner){
		var result = elem.offsetLeft;
		if(!isInner){
			while(elem = elem.offsetParent){
				result += elem.offsetLeft;
			}
		}
		return result;
	};
	
	// DONE - updated
	position.setLeft = function(elem, newLeft, isInner){
		var curLeft = position.getPixelVal(elem.style.left);
		if(curLeft === undefined){
			elem.style.left = newLeft + "px";
			curLeft = newLeft;
		}
		var offset = position.getLeft(elem, isInner) - curLeft;
		elem.style.left = (newLeft - offset)+"px";
	};
		
	position.getHeight = function(_7c){
		var _7d=_7c.offsetHeight;
		if(!_7d){
		_7d=_7c.scrollHeight;
		}
		return _7d;
	};
	
	position.setHeight = function(_7e, _7f){
		var _80=position.getPixelVal(_7e.style.height);
		if(_80==undefined){
		_7e.style.height=_7f+"px";
		_80=_7f;
		}
		var _81=position.getHeight(_7e)-_80;
		if(_81>_7f){
		_81=_7f;
		}
		_7e.style.height=(_7f-_81)+"px";
	};
	
	position.getWidth = function(_82){
		var _83=_82.offsetWidth;
		if(!_83){
		_83=_82.scrollWidth;
		}
		return _83;
	};
	
	position.setWidth = function(_84, _85){
		var _86=position.getPixelVal(_84.style.width);
		if(_86==undefined){
		_84.style.width=_85+"px";
		_86=_85;
		}
		var _87=position.getWidth(_84)-_86;
		if(_87>_85){
		_87=_85;
		}
		_84.style.width=(_85-_87)+"px";
	};
	
	position.getWindowHeight = function(){
		if(self.innerHeight){
		return self.innerHeight;
		}else{
		if(doc.documentElement&&doc.documentElement.clientHeight){
		return doc.documentElement.clientHeight;
		}else{
		if(doc.body){
		return doc.body.clientHeight;
		}
		}
		}
	};
	
	// DONE - slightly improved - jslint clean
	//
	// Watches the input textarea, polling at an interval and runs
	// a callback function if anything has changed.
	wmd.inputPoller = function(inputArea, callback, interval){
		
		var pollerObj = this;
		
		// Stored start, end and text.  Used to see if there are changes to the input.
		var lastStart;
		var lastEnd;
		var markdown;
		
		var killHandle;	// Used to cancel monitoring on destruction.
		
		// Checks to see if anything has changed in the textarea.
		// If so, it runs the callback.
		this.tick = function(){
			
			// Silently die if the input area is hidden, etc.
			if(!util.elementOk(inputArea)){
				return;
			}
			
			// Update the selection start and end, text.
			if(inputArea.selectionStart || inputArea.selectionStart === 0){
				var start = inputArea.selectionStart;
				var end = inputArea.selectionEnd;
				if(start != lastStart || end != lastEnd){
					lastStart = start;
					lastEnd = end;
					
					if(markdown != inputArea.value){
						markdown = inputArea.value;
						return true;
					}
				}
			}
			return false;
		};
		
		
		var doTickCallback = function(){
			
			if(util.getStyleProperty(inputArea, "display") === "none"){
				return;
			}
			
			// If anything has changed, call the function.
			if(pollerObj.tick()){
				callback();
			}
		};
		
		// Set how often we poll the textarea for changes.
		var assignInterval = function(){
			if(interval === undefined){
				interval = 500;
			}
			killHandle = self.setInterval(doTickCallback, interval);
		};
		
		this.destroy = function(){
			self.clearInterval(killHandle);
		};
		
		assignInterval();
	};
	
	wmd.undoManager = function(_94, _95){
		var _96=this;
		var _97=[];
		var _98=0;
		var _99="none";
		var _9a;
		var _9b;
		var _9c;
		var _9d;
		var _9e=function(_9f,_a0){
		if(_99!=_9f){
		_99=_9f;
		if(!_a0){
		_a1();
		}
		}
		if(!wmd.Util.IE||_99!="moving"){
		_9c=self.setTimeout(_a2,1);
		}else{
		_9d=null;
		}
		};
		var _a2=function(){
		_9d=new wmd.textareaState(_94);
		_9b.tick();
		_9c=undefined;
		};
		this.setCommandMode=function(){
		_99="command";
		_a1();
		_9c=self.setTimeout(_a2,0);
		};
		this.canUndo=function(){
		return _98>1;
		};
		this.canRedo=function(){
		if(_97[_98+1]){
		return true;
		}
		return false;
		};
		this.undo=function(){
		if(_96.canUndo()){
		if(_9a){
		_9a.restore();
		_9a=null;
		}else{
		_97[_98]=new wmd.textareaState(_94);
		_97[--_98].restore();
		if(_95){
		_95();
		}
		}
		}
		_99="none";
		_94.focus();
		_a2();
		};
		this.redo=function(){
		if(_96.canRedo()){
		_97[++_98].restore();
		if(_95){
		_95();
		}
		}
		_99="none";
		_94.focus();
		_a2();
		};
		var _a1=function(){
		var _a3=_9d||new wmd.textareaState(_94);
		if(!_a3){
		return false;
		}
		if(_99=="moving"){
		if(!_9a){
		_9a=_a3;
		}
		return;
		}
		if(_9a){
		if(_97[_98-1].text!=_9a.text){
		_97[_98++]=_9a;
		}
		_9a=null;
		}
		_97[_98++]=_a3;
		_97[_98+1]=null;
		if(_95){
		_95();
		}
		};
		var _a4=function(_a5){
		var _a6=false;
		if(_a5.ctrlKey||_a5.metaKey){
		var _a7=(_a5.charCode||_a5.keyCode)|96;
		var _a8=String.fromCharCode(_a7);
		switch(_a8){
		case "y":
		_96.redo();
		_a6=true;
		break;
		case "z":
		if(!_a5.shiftKey){
		_96.undo();
		}else{
		_96.redo();
		}
		_a6=true;
		break;
		}
		}
		if(_a6){
		if(_a5.preventDefault){
		_a5.preventDefault();
		}
		if(self.event){
		self.event.returnValue=false;
		}
		return;
		}
		};
		var _a9=function(_aa){
		if(!_aa.ctrlKey&&!_aa.metaKey){
		var _ab=_aa.keyCode;
		if((_ab>=33&&_ab<=40)||(_ab>=63232&&_ab<=63235)){
		_9e("moving");
		}else{
		if(_ab==8||_ab==46||_ab==127){
		_9e("deleting");
		}else{
		if(_ab==13){
		_9e("newlines");
		}else{
		if(_ab==27){
		_9e("escape");
		}else{
		if((_ab<16||_ab>20)&&_ab!=91){
		_9e("typing");
		}
		}
		}
		}
		}
		}
		};
		var _ac=function(){
		util.addEvent(_94,"keypress",function(_ad){
		if((_ad.ctrlKey||_ad.metaKey)&&(_ad.keyCode==89||_ad.keyCode==90)){
		_ad.preventDefault();
		}
		});
		var _ae=function(){
		if(wmd.Util.IE||(_9d&&_9d.text!=_94.value)){
		if(_9c==undefined){
		_99="paste";
		_a1();
		_a2();
		}
		}
		};
		_9b=new wmd.inputPoller(_94,_ae,100);
		util.addEvent(_94,"keydown",_a4);
		util.addEvent(_94,"keydown",_a9);
		util.addEvent(_94,"mousedown",function(){
		_9e("moving");
		});
		_94.onpaste=_ae;
		_94.ondrop=_ae;
		};
		var _af=function(){
		_ac();
		_a2();
		_a1();
		};
		this.destroy=function(){
		if(_9b){
		_9b.destroy();
		}
		};
		_af();
	};
	
	wmd.editor = function(inputBox, previewRefreshCallback){
		
		if(!previewRefreshCallback){
			previewRefreshCallback = function(){};
		}
		
		var _b2 = 28;
		var _b3 = 4076;
		var _b4 = 0;
		var _b5;
		var _b6;
		var _b7 = this;
		var _b8;
		var _b9;
		var _ba;
		var _bb;
		var _bc;
		var _bd;
		var _be;
		var _bf;
		var buttonCallbacks = [];	// Callbacks for the buttons at the top of the input area
		
		// Saves the input state at the time of button click and performs the button function.
		// The parameter is the function performed when this function is called.
		var saveStateDoButtonAction = function(callback){
			
			if(_bd){
				_bd.setCommandMode();
			}
			
			var state = new wmd.textareaState(inputBox);
			
			if(!state){
				return;
			}
			
			var chunks = state.getChunks();
			
			// This seems like a very convoluted way of performing the action.
			var performAction = function(){
				
				inputBox.focus();
				
				if(chunks){
					state.setChunks(chunks);
				}
				
				state.restore();
				previewRefreshCallback();
			};
			
			var _c6 = callback(chunks, performAction);
			
			if(!_c6){
				performAction();
			}
		};
		
		var _c7 = function(_c8){
			
			inputBox.focus();
			
			if(_c8.textOp){
				saveStateDoButtonAction(_c8.textOp);
			}
			
			if(_c8.execute){
				_c8.execute(_b7);
			}
		};
		
		var _c9 = function(_ca,_cb){
			
			var _cc = _ca.style;
			
			if(_cb){
				_cc.opacity = "1.0";
				_cc.KHTMLOpacity = "1.0";
				if(wmd.Util.newIE){
					_cc.filter = "";
				}
				if(wmd.Util.oldIE){
					_cc.filter = "chroma(color=fuchsia)";
				}
				_cc.cursor = "pointer";
				
				_ca.onmouseover = function(){
					_cc.backgroundColor="lightblue";
					_cc.border="1px solid blue";
				};
				
				_ca.onmouseout = function(){
					_cc.backgroundColor = "";
					_cc.border = "1px solid transparent";
					if(wmd.Util.oldIE){
						_cc.borderColor = "fuchsia";
						_cc.filter = "chroma(color=fuchsia)"+_cc.filter;
					}
				};
			}
			else{
				_cc.opacity = "0.4";
				_cc.KHTMLOpacity = "0.4";
				if(wmd.Util.oldIE){
					_cc.filter = "chroma(color=fuchsia) alpha(opacity=40)";
				}
				if(wmd.Util.newIE){
					_cc.filter = "alpha(opacity=40)";
				}
				_cc.cursor = "";
				_cc.backgroundColor = "";
				if(_ca.onmouseout){
					_ca.onmouseout();
				}
				_ca.onmouseover=_ca.onmouseout=null;
			}
		};
		
		var addButtonCallback = function(callback){
			callback && buttonCallbacks.push(callback);
		};
		
		var addButtonSeparator = function(){
			buttonCallbacks.push("|");
		};
		
		// Creates a separator in the button row at the top of the input area.
		var makeButtonSeparator = function(){
			
			var _d1 = util.createImage("images/separator.png", 20, 20);
			_d1.style.padding = "4px";
			_d1.style.paddingTop = "0px";
			_b9.appendChild(_d1);
			
		};
		
		var makeButtonImage = function(_d3){
			if(_d3.image){
				var _d4 = util.createImage(_d3.image, 16, 16);
				_d4.border = 0;
				if(_d3.description){
					var _d5 = _d3.description;
					if(_d3.key){
						var _d6 = " Ctrl+";
						_d5 += _d6 + _d3.key.toUpperCase();
					}
					_d4.title = _d5;
				}
				_c9(_d4, true);
				var _d7 = _d4.style;
				_d7.margin = "0px";
				_d7.padding = "1px";
				_d7.marginTop = "7px";
				_d7.marginBottom = "5px";
				_d4.onmouseout();
				var _d8 = _d4;
				
				_d8.onclick = function(){
					if(_d8.onmouseout){
						_d8.onmouseout();
					}
					_c7(_d3);
					return false;
				};
				_b9.appendChild(_d8);
				return _d8;
			}
			return;
		};
		
		// Creates the button row above the input area.
		var makeButtonRow = function(){
			
			for(var callback in buttonCallbacks){
				
				if(buttonCallbacks[callback] == "|"){
					makeButtonSeparator();
				}
				else{
					makeButtonImage(buttonCallbacks[callback]);
				}
			}
		};
		
		var _db = function(){
			if(_bd){
				_c9(_be, _bd.canUndo());
				_c9(_bf, _bd.canRedo());
			}
		};
		
		var _dc = function(){
			if(inputBox.offsetParent){
				_ba = util.makeElement("div");
				var _dd = _ba.style;
				_dd.visibility = "hidden";
				_dd.top = _dd.left = _dd.width = "0px";
				_dd.display = "inline";
				_dd.cssFloat = "left";
				_dd.overflow = "visible";
				_dd.opacity = "0.999";
				_b8.style.position = "absolute";
				_ba.appendChild(_b8);
				inputBox.style.marginTop = "";
				var _de = position.getTop(inputBox);
				inputBox.style.marginTop = "0";
				var _df = position.getTop(inputBox);
				_b4 = _de - _df;
				_e0();
				inputBox.parentNode.insertBefore(_ba, inputBox);
				_e1();
				util.skin(_b8, wmd.basePath + "images/bg.png", _b2, _b3);
				_dd.visibility = "visible";
				return true;
			}
			return false;
		};
		
		var setButtonCallbacks = function(){
			
			var buttons = wmd.wmd_env.buttons.split(/\s+/);
			
			for(var btn in buttons){
				
				switch(buttons[btn]){
					case "|":
						addButtonSeparator();
						break;
					case "bold":
						addButtonCallback(command.bold);
						break;
					case "italic":
						addButtonCallback(command.italic);
						break;
					case "link":
						addButtonCallback(command.link);
						break;
				}
				
				if(wmd.full){
					switch(buttons[btn]){
						case "blockquote":
							addButtonCallback(command.blockquote);
							break;
						case "code":
							addButtonCallback(command.code);
							break;
						case "image":
							addButtonCallback(command.img);
							break;
						case "ol":
							addButtonCallback(command.ol);
							break;
						case "ul":
							addButtonCallback(command.ul);
							break;
						case "heading":
							addButtonCallback(command.h1);
							break;
						case "hr":
							addButtonCallback(command.hr);
							break;
					}
				}
			}
			return;
		};
		
		var _e5 = function(){
			
			if(/\?noundo/.test(doc.location.href)){
				wmd.nativeUndo=true;
			}
			
			if(!wmd.nativeUndo){
				_bd = new wmd.undoManager(inputBox,function(){
					previewRefreshCallback();
					_db();
				});
			}
			
			var _e6 = inputBox.parentNode;
			_b8 = util.makeElement("div");
			_b8.style.display = "block";
			_b8.style.zIndex = 100;
			if(!wmd.full){
				_b8.title += "\n(Free Version)";
			}
			_b8.unselectable="on";
			
			_b8.onclick = function(){
				inputBox.focus();
			};
			
			_b9 = util.makeElement("span");
			var _e7 = _b9.style;
			_e7.height = "auto";
			_e7.paddingBottom = "2px";
			_e7.lineHeight = "0";
			_e7.paddingLeft = "15px";
			_e7.paddingRight = "65px";
			_e7.display = "block";
			_e7.position = "absolute";
			_b9.unselectable = "on";
			_b8.appendChild(_b9);
			addButtonCallback(command.autoindent);
			var _e8 = util.createImage("images/bg.png");
			var _e9 = util.createImage("images/bg-fill.png");
			
			setButtonCallbacks();
			makeButtonRow();
			
			if(_bd){
				makeButtonSeparator();
				_be = makeButtonImage(command.undo);
				_bf = makeButtonImage(command.redo);
				var _ea = nav.platform.toLowerCase();
				
				if(/win/.test(_ea)){
					_be.title+=" - Ctrl+Z";
					_bf.title+=" - Ctrl+Y";
				}
				else{
					if(/mac/.test(_ea)){
						_be.title+=" - Ctrl+Z";
						_bf.title+=" - Ctrl+Shift+Z";
					}
					else{
						_be.title+=" - Ctrl+Z";
						_bf.title+=" - Ctrl+Shift+Z";
					}
				}
			}
			
			var _eb = "keydown";
			if(nav.userAgent.indexOf("Opera") != -1){
				_eb = "keypress";
			}
			
			util.addEvent(inputBox, _eb, 
				function(_ec){
					
					var _ed = false;
					
					if(_ec.ctrlKey||_ec.metaKey){
						
						var _ee = (_ec.charCode || _ec.keyCode);
						var _ef = String.fromCharCode(_ee).toLowerCase();
						for(var callback in buttonCallbacks){
							
							var _f1 = buttonCallbacks[callback];
							
							if(_f1.key && _ef == _f1.key || _f1.keyCode && _ec.keyCode == _f1.keyCode){
								_c7(_f1);
								_ed = true;
							}
						}
					}
					
					if(_ed){
						
						if(_ec.preventDefault){
							_ec.preventDefault();
						}
						
						if(self.event){
							self.event.returnValue = false;
						}
					}
				});
			
			util.addEvent(inputBox, "keyup", 
				function(_f2){
					if(_f2.shiftKey && !_f2.ctrlKey && !_f2.metaKey){
						var _f3 = (_f2.charCode || _f2.keyCode);
						switch(_f3){
							case 13:
								_c7(command.autoindent);
								break;
						}
					}
				});
			
			if(!_dc()){
				_bc = self.setInterval(function(){
					if(_dc()){
						self.clearInterval(_bc);
					}
				}, 100);
			}
			
			util.addEvent(self, "resize", _e1);
			_bb = self.setInterval(_e1, 100);
			if(inputBox.form){
				var _f4 = inputBox.form.onsubmit;
				inputBox.form.onsubmit = function(){
					_f5();
					if(_f4){
						return _f4.apply(this, arguments);
					}
				};
			}
			_db();
		};
		
		var _f5 = function(){
			if(wmd.showdown){
				var _f6 = new wmd.showdown.converter();
			}
			var _f7 = inputBox.value;
			
			var _f8 = function(){
				inputBox.value = _f7;
			};
			
			if(!/markdown/.test(wmd.wmd_env.output.toLowerCase())){
				if(_f6){
					inputBox.value = _f6.makeHtml(_f7);
					self.setTimeout(_f8, 0);
				}
			}
			return true;
		};
		
		var _e0 = function(){
			var _f9 = util.makeElement("div");
			var _fa = _f9.style;
			_fa.paddingRight = "15px";
			_fa.height = "100%";
			_fa.display = "block";
			_fa.position = "absolute";
			_fa.right = "0";
			_f9.unselectable = "on";
			var _fb = util.makeElement("a");
			_fa = _fb.style;
			_fa.position = "absolute";
			_fa.right = "10px";
			_fa.top = "5px";
			_fa.display = "inline";
			_fa.width = "50px";
			_fa.height = "25px";
			_fb.href = "http://www.wmd-editor.com/";
			_fb.target = "_blank";
			_fb.title = "WMD: The Wysiwym Markdown Editor";
			var _fc = util.createImage("images/wmd.png");
			var _fd = util.createImage("images/wmd-on.png");
			_fb.appendChild(_fc);
			_fb.onmouseover = function(){
				util.setImage(_fc, "images/wmd-on.png");
				_fb.style.cursor = "pointer";
			};
			_fb.onmouseout=function(){
				util.setImage(_fc, "images/wmd.png");
			};
			_b8.appendChild(_fb);
		};
		
		var _e1 = function(){
			
			if(!util.elementOk(inputBox)){
				_b8.style.display = "none";
				return;
			}
			
			if(_b8.style.display == "none"){
				_b8.style.display = "block";
			}
			
			var _fe = position.getWidth(inputBox);
			var _ff = position.getHeight(inputBox);
			var _100 = position.getLeft(inputBox);
			if(_b8.style.width == _fe + "px" && _b5 == _ff && _b6 == _100){
				if(position.getTop(_b8) < position.getTop(inputBox)){
					return;
				}
			}
			_b5 = _ff;
			_b6 = _100;
			var _101 = 100;
			_b8.style.width = Math.max(_fe, _101) + "px";
			var root = _b8.offsetParent;
			var _103 = position.getHeight(_b9);
			var _104 = _103 - _b2 + "px";
			_b8.style.height = _104;
			if(util.fillers){
				util.fillers[0].style.height = util.fillers[1].style.height = _104;
			}
			var _105 = 3;
			inputBox.style.marginTop = _103 + _105 + _b4 + "px";
			var _106 = position.getTop(inputBox);
			var _100 = position.getLeft(inputBox);
			position.setTop(root, _106 - _103 - _105);
			position.setLeft(root, _100);
			_b8.style.opacity = _b8.style.opacity || 0.999;
			return;
		};
		
		this.undo = function(){
			if(_bd){
				_bd.undo();
			}
		};
		
		this.redo = function(){
			if(_bd){
				_bd.redo();
			}
		};
		
		var init = function(){
			_e5();
		};
		
		this.destroy = function(){
			if(_bd){
				_bd.destroy();
			}
			if(_ba.parentNode){
				_ba.parentNode.removeChild(_ba);
			}
			if(inputBox){
				inputBox.style.marginTop = "";
			}
			self.clearInterval(_bb);
			self.clearInterval(_bc);
		};
		
		init();
	};
	
	wmd.textareaState = function(inputArea){
		
		var stateObj = this;
		
		var _10a = function(_10b){
		
			// If it's hidden we just return.
			if(util.getStyleProperty(inputArea, "display") === "none"){
				return;
			}
			
			var isOpera = nav.userAgent.indexOf("Opera") != -1;
			
			if(_10b.selectionStart !== undefined && !isOpera){
				
				_10b.focus();
				_10b.selectionStart = stateObj.start;
				_10b.selectionEnd = stateObj.end;
				_10b.scrollTop = stateObj.scrollTop;
			
			}
			else if(doc.selection){
				
				if(doc.activeElement && doc.activeElement !== inputArea){
					return;
				}
				
				_10b.focus();
				var _10d=_10b.createTextRange();
				_10d.moveStart("character", -_10b.value.length);
				_10d.moveEnd("character", -_10b.value.length);
				_10d.moveEnd("character", stateObj.end);
				_10d.moveStart("character", stateObj.start);
				_10d.select();
			}
		};
		
		this.init = function(newArea){
			
			// Normally the argument is not passed so the arguemnt passed to constructor
			// is used as the input area.
			if(newArea){
				inputArea = newArea;
			}
			
			// If hidden, do nothing.
			if(util.getStyleProperty(inputArea,"display") == "none"){
				return;
			}
			
			_10f(inputArea);
			stateObj.scrollTop = inputArea.scrollTop;
			if(!stateObj.text && inputArea.selectionStart || inputArea.selectionStart === 0){
				stateObj.text = inputArea.value;
			}
		};
		
		var _110 = function(_111){
			_111 = _111.replace(/\r\n/g, "\n");
			_111 = _111.replace(/\r/g, "\n");
			return _111;
		};
		
		var _10f = function(){
			
			if(inputArea.selectionStart || inputArea.selectionStart === 0){
				
				stateObj.start = inputArea.selectionStart;
				stateObj.end = inputArea.selectionEnd;
			}
			else if(doc.selection){

				stateObj.text = _110(inputArea.value);
				var _112 = doc.selection.createRange();
				var _113 = _110(_112.text);
				var _114 = "\x07";
				var _115 = _114 + _113 + _114;
				_112.text = _115;
				var _116 = _110(inputArea.value);
				_112.moveStart("character", -_115.length);
				_112.text = _113;
				stateObj.start = _116.indexOf(_114);
				stateObj.end = _116.lastIndexOf(_114) - _114.length;
					
				var _117 = stateObj.text.length - _110(inputArea.value).length;
				if(_117){
					_112.moveStart("character", -_113.length);
					while(_117--){
						_113 += "\n";
						stateObj.end += 1;
					}
					_112.text=_113;
				}
					
				_10a(inputArea);
			}
			
			
			return stateObj;
		};
		
		this.restore = function(_118){
			if(!_118){
				_118 = inputArea;
			}
			if(stateObj.text != undefined && stateObj.text != _118.value){
				_118.value = stateObj.text;
			}
			_10a(_118, stateObj);
			_118.scrollTop = stateObj.scrollTop;
		};
		
		this.getChunks = function(){
			var _119 = new wmd.Chunks();
			_119.before = _110(stateObj.text.substring(0, stateObj.start));
			_119.startTag = "";
			_119.selection = _110(stateObj.text.substring(stateObj.start, stateObj.end));
			_119.endTag = "";
			_119.after = _110(stateObj.text.substring(stateObj.end));
			_119.scrollTop = stateObj.scrollTop;
			return _119;
		};
		
		this.setChunks = function(_11a){
			
			_11a.before = _11a.before + _11a.startTag;
			_11a.after = _11a.endTag + _11a.after;
			
			var _11b = nav.userAgent.indexOf("Opera") !== -1;
			if(_11b){
				_11a.before = _11a.before.replace(/\n/g,"\r\n");
				_11a.selection = _11a.selection.replace(/\n/g,"\r\n");
				_11a.after = _11a.after.replace(/\n/g,"\r\n");
			}
			
			stateObj.start = _11a.before.length;
			stateObj.end = _11a.before.length + _11a.selection.length;
			stateObj.text = _11a.before + _11a.selection + _11a.after;
			stateObj.scrollTop = _11a.scrollTop;
		};
		
		this.init();
	};
	
	// DONE - empty
	wmd.Chunks = function(){
	};
	
	// startRegex: a regular expression to find the start tag
	// endRegex: a regular expresssion to find the end tag
	wmd.Chunks.prototype.findTags = function(startRegex, endRegex){
		
		var _11e;
		var _11f;
		var chunkObj = this;
		
		if(startRegex){
			_11f = util.regexToString(startRegex);
			_11e = new re(_11f.expression + "$", _11f.flags);
			
		this.before = this.before.replace(_11e,
			function(_121){
				chunkObj.startTag = chunkObj.startTag + _121;
				return "";
			});
			
		_11e = new re("^" + _11f.expression, _11f.flags);
		
		this.selection = this.selection.replace(_11e,
			function(_122){
				chunkObj.startTag = chunkObj.startTag + _122;
				return "";
			});
		}
		
		if(endRegex){
			_11f = util.regexToString(endRegex);
			_11e = new re(_11f.expression + "$", _11f.flags);
			this.selection = this.selection.replace(_11e,
				function(_123){
					chunkObj.endTag = _123 + chunkObj.endTag;
					return "";
				});
			_11e = new re("^" + _11f.expression, _11f.flags);
			this.after = this.after.replace(_11e,
				function(_124){
					chunkObj.endTag = _124 + chunkObj.endTag;
					return "";
				});
		}
	};
	
	// DONE - jslint clean
	//
	// If the argument is false, the whitespace is transferred
	// to the before/after borders.
	// If the argument is true, the whitespace disappears.
	//
	// The double negative sucks.  The paramater "sign" needs to be flipped
	// or the variable eliminated.
	wmd.Chunks.prototype.trimWhitespace = function(dontMove){
		
		this.selection = this.selection.replace(/^(\s*)/, "");
		
		if(!dontMove){
			this.before += re.$1;
		}
		
		this.selection = this.selection.replace(/(\s*)$/, "");
		
		if(!dontMove){
			this.after = re.$1 + this.after;
		}
	};
	
	wmd.Chunks.prototype.skipLines = function(_126, _127, _128){
		
		if(_126 ===undefined){
			_126 = 1;
		}
		
		if(_127 === undefined){
			_127 = 1;
		}
		
		_126++;
		_127++;
		
		var _129, _12a;
		
		this.selection = this.selection.replace(/(^\n*)/, "");
		this.startTag = this.startTag + re.$1;
		this.selection = this.selection.replace(/(\n*$)/, "");
		this.endTag = this.endTag + re.$1;
		this.startTag = this.startTag.replace(/(^\n*)/, "");
		this.before = this.before + re.$1;
		this.endTag = this.endTag.replace(/(\n*$)/, "");
		this.after = this.after + re.$1;
		
		if(this.before){
			
			_129 = _12a = "";
			
			while(_126--){
				_129 += "\\n?";
				_12a += "\n";
			}
			
			if(_128){
				_129 = "\\n*";
			}
			this.before = this.before.replace(new re(_129 + "$", ""), _12a);
		}
		
		if(this.after){
			_129 = _12a = "";
			while(_127--){
				_129 += "\\n?";
				_12a += "\n";
			}
			if(_128){
				_129 = "\\n*";
			}
			this.after = this.after.replace(new re(_129, ""), _12a);
		}
	};
	
	command.prefixes="(?:\\s{4,}|\\s*>|\\s*-\\s+|\\s*\\d+\\.|=|\\+|-|_|\\*|#|\\s*\\[[^\n]]+\\]:)";
	
	command.unwrap = function(chnks){
		var txt = new re("([^\\n])\\n(?!(\\n|" + command.prefixes + "))","g");
		chnks.selection = chnks.selection.replace(txt, "$1 $2");
	};
	
	command.wrap = function(chnks, len){
		command.unwrap(chnks);
		var _12f = new re("(.{1," + len + "})( +|$\\n?)", "gm");
		
		chnks.selection = chnks.selection.replace(_12f,
			function(_130, line){
				if(new re("^" + command.prefixes, "").test(_130)){
					return _130;
				}
				return line + "\n";
			});
			
		chnks.selection = chnks.selection.replace(/\s+$/, "");
	};
	
	command.doBold = function(chunk){
		return command.doBorI(chunk, 2, "strong text");
	};
	
	command.doItalic = function(chunk){
		return command.doBorI(chunk, 1, "emphasized text");
	};
	
	// DONE - reworked a little and jslint clean
	//
	// chunk: The selected region that will be enclosed with */**
	// nStars: 1 for italics, 2 for bold
	// insertText: If you just click the button without highlighting text, this gets inserted
	//
	// This part of the control acts in some pretty weird ways.
	command.doBorI = function(chunk, nStars, insertText){
		
		// Get rid of whitespace and fixup newlines.
		chunk.trimWhitespace();
		chunk.selection = chunk.selection.replace(/\n{2,}/g,"\n");
		
		// Look for stars before and after.  Is the chunk already marked up?
		chunk.before.search(/(\**$)/);
		var starsBefore = re.$1;
		
		chunk.after.search(/(^\**)/);
		var starsAfter = re.$1;
		
		var prevStars = Math.min(starsBefore.length, starsAfter.length);
		
		// Remove stars if we have to since the button acts as a toggle.
		if((prevStars >= nStars) && (prevStars != 2 || nStars != 1)){
			chunk.before = chunk.before.replace(re("[*]{" + nStars + "}$", ""), "");
			chunk.after = chunk.after.replace(re("^[*]{" + nStars + "}", ""), "");
			return;
		}
		
		// It's not really clear why this code is necessary.  It just moves
		// some arbitrary stuff around.
		if(!chunk.selection && starsAfter){
			chunk.after = chunk.after.replace(/^([*_]*)/, "");
			chunk.before = chunk.before.replace(/(\s?)$/, "");
			var whitespace = re.$1;
			chunk.before = chunk.before + starsAfter + whitespace;
			return;
		}
		
		// In most cases, if you don't have any selected text and click the button
		// you'll get a selected, marked up region with the default text inserted.
		if(!chunk.selection && !starsAfter){
			chunk.selection = insertText;
		}
		
		// Add the true markup.
		var markup = nStars <= 1 ? "*" : "**";	// shouldn't the test be = ?
		chunk.before = chunk.before + markup;
		chunk.after = markup + chunk.after;
	};
	
	command.stripLinkDefs = function(_13c, _13d){
		_13c=_13c.replace(/^[ ]{0,3}\[(\d+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|$)/gm,function(_13e,id,_140,_141,_142){
		_13d[id]=_13e.replace(/\s*$/,"");
		if(_141){
		_13d[id]=_13e.replace(/["(](.+?)[")]$/,"");
		return _141+_142;
		}
		return "";
		});
		return _13c;
	};
	
	command.addLinkDef = function(_143, _144){
		var _145=0;
		var _146={};
		_143.before=command.stripLinkDefs(_143.before,_146);
		_143.selection=command.stripLinkDefs(_143.selection,_146);
		_143.after=command.stripLinkDefs(_143.after,_146);
		var _147="";
		var _148=/(\[(?:\[[^\]]*\]|[^\[\]])*\][ ]?(?:\n[ ]*)?\[)(\d+)(\])/g;
		var _149=function(def){
		_145++;
		def=def.replace(/^[ ]{0,3}\[(\d+)\]:/,"  ["+_145+"]:");
		_147+="\n"+def;
		};
		var _14b=function(_14c,_14d,id,end){
		if(_146[id]){
		_149(_146[id]);
		return _14d+_145+end;
		}
		return _14c;
		};
		_143.before=_143.before.replace(_148,_14b);
		if(_144){
		_149(_144);
		}else{
		_143.selection=_143.selection.replace(_148,_14b);
		}
		var _150=_145;
		_143.after=_143.after.replace(_148,_14b);
		if(_143.after){
		_143.after=_143.after.replace(/\n*$/,"");
		}
		if(!_143.after){
		_143.selection=_143.selection.replace(/\n*$/,"");
		}
		_143.after+="\n\n"+_147;
		return _150;
	};
	
	command.doLinkOrImage = function(_151, _152, _153){
		_151.trimWhitespace();
		_151.findTags(/\s*!?\[/,/\][ ]?(?:\n[ ]*)?(\[.*?\])?/);
		if(_151.endTag.length>1){
		_151.startTag=_151.startTag.replace(/!?\[/,"");
		_151.endTag="";
		command.addLinkDef(_151,null);
		}else{
		if(/\n\n/.test(_151.selection)){
		command.addLinkDef(_151,null);
		return;
		}
		var _154;
		var _155=function(_156){
		if(_156!=null){
		_151.startTag=_151.endTag="";
		var _157=" [999]: "+_156;
		var num=command.addLinkDef(_151,_157);
		_151.startTag=_152?"![":"[";
		_151.endTag="]["+num+"]";
		if(!_151.selection){
		if(_152){
		_151.selection="alt text";
		}else{
		_151.selection="link text";
		}
		}
		}
		_153();
		};
		if(_152){
		_154=util.prompt("<p style='margin-top: 0px'><b>Enter the image URL.</b></p><p>You can also add a title, which will be displayed as a tool tip.</p><p>Example:<br />http://wmd-editor.com/images/cloud1.jpg   \"Optional title\"</p>","http://",_155);
		}else{
		_154=util.prompt("<p style='margin-top: 0px'><b>Enter the web address.</b></p><p>You can also add a title, which will be displayed as a tool tip.</p><p>Example:<br />http://wmd-editor.com/   \"Optional title\"</p>","http://",_155);
		}
		return true;
		}
	};
	
	// Note that these commands either have a textOp callback which is executed on button
	// click OR they have an execute function which performs non-text work.
	
	command.bold = {};
	command.bold.description = "Strong <strong>";
	command.bold.image = "images/bold.png";
	command.bold.key = "b";
	command.bold.textOp = command.doBold;
	
	command.italic = {};
	command.italic.description = "Emphasis <em>";
	command.italic.image = "images/italic.png";
	command.italic.key = "i";
	command.italic.textOp = command.doItalic;

	command.link = {};
	command.link.description = "Hyperlink <a>";
	command.link.image = "images/link.png";
	command.link.key = "l";
	command.link.textOp = function(_159, _15a){
		return command.doLinkOrImage(_159, false, _15a);
	};

	command.undo = {};
	command.undo.description = "Undo";
	command.undo.image = "images/undo.png";
	command.undo.execute = function(_15b){
		_15b.undo();
	};

	command.redo = {};
	command.redo.description = "Redo";
	command.redo.image = "images/redo.png";
	command.redo.execute = function(_15c){
		_15c.redo();
	};
	

	// DONE - jslint clean
	util.findPanes = function(wmdStuff){
		
		// wmdStuff is just a non-special object that keeps our important references in
		// one place.
		//
		// Any div with a class of "wmd-preview" is sent the translated HTML for previewing.
		// Ditto for "wmd-output" --> HTML output.  The first element is selected, as per
		// the WMD documentation.
		wmdStuff.preview = wmdStuff.preview || util.getElementsByClass("wmd-preview", "div")[0];
		wmdStuff.output = wmdStuff.output || util.getElementsByClass("wmd-output", "textarea")[0];
		wmdStuff.output = wmdStuff.output || util.getElementsByClass("wmd-output", "div")[0];
		
		if(!wmdStuff.input){
			
			var inputAreas = doc.getElementsByTagName("textarea");
			
			for(var i = 0; i < inputAreas.length; i++){
				
				var area = inputAreas[i];
				
				// Make sure it's not the output area or selected to ignore.
				if(area != wmdStuff.output && !/wmd-ignore/.test(area.className.toLowerCase())){
					
					// As per the documentation, the first one is the one we use.
					wmdStuff.input = area;
					break;
				}
			}
		}

		return;
	};
	
	// DONE - jslint clean
	util.makeAPI = function(){
		wmd.wmd = {};
		wmd.wmd.editor = wmd.editor;
		wmd.wmd.previewManager = wmd.previewManager;
	};
	
	// DONE - fixed up and jslint clean
	util.startEditor = function(){
	
		if(wmd.wmd_env.autostart === false){
			wmd.editorInit();
			util.makeAPI();
			return;
		}
		
		// wmdStuff is just an empty object that we'll fill with references
		// to the various important parts of the library.  e.g. the 
		// input and output textareas/divs.
		var wmdStuff = {};
		var edit, preview;
		
		// Fired after the page has fully loaded.
		var loadListener = function(){
			
			try{
				// I think the clone equality test is just a strange way to see
				// if the panes got set/reset in findPanes().
				var clone = util.cloneObject(wmdStuff);
				util.findPanes(wmdStuff);
				
				if(!util.objectsEqual(clone, wmdStuff) && wmdStuff.input){
					
					if(!edit){
						
						wmd.editorInit();
						var previewRefreshCallback;
						
						if(wmd.previewManager !== undefined){
							preview = new wmd.previewManager(wmdStuff);
							previewRefreshCallback = preview.refresh;
						}
						
						edit = new wmd.editor(wmdStuff.input, previewRefreshCallback);
					}
					else if(preview){
							
							preview.refresh(true);
					}
				}
			}
			catch(e){
				// Useful!
			}
		};
		
		util.addEvent(self, "load", loadListener);
		var ignored = self.setInterval(loadListener, 100);
	};
	
	// UNFINISHED - needs display stuff
	wmd.previewManager = function(wmdStuff){
		
		// wmdStuff stores random things we need to keep track of, like
		// the input textarea.	
			
		var managerObj = this;
		var converter;
		var poller;
		var timeout;
		var elapsedTime;
		var oldInputText;
		var htmlOut;
		var maxDelay = 3000;
		var startType = "delayed";  // The other legal value is "manual"
		
		// Adds event listeners to elements and creates the input poller.
		var setupEvents = function(inputElem, listener){
			
			util.addEvent(inputElem, "input", listener);
			inputElem.onpaste = listener;
			inputElem.ondrop = listener;
			
			util.addEvent(self, "keypress", listener);		// Why is this one self?
			
			util.addEvent(inputElem, "keypress", listener);
			util.addEvent(inputElem, "keydown", listener);
			poller = new wmd.inputPoller(inputElem, listener);
		};
			
		var _176 = function(){
			var _177 = 0;
			if(self.innerHeight){
				_177 = self.pageYOffset;
			}
			else{
				if(doc.documentElement && doc.documentElement.scrollTop){
					_177 = doc.documentElement.scrollTop;
				}
				else{
					if(doc.body){
						_177 = doc.body.scrollTop;
					}
				}
			}
			return _177;
		};
			
		var makePreviewHtml = function(){
			
			// If there are no registered preview and output panels
			// there is nothing to do.
			if(!wmdStuff.preview && !wmdStuff.output){
				return;
			}
			
			var text = wmdStuff.input.value;
			if(text && text == oldInputText){
				return;	// Input text hasn't changed.
			}
			else{
				oldInputText = text;
			}
			
			var prevTime = new Date().getTime();
			
			if(!converter && wmd.showdown){
				converter = new wmd.showdown.converter();
			}
			
			if(converter){
				text = converter.makeHtml(text);
			}
			
			// Calculate the processing time of the HTML creation.
			// It's used as the delay time in the event listener.
			var currTime = new Date().getTime();
			elapsedTime = currTime - prevTime;
			
			pushPreviewHtml(text);
			htmlOut = text;
		};
			
		// setTimeout is already used.  Used as an event listener.
		var applyTimeout = function(){
			
			if(timeout){
				self.clearTimeout(timeout);
				timeout = undefined;
			}
			
			if(startType !== "manual"){
				
				var delay = 0;
				
				if(startType === "delayed"){
					delay = elapsedTime;
				}
				
				if(delay > maxDelay){
					delay = maxDelay;
				}
				timeout = self.setTimeout(makePreviewHtml, delay);
			}
		};
			
		var _17f;
		var _180;
		
		var _181 = function(_182){
			if(_182.scrollHeight <= _182.clientHeight){
				return 1;
			}
			return _182.scrollTop / (_182.scrollHeight - _182.clientHeight);
		};
			
		var _183 = function(_184,_185){
			_184.scrollTop = (_184.scrollHeight - _184.clientHeight) * _185;
		};
			
		var _186 = function(){
			if(wmdStuff.preview){
				_17f = _181(wmdStuff.preview);
			}
			
			if(wmdStuff.output){
				_180 = _181(wmdStuff.output);
			}
		};
		
		var _187 = function(){
			if(wmdStuff.preview){
				wmdStuff.preview.scrollTop = wmdStuff.preview.scrollTop;
				_183(wmdStuff.preview, _17f);
			}
			if(wmdStuff.output){
				_183(wmdStuff.output, _180);
			}
		};
		
		this.refresh = function(_188){
			if(_188){
				oldInputText = "";
				makePreviewHtml();
			}
			else{
				applyTimeout();
			}
		};
		
		this.processingTime = function(){
			return elapsedTime;
		};
		
		// The output HTML
		this.output = function(){
			return htmlOut;
		};
		
		// The mode can be "manual" or "delayed"
		this.setUpdateMode = function(mode){
			startType = mode;
			managerObj.refresh();
		};
		
		var _18a = true;
		
		var pushPreviewHtml = function(text){
			
			_186();
			var _18c = position.getTop(wmdStuff.input) - _176();
			
			// Send the encoded HTML to the output textarea/div.
			if(wmdStuff.output){
				// The value property is only defined if the output is a textarea.
				if(wmdStuff.output.value !== undefined){
					wmdStuff.output.value = text;
					wmdStuff.output.readOnly = true;
				}
				// Otherwise we are just replacing the text in a div.
				// Send the HTML wrapped in <pre><code>
				else{
					var newText = text.replace(/&/g, "&amp;");
					newText = newText.replace(/</g, "&lt;");
					wmdStuff.output.innerHTML = "<pre><code>" + newText + "</code></pre>";
				}
			}
			
			if(wmdStuff.preview){
				// The preview is just raw HTML
				wmdStuff.preview.innerHTML = text;
			}
			
			_187();
			
			if(_18a){
				_18a = false;
				return;
			}
			
			var _18e = position.getTop(wmdStuff.input) - _176();
			
			if(nav.userAgent.indexOf("MSIE")!=-1){
				self.setTimeout(function(){self.scrollBy(0, _18e - _18c);}, 0);
			}
			else{
				self.scrollBy(0, _18e - _18c);
			}
		};
		
		var init = function(){
			
			setupEvents(wmdStuff.input, applyTimeout);
			makePreviewHtml();
			
			if(wmdStuff.preview){
				wmdStuff.preview.scrollTop = 0;
			}
			if(wmdStuff.output){
				wmdStuff.output.scrollTop = 0;
			}
		};
		
		this.destroy = function(){
			if(poller){
				poller.destroy();
			}
		};
		
		init();
	};
};

if(Attacklab.fileLoaded){
	Attacklab.fileLoaded("wmd-base.js");
}

