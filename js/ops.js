"use strict";

var CABLES=CABLES||{};
CABLES.OPS=CABLES.OPS||{};

var Ops=Ops || {};
Ops.Gl=Ops.Gl || {};
Ops.User=Ops.User || {};
Ops.Date=Ops.Date || {};
Ops.Math=Ops.Math || {};
Ops.Anim=Ops.Anim || {};
Ops.Html=Ops.Html || {};
Ops.Json=Ops.Json || {};
Ops.Array=Ops.Array || {};
Ops.Debug=Ops.Debug || {};
Ops.Value=Ops.Value || {};
Ops.String=Ops.String || {};
Ops.Lottie=Ops.Lottie || {};
Ops.Trigger=Ops.Trigger || {};
Ops.Boolean=Ops.Boolean || {};
Ops.Math.Compare=Ops.Math.Compare || {};
Ops.User.alivemachine=Ops.User.alivemachine || {};



// **************************************************************
// 
// Ops.Debug.Console
// 
// **************************************************************

Ops.Debug.Console = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var visible=op.inValueBool("visible",true);


visible.onChange=function()
{
    if(visible.get()) logger.style.display="block";
        else logger.style.display="none";
};

var logger = document.createElement('div');
logger.style.padding="0px";
logger.style.position="absolute";
logger.style.overflow="scroll";
if(CABLES.UI)
{
    logger.style.width="100%";
    logger.style.height="50%";
}
else
{
    logger.style.width="100vw";
    logger.style.height="50vh";
}
logger.style['background-color']="rgba(0,0,0,0.74)";
logger.style['box-sizing']="border-box";
logger.style.padding="5px";
// logger.style['border-left']="1px solid grey";
// logger.style['border-top']="1px solid grey";
logger.style["z-index"]="9999";
logger.style.color="#fff";


var canvas = op.patch.cgl.canvas.parentElement;
canvas.appendChild(logger);


var oldLog = console.log;
var oldLogError = console.error;
var oldLogWarn = console.warn;
// var logger = document.getElementById('log');
console.log = thelog;
console.error = thelog;
console.warn = thelog;

function thelog()
{
    oldLog(arguments);
    var html='<code style="display:block;overflow:hidden;margin-top:3px;border-bottom:1px solid #000;padding:3px;">';
    for (var i = 0; i < arguments.length; i++)
    {
        if (typeof arguments[i] == 'object') html += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '';
        else html += arguments[i] ;
    }
    logger.innerHTML+=html+ '</code>';
    logger.scrollTop = logger.scrollHeight;
}

op.onDelete=function()
{
    logger.remove();
    console.log=oldLog;
    console.error=oldLogError;
    console.warn=oldLogWarn;
    
};

};

Ops.Debug.Console.prototype = new CABLES.Op();
CABLES.OPS["1e650a0b-672f-4dca-bcf0-5df281a2d31e"]={f:Ops.Debug.Console,objName:"Ops.Debug.Console"};




// **************************************************************
// 
// Ops.Html.ElementChilds
// 
// **************************************************************

Ops.Html.ElementChilds = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    parentPort = op.inObject("Parent");

const inPorts = [];
for (let i = 0; i < 10; i++)
{
    const p = op.inObject("Child " + (i + 1));
    inPorts.push(p);
    p.onChange = rebuild;
}

parentPort.onChange = rebuild;

function rebuild()
{
    const parent = parentPort.get();
    if (!parent) return;

    let child = parent.lastElementChild;
    while (child)
    {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }

    for (let i = 0; i < inPorts.length; i++)
    {
        const p = inPorts[i].get();
        if (p)
        {
            parent.appendChild(p);
        }
    }
}


};

Ops.Html.ElementChilds.prototype = new CABLES.Op();
CABLES.OPS["65c535ef-70f0-47f6-bb82-5b6c8e6d9dd9"]={f:Ops.Html.ElementChilds,objName:"Ops.Html.ElementChilds"};




// **************************************************************
// 
// Ops.Html.CSS_v2
// 
// **************************************************************

Ops.Html.CSS_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var code=op.inStringEditor("css code");

code.setUiAttribs({editorSyntax:'css'});


var styleEle=null;
var eleId='css_'+CABLES.uuid();

code.onChange=update;
update();


function getCssContent()
{
    var css=code.get();
    css = css.replace(/{{ASSETPATH}}/g, op.patch.getAssetPath());
    return css;
}

function update()
{
    styleEle=document.getElementById(eleId);

    if(styleEle)
    {
        styleEle.textContent=getCssContent();
    }
    else
    {
        styleEle  = document.createElement('style');
        styleEle.type = 'text/css';
        styleEle.id = eleId;
        styleEle.textContent=getCssContent();

        var head  = document.getElementsByTagName('body')[0];
        head.appendChild(styleEle);
    }
}

op.onDelete=function()
{
    styleEle=document.getElementById(eleId);
    if(styleEle)styleEle.remove();
};


};

Ops.Html.CSS_v2.prototype = new CABLES.Op();
CABLES.OPS["a56d3edd-06ad-44ed-9810-dbf714600c67"]={f:Ops.Html.CSS_v2,objName:"Ops.Html.CSS_v2"};




// **************************************************************
// 
// Ops.Array.ArraySetString
// 
// **************************************************************

Ops.Array.ArraySetString = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    exe = op.inTriggerButton("Execute"),
    array = op.inArray("Array"),
    index = op.inValueInt("Index"),
    value = op.inString("String"),
    values = op.outArray("Result");

values.ignoreValueSerialize = true;
exe.onTriggered = update;

function updateIndex()
{
    if (exe.isLinked()) return;
    update();
}

function update()
{
    const arr = array.get();
    if (!arr) return;
    arr[index.get()] = value.get();

    values.set("");
    values.set(arr);
}


};

Ops.Array.ArraySetString.prototype = new CABLES.Op();
CABLES.OPS["2752b35e-592d-41db-b8dd-cdc43a7ccbe2"]={f:Ops.Array.ArraySetString,objName:"Ops.Array.ArraySetString"};




// **************************************************************
// 
// Ops.Array.ArrayToString_v3
// 
// **************************************************************

Ops.Array.ArrayToString_v3 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inArr=op.inArray("Array"),
    inSeperator=op.inString("Seperator",","),
    inNewLine=op.inValueBool("New Line"),
    outStr=op.outString("Result");

inArr.onChange=
    outStr.onChange=
    inSeperator.onChange=
    inNewLine.onChange=exec;


function exec()
{
    var arr=inArr.get();
    var result='';

    var sep=inSeperator.get();
    if(inNewLine.get())sep+='\n';

    if(arr && arr.join)
    {
        result=arr.join(sep);
    }

    outStr.set(result);
}

};

Ops.Array.ArrayToString_v3.prototype = new CABLES.Op();
CABLES.OPS["7b539bb3-8e86-4367-9e00-a637d3cfd87a"]={f:Ops.Array.ArrayToString_v3,objName:"Ops.Array.ArrayToString_v3"};




// **************************************************************
// 
// Ops.Html.DivElement_v2
// 
// **************************************************************

Ops.Html.DivElement_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inText = op.inString("Text", "Hello Div"),
    inId = op.inString("Id"),
    inClass = op.inString("Class"),
    inStyle = op.inValueEditor("Style", "position:absolute;z-index:9999;", "none"),
    inInteractive = op.inValueBool("Interactive", false),
    inVisible = op.inValueBool("Visible", true),
    inBreaks = op.inValueBool("Convert Line Breaks", false),
    outElement = op.outObject("DOM Element"),
    outHover = op.outValue("Hover"),
    outClicked = op.outTrigger("Clicked");

let listenerElement = null;
let oldStr = null;
let prevDisplay = "block";

const div = document.createElement("div");
div.dataset.op = op.id;
const canvas = op.patch.cgl.canvas.parentElement;

canvas.appendChild(div);
outElement.set(div);

inClass.onChange = updateClass;
inBreaks.onChange = inText.onChange = updateText;
inStyle.onChange = updateStyle;
inInteractive.onChange = updateInteractive;
inVisible.onChange = updateVisibility;

updateText();
updateStyle();
warning();

op.onDelete = removeElement;

outElement.onLinkChanged = updateStyle;

function setCSSVisible(visible)
{
    if (!visible)
    {
        div.style.visibility = "hidden";
        prevDisplay = div.style.display || "block";
        div.style.display = "none";
    }
    else
    {
        // prevDisplay=div.style.display||'block';
        if (prevDisplay == "none") prevDisplay = "block";
        div.style.visibility = "visible";
        div.style.display = prevDisplay;
    }
}

function updateVisibility()
{
    setCSSVisible(inVisible.get());
}


function updateText()
{
    let str = inText.get();
    // console.log(oldStr,str);

    if (oldStr === str) return;
    oldStr = str;

    if (str && inBreaks.get()) str = str.replace(/(?:\r\n|\r|\n)/g, "<br>");

    if (div.innerHTML != str) div.innerHTML = str;
    outElement.set(null);
    outElement.set(div);
}

function removeElement()
{
    if (div && div.parentNode) div.parentNode.removeChild(div);
}
// inline css inisde div
function updateStyle()
{
    if (inStyle.get() != div.style)
    {
        div.setAttribute("style", inStyle.get());
        updateVisibility();
        outElement.set(null);
        outElement.set(div);
    }
    warning();
}

function updateClass()
{
    div.setAttribute("class", inClass.get());
    warning();
}

function onMouseEnter()
{
    outHover.set(true);
}

function onMouseLeave()
{
    outHover.set(false);
}

function onMouseClick()
{
    outClicked.trigger();
}

function updateInteractive()
{
    removeListeners();
    if (inInteractive.get()) addListeners();
}

inId.onChange = function ()
{
    div.id = inId.get();
};

function removeListeners()
{
    if (listenerElement)
    {
        listenerElement.removeEventListener("click", onMouseClick);
        listenerElement.removeEventListener("mouseleave", onMouseLeave);
        listenerElement.removeEventListener("mouseenter", onMouseEnter);
        listenerElement = null;
    }
}

function addListeners()
{
    if (listenerElement)removeListeners();

    listenerElement = div;

    if (listenerElement)
    {
        listenerElement.addEventListener("click", onMouseClick);
        listenerElement.addEventListener("mouseleave", onMouseLeave);
        listenerElement.addEventListener("mouseenter", onMouseEnter);
    }
}

op.addEventListener("onEnabledChange", function (enabled)
{
    op.log("css changed");
    setCSSVisible(div.style.visibility != "visible");
});

function warning()
{
    if (inClass.get() && inStyle.get())
    {
        op.setUiError("error", "DIV uses external and inline CSS", 1);
    }
    else
    {
        op.setUiError("error", null);
    }
}


};

Ops.Html.DivElement_v2.prototype = new CABLES.Op();
CABLES.OPS["db36db6d-83e4-4d27-b84c-8a20067aaffc"]={f:Ops.Html.DivElement_v2,objName:"Ops.Html.DivElement_v2"};




// **************************************************************
// 
// Ops.Trigger.TriggerOnChangeString
// 
// **************************************************************

Ops.Trigger.TriggerOnChangeString = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inval=op.inString("String"),
    next=op.outTrigger("Changed"),
    outStr=op.outString("Result");

inval.onChange=function()
{
    outStr.set(inval.get());
    next.trigger();
};

};

Ops.Trigger.TriggerOnChangeString.prototype = new CABLES.Op();
CABLES.OPS["319d07e0-5cbe-4bc1-89fb-a934fd41b0c4"]={f:Ops.Trigger.TriggerOnChangeString,objName:"Ops.Trigger.TriggerOnChangeString"};




// **************************************************************
// 
// Ops.Trigger.TriggerString
// 
// **************************************************************

Ops.Trigger.TriggerString = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    exec = op.inTriggerButton("Trigger"),
    inString = op.inString("String", ""),
    next = op.outTrigger("Next"),
    outString = op.outString("Result");

outString.changeAlways = true;
exec.onTriggered = function ()
{
    outString.set(inString.get());
    next.trigger();
};


};

Ops.Trigger.TriggerString.prototype = new CABLES.Op();
CABLES.OPS["217482b8-2ee6-4609-b7ad-4550e6aaa371"]={f:Ops.Trigger.TriggerString,objName:"Ops.Trigger.TriggerString"};




// **************************************************************
// 
// Ops.Math.MathExpression
// 
// **************************************************************

Ops.Math.MathExpression = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const inA = op.inFloat("A", 0);
const inB = op.inFloat("B", 1);
const inC = op.inFloat("C", 2);
const inD = op.inFloat("D", 3);
op.setPortGroup("Parameters", [inA, inB, inC, inD]);
const inExpression = op.inString("Expression", "a*(b+c+d)");
op.setPortGroup("Expression", [inExpression]);
const outResult = op.outNumber("Result");
const outExpressionIsValid = op.outBool("Expression Valid");

let currentFunction = inExpression.get();
let functionValid = false;

const createFunction = () =>
{
    try
    {
        currentFunction = new Function("m", "a", "b", "c", "d", `with(m) { return ${inExpression.get()} }`);
        functionValid = true;
        evaluateFunction();
        outExpressionIsValid.set(functionValid);
    }
    catch (e)
    {
        functionValid = false;
        outExpressionIsValid.set(functionValid);
        if (e instanceof ReferenceError || e instanceof SyntaxError) return;
    }
};

const evaluateFunction = () =>
{
    if (functionValid)
    {
        outResult.set(currentFunction(Math, inA.get(), inB.get(), inC.get(), inD.get()));
        if (!inExpression.get()) outResult.set(0);
    }

    outExpressionIsValid.set(functionValid);
};


inA.onChange = inB.onChange = inC.onChange = inD.onChange = evaluateFunction;
inExpression.onChange = createFunction;
createFunction();


};

Ops.Math.MathExpression.prototype = new CABLES.Op();
CABLES.OPS["d2343a1e-64ea-45b2-99ed-46e167bbdcd3"]={f:Ops.Math.MathExpression,objName:"Ops.Math.MathExpression"};




// **************************************************************
// 
// Ops.Json.AjaxRequest_v2
// 
// **************************************************************

Ops.Json.AjaxRequest_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const filename = op.inUrl("file"),
    jsonp = op.inValueBool("JsonP", false),
    headers = op.inObject("headers", {}),
    inBody = op.inStringEditor("body", ""),
    inMethod = op.inDropDown("HTTP Method", ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "CONNECT", "OPTIONS", "TRACE"], "GET"),
    inContentType = op.inString("Content-Type", "application/json"),
    inParseJson = op.inBool("parse json", true),
    reloadTrigger = op.inTriggerButton("reload"),
    outData = op.outObject("data"),
    outString = op.outString("response"),
    isLoading = op.outValue("Is Loading", false),
    outTrigger = op.outTrigger("Loaded");

filename.setUiAttribs({ "title": "URL" });

outData.ignoreValueSerialize = true;

filename.onChange = jsonp.onChange = headers.onChange = inMethod.onChange = inParseJson.onChange = delayedReload;

reloadTrigger.onTriggered = function ()
{
    delayedReload();
};

let loadingId = 0;
let reloadTimeout = 0;

function delayedReload()
{
    clearTimeout(reloadTimeout);
    reloadTimeout = setTimeout(reload, 100);
}

op.onFileChanged = function (fn)
{
    if (filename.get() && filename.get().indexOf(fn) > -1) reload(true);
};

function reload(addCachebuster)
{
    if (!filename.get()) return;

    op.patch.loading.finished(loadingId);

    loadingId = op.patch.loading.start("jsonFile", "" + filename.get());
    isLoading.set(true);

    op.setUiAttrib({ "extendTitle": CABLES.basename(filename.get()) });

    op.setUiError("jsonerr", null);

    let httpClient = CABLES.ajax;
    if (jsonp.get()) httpClient = CABLES.jsonp;

    let url = op.patch.getFilePath(filename.get());
    if (addCachebuster)url += "?rnd=" + CABLES.generateUUID();

    const body = inBody.get();
    httpClient(
        url,
        (err, _data, xhr) =>
        {
            if (err)
            {
                op.error(err);
                return;
            }
            try
            {
                let data = _data;
                outData.set(null);
                if (typeof data === "string" && inParseJson.get())
                {
                    data = JSON.parse(_data);
                    outData.set(data);
                }
                outString.set(null);
                outString.set(_data);
                op.uiAttr({ "error": null });
                op.patch.loading.finished(loadingId);
                outTrigger.trigger();
                isLoading.set(false);
            }
            catch (e)
            {
                op.error(e);
                op.setUiError("jsonerr", "Problem while loading json:<br/>" + e);
                op.patch.loading.finished(loadingId);
                isLoading.set(false);
            }
        },
        inMethod.get(),
        (body && body.length > 0) ? body : null,
        inContentType.get(),
        null,
        headers.get() || {}
    );
}


};

Ops.Json.AjaxRequest_v2.prototype = new CABLES.Op();
CABLES.OPS["e0879058-5505-4dc4-b9ff-47a3d3c8a71a"]={f:Ops.Json.AjaxRequest_v2,objName:"Ops.Json.AjaxRequest_v2"};




// **************************************************************
// 
// Ops.String.StringCompose_v3
// 
// **************************************************************

Ops.String.StringCompose_v3 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    format=op.inString('Format',"hello $a, $b $c und $d"),
    a=op.inString('String A','world'),
    b=op.inString('String B',1),
    c=op.inString('String C',2),
    d=op.inString('String D',3),
    e=op.inString('String E'),
    f=op.inString('String F'),
    result=op.outString("Result");

format.onChange=
    a.onChange=
    b.onChange=
    c.onChange=
    d.onChange=
    e.onChange=
    f.onChange=update;

update();

function update()
{
    var str=format.get()||'';
    if(typeof str!='string')
        str='';

    str = str.replace(/\$a/g, a.get());
    str = str.replace(/\$b/g, b.get());
    str = str.replace(/\$c/g, c.get());
    str = str.replace(/\$d/g, d.get());
    str = str.replace(/\$e/g, e.get());
    str = str.replace(/\$f/g, f.get());

    result.set(str);
}

};

Ops.String.StringCompose_v3.prototype = new CABLES.Op();
CABLES.OPS["6afea9f4-728d-4f3c-9e75-62ddc1448bf0"]={f:Ops.String.StringCompose_v3,objName:"Ops.String.StringCompose_v3"};




// **************************************************************
// 
// Ops.String.String_v2
// 
// **************************************************************

Ops.String.String_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    v=op.inString("value",""),
    result=op.outString("String");

v.onChange=function()
{
    result.set(v.get());
};



};

Ops.String.String_v2.prototype = new CABLES.Op();
CABLES.OPS["d697ff82-74fd-4f31-8f54-295bc64e713d"]={f:Ops.String.String_v2,objName:"Ops.String.String_v2"};




// **************************************************************
// 
// Ops.Json.ObjectGetObject_v2
// 
// **************************************************************

Ops.Json.ObjectGetObject_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    data = op.inObject("Object"),
    key = op.inString("Key"),
    result = op.outObject("Result");

result.ignoreValueSerialize = true;
data.ignoreValueSerialize = true;

key.onChange = function ()
{
    op.setUiAttrib({ "extendTitle": key.get() });
    update();
};

data.onChange = update;

function update()
{
    if (data.get() && data.get().hasOwnProperty(key.get()))
    {
        result.set(data.get()[key.get()]);
    }
    else
    {
        result.set(null);
    }
}


};

Ops.Json.ObjectGetObject_v2.prototype = new CABLES.Op();
CABLES.OPS["d1dfa305-89db-4ca1-b0ac-2d6321d76ae8"]={f:Ops.Json.ObjectGetObject_v2,objName:"Ops.Json.ObjectGetObject_v2"};




// **************************************************************
// 
// Ops.Json.ObjectGetString
// 
// **************************************************************

Ops.Json.ObjectGetString = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var data=op.inObject("data");
var key = op.inString("Key");
const result=op.outString("Result");

result.ignoreValueSerialize=true;
data.ignoreValueSerialize=true;

key.onChange=function()
{
    op.setUiAttrib({ extendTitle: key.get() });
    exec();
};
data.onChange=exec;

function exec()
{
    if(data.get() && data.get().hasOwnProperty(key.get()))
    {
        result.set( data.get()[key.get()] );
    }
    else
    {
        result.set(null);
    }
}


};

Ops.Json.ObjectGetString.prototype = new CABLES.Op();
CABLES.OPS["7d86cd28-f7d8-44a1-a4da-466c4782aaec"]={f:Ops.Json.ObjectGetString,objName:"Ops.Json.ObjectGetString"};




// **************************************************************
// 
// Ops.String.StripHtml
// 
// **************************************************************

Ops.String.StripHtml = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inStr = op.inString("String", ""),
    outStr = op.outString("Result");

inStr.onChange = function ()
{
    // outStr.set((inStr.get() || "").replace(/(<([^>]+)>)/ig, ""));

    const parser = new DOMParser();
    const dom = parser.parseFromString(inStr.get(), "text/html");

    outStr.set(dom.body.textContent);
};


};

Ops.String.StripHtml.prototype = new CABLES.Op();
CABLES.OPS["8a868fc7-363f-4221-9789-67ffe5830e36"]={f:Ops.String.StripHtml,objName:"Ops.String.StripHtml"};




// **************************************************************
// 
// Ops.Json.ParseObject_v2
// 
// **************************************************************

Ops.Json.ParseObject_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    str=op.inStringEditor("JSON String",'{}',"json"),
    outObj=op.outObject("Result"),
    isValid=op.outValue("Valid");

str.onChange=parse;
parse();

function parse()
{
    try
    {
        var obj=JSON.parse(str.get());
        outObj.set(null);
        outObj.set(obj);
        isValid.set(true);
        op.setUiError("invalidjson",null);
    }
    catch(ex)
    {
        console.log(JSON.stringify(ex));
        isValid.set(false);

        var outStr="";
        var parts=ex.message.split(" ");
        for(var i=0;i<parts.length-1;i++)
        {
            var num=parseFloat(parts[i+1]);
            if(num && parts[i]=="position")
            {
                const outStrA=str.get().substring(num-15, num);
                const outStrB=str.get().substring(num, num+1);
                const outStrC=str.get().substring(num+1, num+15);
                outStr='<span style="font-family:monospace;background-color:black;">'+outStrA+'<span style="font-weight:bold;background-color:red;">'+outStrB+"</span>"+outStrC+" </span>";
            }
        }

        op.setUiError("invalidjson","INVALID JSON<br/>can not parse string to object:<br/><b> "+ex.message+'</b><br/>'+outStr);
    }
}


};

Ops.Json.ParseObject_v2.prototype = new CABLES.Op();
CABLES.OPS["2ce8a4d3-37d3-4cdc-abd1-a560fbe841ee"]={f:Ops.Json.ParseObject_v2,objName:"Ops.Json.ParseObject_v2"};




// **************************************************************
// 
// Ops.String.ConcatMulti
// 
// **************************************************************

Ops.String.ConcatMulti = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

const addSpacesCheckBox = op.inBool("add spaces",false),
        newLinesCheckBox = op.inBool("new lines",false),
        stringPorts = [],
        result = op.outString("concat string");


stringPorts.onChange = addSpacesCheckBox.onChange =
newLinesCheckBox.onChange = update;

addSpacesCheckBox.hidePort(true);
newLinesCheckBox.hidePort(true);

for(var i=0; i<8; i++)
{
    var p=op.inString("string " + i);
    stringPorts.push(p);
    p.onChange = update;
}

function update()
{
    var str = "";
    var nl = "";
    var space = addSpacesCheckBox.get();

    for(var i=0; i<stringPorts.length; i++)
    {
        const inString=stringPorts[i].get();
        if(!inString)continue;
        if(space) str += " ";
        if(i>0 && newLinesCheckBox.get()) nl = '\n';
        str += nl;
        str += inString;
    }
    result.set(str);
}


};

Ops.String.ConcatMulti.prototype = new CABLES.Op();
CABLES.OPS["21d3dcc6-3c5b-4e94-97dc-ef7720e9e00d"]={f:Ops.String.ConcatMulti,objName:"Ops.String.ConcatMulti"};




// **************************************************************
// 
// Ops.String.NumberToString_v2
// 
// **************************************************************

Ops.String.NumberToString_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    val=op.inValue("Number"),
    result=op.outString("Result");

val.onChange=update;
update();

function update()
{
    result.set( String(val.get()||0));
}



};

Ops.String.NumberToString_v2.prototype = new CABLES.Op();
CABLES.OPS["5c6d375a-82db-4366-8013-93f56b4061a9"]={f:Ops.String.NumberToString_v2,objName:"Ops.String.NumberToString_v2"};




// **************************************************************
// 
// Ops.Json.ObjectIterate
// 
// **************************************************************

Ops.Json.ObjectIterate = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var inObj=op.inObject("Object");
var outKey=op.outValue("Key");

inObj.onChange=function()
{
    var obj=inObj.get();
    
    if(obj)
    {
        for(var i in obj)
        {
            outKey.set(i);
        }
    }
};

};

Ops.Json.ObjectIterate.prototype = new CABLES.Op();
CABLES.OPS["128f5b07-17f9-43fb-ab61-c170a9a9cd8d"]={f:Ops.Json.ObjectIterate,objName:"Ops.Json.ObjectIterate"};




// **************************************************************
// 
// Ops.Gl.CanvasInfo
// 
// **************************************************************

Ops.Gl.CanvasInfo = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};


const
    width=op.outValue("width"),
    height=op.outValue("height"),
    pixelRatio=op.outValue("Pixel Ratio"),
    aspect=op.outValue("Aspect Ratio"),
    landscape=op.outValueBool("Landscape");

var cgl=op.patch.cgl;
cgl.addEventListener("resize",update);
update();

function update()
{
    height.set(cgl.canvasHeight);
    width.set(cgl.canvasWidth);
    pixelRatio.set(window.devicePixelRatio);
    aspect.set(cgl.canvasWidth/cgl.canvasHeight);
    landscape.set(cgl.canvasWidth>cgl.canvasHeight);
}


};

Ops.Gl.CanvasInfo.prototype = new CABLES.Op();
CABLES.OPS["94e499e5-b4ee-4861-ab48-6ab5098b2cc3"]={f:Ops.Gl.CanvasInfo,objName:"Ops.Gl.CanvasInfo"};




// **************************************************************
// 
// Ops.String.RandomString_v2
// 
// **************************************************************

Ops.String.RandomString_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    chars=op.inString("chars","cables"),
    len=op.inValueInt("Length",10),
    generate=op.inTriggerButton("Generate"),
    result=op.outString("Result");

generate.onTriggered=gen;
gen();

function gen()
{
    var numChars=chars.get().length-1;
    var str='';
    for(var i=0;i<Math.abs(len.get());i++)
        str+=chars.get()[Math.round(Math.random()*numChars)];

    result.set(str);
}

};

Ops.String.RandomString_v2.prototype = new CABLES.Op();
CABLES.OPS["55285d4a-f542-4c8b-9839-02b33b15c916"]={f:Ops.String.RandomString_v2,objName:"Ops.String.RandomString_v2"};




// **************************************************************
// 
// Ops.User.alivemachine.Runway
// 
// **************************************************************

Ops.User.alivemachine.Runway = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
// your new op
// have a look at the documentation at:
// https://docs.cables.gl/dev_hello_op/dev_hello_op.html
// inputs

const triggerIn = op.inTrigger("trigger");
const routeIn = op.inString("route","");
//const filterIn = op.inString("inputkey","");
const dataIn = op.inString("inputdata","");
//const filterOut = op.inString("outputkey","");

//const imageIn = op.inTexture("image");


// outputs


const dataOut = op.outString("outputdata");


dataIn.onChange = go;
triggerIn.onTriggered = go;
var outputs = ["output_image", "image", "output", "result", "generated_text", "caption", "stylizedImage"]

function  go() {
    op.log("go")
    //var xmlHttp = new XMLHttpRequest();
    //xmlHttp.open( "GET", routeIn.get(), false ); // false for synchronous request
    //xmlHttp.send( null );
    //dataOut.set(JSON.parse(xmlHttp.responseText)[filterOut.get])

    httpPostAsync(routeIn.get(), function(result){
        //dataOut.set(JSON.parse(result)[filterOut.get()])

        for(var i = 0; i<outputs.length; i++){
            if(JSON.parse(result)[outputs[i]]!="undefined"){
                dataOut.set(JSON.parse(result)[outputs[i]])
            }
        }

        //dataOut.set(JSON.parse(result)[filterOut.get()])
    })
}
/*
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}
*/

function httpPostAsync(theUrl, callback) {
    var dat = dataIn.get();
const inputs = {
  "caption":dat,
  "input_image":dat,
  "contentImage":dat,
  "image":dat,
  "num_octaves": 2,
  "iterations": 50,
  "octave_scale": 1,
  "features_mixed_2": 1.8,
  "features_mixed_3": 1.7,
  "features_mixed_4": 1.4,
  "features_mixed_5": 1.9,
  "alpha_normal": 1,
  "prompt": dat,
  "max_characters": 128,
  "top_p": .5,
  "seed": 54,
  "semantic_map":dat
};
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", theUrl, true);
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }

    xmlHttp.send(JSON.stringify(inputs));
}


};

Ops.User.alivemachine.Runway.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.Html.IFrame_v3
// 
// **************************************************************

Ops.Html.IFrame_v3 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    src=op.inString("URL",'https://undev.studio'),
    elId=op.inString("ID"),
    active=op.inBool("Active",true),
    inStyle=op.inStringEditor("Style","position:absolute;\nz-index:9999;\nborder:0;\nwidth:50%;\nheight:50%;"),
    outEle=op.outObject("Element");

op.setPortGroup('Attributes',[src,elId]);

let element=null;

op.onDelete=removeEle;

op.onLoaded=()=>
{
    console.log("init!");
    addElement();
    updateSoon();

    inStyle.onChange=
    src.onChange=
    elId.onChange=updateSoon;

    active.onChange=updateActive;
};


function addElement()
{
    if(!active.get()) return;
    if(element) removeEle();
    element = document.createElement('iframe');
    updateAttribs();
    const parent = op.patch.cgl.canvas.parentElement;
    parent.appendChild(element);
    outEle.set(element);
}

let timeOut=null;

function updateSoon()
{
    clearTimeout(timeOut);
    timeOut=setTimeout(updateAttribs,30);
}

function updateAttribs()
{
    if(!element)return;
    element.setAttribute("style",inStyle.get());
    element.setAttribute('src',src.get());
    element.setAttribute('id',elId.get());

    console.log(src.get(),elId.get(),active.get());
}

function removeEle()
{
    if(element && element.parentNode)element.parentNode.removeChild(element);
    element=null;
    outEle.set(element);
}

function updateActive()
{
    if(!active.get())
    {
        removeEle();
        return;
    }

    addElement();
}









};

Ops.Html.IFrame_v3.prototype = new CABLES.Op();
CABLES.OPS["9e74b275-a1ed-4d10-aba4-4b3311363a99"]={f:Ops.Html.IFrame_v3,objName:"Ops.Html.IFrame_v3"};




// **************************************************************
// 
// Ops.String.StringContains_v2
// 
// **************************************************************

Ops.String.StringContains_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inStr=op.inString("String"),
    inValue=op.inString("SearchValue"),
    outFound=op.outValue("Found",false),
    outIndex=op.outValue("Index",-1);

inValue.onChange=
    inStr.onChange=exec;

exec();

function exec()
{
    if(inStr.get() && inValue.get().length>0)
    {
        const index=inStr.get().indexOf(inValue.get());
        outIndex.set(index);
        outFound.set(index>-1);
    }
    else
    {
        outIndex.set(-1);
        outFound.set(false);
    }
}

};

Ops.String.StringContains_v2.prototype = new CABLES.Op();
CABLES.OPS["2ca3e5d7-e6b4-46a7-8381-3fe1ad8b6879"]={f:Ops.String.StringContains_v2,objName:"Ops.String.StringContains_v2"};




// **************************************************************
// 
// Ops.String.GateString
// 
// **************************************************************

Ops.String.GateString = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    valueInPort = op.inString('String In', 'hello'),
    passThroughPort = op.inValueBool('Pass Through',false),
    valueOutPort = op.outString('String Out','');

valueInPort.onChange =
passThroughPort.onChange = update;

function update()
{
    if(passThroughPort.get())
    {
        valueOutPort.set(null);
        valueOutPort.set(valueInPort.get());
    }
        // else
        // valueOutPort.set('');
}

};

Ops.String.GateString.prototype = new CABLES.Op();
CABLES.OPS["0ce14933-2d91-4381-9d82-2304aae22c0e"]={f:Ops.String.GateString,objName:"Ops.String.GateString"};




// **************************************************************
// 
// Ops.Boolean.ToggleBoolValue
// 
// **************************************************************

Ops.Boolean.ToggleBoolValue = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    bool=op.inValueBool("in bool"),
    outbool=op.outValueBool("out bool");

bool.changeAlways=true;

bool.onChange=function()
{
    outbool.set( ! (true==bool.get()) );
};

};

Ops.Boolean.ToggleBoolValue.prototype = new CABLES.Op();
CABLES.OPS["7b1abd02-3aad-4106-9848-7f4c3cfab6a9"]={f:Ops.Boolean.ToggleBoolValue,objName:"Ops.Boolean.ToggleBoolValue"};




// **************************************************************
// 
// Ops.String.FilterValidString
// 
// **************************************************************

Ops.String.FilterValidString = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

const
    inStr=op.inString("String",""),
    checkNull=op.inBool("Invalid if null",true),
    checkUndefined=op.inBool("Invalid if undefined",true),
    checkEmpty=op.inBool("Invalid if empty",true),
    checkZero=op.inBool("Invalid if 0",true),
    outStr=op.outString("Last Valid String"),
    result=op.outBool("Is Valid");

inStr.onChange=
checkNull.onChange=
checkUndefined.onChange=
checkEmpty.onChange=
function()
{
    const str=inStr.get();
    var r=true;

    if(r===false)r=false;
    if(r && checkZero.get() && (str===0 || str==="0")) r=false;
    if(r && checkNull.get() && str===null) r=false;
    if(r && checkUndefined.get() && str===undefined) r=false;
    if(r && checkEmpty.get() && str==="") r=false;

    if(r)outStr.set(str);

    result.set(r);

};


};

Ops.String.FilterValidString.prototype = new CABLES.Op();
CABLES.OPS["a522235d-f220-46ea-bc26-13a5b20ec8c6"]={f:Ops.String.FilterValidString,objName:"Ops.String.FilterValidString"};




// **************************************************************
// 
// Ops.Anim.Timer_v2
// 
// **************************************************************

Ops.Anim.Timer_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inSpeed = op.inValue("Speed", 1),
    playPause = op.inValueBool("Play", true),
    reset = op.inTriggerButton("Reset"),
    inSyncTimeline = op.inValueBool("Sync to timeline", false),
    outTime = op.outValue("Time");

op.setPortGroup("Controls", [playPause, reset, inSpeed]);

const timer = new CABLES.Timer();
let lastTime = null;
let time = 0;
let syncTimeline = false;

playPause.onChange = setState;
setState();

function setState()
{
    if (playPause.get())
    {
        timer.play();
        op.patch.addOnAnimFrame(op);
    }
    else
    {
        timer.pause();
        op.patch.removeOnAnimFrame(op);
    }
}

reset.onTriggered = doReset;

function doReset()
{
    time = 0;
    lastTime = null;
    timer.setTime(0);
    outTime.set(0);
}

inSyncTimeline.onChange = function ()
{
    syncTimeline = inSyncTimeline.get();
    playPause.setUiAttribs({ "greyout": syncTimeline });
    reset.setUiAttribs({ "greyout": syncTimeline });
};

op.onAnimFrame = function (tt)
{
    if (timer.isPlaying())
    {
        if (CABLES.overwriteTime !== undefined)
        {
            outTime.set(CABLES.overwriteTime * inSpeed.get());
        }
        else

        if (syncTimeline)
        {
            outTime.set(tt * inSpeed.get());
        }
        else
        {
            timer.update();
            const timerVal = timer.get();

            if (lastTime === null)
            {
                lastTime = timerVal;
                return;
            }

            const t = Math.abs(timerVal - lastTime);
            lastTime = timerVal;

            time += t * inSpeed.get();
            if (time != time)time = 0;
            outTime.set(time);
        }
    }
};


};

Ops.Anim.Timer_v2.prototype = new CABLES.Op();
CABLES.OPS["aac7f721-208f-411a-adb3-79adae2e471a"]={f:Ops.Anim.Timer_v2,objName:"Ops.Anim.Timer_v2"};




// **************************************************************
// 
// Ops.Math.Modulo
// 
// **************************************************************

Ops.Math.Modulo = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const result=op.outValue("result");
const number1=op.inValueFloat("number1");
const number2=op.inValueFloat("number2");
const pingpong=op.inValueBool("pingpong");

// pointer to function
var calculateFunction = calculateModule;

number1.onChange=exec;
number2.onChange=exec;

number1.set(1);
number2.set(2);

pingpong.onChange=updatePingPong;

function exec()
{
    var n2=number2.get();
    var n1=number1.get();

    result.set( calculateFunction(n1, n2) );
    return;
}

function calculateModule(n1, n2) {
    var re = ((n1%n2)+n2)%n2;
    if(re!=re) re=0;
    return re;
}

function calculatePingPong(n1, n2) {
    var r = ((n1%n2)+n2)%n2*2;
    if(r>n2) return n2 * 2.0-r;
    else return r;
}

function updatePingPong()
{
    if (pingpong.get()) calculateFunction = calculatePingPong;
    else calculateFunction = calculateModule;
}



};

Ops.Math.Modulo.prototype = new CABLES.Op();
CABLES.OPS["ebc13b25-3705-4265-8f06-5f985b6a7bb1"]={f:Ops.Math.Modulo,objName:"Ops.Math.Modulo"};




// **************************************************************
// 
// Ops.Value.Integer
// 
// **************************************************************

Ops.Value.Integer = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    input = op.inInt("Integer",0),
    output = op.outNumber("Number out");

input.onChange=function()
{
    output.set(Math.floor(input.get()));
}

};

Ops.Value.Integer.prototype = new CABLES.Op();
CABLES.OPS["17bc01d7-04ad-4aab-b88b-bb09744c4a69"]={f:Ops.Value.Integer,objName:"Ops.Value.Integer"};




// **************************************************************
// 
// Ops.Value.TriggerOnChangeNumber
// 
// **************************************************************

Ops.Value.TriggerOnChangeNumber = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const inval = op.inValue("Value");
const next = op.outTrigger("Next");
const number = op.outValue("Number");

inval.onChange = function ()
{
    number.set(inval.get());
    next.trigger();
};


};

Ops.Value.TriggerOnChangeNumber.prototype = new CABLES.Op();
CABLES.OPS["f5c8c433-ce13-49c4-9a33-74e98f110ed0"]={f:Ops.Value.TriggerOnChangeNumber,objName:"Ops.Value.TriggerOnChangeNumber"};




// **************************************************************
// 
// Ops.Trigger.TriggerCounter
// 
// **************************************************************

Ops.Trigger.TriggerCounter = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    exe=op.inTriggerButton("exe"),
    reset=op.inTriggerButton("reset"),
    trigger=op.outTrigger("trigger"),
    num=op.outValue("timesTriggered");

op.toWorkPortsNeedToBeLinked(exe);

var n=0;

exe.onTriggered= function()
{
    n++;
    num.set(n);
    trigger.trigger();
};

reset.onTriggered= function()
{
    n=0;
    num.set(n);
};

};

Ops.Trigger.TriggerCounter.prototype = new CABLES.Op();
CABLES.OPS["e640619f-235c-4543-bbf8-b358e0283180"]={f:Ops.Trigger.TriggerCounter,objName:"Ops.Trigger.TriggerCounter"};




// **************************************************************
// 
// Ops.Array.ArrayReverse
// 
// **************************************************************

Ops.Array.ArrayReverse = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var inArr=op.inArray("Input");
var outArr=op.outArray("Result");

inArr.onChange=function()
{
    var arr=inArr.get();
    if(arr) {
        var arrCopy = arr.slice();
        outArr.set(arrCopy.reverse());
    }
};

};

Ops.Array.ArrayReverse.prototype = new CABLES.Op();
CABLES.OPS["88d8662f-2c01-42e6-943d-4d3cf90657b0"]={f:Ops.Array.ArrayReverse,objName:"Ops.Array.ArrayReverse"};




// **************************************************************
// 
// Ops.Array.Array_v2
// 
// **************************************************************

Ops.Array.Array_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inLength=op.inValueInt("Array length",10),
    modeSelect = op.inSwitch("Mode select",['Number','1,2,3,4',"0-1","1-0"],'Number'),
    inDefaultValue=op.inValueFloat("Default Value"),
    outArr=op.outArray("Array"),
    outArrayLength = op.outNumber("Array length out");

var arr=[];

var selectIndex = 0;
const MODE_NUMBER = 0;
const MODE_1_TO_4 = 1;
const MODE_0_TO_1 = 2;
const MODE_1_TO_0 = 3;

onFilterChange();
function onFilterChange()
{
    var selectedMode = modeSelect.get();
    if(selectedMode === 'Number') selectIndex = MODE_NUMBER;
    else if(selectedMode === '1,2,3,4') selectIndex = MODE_1_TO_4;
    else if(selectedMode === '0-1') selectIndex = MODE_0_TO_1;
    else if(selectedMode === '1-0') selectIndex = MODE_1_TO_0;

    if( selectIndex === MODE_NUMBER)
    {
        inDefaultValue.setUiAttribs({greyout:false});
    }
    else if(selectIndex === MODE_1_TO_4)
    {
        inDefaultValue.setUiAttribs({greyout:true});
    }
    else if(selectIndex === MODE_0_TO_1)
    {
        inDefaultValue.setUiAttribs({greyout:true});
    }
    else if(selectIndex === MODE_1_TO_0)
    {
        inDefaultValue.setUiAttribs({greyout:true});
    }
    op.setUiAttrib({"extendTitle":modeSelect.get()});

    reset();
}

function reset()
{
    arr.length = 0;

    var arrLength = inLength.get();
    var valueForArray = inDefaultValue.get();
    var i;

    //mode 0 - fill all array values with one number
    if( selectIndex === MODE_NUMBER)
    {
        for(i=0;i<arrLength;i++)
        {
            arr[i]=valueForArray;
        }
    }
    //mode 1 Continuous number array - increments up to array length
    else if(selectIndex === MODE_1_TO_4)
    {
        for(i = 0;i < arrLength; i++)
        {
            arr[i] = i;
        }
    }
    //mode 2 Normalized array
    else if(selectIndex === MODE_0_TO_1)
    {
        for(i = 0;i < arrLength; i++)
        {
            arr[i] = i / arrLength;
        }
    }
    //mode 3 reversed Normalized array
    else if(selectIndex === MODE_1_TO_0)
    {
        for(i = 0;i < arrLength; i++)
        {
            arr[i] = 1-i / arrLength;
        }
    }

    outArr.set(null);
    outArr.set(arr);
    outArrayLength.set(arr.length);
}

inDefaultValue.onChange = inLength.onChange = function ()
{
    reset();
}
modeSelect.onChange = onFilterChange;
reset();


};

Ops.Array.Array_v2.prototype = new CABLES.Op();
CABLES.OPS["ca9219d2-9f06-4516-9cf2-98e61f84d4bb"]={f:Ops.Array.Array_v2,objName:"Ops.Array.Array_v2"};




// **************************************************************
// 
// Ops.User.alivemachine.MyFilterValidString
// 
// **************************************************************

Ops.User.alivemachine.MyFilterValidString = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

const
    inStr=op.inString("String",""),
    infilter=op.inString("Filter","null"),
    checkNull=op.inBool("Invalid if null",true),
    checkUndefined=op.inBool("Invalid if undefined",true),
    checkEmpty=op.inBool("Invalid if empty",true),
    checkZero=op.inBool("Invalid if 0",true),
    outStr=op.outString("Last Valid String"),
    result=op.outBool("Is Valid");

inStr.onChange=
infilter.onChange=
checkNull.onChange=
checkUndefined.onChange=
checkEmpty.onChange=
function()
{
    const str=inStr.get();
    var r=true;

    if(r===false)r=false;
    if(r && checkZero.get() && (str===0 || str==="0")) r=false;
    if(r && checkNull.get() && str===null) r=false;
    if(r && checkUndefined.get() && str===undefined) r=false;
    if(r && checkEmpty.get() && str==="") r=false;
    if(r && infilter.get()!=="" && str.includes(infilter.get())) r=false;
    if(r)outStr.set(str);
    //if(r && str.includes(infilter.get())) r=false;
    //alert(str.includes(infilter.get()));
    result.set(r);

};


};

Ops.User.alivemachine.MyFilterValidString.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.String.SwitchString
// 
// **************************************************************

Ops.String.SwitchString = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    idx=op.inValueInt("Index"),
    result=op.outString("Result");

const valuePorts=[];

idx.onChange=update;

for(var i=0;i<10;i++)
{
    var p=op.inString("String "+i);
    valuePorts.push( p );
    p.onChange=update;
}

function update()
{
    if(idx.get()>=0 && valuePorts[idx.get()])
    {
        result.set( valuePorts[idx.get()].get() );
    }
}

};

Ops.String.SwitchString.prototype = new CABLES.Op();
CABLES.OPS["2a7a0c68-f7c9-4249-b19a-d2de5cb4862c"]={f:Ops.String.SwitchString,objName:"Ops.String.SwitchString"};




// **************************************************************
// 
// Ops.Math.TriggerRandomNumber_v2
// 
// **************************************************************

Ops.Math.TriggerRandomNumber_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    exe=op.inTriggerButton('Generate'),
    min=op.inValue("min",0),
    max=op.inValue("max",1),
    outTrig = op.outTrigger("next"),
    result=op.outValue("result"),
    inInteger=op.inValueBool("Integer",false);

exe.onTriggered=genRandom;
max.onChange=genRandom;
min.onChange=genRandom;
inInteger.onChange=genRandom;

op.setPortGroup("Value Range",[min,max]);
genRandom();

function genRandom()
{
    var r=(Math.random()*(max.get()-min.get()))+min.get();
    if(inInteger.get())r=Math.floor((Math.random()*((max.get()-min.get()+1)))+min.get());
    result.set(r);
    outTrig.trigger();
}


};

Ops.Math.TriggerRandomNumber_v2.prototype = new CABLES.Op();
CABLES.OPS["26f446cc-9107-4164-8209-5254487fa132"]={f:Ops.Math.TriggerRandomNumber_v2,objName:"Ops.Math.TriggerRandomNumber_v2"};




// **************************************************************
// 
// Ops.User.alivemachine.EncodeURI
// 
// **************************************************************

Ops.User.alivemachine.EncodeURI = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    en=op.inString("Encode",""),
    de=op.inString("Decode",""),
    blr=op.inString("Linebreak Remove",""),
    ended=op.outString("Encoded"),
    deded=op.outString("Decoded"),
    blred=op.outString("Lb Removed");
blr.onChange=
en.onChange=
de.onChange=update;

function update()
{
    var str = blr.get();
    str = str.replace(/\/n|\\n/g,"");
    blred.set(str);

    ended.set(encodeURIComponent(en.get()));
    deded.set(decodeURIComponent(de.get()));

}



};

Ops.User.alivemachine.EncodeURI.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.String.StringLength_v2
// 
// **************************************************************

Ops.String.StringLength_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inStr=op.inString("String"),
    result=op.outValue("Result");

inStr.onChange=function()
{
    if(!inStr.get()) result.set(-1);
        else result.set( inStr.get().length );
};

};

Ops.String.StringLength_v2.prototype = new CABLES.Op();
CABLES.OPS["aa47bb8b-d5d7-4175-b217-ab0157d3365d"]={f:Ops.String.StringLength_v2,objName:"Ops.String.StringLength_v2"};




// **************************************************************
// 
// Ops.Trigger.NthTrigger_v2
// 
// **************************************************************

Ops.Trigger.NthTrigger_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var DEFAULT_NTH = 5;

// inputs
var exePort = op.inTriggerButton('Execute');
var nthPort = op.inValue('Nth', DEFAULT_NTH);

// outputs
var triggerPort = op.outTrigger('Next');

var count = 0;
var nth = DEFAULT_NTH;

exePort.onTriggered = onExeTriggered;
nthPort.onChange = valueChanged;

function onExeTriggered() {
    count++;
    if(count % nth === 0) {
        count = 0;
        triggerPort.trigger();
    }
}

function valueChanged() {
    nth = nthPort.get();
    count = 0;
}

};

Ops.Trigger.NthTrigger_v2.prototype = new CABLES.Op();
CABLES.OPS["ea43c184-5842-4aa1-b298-5db4515cbed0"]={f:Ops.Trigger.NthTrigger_v2,objName:"Ops.Trigger.NthTrigger_v2"};




// **************************************************************
// 
// Ops.Math.Compare.GreaterThan
// 
// **************************************************************

Ops.Math.Compare.GreaterThan = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    result=op.outValue("result"),
    number1=op.inValueFloat("number1"),
    number2=op.inValueFloat("number2");

number1.onChange=number2.onChange=exec;

function exec()
{
    result.set(number1.get()>number2.get());
}



};

Ops.Math.Compare.GreaterThan.prototype = new CABLES.Op();
CABLES.OPS["b250d606-f7f8-44d3-b099-c29efff2608a"]={f:Ops.Math.Compare.GreaterThan,objName:"Ops.Math.Compare.GreaterThan"};




// **************************************************************
// 
// Ops.Boolean.BoolToNumber
// 
// **************************************************************

Ops.Boolean.BoolToNumber = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    bool=op.inValueBool("bool"),
    number=op.outValue("number");

bool.onChange=function()
{
    if(bool.get()) number.set(1);
    else number.set(0);
};

};

Ops.Boolean.BoolToNumber.prototype = new CABLES.Op();
CABLES.OPS["2591c495-fceb-4f6e-937f-11b190c72ee5"]={f:Ops.Boolean.BoolToNumber,objName:"Ops.Boolean.BoolToNumber"};




// **************************************************************
// 
// Ops.Html.BackgroundImage_v2
// 
// **************************************************************

Ops.Html.BackgroundImage_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inEle = op.inObject("Element"),
    active = op.inValueBool("active", true),
    filename = op.inUrl("image file"),
    inSize = op.inValueSelect("Size", ["auto", "length", "cover", "contain", "initial", "inherit", "75%", "50%", "25%"], "cover"),
    inRepeat = op.inValueSelect("Repeat", ["no-repeat", "repeat", "repeat-x", "repeat-y"], "no-repeat"),
    inPosition = op.inValueSelect("Position", ["left top", "left center", "left bottom", "right top", "right center", "right bottom", "center top", "center center", "center bottom"], "center center"),

    outEle = op.outObject("HTML Element");


op.onLoadedValueSet =
op.onLoaded =
inPosition.onChange =
inSize.onChange =
inEle.onChange =
inRepeat.onChange =
active.onChange =
filename.onChange = update;

let ele = null;

function remove()
{
    if (ele)
    {
        ele.style["background-image"] = "none";
        ele.style["background-size"] = "initial";
        ele.style["background-position"] = "initial";
        ele.style["background-repeat"] = "initial";
    }
}

function update()
{
    if (!inEle.get())
    {
        remove();
        return;
    }

    op.setUiAttrib({ "extendTitle": CABLES.basename(filename.get()) });

    ele = inEle.get();


    if (ele && ele.style && filename.get())
    {
        if (!active.get())
        {
            ele.style["background-image"] = "none";
        }
        else
        {
            ele.style["background-image"] = "url(" + op.patch.getFilePath(String(filename.get())) + ")";
            ele.style["background-size"] = inSize.get();
            ele.style["background-position"] = inPosition.get();
            ele.style["background-repeat"] = inRepeat.get();
        }
    }
    // else
    // {
    //     // really needed ?
    //     setTimeout(update,100);
    // }

    outEle.set(inEle.get());
}


};

Ops.Html.BackgroundImage_v2.prototype = new CABLES.Op();
CABLES.OPS["081c4328-984d-4acd-8758-5d1379cc3a30"]={f:Ops.Html.BackgroundImage_v2,objName:"Ops.Html.BackgroundImage_v2"};




// **************************************************************
// 
// Ops.Lottie.LottieSVGPlayer
// 
// **************************************************************

Ops.Lottie.LottieSVGPlayer = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inEle=op.inObject("HTML Element"),
    inData=op.inObject("JSON Data"),
    inPlay=op.inValueBool("Play",true),
    inLoop=op.inValueBool("Loop",true);

inPlay.onChange=inLoop.onChange=inEle.onChange=inData.onChange=updateData;

var anim=null;

function dispose()
{
    if(anim)
    {
        anim.destroy();
        anim=null;
    }
}

function updateData()
{
    if(anim)dispose();
    if(!inEle.get() || !inData.get())return;

    var params = {
        container: inEle.get(),
        renderer: 'svg',
        loop: inLoop.get(),
        autoplay: inPlay.get(),
        animationData: inData.get()
    };

    anim = lottie.loadAnimation(params);
}




};

Ops.Lottie.LottieSVGPlayer.prototype = new CABLES.Op();
CABLES.OPS["c4ed075b-c897-4788-9cc0-2df638671f67"]={f:Ops.Lottie.LottieSVGPlayer,objName:"Ops.Lottie.LottieSVGPlayer"};




// **************************************************************
// 
// Ops.String.StringEditor
// 
// **************************************************************

Ops.String.StringEditor = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    v = op.inValueEditor("value", ""),
    syntax = op.inValueSelect("Syntax", ["text", "glsl", "css", "html", "xml"], "text"),
    result = op.outString("Result");

v.setUiAttribs({ "hidePort": true });

syntax.onChange = function ()
{
    v.setUiAttribs({ "editorSyntax": syntax.get() });
};

v.onChange = function ()
{
    result.set(v.get());
};


};

Ops.String.StringEditor.prototype = new CABLES.Op();
CABLES.OPS["6468b7c1-f63e-4db4-b809-4b203d27ead3"]={f:Ops.String.StringEditor,objName:"Ops.String.StringEditor"};




// **************************************************************
// 
// Ops.Html.CSSProperty_v2
// 
// **************************************************************

Ops.Html.CSSProperty_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inEle = op.inObject("Element"),
    inProperty = op.inString("Property"),
    inValue = op.inFloat("Value"),
    inValueSuffix = op.inString("Value Suffix", "px"),
    outEle = op.outObject("HTML Element");

op.setPortGroup("Element", [inEle]);
op.setPortGroup("Attributes", [inProperty, inValue, inValueSuffix]);

inProperty.onChange = updateProperty;
inValue.onChange = update;
inValueSuffix.onChange = update;
let ele = null;

inEle.onChange = inEle.onLinkChanged = function ()
{
    if (ele && ele.style)
    {
        ele.style[inProperty.get()] = "initial";
    }
    update();
};

function updateProperty()
{
    update();
    op.setUiAttrib({ "extendTitle": inProperty.get() + "" });
}

function update()
{
    ele = inEle.get();
    if (ele && ele.style)
    {
        const str = inValue.get() + inValueSuffix.get();
        try
        {
            // console.log("css",inProperty.get(),str);
            if (ele.style[inProperty.get()] != str)
                ele.style[inProperty.get()] = str;
        }
        catch (e)
        {
            console.log(e);
        }
    }

    outEle.set(inEle.get());
}


};

Ops.Html.CSSProperty_v2.prototype = new CABLES.Op();
CABLES.OPS["c179aa0e-b558-4130-8c2d-2deab2919a07"]={f:Ops.Html.CSSProperty_v2,objName:"Ops.Html.CSSProperty_v2"};




// **************************************************************
// 
// Ops.Boolean.TriggerBoolean
// 
// **************************************************************

Ops.Boolean.TriggerBoolean = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

var inTriggerTrue=op.inTriggerButton("True");
var inTriggerFalse=op.inTriggerButton("false");

var outResult=op.outValueBool("Result");



inTriggerTrue.onTriggered=function()
{
    outResult.set(true);
};

inTriggerFalse.onTriggered=function()
{
    outResult.set(false);
};

};

Ops.Boolean.TriggerBoolean.prototype = new CABLES.Op();
CABLES.OPS["31f65abe-9d6c-4ba6-a291-ef2de41d2087"]={f:Ops.Boolean.TriggerBoolean,objName:"Ops.Boolean.TriggerBoolean"};




// **************************************************************
// 
// Ops.Math.Math
// 
// **************************************************************

Ops.Math.Math = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const num0 = op.inFloat("number 0",0),
    num1 = op.inFloat("number 1",0),
    mathDropDown = op.inSwitch("math mode",['+','-','*','/','%','min','max'], "+"),
    result = op.outNumber("result");

var mathFunc;

num0.onChange = num1.onChange = update;
mathDropDown.onChange = onFilterChange;

var n0=0;
var n1=0;

const mathFuncAdd = function(a,b){return a+b};
const mathFuncSub = function(a,b){return a-b};
const mathFuncMul = function(a,b){return a*b};
const mathFuncDiv = function(a,b){return a/b};
const mathFuncMod = function(a,b){return a%b};
const mathFuncMin = function(a,b){return Math.min(a,b)};
const mathFuncMax = function(a,b){return Math.max(a,b)};


function onFilterChange()
{
    var mathSelectValue = mathDropDown.get();

    if(mathSelectValue == '+')         mathFunc = mathFuncAdd;
    else if(mathSelectValue == '-')    mathFunc = mathFuncSub;
    else if(mathSelectValue == '*')    mathFunc = mathFuncMul;
    else if(mathSelectValue == '/')    mathFunc = mathFuncDiv;
    else if(mathSelectValue == '%')    mathFunc = mathFuncMod;
    else if(mathSelectValue == 'min')  mathFunc = mathFuncMin;
    else if(mathSelectValue == 'max')  mathFunc = mathFuncMax;
    update();
    op.setUiAttrib({"extendTitle":mathSelectValue});
}

function update()
{
   n0 = num0.get();
   n1 = num1.get();

   result.set(mathFunc(n0,n1));
}

onFilterChange();


};

Ops.Math.Math.prototype = new CABLES.Op();
CABLES.OPS["e9fdcaca-a007-4563-8a4d-e94e08506e0f"]={f:Ops.Math.Math,objName:"Ops.Math.Math"};




// **************************************************************
// 
// Ops.Math.Clamp
// 
// **************************************************************

Ops.Math.Clamp = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const val=op.inValueFloat("val",0.5);
const min=op.inValueFloat("min",0);
const max=op.inValueFloat("max",1);
const ignore=op.inValueBool("ignore outside values");
const result=op.outValue("result");

val.onChange=min.onChange=max.onChange=clamp;

function clamp()
{
    if(ignore.get())
    {
        if(val.get()>max.get()) return;
        if(val.get()<min.get()) return;
    }
    result.set( Math.min(Math.max(val.get(), min.get()), max.get()));
}



};

Ops.Math.Clamp.prototype = new CABLES.Op();
CABLES.OPS["cda1a98e-5e16-40bd-9b18-a67e9eaad5a1"]={f:Ops.Math.Clamp,objName:"Ops.Math.Clamp"};




// **************************************************************
// 
// Ops.Trigger.Threshold
// 
// **************************************************************

Ops.Trigger.Threshold = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
//this op will send one trigger out if the threshold has been crossed
// but will not send another until the incoming inValue
//drops below the threshold and go's above it again

const inValue = op.inValue("Input"),
    inThreshold = op.inValue("Threshold"),
    output = op.outTrigger("Output");

var hasThresholdBeenExceeded = false;

inValue.onChange = update;
function update()
{
	if(!hasThresholdBeenExceeded && inValue.get() >= inThreshold.get())
	{
		hasThresholdBeenExceeded = true;
		output.trigger();
	}
	else if(hasThresholdBeenExceeded && inValue.get() <= inThreshold.get())
	{
		hasThresholdBeenExceeded = false;
	}
}




};

Ops.Trigger.Threshold.prototype = new CABLES.Op();
CABLES.OPS["ef0891db-6053-42ba-b7d5-29c7cf6d8208"]={f:Ops.Trigger.Threshold,objName:"Ops.Trigger.Threshold"};




// **************************************************************
// 
// Ops.Trigger.TriggerOnce
// 
// **************************************************************

Ops.Trigger.TriggerOnce = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    exe=op.inTriggerButton("Exec"),
    reset=op.inTriggerButton("Reset"),
    next=op.outTrigger("Next");
var outTriggered=op.outValue("Was Triggered");

var triggered=false;

op.toWorkPortsNeedToBeLinked(exe);

reset.onTriggered=function()
{
    triggered=false;
    outTriggered.set(triggered);
};

exe.onTriggered=function()
{
    if(triggered)return;

    triggered=true;
    next.trigger();
    outTriggered.set(triggered);

};

};

Ops.Trigger.TriggerOnce.prototype = new CABLES.Op();
CABLES.OPS["cf3544e4-e392-432b-89fd-fcfb5c974388"]={f:Ops.Trigger.TriggerOnce,objName:"Ops.Trigger.TriggerOnce"};




// **************************************************************
// 
// Ops.User.alivemachine.MyCustomEventListener
// 
// **************************************************************

Ops.User.alivemachine.MyCustomEventListener = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
// constants
var EVENT_NAME_DEFAULT = '';
var USE_CAPTURE_DEFAULT = false;
var PREVENT_DEFAULT_DEFAULT  = true;
var STOP_PROPAGATION_DEFAULT  = true;

// variables
var lastElement = null; // stores the last connected element, so we can remove prior event listeners
var lastEventName = EVENT_NAME_DEFAULT;
var lastUseCapture = USE_CAPTURE_DEFAULT;

// inputs
var elementPort = op.inObject('Element');
var eventNamePort = op.inValueString('Event Name', EVENT_NAME_DEFAULT);
var useCapturePort = op.inValueBool('Use Capture', USE_CAPTURE_DEFAULT);
var preventDefaultPort = op.inValueBool('Prevent Default', PREVENT_DEFAULT_DEFAULT);
var stopPropagationPort = op.inValueBool('Stop Propagation', STOP_PROPAGATION_DEFAULT);

// outputs
var triggerPort = op.outTrigger('Event Trigger');
var eventObjPort = op.outObject('Event Object');
var selectedImg = op.outString('selectedImg');
var selectedText = op.outString('selectedText');
var selectedID = op.outString('selectedID');
var msg = op.outString('Message');

// change listeners
elementPort.onChange = update;
eventNamePort.onChange = update;
useCapturePort.onChange = update;

function update() {
    var element = elementPort.get();
    var eventName = eventNamePort.get();
    var useCapture = useCapturePort.get();
    removeListener();
    addListener(element, eventName, useCapture);
    lastElement = element;
    lastEventName = eventName;
    lastUseCapture = useCapture;
}

function removeListener() {
    if(lastElement && lastEventName) {
        lastElement.removeEventListener(lastEventName, handleEvent, lastUseCapture);
    }
}

function addListener(el, name, useCapture) {
    if(el && name) {
        addEventListener(name, handleEvent, useCapture);
    }
}
function handleEvent(ev) {
    eventObjPort.set(ev);
    if(ev.srcElement.tagName=='IMG'){
        selectedImg.set(ev.srcElement.src.toString());
    }else if(ev.srcElement.tagName=='TEXTAREA'){
        selectedText.set(ev.srcElement.value.toString());
    }else if(eventNamePort.get()=='message'){
        msg.set(ev.data);
    }
    var id = ev.srcElement.id;
    if(ev.srcElement.id!==undefined){
    selectedID.set(id.toString());
    }


    if(preventDefaultPort.get()) { ev.preventDefault(); }
    if(stopPropagationPort.get()) { ev.stopPropagation(); }
    triggerPort.trigger();
}

};

Ops.User.alivemachine.MyCustomEventListener.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.User.alivemachine.Image2b64
// 
// **************************************************************

Ops.User.alivemachine.Image2b64 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

const urlIn = op.inString("URL");
const outPath=op.outString("URI");

var img = new Image();
urlIn.onChange=reload;


img.crossOrigin = 'Anonymous';

img.onload = function () {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

  canvas.height = "512";
  canvas.width = "512";
  //canvas.width = img.naturalWidth;
  ctx.drawImage(img, 0, 0, 512, 512);

  var uri = canvas.toDataURL('image/png');
  outPath.set(uri);

}
function reload(){
    //if(urlIn.get().indexOf("data:") ==='0'){
        img.src = urlIn.get();
        outPath.set('');
    //}else{
        //outPath.set(urlIn.get());
    //}
}



};

Ops.User.alivemachine.Image2b64.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.Date.DateAndTime
// 
// **************************************************************

Ops.Date.DateAndTime = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var UPDATE_RATE_DEFAULT = 500;
var UPDATE_RATE_MIN = 50;
var updateRate = UPDATE_RATE_DEFAULT;

var outYear=op.outValue("Year");
var outMonth=op.outValue("Month");
var outDay=op.outValue("Day");
var outHours=op.outValue("Hours");
var outMinutes=op.outValue("Minutes");
var outSeconds=op.outValue("Seconds");
var outTimestemp=op.outValue("Timestamp");
var d = new Date();
var updateRatePort = op.inValue("Update Rate", UPDATE_RATE_DEFAULT);

var timeout=setTimeout(update, UPDATE_RATE_DEFAULT);
update();

function update()
{
    d = new Date();

    outSeconds.set( d.getSeconds() );
    outMinutes.set( d.getMinutes() );
    outHours.set( d.getHours() );
    outDay.set( d.getDate() );
    outMonth.set( d.getMonth() );
    outYear.set( d.getFullYear() );
    
    timeout=setTimeout(update, updateRate);
    
    outTimestemp.set(Date.now());
}

updateRatePort.onChange = function() {
    var newUpdateRate = updateRatePort.get();
    if(newUpdateRate && newUpdateRate >= UPDATE_RATE_MIN) {
        updateRate = newUpdateRate;
    }
};

op.onDelete=function()
{
    clearTimeout(timeout);
};

};

Ops.Date.DateAndTime.prototype = new CABLES.Op();
CABLES.OPS["beff95ec-7b50-4b6e-80b8-a7e4ab97d8cc"]={f:Ops.Date.DateAndTime,objName:"Ops.Date.DateAndTime"};




// **************************************************************
// 
// Ops.User.alivemachine.B64toArraybuffer
// 
// **************************************************************

Ops.User.alivemachine.B64toArraybuffer = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

const b64In = op.inString("b64");
const abOut=op.outString("Array Buffer");

b64In.onChange=_base64ToArrayBuffer;



function _base64ToArrayBuffer() {
    var base64 = b64In.get();
  base64 = base64.split('data:image/png;base64,').join('');
  var binary_string = window.atob(base64),
    len = binary_string.length,
    bytes = new Uint8Array(len),
    i;

  for (i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  abOut.set(bytes);
  return bytes.buffer;
}



};

Ops.User.alivemachine.B64toArraybuffer.prototype = new CABLES.Op();



window.addEventListener('load', function(event) {
CABLES.jsLoaded=new Event('CABLES.jsLoaded');
document.dispatchEvent(CABLES.jsLoaded);
});
