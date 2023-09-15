"use strict";

var CABLES=CABLES||{};
CABLES.OPS=CABLES.OPS||{};

var Ops=Ops || {};
Ops.Ui=Ops.Ui || {};
Ops.User=Ops.User || {};
Ops.Date=Ops.Date || {};
Ops.Anim=Ops.Anim || {};
Ops.Html=Ops.Html || {};
Ops.Json=Ops.Json || {};
Ops.Time=Ops.Time || {};
Ops.Math=Ops.Math || {};
Ops.Array=Ops.Array || {};
Ops.Debug=Ops.Debug || {};
Ops.Value=Ops.Value || {};
Ops.String=Ops.String || {};
Ops.Trigger=Ops.Trigger || {};
Ops.Boolean=Ops.Boolean || {};
Ops.Sidebar=Ops.Sidebar || {};
Ops.WebAudio=Ops.WebAudio || {};
Ops.Math.Compare=Ops.Math.Compare || {};
Ops.User.alivemachine=Ops.User.alivemachine || {};



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
// Ops.String.SubString_v2
// 
// **************************************************************

Ops.String.SubString_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inStr=op.inString("String","cables"),
    inStart=op.inValueInt("Start",0),
    inEnd=op.inValueInt("End",4),
    result=op.outString("Result");

inStr.onChange=
    inStart.onChange=
    inEnd.onChange=update;

update();

function update()
{
    var start=inStart.get();
    var end=inEnd.get();
    var str=inStr.get()+'';
    result.set( str.substring(start,end) );
}

};

Ops.String.SubString_v2.prototype = new CABLES.Op();
CABLES.OPS["6e994ba8-01d1-4da6-98b4-af7e822a2e6c"]={f:Ops.String.SubString_v2,objName:"Ops.String.SubString_v2"};




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
// Ops.Html.CSSPropertyString
// 
// **************************************************************

Ops.Html.CSSPropertyString = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inEle = op.inObject("Element"),
    inProperty = op.inString("Property"),
    inValue = op.inString("Value"),
    outEle = op.outObject("HTML Element");

op.setPortGroup("Element", [inEle]);
op.setPortGroup("Attributes", [inProperty, inValue]);

inProperty.onChange = updateProperty;
inValue.onChange = update;
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
        const str = inValue.get();
        try
        {
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

Ops.Html.CSSPropertyString.prototype = new CABLES.Op();
CABLES.OPS["a7abdfb9-4c2a-4ddb-8fc6-55b3fdfbdaf3"]={f:Ops.Html.CSSPropertyString,objName:"Ops.Html.CSSPropertyString"};




// **************************************************************
// 
// Ops.Value.NumberSwitchBoolean
// 
// **************************************************************

Ops.Value.NumberSwitchBoolean = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inBool=op.inValueBool("Boolean"),
    valTrue=op.inValue("Value true",1),
    valFalse=op.inValue("Value false",0),
    outVal=op.outValue("Result");

inBool.onChange =
    valTrue.onChange =
    valFalse.onChange = update;

op.setPortGroup("Output Values",[valTrue,valFalse]);

function update() {
    if(inBool.get()) outVal.set(valTrue.get());
    else outVal.set(valFalse.get());
}

};

Ops.Value.NumberSwitchBoolean.prototype = new CABLES.Op();
CABLES.OPS["637c5fa8-840d-4535-96ab-3d27b458a8ba"]={f:Ops.Value.NumberSwitchBoolean,objName:"Ops.Value.NumberSwitchBoolean"};




// **************************************************************
// 
// Ops.String.StringOld2New
// 
// **************************************************************

Ops.String.StringOld2New = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inStr=op.inValueString("String"),
    outStr=op.outString("Result");

inStr.onChange=function()
{
    outStr.set(inStr.get());

};

};

Ops.String.StringOld2New.prototype = new CABLES.Op();
CABLES.OPS["77193bdc-9769-41da-95e1-51afcaad0274"]={f:Ops.String.StringOld2New,objName:"Ops.String.StringOld2New"};




// **************************************************************
// 
// Ops.Value.SwitchFile
// 
// **************************************************************

Ops.Value.SwitchFile = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var idx=op.inValueInt("Index");
var valuePorts=[];
var result=op.outValue("Result");

idx.onChange=update;

for(var i=0;i<10;i++)
{
    var p=op.inFile("File "+i);
    valuePorts.push( p );
    p.onChange=update;
}

function update()
{
    const index=idx.get();
    if(index>=0 && valuePorts[index])
    {
        result.set( valuePorts[index].get() );
    }
}

};

Ops.Value.SwitchFile.prototype = new CABLES.Op();
CABLES.OPS["ce6e3213-1ce0-4c90-a7d5-e5dc1c23fa63"]={f:Ops.Value.SwitchFile,objName:"Ops.Value.SwitchFile"};




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
// Ops.Boolean.Or
// 
// **************************************************************

Ops.Boolean.Or = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    bool0=op.inValueBool("bool 1"),
    bool1=op.inValueBool("bool 2"),
    bool2=op.inValueBool("bool 3"),
    bool3=op.inValueBool("bool 4"),
    bool4=op.inValueBool("bool 5"),
    bool5=op.inValueBool("bool 6"),
    bool6=op.inValueBool("bool 7"),
    bool7=op.inValueBool("bool 8"),
    result=op.outValueBool("result");

bool0.onChange=
    bool1.onChange=
    bool2.onChange=
    bool3.onChange=
    bool4.onChange=
    bool5.onChange=
    bool6.onChange=
    bool7.onChange=exec;

function exec()
{
    result.set( bool0.get() || bool1.get()  || bool2.get() || bool3.get() || bool4.get() || bool5.get() || bool6.get() || bool7.get() );
}



};

Ops.Boolean.Or.prototype = new CABLES.Op();
CABLES.OPS["b3b36238-4592-4e11-afe3-8361c4fd6be5"]={f:Ops.Boolean.Or,objName:"Ops.Boolean.Or"};




// **************************************************************
// 
// Ops.Boolean.And
// 
// **************************************************************

Ops.Boolean.And = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    bool0 = op.inValueBool("bool 1"),
    bool1 = op.inValueBool("bool 2"),
    result = op.outValueBool("result");

bool0.onChange = exec;
bool1.onChange = exec;

function exec()
{
    result.set(bool1.get() && bool0.get());
}


};

Ops.Boolean.And.prototype = new CABLES.Op();
CABLES.OPS["c26e6ce0-8047-44bb-9bc8-5a4f911ed8ad"]={f:Ops.Boolean.And,objName:"Ops.Boolean.And"};




// **************************************************************
// 
// Ops.String.SwitchStringBoolean
// 
// **************************************************************

Ops.String.SwitchStringBoolean = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inBool=op.inValueBool("Boolean"),
    inStrTrue=op.inString("True","Yes"),
    inStrFalse=op.inString("False","No"),
    result=op.outString("Result");

inBool.onChange=
inStrFalse.onChange=
inStrTrue.onChange=update;

function update()
{
    if(inBool.get())result.set(inStrTrue.get());
        else result.set(inStrFalse.get());
}

update();

};

Ops.String.SwitchStringBoolean.prototype = new CABLES.Op();
CABLES.OPS["19e3c428-22ce-45a3-b903-fddfc46fc0a3"]={f:Ops.String.SwitchStringBoolean,objName:"Ops.String.SwitchStringBoolean"};




// **************************************************************
// 
// Ops.Boolean.ToggleBool
// 
// **************************************************************

Ops.Boolean.ToggleBool = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    trigger=op.inTriggerButton("trigger"),
    reset=op.inTriggerButton("reset"),
    outBool=op.outValue("result");

var theBool=false;
outBool.set(theBool);
outBool.ignoreValueSerialize=true;

trigger.onTriggered=function()
{
    theBool=!theBool;
    outBool.set(theBool);
};

reset.onTriggered=function()
{
    theBool=false;
    outBool.set(theBool);
};



};

Ops.Boolean.ToggleBool.prototype = new CABLES.Op();
CABLES.OPS["712a25f4-3a93-4042-b8c5-2f56169186cc"]={f:Ops.Boolean.ToggleBool,objName:"Ops.Boolean.ToggleBool"};




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
// Ops.Trigger.TriggerLimiter
// 
// **************************************************************

Ops.Trigger.TriggerLimiter = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var inTriggerPort = op.inTrigger("In Trigger");
var timePort = op.inValue("Milliseconds", 300);
var outTriggerPort = op.outTrigger("Out Trigger");
var progress=op.outValue("Progress");

var lastTriggerTime = 0;

// change listeners
inTriggerPort.onTriggered = function()
{
    var now = CABLES.now();
    var prog=(now-lastTriggerTime )/timePort.get();

    if(prog>1.0)prog=1.0;
    if(prog<0.0)prog=0.0;

    // console.log(prog);
    progress.set(prog);

    if(now >=lastTriggerTime + timePort.get())
    {
        lastTriggerTime = now;
        // progress.set(1.0);
        outTriggerPort.trigger();
    }
};

};

Ops.Trigger.TriggerLimiter.prototype = new CABLES.Op();
CABLES.OPS["47641d85-9f81-4287-8aa2-35753b0727e0"]={f:Ops.Trigger.TriggerLimiter,objName:"Ops.Trigger.TriggerLimiter"};




// **************************************************************
// 
// Ops.Boolean.TriggerChangedTrue
// 
// **************************************************************

Ops.Boolean.TriggerChangedTrue = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

var val=op.inValueBool("Value",false);

var next=op.outTrigger("Next");

var oldVal=0;

val.onChange=function()
{
    var newVal=val.get();
    if(!oldVal && newVal)
    {
        oldVal=true;
        next.trigger();
    }
    else
    {
        oldVal=false;
    }
};

};

Ops.Boolean.TriggerChangedTrue.prototype = new CABLES.Op();
CABLES.OPS["385197e1-8b34-4d1c-897f-d1386d99e3b3"]={f:Ops.Boolean.TriggerChangedTrue,objName:"Ops.Boolean.TriggerChangedTrue"};




// **************************************************************
// 
// Ops.Math.Multiply
// 
// **************************************************************

Ops.Math.Multiply = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const number1 = op.inValueFloat("number1", 1);
const number2 = op.inValueFloat("number2", 2);
const result = op.outValue("result");

number1.onChange = number2.onChange = update;
update();

function update()
{
    const n1 = number1.get();
    const n2 = number2.get();

    result.set(n1 * n2);
}


};

Ops.Math.Multiply.prototype = new CABLES.Op();
CABLES.OPS["1bbdae06-fbb2-489b-9bcc-36c9d65bd441"]={f:Ops.Math.Multiply,objName:"Ops.Math.Multiply"};




// **************************************************************
// 
// Ops.Boolean.MonoFlop
// 
// **************************************************************

Ops.Boolean.MonoFlop = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    trigger=op.inTriggerButton("Trigger"),
    duration=op.inValue("Duration",1),
    valueTrue=op.inValue("Value True",1),
    valueFalse=op.inValue("Value False",0),
    outAct=op.outTrigger("Activated"),
    result=op.outValue("Result",false);

var lastTimeout=-1;

trigger.onTriggered=function()
{
    if(result.get()==valueFalse.get())outAct.trigger();
    result.set(valueTrue.get());

    clearTimeout(lastTimeout);
    lastTimeout=setTimeout(function()
    {
        result.set(valueFalse.get());
    },duration.get()*1000);

};

};

Ops.Boolean.MonoFlop.prototype = new CABLES.Op();
CABLES.OPS["3a4b0a78-4172-41c7-8248-95cb0856ecc8"]={f:Ops.Boolean.MonoFlop,objName:"Ops.Boolean.MonoFlop"};




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
// Ops.User.alivemachine.FileIn
// 
// **************************************************************

Ops.User.alivemachine.FileIn = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
// inputs
var parentPort = op.inObject('link');
var labelPort = op.inString('Text', 'Select File:');
var inId = op.inValueString('Id', '');
var inBrowse = op.inTriggerButton("browse");
inBrowse.onTriggered=goBrowse;
function goBrowse(){
    fileInputEle.click();
}

// outputs
var siblingsPort = op.outObject('childs');
const outTex=op.outTexture("Texture");
var outFile=op.outString("b64image");

// vars
var el = document.createElement('div');
el.classList.add('sidebar__item');
el.classList.add('sidebar__text');
var label = document.createElement('div');
label.classList.add('sidebar__item-label');
var labelText = document.createTextNode(labelPort.get());
label.appendChild(labelText);
el.appendChild(label);

const fileInputEle = document.createElement('input');
fileInputEle.type="file";
fileInputEle.id="file";
fileInputEle.name="file";
fileInputEle.style.width="100%";
fileInputEle.style.margin="0";
el.appendChild(fileInputEle);

const imgEl = document.createElement('img');

fileInputEle.addEventListener('change', handleFileSelect, false);

function handleFileSelect(evt)
{

    const reader = new FileReader();

    reader.onabort = function(e) {
        op.log('File read cancelled');
    };

    reader.onload = function(e)
    {
        var image = new Image();
        image.onerror=function(e)
        {
            op.log("image error",e);
        };
        image.onload=function(e)
        {
            var tex=CGL.Texture.createFromImage(op.patch.cgl,image,{});
            var canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        canvas.getContext('2d').drawImage(image, 0, 0, 1024,1024);
        var b64img = canvas.toDataURL('image/png', .1);
	    outFile.set(b64img);
            outTex.set(tex);
        };
        image.src = e.target.result;

    };

    reader.readAsDataURL(evt.target.files[0]);
}


// events
parentPort.onChange = onParentChanged;
labelPort.onChange = onLabelTextChanged;
inId.onChange = onIdChanged;
op.onDelete = onDelete;

op.toWorkNeedsParent('Ops.Sidebar.Sidebar');

// functions

function onIdChanged()
{
    el.id=inId.get();
}

function onLabelTextChanged() {
    var labelText = labelPort.get();
    label.textContent = labelText;
}

function onParentChanged() {
    var parent = parentPort.get();
    if(parent && parent.parentElement) {
        parent.parentElement.appendChild(el);
        siblingsPort.set(null);
        siblingsPort.set(parent);
    } else { // detach
        if(el.parentElement) {
            el.parentElement.removeChild(el);
        }
    }
}

function showElement(el) {
    if(el) {
        el.style.display = 'block';
    }
}

function hideElement(el) {
    if(el) {
        el.style.display = 'none';
    }
}

function onDelete() {
    removeElementFromDOM(el);
}

function removeElementFromDOM(el) {
    if(el && el.parentNode && el.parentNode.removeChild) {
        el.parentNode.removeChild(el);
    }
}


};

Ops.User.alivemachine.FileIn.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.Ui.PatchInput
// 
// **************************************************************

Ops.Ui.PatchInput = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

op.getPatchOp=function()
{
    for(var i in op.patch.ops)
    {
        if(op.patch.ops[i].patchId)
        {
            if(op.patch.ops[i].patchId.get()==op.uiAttribs.subPatch)
            {
                return op.patch.ops[i];
            }
        }
    }
};


};

Ops.Ui.PatchInput.prototype = new CABLES.Op();
CABLES.OPS["e3f68bc3-892a-4c78-9974-aca25c27025d"]={f:Ops.Ui.PatchInput,objName:"Ops.Ui.PatchInput"};




// **************************************************************
// 
// Ops.Ui.PatchOutput
// 
// **************************************************************

Ops.Ui.PatchOutput = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

// empty

};

Ops.Ui.PatchOutput.prototype = new CABLES.Op();
CABLES.OPS["851b44cb-5667-4140-9800-5aeb7031f1d7"]={f:Ops.Ui.PatchOutput,objName:"Ops.Ui.PatchOutput"};




// **************************************************************
// 
// Ops.Ui.SubPatch
// 
// **************************************************************

Ops.Ui.SubPatch = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
op.dyn=op.addInPort(new CABLES.Port(op,"create port",CABLES.OP_PORT_TYPE_DYNAMIC));
op.dynOut=op.addOutPort(new CABLES.Port(op,"create port out",CABLES.OP_PORT_TYPE_DYNAMIC));

var dataStr=op.addInPort(new CABLES.Port(op,"dataStr",CABLES.OP_PORT_TYPE_VALUE,{ display:'readonly' }));
op.patchId=op.addInPort(new CABLES.Port(op,"patchId",CABLES.OP_PORT_TYPE_VALUE,{ display:'readonly' }));



dataStr.setUiAttribs({hideParam:true});
op.patchId.setUiAttribs({hideParam:true});

var data={"ports":[],"portsOut":[]};

// Ops.Ui.Patch.maxPatchId=CABLES.generateUUID();

op.patchId.onChange=function()
{
    // console.log("subpatch changed...");
    // clean up old subpatch if empty
    var oldPatchOps=op.patch.getSubPatchOps(oldPatchId);

    // console.log("subpatch has childs ",oldPatchOps.length);

    if(oldPatchOps.length==2)
    {
        for(var i=0;i<oldPatchOps.length;i++)
        {
            // console.log("delete ",oldPatchOps[i]);
            op.patch.deleteOp(oldPatchOps[i].id);
        }
    }
    else
    {
        // console.log("old subpatch has ops.,...");
    }
};

var oldPatchId=CABLES.generateUUID();
op.patchId.set(oldPatchId);

op.onLoaded=function()
{
    // op.patchId.set(CABLES.generateUUID());
};

op.onLoadedValueSet=function()
{
    data=JSON.parse(dataStr.get());
    if(!data)
    {
        data={"ports":[],"portsOut":[]};
    }
    setupPorts();
};

function loadData()
{
}

getSubPatchInputOp();
getSubPatchOutputOp();

var dataLoaded=false;
dataStr.onChange=function()
{
    if(dataLoaded)return;

    if(!dataStr.get())return;
    try
    {
        // console.log('parse subpatch data');
        loadData();
    }
    catch(e)
    {
        // op.log('cannot load subpatch data...');
        console.log(e);
    }
};

function saveData()
{
    dataStr.set(JSON.stringify(data));
}

function addPortListener(newPort,newPortInPatch)
{
    //console.log('newPort',newPort.name);

    newPort.addEventListener("onUiAttrChange",function(attribs)
    {
        console.log("onUiAttrChange!!!");

        if(attribs.title)
        {
            var i=0;
            for(i=0;i<data.portsOut.length;i++)
                if(data.portsOut[i].name==newPort.name)
                    data.portsOut[i].title=attribs.title;

            for(i=0;i<data.ports.length;i++)
                if(data.ports[i].name==newPort.name)
                    data.ports[i].title=attribs.title;

            saveData();
        }

    });


    if(newPort.direction==CABLES.PORT_DIR_IN)
    {
        if(newPort.type==CABLES.OP_PORT_TYPE_FUNCTION)
        {
            newPort.onTriggered=function()
            {
                if(newPortInPatch.isLinked())
                    newPortInPatch.trigger();
            };
        }
        else
        {
            newPort.onChange=function()
            {
                newPortInPatch.set(newPort.get());
            };
        }
    }
}

function setupPorts()
{
    if(!op.patchId.get())return;
    var ports=data.ports||[];
    var portsOut=data.portsOut||[];
    var i=0;

    for(i=0;i<ports.length;i++)
    {
        if(!op.getPortByName(ports[i].name))
        {
            // console.log("ports[i].name",ports[i].name);

            var newPort=op.addInPort(new CABLES.Port(op,ports[i].name,ports[i].type));
            var patchInputOp=getSubPatchInputOp();





            // console.log(patchInputOp);

            var newPortInPatch=patchInputOp.addOutPort(new CABLES.Port(patchInputOp,ports[i].name,ports[i].type));

// console.log('newPortInPatch',newPortInPatch);


            newPort.ignoreValueSerialize=true;
            newPort.setUiAttribs({"editableTitle":true});
            if(ports[i].title)
            {
                newPort.setUiAttribs({"title":ports[i].title});
                newPortInPatch.setUiAttribs({"title":ports[i].title});
            }
            addPortListener(newPort,newPortInPatch);

        }
    }

    for(i=0;i<portsOut.length;i++)
    {
        if(!op.getPortByName(portsOut[i].name))
        {
            var newPortOut=op.addOutPort(new CABLES.Port(op,portsOut[i].name,portsOut[i].type));
            var patchOutputOp=getSubPatchOutputOp();
            var newPortOutPatch=patchOutputOp.addInPort(new CABLES.Port(patchOutputOp,portsOut[i].name,portsOut[i].type));

            newPortOut.ignoreValueSerialize=true;
            newPortOut.setUiAttribs({"editableTitle":true});

            if(portsOut[i].title)
            {
                newPortOut.setUiAttribs({"title":portsOut[i].title});
                newPortOutPatch.setUiAttribs({"title":portsOut[i].title});
            }


            // addPortListener(newPortOut,newPortOutPatch);
            addPortListener(newPortOutPatch,newPortOut);

        }
    }

    dataLoaded=true;

}



op.dyn.onLinkChanged=function()
{
    if(op.dyn.isLinked())
    {
        var otherPort=op.dyn.links[0].getOtherPort(op.dyn);
        op.dyn.removeLinks();
        otherPort.removeLinkTo(op.dyn);


        var newName="in"+data.ports.length+" "+otherPort.parent.name+" "+otherPort.name;

        data.ports.push({"name":newName,"type":otherPort.type});

        setupPorts();

        var l=gui.scene().link(
            otherPort.parent,
            otherPort.getName(),
            op,
            newName
            );

        // console.log('-----+===== ',otherPort.getName(),otherPort.get() );
        // l._setValue();
        // l.setValue(otherPort.get());

        dataLoaded=true;
        saveData();
    }
    else
    {
        setTimeout(function()
        {
            op.dyn.removeLinks();
            gui.patch().removeDeadLinks();
        },100);
    }
};

op.dynOut.onLinkChanged=function()
{
    if(op.dynOut.isLinked())
    {
        var otherPort=op.dynOut.links[0].getOtherPort(op.dynOut);
        op.dynOut.removeLinks();
        otherPort.removeLinkTo(op.dynOut);
        var newName="out"+data.ports.length+" "+otherPort.parent.name+" "+otherPort.name;

        data.portsOut.push({"name":newName,"type":otherPort.type});

        setupPorts();

        gui.scene().link(
            otherPort.parent,
            otherPort.getName(),
            op,
            newName
            );

        dataLoaded=true;
        saveData();
    }
    else
    {
        setTimeout(function()
        {
            op.dynOut.removeLinks();
            gui.patch().removeDeadLinks();
        },100);


        op.log('dynOut unlinked...');
    }
    gui.patch().removeDeadLinks();
};



function getSubPatchOutputOp()
{
    var patchOutputOP=op.patch.getSubPatchOp(op.patchId.get(),'Ops.Ui.PatchOutput');

    if(!patchOutputOP)
    {
        // console.log("Creating output for ",op.patchId.get());
        op.patch.addOp('Ops.Ui.PatchOutput',{'subPatch':op.patchId.get()} );
        patchOutputOP=op.patch.getSubPatchOp(op.patchId.get(),'Ops.Ui.PatchOutput');

        if(!patchOutputOP) console.warn('no patchinput2!');
    }
    return patchOutputOP;

}

function getSubPatchInputOp()
{
    var patchInputOP=op.patch.getSubPatchOp(op.patchId.get(),'Ops.Ui.PatchInput');

    if(!patchInputOP)
    {
        op.patch.addOp('Ops.Ui.PatchInput',{'subPatch':op.patchId.get()} );
        patchInputOP=op.patch.getSubPatchOp(op.patchId.get(),'Ops.Ui.PatchInput');
        if(!patchInputOP) console.warn('no patchinput2!');
    }


    return patchInputOP;
}

op.addSubLink=function(p,p2)
{
    var num=data.ports.length;

    var sublPortname="in"+(num-1)+" "+p2.parent.name+" "+p2.name;
    console.log('sublink! ',sublPortname);

    if(p.direction==CABLES.PORT_DIR_IN)
    {
        var l=gui.scene().link(
            p.parent,
            p.getName(),
            getSubPatchInputOp(),
            sublPortname
            );

        // console.log('- ----=====EEE ',p.getName(),p.get() );
        // console.log('- ----=====EEE ',l.getOtherPort(p).getName() ,l.getOtherPort(p).get() );
    }
    else
    {
        var l=gui.scene().link(
            p.parent,
            p.getName(),
            getSubPatchOutputOp(),
            "out"+(num)+" "+p2.parent.name+" "+p2.name
            );
    }

    var bounds=gui.patch().getSubPatchBounds(op.patchId.get());

    getSubPatchInputOp().uiAttr(
        {
            "translate":
            {
                "x":bounds.minx,
                "y":bounds.miny-100
            }
        });

    getSubPatchOutputOp().uiAttr(
        {
            "translate":
            {
                "x":bounds.minx,
                "y":bounds.maxy+100
            }
        });
    saveData();
    return sublPortname;
};



op.onDelete=function()
{
    for (var i = op.patch.ops.length-1; i >=0 ; i--)
    {
        if(op.patch.ops[i].uiAttribs && op.patch.ops[i].uiAttribs.subPatch==op.patchId.get())
        {
            // console.log(op.patch.ops[i].objName);
            op.patch.deleteOp(op.patch.ops[i].id);
        }
    }



};


};

Ops.Ui.SubPatch.prototype = new CABLES.Op();
CABLES.OPS["84d9a6f0-ed7a-466d-b386-225ed9e89c60"]={f:Ops.Ui.SubPatch,objName:"Ops.Ui.SubPatch"};




// **************************************************************
// 
// Ops.Json.ObjectKeys
// 
// **************************************************************

Ops.Json.ObjectKeys = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

var inObj=op.inObject("Object");

var outNumKeys=op.outValue("Num Keys");
var outKeys=op.outArray("Keys");

inObj.onChange=function()
{
    var o=inObj.get();
    if(!o)
    {
        outNumKeys.set(0);
        outKeys.set([]);
        return;
    }
    
    
    var keys=Object.keys(o);
    outNumKeys.set(keys.length);
    outKeys.set(keys);

    

    // result.set(outObject.set(inObject.get()));
};


};

Ops.Json.ObjectKeys.prototype = new CABLES.Op();
CABLES.OPS["83b4d148-8cb3-4a45-8824-957eeaf02e22"]={f:Ops.Json.ObjectKeys,objName:"Ops.Json.ObjectKeys"};




// **************************************************************
// 
// Ops.Boolean.ParseBoolean_v2
// 
// **************************************************************

Ops.Boolean.ParseBoolean_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inVal=op.inString("String"),
    result=op.outValueBool("Result");

inVal.onChange=function()
{
    var v=inVal.get();
    if( v==="false" || v==false || v===0 || v==null || v==undefined)result.set(false);
    else result.set(true);
};

};

Ops.Boolean.ParseBoolean_v2.prototype = new CABLES.Op();
CABLES.OPS["b436e831-36f5-4e0c-838e-4a82c4b07ec0"]={f:Ops.Boolean.ParseBoolean_v2,objName:"Ops.Boolean.ParseBoolean_v2"};




// **************************************************************
// 
// Ops.User.alivemachine.MasloAnalyzeText
// 
// **************************************************************

Ops.User.alivemachine.MasloAnalyzeText = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const jsonp = false,
    headers = {},
    inMethod = "POST",
    inBody = op.inString("body", ""),
    inContentType = "application/json",
    inParseJson = true,
    reloadTrigger = op.inTriggerButton("send"),
    outData = op.outObject("data"),
    outString = op.outString("response"),
    isLoading = op.outValue("Is Loading", false),
    outTrigger = op.outTrigger("Loaded");
var filename = "https://cors-anywhere.herokuapp.com/https://maslocompanionserver.wl.r.appspot.com/analyzeText/";

outData.ignoreValueSerialize = true;

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
inBody.onChange = delayedReload;


function reload(addCachebuster)
{
    if (!filename) return;

    op.patch.loading.finished(loadingId);

    loadingId = op.patch.loading.start("jsonFile", "" + filename);
    isLoading.set(true);

    op.setUiAttrib({ "extendTitle": CABLES.basename(filename) });

    op.setUiError("jsonerr", null);

    let httpClient = CABLES.ajax;
    if (jsonp) httpClient = CABLES.jsonp;

    let url = op.patch.getFilePath(filename);
    if (addCachebuster)url += "?rnd=" + CABLES.generateUUID();

    const body = '{"media":"'+inBody.get()+'","originTextID":"666777999","type":"text"}';
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
                if (typeof data === "string" && inParseJson)
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
        inMethod,
        (body && body.length > 0) ? body : null,
        inContentType,
        null,
        headers || {}
    );
}


};

Ops.User.alivemachine.MasloAnalyzeText.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.Json.ObjectGetArray_v2
// 
// **************************************************************

Ops.Json.ObjectGetArray_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    data = op.inObject("data"),
    key = op.inString("key"),
    result = op.outArray("result"),
    arrLength = op.outValue("Length");

result.ignoreValueSerialize = true;
data.ignoreValueSerialize = true;

data.onChange = update;

key.onChange = function ()
{
    op.setUiAttrib({ "extendTitle": key.get() });
    update();
};

function update()
{
    result.set(null);
    const dat = data.get();
    const k = key.get();
    if (dat && dat.hasOwnProperty(k))
    {
        result.set(dat[k]);
        arrLength.set(result.get().length);
    }
    else
    {
        arrLength.set(0);
    }
}


};

Ops.Json.ObjectGetArray_v2.prototype = new CABLES.Op();
CABLES.OPS["7c06a818-9c07-493a-8c4f-04eb2c7796f5"]={f:Ops.Json.ObjectGetArray_v2,objName:"Ops.Json.ObjectGetArray_v2"};




// **************************************************************
// 
// Ops.Array.ArrayOfObjectsToString
// 
// **************************************************************

Ops.Array.ArrayOfObjectsToString = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const inArray = op.inArray("Array In");
const outString = op.outString("String");

inArray.onChange = function() {
    if (!inArray.get()) {
        outString.set("");
        return;
    }

    const arr = inArray.get();
    let result = "";

    for (let i = 0; i < arr.length; i += 1) {
        const objToString = JSON.stringify(arr[i]);
        result += "\n" + objToString;
    }

    outString.set(result);
}

};

Ops.Array.ArrayOfObjectsToString.prototype = new CABLES.Op();
CABLES.OPS["1593cd67-2a90-43ab-b95e-ad6bbe9af37e"]={f:Ops.Array.ArrayOfObjectsToString,objName:"Ops.Array.ArrayOfObjectsToString"};




// **************************************************************
// 
// Ops.Time.DelayedTrigger
// 
// **************************************************************

Ops.Time.DelayedTrigger = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    exe=op.inTrigger("exe"),
    delay=op.inValueFloat("delay",1),
    next=op.outTrigger("next"),
    outDelaying=op.outBool("Delaying");

var lastTimeout=null;

exe.onTriggered=function()
{
    outDelaying.set(true);
    if(lastTimeout)clearTimeout(lastTimeout);

    lastTimeout=setTimeout(
        function()
        {
            outDelaying.set(false);
            lastTimeout=null;
            next.trigger();
        },
        delay.get()*1000);
};

};

Ops.Time.DelayedTrigger.prototype = new CABLES.Op();
CABLES.OPS["f4ff66b0-8500-46f7-9117-832aea0c2750"]={f:Ops.Time.DelayedTrigger,objName:"Ops.Time.DelayedTrigger"};




// **************************************************************
// 
// Ops.String.Concat_v2
// 
// **************************************************************

Ops.String.Concat_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var string1=op.inString("string1","ABC");
var string2=op.inString("string2","XYZ");
var newLine=op.inValueBool("New Line",false);
var result=op.outString("result");

newLine.onChange=string2.onChange=string1.onChange=exec;
exec();

function exec()
{
    var s1=string1.get();
    var s2=string2.get();
    if(!s1 && !s2)
    {
        result.set('');
        return;
    }
    if(!s1)s1='';
    if(!s2)s2='';

    var nl='';
    if(s1 && s2 && newLine.get())nl='\n';
    result.set( String(s1)+nl+String(s2));
}




};

Ops.String.Concat_v2.prototype = new CABLES.Op();
CABLES.OPS["a52722aa-0ca9-402c-a844-b7e98a6c6e60"]={f:Ops.String.Concat_v2,objName:"Ops.String.Concat_v2"};




// **************************************************************
// 
// Ops.Value.Boolean
// 
// **************************************************************

Ops.Value.Boolean = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const v=op.inValueBool("value",false);
const result=op.outValueBool("result");

result.set(false);
v.onChange=exec;

function exec()
{
    if(result.get()!=v.get()) result.set(v.get());
}



};

Ops.Value.Boolean.prototype = new CABLES.Op();
CABLES.OPS["83e2d74c-9741-41aa-a4d7-1bda4ef55fb3"]={f:Ops.Value.Boolean,objName:"Ops.Value.Boolean"};




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
    sc=op.inString("Special Chr Remove",""),
    ended=op.outString("Encoded"),
    deded=op.outString("Decoded"),
    blred=op.outString("Lb Removed"),
    sced=op.outString("Spe Chr Removed");
sc.onChange=
blr.onChange=
en.onChange=
de.onChange=update;

function update()
{
    var str = blr.get();
    if(str!==null){
    str = str.replace(/\/n|\\n/g,"");
    blred.set(str);
    }
    var str2 = sc.get();
    if(str2!==null){
    //str2 = str2.replace(/[^\w\s]/gi, '');
    sced.set(str2);
    }
    ended.set(encodeURIComponent(en.get()));
    deded.set(decodeURIComponent(de.get()));

}



};

Ops.User.alivemachine.EncodeURI.prototype = new CABLES.Op();





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
// Ops.Boolean.BoolToString
// 
// **************************************************************

Ops.Boolean.BoolToString = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inBool=op.inBool("Boolean",false),
    inTrue=op.inString("True","true"),
    inFalse=op.inString("False","false"),
    result=op.outString("String","false");

inTrue.onChange=
    inFalse.onChange=
    inBool.onChange=update

function update()
{
    if(inBool.get()) result.set(inTrue.get());
    else result.set(inFalse.get());
}

};

Ops.Boolean.BoolToString.prototype = new CABLES.Op();
CABLES.OPS["22a734aa-8b08-4db7-929b-393d4704e1d6"]={f:Ops.Boolean.BoolToString,objName:"Ops.Boolean.BoolToString"};




// **************************************************************
// 
// Ops.User.alivemachine.ScrollDownDiv
// 
// **************************************************************

Ops.User.alivemachine.ScrollDownDiv = function()
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
    div.scrollTo(0,div.scrollHeight);

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

Ops.User.alivemachine.ScrollDownDiv.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.User.alivemachine.Storymapr
// 
// **************************************************************

Ops.User.alivemachine.Storymapr = function()
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

Ops.User.alivemachine.Storymapr.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.String.RouteString
// 
// **************************************************************

Ops.String.RouteString = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    NUM_PORTS = 10,
    indexPort = op.inInt('Index'),
    valuePort = op.inString('String in',"cables"),
    defaultStringPort = op.inString('Default string', ""),
    valuePorts = createOutPorts();

indexPort.onChange = valuePort.onChange = defaultStringPort.onChange = update;

setDefaultValues();
update();

function createOutPorts()
{
    var arr = [];
    for(var i=0; i<NUM_PORTS; i++)
    {
        var port = op.outString('Index ' + i + ' string');
        arr.push(port);
    }
    return arr;
};

function setDefaultValues()
{
    var defaultValue = defaultStringPort.get();
    if(!defaultStringPort.get())
    {
        defaultValue = "";
    }
    valuePorts.forEach(port => port.set(defaultValue));
};

function update()
{
    setDefaultValues();
    var index = indexPort.get();
    var value = valuePort.get();
    index = Math.round(index);
    index = clamp(index, 0, NUM_PORTS-1);
    valuePorts[index].set(value);
};

function clamp(value, min, max)
{
  return Math.min(Math.max(value, min), max);
};


};

Ops.String.RouteString.prototype = new CABLES.Op();
CABLES.OPS["9998ff83-335b-40cd-aa0e-4cae558cb551"]={f:Ops.String.RouteString,objName:"Ops.String.RouteString"};




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

    httpPostAsync(routeIn.get()+"query", function(result){
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
// Ops.User.alivemachine.Fetch
// 
// **************************************************************

Ops.User.alivemachine.Fetch = function()
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

Ops.User.alivemachine.Fetch.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.User.alivemachine.Fetch02
// 
// **************************************************************

Ops.User.alivemachine.Fetch02 = function()
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
    fetch(inString.get())
    .then(response => response.json())
    .then(data => outString.set(data));

    next.trigger();
};


};

Ops.User.alivemachine.Fetch02.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.Html.AppendChild
// 
// **************************************************************

Ops.Html.AppendChild = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
// constants
var CANVAS_ELEMENT = op.patch.cgl.canvas;

// variables
var lastParent = null;
var lastChild = null;

// inputs
var parentPort = op.inObject('Parent');
var childPort = op.inObject('Child');

// outputs
var parentOutPort = op.outObject('Parent Out');
var childOutPort = op.outObject('Child Out');

// change listeners
parentPort.onChange = update;
childPort.onChange = update;

// functions

function update() {
    var parent = parentPort.get();
    var child = childPort.get();
    if(parent !== lastParent) {
        if(parent) {
            handleParentConnect(parent, child);
        } else {
            handleParentDisconnect(parent, child);
        }
        lastParent = parent;
    }
    if(child !== lastChild) {
        if(child) {
            handleChildConnect(parent, child);
        } else {
            handleChildDisconnect(parent, child);
        }
        lastChild = child;
    }
    parentOutPort.set(parent);
    childOutPort.set(child);
}

function handleParentConnect(parent, child) {
    if(child) {
        parent.appendChild(child);
    }    
}

function handleParentDisconnect(parent, child) {
    if(child) {
        CANVAS_ELEMENT.appendChild(child); // if there is no parent, append to patch
    }
}

function handleChildConnect(parent, child) {
    if(parent) {
        parent.appendChild(child);
    }    
}

function handleChildDisconnect(parent, child) {
    if(lastChild) {
        CANVAS_ELEMENT.appendChild(lastChild);    
    }
}


};

Ops.Html.AppendChild.prototype = new CABLES.Op();
CABLES.OPS["dbb2b232-3021-4eb7-bf9b-d194ae8918cb"]={f:Ops.Html.AppendChild,objName:"Ops.Html.AppendChild"};




// **************************************************************
// 
// Ops.Json.RouteObject
// 
// **************************************************************

Ops.Json.RouteObject = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

const
    NUM_PORTS = 10,
    DEFAULT_OBJECT = {},
    indexPort = op.inInt('index'),
    objectPort = op.inObject('Object in'),
    defaultObjectPort = op.inObject('default object', DEFAULT_OBJECT),
    objectPorts = createOutPorts(DEFAULT_OBJECT);

indexPort.onChange = objectPort.onChange = defaultObjectPort.onChange = update;

setDefaultValues();
update();

function createOutPorts()
{
    var arrayObjects = [];
    for(var i=0; i<NUM_PORTS; i++)
    {
        var port = op.outObject('Index ' + i + ' Object');
        arrayObjects.push(port);
    }
    defaultObjectPort.set(null);
    return arrayObjects;
};

function setDefaultValues()
{
    var defaultValue = defaultObjectPort.get();

    objectPorts.forEach(port => port.set(null));
    if(defaultObjectPort.get())
    {
        objectPorts.forEach(port => port.set(defaultValue));
    }
};

function update()
{
    setDefaultValues();
    var index = indexPort.get();
    var value = objectPort.get();

    index = Math.floor(index);
    index = clamp(index, 0, NUM_PORTS-1);
    objectPorts[index].set(value);
};

function clamp(value, min, max)
{
  return Math.min(Math.max(value, min), max);
};


};

Ops.Json.RouteObject.prototype = new CABLES.Op();
CABLES.OPS["bc969951-32b5-4226-9944-80a719a65497"]={f:Ops.Json.RouteObject,objName:"Ops.Json.RouteObject"};




// **************************************************************
// 
// Ops.Ui.Comment_v2
// 
// **************************************************************

Ops.Ui.Comment_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inTitle=op.inString("title",'New comment'),
    inText=op.inTextarea("text")
    ;

op.init=
    inTitle.onChange=
    inText.onChange=
    op.onLoaded=update;

update();

function update()
{
    if(CABLES.UI)
    {
        op.uiAttr(
            {
                'comment_title':inTitle.get(),
                'comment_text':inText.get()
            });

        op.name=inTitle.get();
    }
}




};

Ops.Ui.Comment_v2.prototype = new CABLES.Op();
CABLES.OPS["93492eeb-bf35-4a62-98f7-d85b0b79bfe5"]={f:Ops.Ui.Comment_v2,objName:"Ops.Ui.Comment_v2"};




// **************************************************************
// 
// Ops.Sidebar.Sidebar
// 
// **************************************************************

Ops.Sidebar.Sidebar = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={style_css:"/*\n * SIDEBAR\n  http://danielstern.ca/range.css/#/\n  https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-progress-value\n */\n\n\n.icon-chevron-down {\n    top: 2px;\n    right: 9px;\n}\n\n.iconsidebar-chevron-up {\n\tbackground-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4ODg4ODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLWNoZXZyb24tdXAiPjxwb2x5bGluZSBwb2ludHM9IjE4IDE1IDEyIDkgNiAxNSI+PC9wb2x5bGluZT48L3N2Zz4=);\n    top: 2px;\n    right: 9px;\n}\n\n.sidebar-cables-right\n{\n    right: 0px;\n    left: initial !important;\n}\n\n.sidebar-cables {\n    position: absolute;\n    top: 15px;\n    left: 15px;\n    border-radius: 10px;\n    /*border:10px solid #1a1a1a;*/\n    z-index: 100000;\n    color: #BBBBBB;\n    width: 220px;\n    max-height: 100%;\n    box-sizing: border-box;\n    overflow-y: auto;\n    overflow-x: hidden;\n    font-size: 13px;\n    font-family: Arial;\n    line-height: 1em; /* prevent emojis from breaking height of the title */\n    --sidebar-border-radius: 4px;\n    --sidebar-monospace-font-stack: \"SFMono-Regular\", Consolas, \"Liberation Mono\", Menlo, Courier, monospace;\n    --sidebar-hover-transition-time: .2s;\n}\n\n.sidebar-cables::selection {\n    background-color: #24baa7;\n    color: #EEEEEE;\n}\n\n.sidebar-cables::-webkit-scrollbar {\n    background-color: transparent;\n    --cables-scrollbar-width: 8px;\n    width: var(--cables-scrollbar-width);\n}\n\n.sidebar-cables::-webkit-scrollbar-track {\n    background-color: transparent;\n    width: var(--cables-scrollbar-width);\n}\n\n.sidebar-cables::-webkit-scrollbar-thumb {\n    background-color: #333333;\n    border-radius: 4px;\n    width: var(--cables-scrollbar-width);\n}\n\n.sidebar-cables--closed {\n    width: auto;\n}\n\n.sidebar__close-button {\n    background-color: #222;\n    -webkit-user-select: none;  /* Chrome all / Safari all */\n    -moz-user-select: none;     /* Firefox all */\n    -ms-user-select: none;      /* IE 10+ */\n    user-select: none;          /* Likely future */\n    transition: background-color var(--sidebar-hover-transition-time);\n    color: #CCCCCC;\n    height: 12px;\n    box-sizing: border-box;\n    padding-top: 2px;\n    text-align: center;\n    cursor: pointer;\n    /*border-top: 1px solid #272727;*/\n    border-radius: 0 0 var(--sidebar-border-radius) var(--sidebar-border-radius);\n    opacity: 1.0;\n    transition: opacity 0.3s;\n    overflow: hidden;\n}\n\n.sidebar__close-button-icon {\n    display: inline-block;\n    /*opacity: 0;*/\n    width: 21px;\n    height: 20px;\n    position: relative;\n    top: -1px;\n    /*background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4ODg4ODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLWNoZXZyb24tdXAiPjxwb2x5bGluZSBwb2ludHM9IjE4IDE1IDEyIDkgNiAxNSI+PC9wb2x5bGluZT48L3N2Zz4=);*/\n    /*background-size: cover;*/\n    /*background-repeat: no-repeat;*/\n    /*background-repeat: no-repeat;*/\n    /*background-position: 0 -1px;*/\n}\n\n.sidebar--closed {\n    width: auto;\n    margin-right: 20px;\n}\n\n.sidebar--closed .sidebar__close-button {\n    margin-top: 8px;\n    margin-left: 8px;\n    padding-top: 13px;\n    padding-left: 11px;\n    padding-right: 11px;\n    width: 46px;\n    height: 46px;\n    border-radius: 50%;\n    cursor: pointer;\n    opacity: 0.3;\n}\n\n.sidebar--closed .sidebar__group\n{\n    display:none;\n\n}\n.sidebar--closed .sidebar__close-button-icon {\n    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMnB4IiBoZWlnaHQ9IjE3cHgiIHZpZXdCb3g9IjAgMCAyMiAxNyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5Hcm91cCAzPC90aXRsZT4gICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+ICAgIDxkZWZzPjwvZGVmcz4gICAgPGcgaWQ9IkNhbnZhcy1TaWRlYmFyIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxnIGlkPSJEZXNrdG9wLWdyZWVuLWJsdWlzaC1Db3B5LTkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMC4wMDAwMDAsIC0yMi4wMDAwMDApIj4gICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMDAwMDAwLCAyMi4wMDAwMDApIj4gICAgICAgICAgICAgICAgPHBhdGggZD0iTTAuNSwyLjUgTDIuNSwyLjUiIGlkPSJMaW5lLTIiIHN0cm9rZT0iIzk3OTc5NyIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSI+PC9wYXRoPiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTAuNSwyLjUgTDIxLjUsMi41IiBpZD0iTGluZS0yIiBzdHJva2U9IiM5Nzk3OTciIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiPjwvcGF0aD4gICAgICAgICAgICAgICAgPHBhdGggZD0iTTAuNSw4LjUgTDExLjUsOC41IiBpZD0iTGluZS0yIiBzdHJva2U9IiM5Nzk3OTciIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiPjwvcGF0aD4gICAgICAgICAgICAgICAgPHBhdGggZD0iTTE5LjUsOC41IEwyMS41LDguNSIgaWQ9IkxpbmUtMiIgc3Ryb2tlPSIjOTc5Nzk3IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48L3BhdGg+ICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0wLjUsMTQuNSBMNS41LDE0LjUiIGlkPSJMaW5lLTIiIHN0cm9rZT0iIzk3OTc5NyIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSI+PC9wYXRoPiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTMuNSwxNC41IEwyMS41LDE0LjUiIGlkPSJMaW5lLTIiIHN0cm9rZT0iIzk3OTc5NyIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSI+PC9wYXRoPiAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTMiIGZpbGw9IiM5Nzk3OTciIGN4PSI2LjUiIGN5PSIyLjUiIHI9IjIuNSI+PC9jaXJjbGU+ICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtMyIgZmlsbD0iIzk3OTc5NyIgY3g9IjE1LjUiIGN5PSI4LjUiIHI9IjIuNSI+PC9jaXJjbGU+ICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtMyIgZmlsbD0iIzk3OTc5NyIgY3g9IjkuNSIgY3k9IjE0LjUiIHI9IjIuNSI+PC9jaXJjbGU+ICAgICAgICAgICAgPC9nPiAgICAgICAgPC9nPiAgICA8L2c+PC9zdmc+);\n    background-position: 0px 0px;\n}\n\n.sidebar__close-button:hover {\n    background-color: #111111;\n    opacity: 1.0 !important;\n}\n\n/*\n * SIDEBAR ITEMS\n */\n\n.sidebar__items {\n    /* max-height: 1000px; */\n    /* transition: max-height 0.5;*/\n    background-color: #222;\n}\n\n.sidebar--closed .sidebar__items {\n    /* max-height: 0; */\n    height: 0;\n    display: none;\n    pointer-interactions: none;\n}\n\n.sidebar__item__right {\n    float: right;\n}\n\n/*\n * SIDEBAR GROUP\n */\n\n.sidebar__group {\n    /*background-color: #1A1A1A;*/\n    overflow: hidden;\n    box-sizing: border-box;\n    animate: height;\n    /* max-height: 1000px; */\n    /* transition: max-height 0.5s; */\n    --sidebar-group-header-height: 28px;\n}\n\n.sidebar__group--closed {\n    /* max-height: 13px; */\n    height: var(--sidebar-group-header-height);\n}\n\n.sidebar__group-header {\n    box-sizing: border-box;\n    color: #EEEEEE;\n    background-color: #151515;\n    -webkit-user-select: none;  /* Chrome all / Safari all */\n    -moz-user-select: none;     /* Firefox all */\n    -ms-user-select: none;      /* IE 10+ */\n    user-select: none;          /* Likely future */\n    height: var(--sidebar-group-header-height);\n    padding-top: 7px;\n    text-transform: uppercase;\n    letter-spacing: 0.08em;\n    cursor: pointer;\n    transition: background-color var(--sidebar-hover-transition-time);\n    position: relative;\n}\n\n.sidebar__group-header:hover {\n  background-color: #111111;\n}\n\n.sidebar__group-header-title {\n  /*text-align: center;*/\n  overflow: hidden;\n  padding: 0 15px;\n  padding-top:2px;\n  font-weight:bold;\n}\n\n.sidebar__group-header-icon {\n    width: 17px;\n    height: 14px;\n    background-repeat: no-repeat;\n    display: inline-block;\n    position: absolute;\n    background-size: cover;\n\n    /* icon open */\n    /* feather icon: chevron up */\n    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4ODg4ODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLWNoZXZyb24tdXAiPjxwb2x5bGluZSBwb2ludHM9IjE4IDE1IDEyIDkgNiAxNSI+PC9wb2x5bGluZT48L3N2Zz4=);\n    top: 4px;\n    right: 5px;\n    opacity: 0.0;\n    transition: opacity 0.3;\n}\n\n.sidebar__group-header:hover .sidebar__group-header-icon {\n    opacity: 1.0;\n}\n\n/* icon closed */\n.sidebar__group--closed .sidebar__group-header-icon {\n    /* feather icon: chevron down */\n    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4ODg4ODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLWNoZXZyb24tZG93biI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiPjwvcG9seWxpbmU+PC9zdmc+);\n    top: 4px;\n    right: 5px;\n}\n\n/*\n * SIDEBAR ITEM\n */\n\n.sidebar__item\n{\n    box-sizing: border-box;\n    padding: 7px;\n    padding-left:15px;\n    padding-right:15px;\n\n    overflow: hidden;\n    position: relative;\n}\n\n.sidebar__item-label {\n    display: inline-block;\n    -webkit-user-select: none;  /* Chrome all / Safari all */\n    -moz-user-select: none;     /* Firefox all */\n    -ms-user-select: none;      /* IE 10+ */\n    user-select: none;          /* Likely future */\n    width: calc(50% - 7px);\n    margin-right: 7px;\n    margin-top: 2px;\n    text-overflow: ellipsis;\n    /* overflow: hidden; */\n}\n\n.sidebar__item-value-label {\n    font-family: var(--sidebar-monospace-font-stack);\n    display: inline-block;\n    text-overflow: ellipsis;\n    overflow: hidden;\n    white-space: nowrap;\n    max-width: 60%;\n}\n\n.sidebar__item-value-label::selection {\n    background-color: #24baa7;\n    color: #EEEEEE;\n}\n\n.sidebar__item + .sidebar__item,\n.sidebar__item + .sidebar__group,\n.sidebar__group + .sidebar__item,\n.sidebar__group + .sidebar__group {\n    border-top: 1px solid #272727;\n}\n\n/*\n * SIDEBAR ITEM TOGGLE\n */\n\n.sidebar__toggle {\n    cursor: pointer;\n}\n\n.sidebar__toggle-input {\n    --sidebar-toggle-input-color: #CCCCCC;\n    --sidebar-toggle-input-color-hover: #EEEEEE;\n    --sidebar-toggle-input-border-size: 2px;\n    display: inline;\n    float: right;\n    box-sizing: border-box;\n    border-radius: 50%;\n    cursor: pointer;\n    --toggle-size: 11px;\n    margin-top: 2px;\n    background-color: transparent !important;\n    border: var(--sidebar-toggle-input-border-size) solid var(--sidebar-toggle-input-color);\n    width: var(--toggle-size);\n    height: var(--toggle-size);\n    transition: background-color var(--sidebar-hover-transition-time);\n    transition: border-color var(--sidebar-hover-transition-time);\n}\n.sidebar__toggle:hover .sidebar__toggle-input {\n    border-color: var(--sidebar-toggle-input-color-hover);\n}\n\n.sidebar__toggle .sidebar__item-value-label {\n    -webkit-user-select: none;  /* Chrome all / Safari all */\n    -moz-user-select: none;     /* Firefox all */\n    -ms-user-select: none;      /* IE 10+ */\n    user-select: none;          /* Likely future */\n    max-width: calc(50% - 12px);\n}\n.sidebar__toggle-input::after { clear: both; }\n\n.sidebar__toggle--active .icon_toggle\n{\n\n    background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjE1cHgiIHdpZHRoPSIzMHB4IiBmaWxsPSIjMDZmNzhiIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGcgZGlzcGxheT0ibm9uZSI+PGcgZGlzcGxheT0iaW5saW5lIj48Zz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzA2Zjc4YiIgZD0iTTMwLDI3QzE3LjM1LDI3LDcsMzcuMzUsNyw1MGwwLDBjMCwxMi42NSwxMC4zNSwyMywyMywyM2g0MCBjMTIuNjUsMCwyMy0xMC4zNSwyMy0yM2wwLDBjMC0xMi42NS0xMC4zNS0yMy0yMy0yM0gzMHogTTcwLDY3Yy05LjM4OSwwLTE3LTcuNjEtMTctMTdzNy42MTEtMTcsMTctMTdzMTcsNy42MSwxNywxNyAgICAgUzc5LjM4OSw2Nyw3MCw2N3oiPjwvcGF0aD48L2c+PC9nPjwvZz48Zz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMwLDI3QzE3LjM1LDI3LDcsMzcuMzUsNyw1MGwwLDBjMCwxMi42NSwxMC4zNSwyMywyMywyM2g0MCAgIGMxMi42NSwwLDIzLTEwLjM1LDIzLTIzbDAsMGMwLTEyLjY1LTEwLjM1LTIzLTIzLTIzSDMweiBNNzAsNjdjLTkuMzg5LDAtMTctNy42MS0xNy0xN3M3LjYxMS0xNywxNy0xN3MxNyw3LjYxLDE3LDE3ICAgUzc5LjM4OSw2Nyw3MCw2N3oiPjwvcGF0aD48L2c+PGcgZGlzcGxheT0ibm9uZSI+PGcgZGlzcGxheT0iaW5saW5lIj48cGF0aCBmaWxsPSIjMDZmNzhiIiBzdHJva2U9IiMwNmY3OGIiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNNyw1MGMwLDEyLjY1LDEwLjM1LDIzLDIzLDIzaDQwICAgIGMxMi42NSwwLDIzLTEwLjM1LDIzLTIzbDAsMGMwLTEyLjY1LTEwLjM1LTIzLTIzLTIzSDMwQzE3LjM1LDI3LDcsMzcuMzUsNyw1MEw3LDUweiI+PC9wYXRoPjwvZz48Y2lyY2xlIGRpc3BsYXk9ImlubGluZSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMwNmY3OGIiIHN0cm9rZT0iIzA2Zjc4YiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGN4PSI3MCIgY3k9IjUwIiByPSIxNyI+PC9jaXJjbGU+PC9nPjxnIGRpc3BsYXk9Im5vbmUiPjxwYXRoIGRpc3BsYXk9ImlubGluZSIgZD0iTTcwLDI1SDMwQzE2LjIxNSwyNSw1LDM2LjIxNSw1LDUwczExLjIxNSwyNSwyNSwyNWg0MGMxMy43ODUsMCwyNS0xMS4yMTUsMjUtMjVTODMuNzg1LDI1LDcwLDI1eiBNNzAsNzEgICBIMzBDMTguNDIxLDcxLDksNjEuNTc5LDksNTBzOS40MjEtMjEsMjEtMjFoNDBjMTEuNTc5LDAsMjEsOS40MjEsMjEsMjFTODEuNTc5LDcxLDcwLDcxeiBNNzAsMzFjLTEwLjQ3NywwLTE5LDguNTIzLTE5LDE5ICAgczguNTIzLDE5LDE5LDE5czE5LTguNTIzLDE5LTE5UzgwLjQ3NywzMSw3MCwzMXogTTcwLDY1Yy04LjI3MSwwLTE1LTYuNzI5LTE1LTE1czYuNzI5LTE1LDE1LTE1czE1LDYuNzI5LDE1LDE1Uzc4LjI3MSw2NSw3MCw2NXoiPjwvcGF0aD48L2c+PC9zdmc+);\n    opacity: 1;\n    transform: rotate(0deg);\n}\n\n\n.icon_toggle\n{\n    float: right;\n    width:40px;\n    height:18px;\n    background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjE1cHgiIHdpZHRoPSIzMHB4IiBmaWxsPSIjYWFhYWFhIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGcgZGlzcGxheT0ibm9uZSI+PGcgZGlzcGxheT0iaW5saW5lIj48Zz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI2FhYWFhYSIgZD0iTTMwLDI3QzE3LjM1LDI3LDcsMzcuMzUsNyw1MGwwLDBjMCwxMi42NSwxMC4zNSwyMywyMywyM2g0MCBjMTIuNjUsMCwyMy0xMC4zNSwyMy0yM2wwLDBjMC0xMi42NS0xMC4zNS0yMy0yMy0yM0gzMHogTTcwLDY3Yy05LjM4OSwwLTE3LTcuNjEtMTctMTdzNy42MTEtMTcsMTctMTdzMTcsNy42MSwxNywxNyAgICAgUzc5LjM4OSw2Nyw3MCw2N3oiPjwvcGF0aD48L2c+PC9nPjwvZz48Zz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMwLDI3QzE3LjM1LDI3LDcsMzcuMzUsNyw1MGwwLDBjMCwxMi42NSwxMC4zNSwyMywyMywyM2g0MCAgIGMxMi42NSwwLDIzLTEwLjM1LDIzLTIzbDAsMGMwLTEyLjY1LTEwLjM1LTIzLTIzLTIzSDMweiBNNzAsNjdjLTkuMzg5LDAtMTctNy42MS0xNy0xN3M3LjYxMS0xNywxNy0xN3MxNyw3LjYxLDE3LDE3ICAgUzc5LjM4OSw2Nyw3MCw2N3oiPjwvcGF0aD48L2c+PGcgZGlzcGxheT0ibm9uZSI+PGcgZGlzcGxheT0iaW5saW5lIj48cGF0aCBmaWxsPSIjYWFhYWFhIiBzdHJva2U9IiNhYWFhYWEiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNNyw1MGMwLDEyLjY1LDEwLjM1LDIzLDIzLDIzaDQwICAgIGMxMi42NSwwLDIzLTEwLjM1LDIzLTIzbDAsMGMwLTEyLjY1LTEwLjM1LTIzLTIzLTIzSDMwQzE3LjM1LDI3LDcsMzcuMzUsNyw1MEw3LDUweiI+PC9wYXRoPjwvZz48Y2lyY2xlIGRpc3BsYXk9ImlubGluZSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNhYWFhYWEiIHN0cm9rZT0iI2FhYWFhYSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGN4PSI3MCIgY3k9IjUwIiByPSIxNyI+PC9jaXJjbGU+PC9nPjxnIGRpc3BsYXk9Im5vbmUiPjxwYXRoIGRpc3BsYXk9ImlubGluZSIgZD0iTTcwLDI1SDMwQzE2LjIxNSwyNSw1LDM2LjIxNSw1LDUwczExLjIxNSwyNSwyNSwyNWg0MGMxMy43ODUsMCwyNS0xMS4yMTUsMjUtMjVTODMuNzg1LDI1LDcwLDI1eiBNNzAsNzEgICBIMzBDMTguNDIxLDcxLDksNjEuNTc5LDksNTBzOS40MjEtMjEsMjEtMjFoNDBjMTEuNTc5LDAsMjEsOS40MjEsMjEsMjFTODEuNTc5LDcxLDcwLDcxeiBNNzAsMzFjLTEwLjQ3NywwLTE5LDguNTIzLTE5LDE5ICAgczguNTIzLDE5LDE5LDE5czE5LTguNTIzLDE5LTE5UzgwLjQ3NywzMSw3MCwzMXogTTcwLDY1Yy04LjI3MSwwLTE1LTYuNzI5LTE1LTE1czYuNzI5LTE1LDE1LTE1czE1LDYuNzI5LDE1LDE1Uzc4LjI3MSw2NSw3MCw2NXoiPjwvcGF0aD48L2c+PC9zdmc+);\n    background-size: 50px 37px;\n    background-position: -6px -10px;\n    transform: rotate(180deg);\n    opacity: 0.4;\n}\n\n\n\n/*.sidebar__toggle--active .sidebar__toggle-input {*/\n/*    transition: background-color var(--sidebar-hover-transition-time);*/\n/*    background-color: var(--sidebar-toggle-input-color);*/\n/*}*/\n/*.sidebar__toggle--active .sidebar__toggle-input:hover*/\n/*{*/\n/*    background-color: var(--sidebar-toggle-input-color-hover);*/\n/*    border-color: var(--sidebar-toggle-input-color-hover);*/\n/*    transition: background-color var(--sidebar-hover-transition-time);*/\n/*    transition: border-color var(--sidebar-hover-transition-time);*/\n/*}*/\n\n/*\n * SIDEBAR ITEM BUTTON\n */\n\n.sidebar__button {}\n\n.sidebar__button-input {\n    -webkit-user-select: none;  /* Chrome all / Safari all */\n    -moz-user-select: none;     /* Firefox all */\n    -ms-user-select: none;      /* IE 10+ */\n    user-select: none;          /* Likely future */\n    height: 24px;\n    background-color: transparent;\n    color: #CCCCCC;\n    box-sizing: border-box;\n    padding-top: 3px;\n    text-align: center;\n    border-radius: 125px;\n    border:2px solid #555;\n    cursor: pointer;\n}\n\n.sidebar__button-input.plus, .sidebar__button-input.minus {\n    display: inline-block;\n    min-width: 20px;\n}\n\n.sidebar__button-input:hover {\n  background-color: #333;\n  border:2px solid #07f78c;\n}\n\n/*\n * VALUE DISPLAY (shows a value)\n */\n\n.sidebar__value-display {}\n\n/*\n * SLIDER\n */\n\n.sidebar__slider {\n    --sidebar-slider-input-height: 3px;\n}\n\n.sidebar__slider-input-wrapper {\n    width: 100%;\n    margin-top: 8px;\n    position: relative;\n}\n\n.sidebar__slider-input {\n    -webkit-appearance: none;\n    appearance: none;\n    margin: 0;\n    width: 100%;\n    height: var(--sidebar-slider-input-height);\n    background: #555;\n    cursor: pointer;\n    outline: 0;\n\n    -webkit-transition: .2s;\n    transition: background-color .2s;\n    border: none;\n}\n\n.sidebar__slider-input:focus, .sidebar__slider-input:hover {\n    border: none;\n}\n\n.sidebar__slider-input-active-track {\n    user-select: none;\n    position: absolute;\n    z-index: 11;\n    top: 0;\n    left: 0;\n    background-color: #07f78c;\n    pointer-events: none;\n    height: var(--sidebar-slider-input-height);\n\n    /* width: 10px; */\n}\n\n/* Mouse-over effects */\n.sidebar__slider-input:hover {\n    /*background-color: #444444;*/\n}\n\n/*.sidebar__slider-input::-webkit-progress-value {*/\n/*    background-color: green;*/\n/*    color:green;*/\n\n/*    }*/\n\n/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */\n\n.sidebar__slider-input::-moz-range-thumb\n{\n    position: absolute;\n    height: 15px;\n    width: 15px;\n    z-index: 900 !important;\n    border-radius: 20px !important;\n    cursor: pointer;\n    background: #07f78c !important;\n    user-select: none;\n\n}\n\n.sidebar__slider-input::-webkit-slider-thumb\n{\n    position: relative;\n    appearance: none;\n    -webkit-appearance: none;\n    user-select: none;\n    height: 15px;\n    width: 15px;\n    display: block;\n    z-index: 900 !important;\n    border: 0;\n    border-radius: 20px !important;\n    cursor: pointer;\n    background: #777 !important;\n}\n\n.sidebar__slider-input:hover ::-webkit-slider-thumb {\n    background-color: #EEEEEE !important;\n}\n\n/*.sidebar__slider-input::-moz-range-thumb {*/\n\n/*    width: 0 !important;*/\n/*    height: var(--sidebar-slider-input-height);*/\n/*    background: #EEEEEE;*/\n/*    cursor: pointer;*/\n/*    border-radius: 0 !important;*/\n/*    border: none;*/\n/*    outline: 0;*/\n/*    z-index: 100 !important;*/\n/*}*/\n\n.sidebar__slider-input::-moz-range-track {\n    background-color: transparent;\n    z-index: 11;\n}\n\n/*.sidebar__slider-input::-moz-range-thumb:hover {*/\n  /* background-color: #EEEEEE; */\n/*}*/\n\n\n/*.sidebar__slider-input-wrapper:hover .sidebar__slider-input-active-track {*/\n/*    background-color: #EEEEEE;*/\n/*}*/\n\n/*.sidebar__slider-input-wrapper:hover .sidebar__slider-input::-moz-range-thumb {*/\n/*    background-color: #fff !important;*/\n/*}*/\n\n/*.sidebar__slider-input-wrapper:hover .sidebar__slider-input::-webkit-slider-thumb {*/\n/*    background-color: #EEEEEE;*/\n/*}*/\n\n.sidebar__slider input[type=text] {\n    box-sizing: border-box;\n    /*background-color: #333333;*/\n    text-align: right;\n    color: #BBBBBB;\n    display: inline-block;\n    background-color: transparent !important;\n\n    width: 40%;\n    height: 18px;\n    outline: none;\n    border: none;\n    border-radius: 0;\n    padding: 0 0 0 4px !important;\n    margin: 0;\n}\n\n.sidebar__slider input[type=text]:active,\n.sidebar__slider input[type=text]:focus,\n.sidebar__slider input[type=text]:hover {\n\n    color: #EEEEEE;\n}\n\n/*\n * TEXT / DESCRIPTION\n */\n\n.sidebar__text .sidebar__item-label {\n    width: auto;\n    display: block;\n    max-height: none;\n    margin-right: 0;\n    line-height: 1.1em;\n}\n\n/*\n * SIDEBAR INPUT\n */\n.sidebar__text-input textarea,\n.sidebar__text-input input[type=text] {\n    box-sizing: border-box;\n    background-color: #333333;\n    color: #BBBBBB;\n    display: inline-block;\n    width: 50%;\n    height: 18px;\n    outline: none;\n    border: none;\n    border-radius: 0;\n    border:1px solid #666;\n    padding: 0 0 0 4px !important;\n    margin: 0;\n}\n\n.sidebar__color-picker .sidebar__item-label\n{\n    width:45%;\n}\n\n.sidebar__text-input textarea,\n.sidebar__text-input input[type=text]:active,\n.sidebar__text-input input[type=text]:focus,\n.sidebar__text-input input[type=text]:hover {\n    background-color: transparent;\n    color: #EEEEEE;\n}\n\n.sidebar__text-input textarea\n{\n    margin-top:10px;\n    height:60px;\n    width:100%;\n}\n\n/*\n * SIDEBAR SELECT\n */\n\n\n\n .sidebar__select {}\n .sidebar__select-select {\n    color: #BBBBBB;\n    /*-webkit-appearance: none;*/\n    /*-moz-appearance: none;*/\n    appearance: none;\n    /*box-sizing: border-box;*/\n    width: 50%;\n    height: 20px;\n    background-color: #333333;\n    /*background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4ODg4ODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLWNoZXZyb24tZG93biI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiPjwvcG9seWxpbmU+PC9zdmc+);*/\n    background-repeat: no-repeat;\n    background-position: right center;\n    background-size: 16px 16px;\n    margin: 0;\n    /*padding: 0 2 2 6px;*/\n    border-radius: 5px;\n    border: 1px solid #777;\n    background-color: #444;\n    cursor: pointer;\n    outline: none;\n\n }\n\n.sidebar__select-select:hover,\n.sidebar__select-select:active,\n.sidebar__select-select:active {\n    background-color: #444444;\n    color: #EEEEEE;\n}\n\n/*\n * COLOR PICKER\n */\n\n .sidebar__color-picker-color-input {}\n\n .sidebar__color-picker input[type=text] {\n    box-sizing: border-box;\n    background-color: #333333;\n    color: #BBBBBB;\n    display: inline-block;\n    width: calc(50% - 21px); /* 50% minus space of picker circle */\n    height: 18px;\n    outline: none;\n    border: none;\n    border-radius: 0;\n    padding: 0 0 0 4px !important;\n    margin: 0;\n    margin-right: 7px;\n}\n\n.sidebar__color-picker input[type=text]:active,\n.sidebar__color-picker input[type=text]:focus,\n.sidebar__color-picker input[type=text]:hover {\n    background-color: #444444;\n    color: #EEEEEE;\n}\n\n.sidebar__color-picker input[type=color],\n.sidebar__palette-picker input[type=color] {\n    display: inline-block;\n    border-radius: 100%;\n    height: 14px;\n    width: 14px;\n    padding: 0;\n    border: none;\n    border-color: transparent;\n    outline: none;\n    background: none;\n    appearance: none;\n    -moz-appearance: none;\n    -webkit-appearance: none;\n    cursor: pointer;\n    position: relative;\n    top: 3px;\n}\n.sidebar__color-picker input[type=color]:focus,\n.sidebar__palette-picker input[type=color]:focus {\n    outline: none;\n}\n.sidebar__color-picker input[type=color]::-moz-color-swatch,\n.sidebar__palette-picker input[type=color]::-moz-color-swatch {\n    border: none;\n}\n.sidebar__color-picker input[type=color]::-webkit-color-swatch-wrapper,\n.sidebar__palette-picker input[type=color]::-webkit-color-swatch-wrapper {\n    padding: 0;\n}\n.sidebar__color-picker input[type=color]::-webkit-color-swatch,\n.sidebar__palette-picker input[type=color]::-webkit-color-swatch {\n    border: none;\n    border-radius: 100%;\n}\n\n/*\n * Palette Picker\n */\n.sidebar__palette-picker .sidebar__palette-picker-color-input.first {\n    margin-left: 0;\n}\n.sidebar__palette-picker .sidebar__palette-picker-color-input.last {\n    margin-right: 0;\n}\n.sidebar__palette-picker .sidebar__palette-picker-color-input {\n    margin: 0 4px;\n}\n\n.sidebar__palette-picker .circlebutton {\n    width: 14px;\n    height: 14px;\n    border-radius: 1em;\n    display: inline-block;\n    top: 3px;\n    position: relative;\n}\n\n/*\n * Preset\n */\n.sidebar__item-presets-preset\n{\n    padding:4px;\n    cursor:pointer;\n    padding-left:8px;\n    padding-right:8px;\n    margin-right:4px;\n    background-color:#444;\n}\n\n.sidebar__item-presets-preset:hover\n{\n    background-color:#666;\n}\n\n.sidebar__greyout\n{\n    background: #222;\n    opacity: 0.8;\n    width: 100%;\n    height: 100%;\n    position: absolute;\n    z-index: 1000;\n    right: 0;\n    top: 0;\n}\n",};
// vars
const CSS_ELEMENT_CLASS = 'cables-sidebar-style'; /* class for the style element to be generated */
const CSS_ELEMENT_DYNAMIC_CLASS = 'cables-sidebar-dynamic-style'; /* things which can be set via op-port, but not attached to the elements themselves, e.g. minimized opacity */
const SIDEBAR_CLASS = 'sidebar-cables';
const SIDEBAR_ID = 'sidebar'+CABLES.uuid();
const SIDEBAR_ITEMS_CLASS = 'sidebar__items';
const SIDEBAR_OPEN_CLOSE_BTN_CLASS = 'sidebar__close-button';
const SIDEBAR_OPEN_CLOSE_BTN_ICON_CLASS = 'sidebar__close-button-icon';
const BTN_TEXT_OPEN = ''; // 'Close';
const BTN_TEXT_CLOSED = ''; // 'Show Controls';

let openCloseBtn = null;
let openCloseBtnIcon = null;
var headerTitleText=null;

// inputs
var visiblePort = op.inValueBool("Visible", true);
var opacityPort = op.inValueSlider('Opacity', 1);
var defaultMinimizedPort = op.inValueBool('Default Minimized');
var minimizedOpacityPort = op.inValueSlider('Minimized Opacity', 0.5);

var inTitle = op.inString('Title','Sidebar');
var side = op.inValueBool('Side');

// outputs
var childrenPort = op.outObject('childs');

var sidebarEl = document.querySelector('.' + SIDEBAR_ID);
if(!sidebarEl) {
    sidebarEl = initSidebarElement();
}
// if(!sidebarEl) return;
var sidebarItemsEl = sidebarEl.querySelector('.' + SIDEBAR_ITEMS_CLASS);
childrenPort.set({
    parentElement: sidebarItemsEl,
    parentOp: op,
});
onDefaultMinimizedPortChanged();
initSidebarCss();
updateDynamicStyles();

// change listeners
visiblePort.onChange = onVisiblePortChange;
opacityPort.onChange = onOpacityPortChange;
defaultMinimizedPort.onChange = onDefaultMinimizedPortChanged;
minimizedOpacityPort.onChange = onMinimizedOpacityPortChanged;
op.onDelete = onDelete;

// functions

function onMinimizedOpacityPortChanged() {
    updateDynamicStyles();
}

side.onChange=function()
{
    if(side.get()) sidebarEl.classList.add('sidebar-cables-right');
        else sidebarEl.classList.remove('sidebar-cables-right');
};


function onDefaultMinimizedPortChanged() {
    if(!openCloseBtn) { return; }
    if(defaultMinimizedPort.get()) {
        sidebarEl.classList.add('sidebar--closed');
        // openCloseBtn.textContent = BTN_TEXT_CLOSED;
    } else {
        sidebarEl.classList.remove('sidebar--closed');
        // openCloseBtn.textContent = BTN_TEXT_OPEN;
    }
}

function onOpacityPortChange()
{
    var opacity = opacityPort.get();
    sidebarEl.style.opacity = opacity;
}

function onVisiblePortChange() {
    if(visiblePort.get()) {
        sidebarEl.style.display = 'block';
    } else {
        sidebarEl.style.display = 'none';
    }
}

side.onChanged=function()
{

};

/**
 * Some styles cannot be set directly inline, so a dynamic stylesheet is needed.
 * Here hover states can be set later on e.g.
 */
function updateDynamicStyles()
{
    let dynamicStyles = document.querySelectorAll('.' + CSS_ELEMENT_DYNAMIC_CLASS);
    if(dynamicStyles)
    {
        dynamicStyles.forEach(function(e)
        {
            e.parentNode.removeChild(e);
        });
    }
    let newDynamicStyle = document.createElement('style');
    newDynamicStyle.classList.add(CSS_ELEMENT_DYNAMIC_CLASS);
    let cssText = '.sidebar--closed .sidebar__close-button { ';
    cssText +=         'opacity: ' + minimizedOpacityPort.get();
    cssText +=     '}';
    let cssTextEl = document.createTextNode(cssText);
    newDynamicStyle.appendChild(cssTextEl);
    document.body.appendChild(newDynamicStyle);
}

function initSidebarElement()
{
    var element = document.createElement('div');
    element.classList.add(SIDEBAR_CLASS);
    element.classList.add(SIDEBAR_ID);
    var canvasWrapper = op.patch.cgl.canvas.parentElement; /* maybe this is bad outside cables!? */

    // header...
    var headerGroup = document.createElement('div');
    headerGroup.classList.add('sidebar__group');
    element.appendChild(headerGroup);
    var header = document.createElement('div');
    header.classList.add('sidebar__group-header');
    element.appendChild(header);
    var headerTitle = document.createElement('div');
    headerTitle.classList.add('sidebar__group-header-title');
    headerTitleText = document.createElement('span');
    headerTitleText.classList.add('sidebar__group-header-title-text');
    headerTitleText.innerHTML=inTitle.get();
    headerTitle.appendChild(headerTitleText);
    header.appendChild(headerTitle);
    headerGroup.appendChild(header);
    element.appendChild(headerGroup);
    headerGroup.addEventListener('click', onOpenCloseBtnClick);

    if(!canvasWrapper)
    {
        console.warn("[sidebar] no canvas parentelement found...");
        return;
    }
    canvasWrapper.appendChild(element);
    var items = document.createElement('div');
    items.classList.add(SIDEBAR_ITEMS_CLASS);
    element.appendChild(items);
    openCloseBtn = document.createElement('div');
    openCloseBtn.classList.add(SIDEBAR_OPEN_CLOSE_BTN_CLASS);
    openCloseBtn.addEventListener('click', onOpenCloseBtnClick);
    // openCloseBtn.textContent = BTN_TEXT_OPEN;
    element.appendChild(openCloseBtn);
    openCloseBtnIcon = document.createElement('span');
    openCloseBtnIcon.classList.add(SIDEBAR_OPEN_CLOSE_BTN_ICON_CLASS);
    openCloseBtn.appendChild(openCloseBtnIcon);

    return element;
}

inTitle.onChange=function()
{
    if(headerTitleText)headerTitleText.innerHTML=inTitle.get();

};

function setClosed(b)
{

}

function onOpenCloseBtnClick(ev)
{
    ev.stopPropagation();
    if(!sidebarEl) { console.error('Sidebar could not be closed...'); return; }
    sidebarEl.classList.toggle('sidebar--closed');
    const btn = ev.target;
    let btnText = BTN_TEXT_OPEN;
    if(sidebarEl.classList.contains('sidebar--closed')) btnText = BTN_TEXT_CLOSED;
}

function initSidebarCss() {
    //var cssEl = document.getElementById(CSS_ELEMENT_ID);
    var cssElements = document.querySelectorAll('.' + CSS_ELEMENT_CLASS);
    // remove old script tag
    if(cssElements) {
        cssElements.forEach(function(e) {
            e.parentNode.removeChild(e);
        });
    }
    var newStyle = document.createElement('style');
    newStyle.innerHTML = attachments.style_css;
    newStyle.classList.add(CSS_ELEMENT_CLASS);
    document.body.appendChild(newStyle);
}

function onDelete() {
    removeElementFromDOM(sidebarEl);
}

function removeElementFromDOM(el) {
    if(el && el.parentNode && el.parentNode.removeChild) el.parentNode.removeChild(el);
}



};

Ops.Sidebar.Sidebar.prototype = new CABLES.Op();
CABLES.OPS["5a681c35-78ce-4cb3-9858-bc79c34c6819"]={f:Ops.Sidebar.Sidebar,objName:"Ops.Sidebar.Sidebar"};




// **************************************************************
// 
// Ops.Sidebar.Group
// 
// **************************************************************

Ops.Sidebar.Group = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
// inputs
var parentPort = op.inObject('link');
var labelPort = op.inString('Text', 'Group');
var defaultMinimizedPort = op.inValueBool('Default Minimized');
const inVisible=op.inBool("Visible",true);

// outputs
var nextPort = op.outObject('next');
var childrenPort = op.outObject('childs');


inVisible.onChange=function()
{
    el.style.display= inVisible.get() ? "block" : "none";
};


// vars
var el = document.createElement('div');
el.classList.add('sidebar__group');
onDefaultMinimizedPortChanged();
var header = document.createElement('div');
header.classList.add('sidebar__group-header');
el.appendChild(header);
header.addEventListener('click', onClick);
var headerTitle = document.createElement('div');
headerTitle.classList.add('sidebar__group-header-title');
// headerTitle.textContent = labelPort.get();
header.appendChild(headerTitle);
var headerTitleText = document.createElement('span');
headerTitleText.textContent = labelPort.get();
headerTitleText.classList.add('sidebar__group-header-title-text');
headerTitle.appendChild(headerTitleText);
var icon = document.createElement('span');
icon.classList.add('sidebar__group-header-icon');
icon.classList.add('iconsidebar-chevron-up');
headerTitle.appendChild(icon);
var groupItems = document.createElement('div');
groupItems.classList.add('sidebar__group-items');
el.appendChild(groupItems);
op.toWorkPortsNeedToBeLinked(parentPort);

// events
parentPort.onChange = onParentChanged;
labelPort.onChange = onLabelTextChanged;
defaultMinimizedPort.onChange = onDefaultMinimizedPortChanged;
op.onDelete = onDelete;

// functions

function onDefaultMinimizedPortChanged() {
    if(defaultMinimizedPort.get()) {
        el.classList.add('sidebar__group--closed');
    } else {
        el.classList.remove('sidebar__group--closed');
    }
}

function onClick(ev) {
    ev.stopPropagation();
    el.classList.toggle('sidebar__group--closed');
}

function onLabelTextChanged() {
    var labelText = labelPort.get();
    headerTitleText.textContent = labelText;
    if(CABLES.UI) {
        op.setTitle('Group: ' + labelText);
    }
}

function onParentChanged() {
    var parent = parentPort.get();
    if(parent && parent.parentElement) {
        parent.parentElement.appendChild(el);
        childrenPort.set(null);
        childrenPort.set({
            parentElement: groupItems,
            parentOp: op,
        });
        nextPort.set(parent);
    } else { // detach
        if(el.parentElement) {
            el.parentElement.removeChild(el);
        }
    }
}

function showElement(el) {
    if(el) {
        el.style.display = 'block';
    }
}

function hideElement(el) {
    if(el) {
        el.style.display = 'none';
    }
}

function onDelete() {
    removeElementFromDOM(el);
}

function removeElementFromDOM(el) {
    if(el && el.parentNode && el.parentNode.removeChild) {
        el.parentNode.removeChild(el);
    }
}


};

Ops.Sidebar.Group.prototype = new CABLES.Op();
CABLES.OPS["86ea2333-b51c-48ed-94c2-8b7b6e9ff34c"]={f:Ops.Sidebar.Group,objName:"Ops.Sidebar.Group"};




// **************************************************************
// 
// Ops.Sidebar.SidebarText_v2
// 
// **************************************************************

Ops.Sidebar.SidebarText_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
// inputs
var parentPort = op.inObject('link');
var labelPort = op.inString('Text', 'Value');
var inId = op.inValueString('Id', '');

// outputs
var siblingsPort = op.outObject('childs');

// vars
var el = document.createElement('div');
el.classList.add('sidebar__item');
el.classList.add('sidebar__text');
var label = document.createElement('div');
label.classList.add('sidebar__item-label');
var labelText = document.createTextNode(labelPort.get());
label.appendChild(labelText);
el.appendChild(label);

// events
parentPort.onChange = onParentChanged;
labelPort.onChange = onLabelTextChanged;
inId.onChange = onIdChanged;
op.onDelete = onDelete;

op.toWorkNeedsParent('Ops.Sidebar.Sidebar');

// functions

function onIdChanged()
{
    el.id=inId.get();
}

function onLabelTextChanged() {
    var labelText = labelPort.get();
    label.textContent = labelText;
    if(CABLES.UI) {
        if(labelText && typeof labelText === 'string') {
            op.setTitle('Text: ' + labelText.substring(0, 10)); // display first 10 characters of text in op title
        } else {
            op.setTitle('Text');
        }
    }
}

function onParentChanged() {
    var parent = parentPort.get();
    if(parent && parent.parentElement) {
        parent.parentElement.appendChild(el);
        siblingsPort.set(null);
        siblingsPort.set(parent);
    } else { // detach
        if(el.parentElement) {
            el.parentElement.removeChild(el);
        }
    }
}

function showElement(el) {
    if(el) {
        el.style.display = 'block';
    }
}

function hideElement(el) {
    if(el) {
        el.style.display = 'none';
    }
}

function onDelete() {
    removeElementFromDOM(el);
}

function removeElementFromDOM(el) {
    if(el && el.parentNode && el.parentNode.removeChild) {
        el.parentNode.removeChild(el);
    }
}


};

Ops.Sidebar.SidebarText_v2.prototype = new CABLES.Op();
CABLES.OPS["cc591cc3-ff23-4817-907c-e5be7d5c059d"]={f:Ops.Sidebar.SidebarText_v2,objName:"Ops.Sidebar.SidebarText_v2"};




// **************************************************************
// 
// Ops.Sidebar.TextInput_v2
// 
// **************************************************************

Ops.Sidebar.TextInput_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
// inputs
const parentPort = op.inObject('Link');
const labelPort = op.inString('Text', 'Text');
const defaultValuePort = op.inString('Default', '');
const inTextArea=op.inBool("TextArea",false);
const inGreyOut=op.inBool("Grey Out",false);
const inVisible=op.inBool("Visible",true);

// outputs
const siblingsPort = op.outObject('Children');
const valuePort = op.outString('Result', defaultValuePort.get());

// vars
var el = document.createElement('div');
el.classList.add('sidebar__item');
el.classList.add('sidebar__text-input');
var label = document.createElement('div');
label.classList.add('sidebar__item-label');
var labelText = document.createTextNode(labelPort.get());
label.appendChild(labelText);
el.appendChild(label);
//var inputWrapper = document.createElement('div');
//inputWrapper.classList.add('sidebar__text-input-input-wrapper');
//el.appendChild(inputWrapper);

var input=null;
creatElement();

//inputWrapper.appendChild(input);
op.toWorkPortsNeedToBeLinked(parentPort);

inTextArea.onChange=creatElement;

function creatElement()
{
    if(input)input.remove();
    if(!inTextArea.get())
    {
        input = document.createElement('input');
    }
    else
    {
        input = document.createElement('textarea');
        onDefaultValueChanged();

    }

    input.classList.add('sidebar__text-input-input');
    input.setAttribute('type', 'text');
    input.setAttribute('value', defaultValuePort.get());
    el.appendChild(input);
    input.addEventListener('input', onInput);
}

var greyOut = document.createElement('div');
greyOut.classList.add('sidebar__greyout');
el.appendChild(greyOut);
greyOut.style.display="none";

inGreyOut.onChange=function()
{
    greyOut.style.display= inGreyOut.get() ? "block" : "none";
};

inVisible.onChange=function()
{
    el.style.display= inVisible.get() ? "block" : "none";
};


// events
parentPort.onChange = onParentChanged;
labelPort.onChange = onLabelTextChanged;
defaultValuePort.onChange = onDefaultValueChanged;
op.onDelete = onDelete;

// functions

function onInput(ev) {
    valuePort.set(ev.target.value);
}

function onDefaultValueChanged() {
    var defaultValue = defaultValuePort.get();
    valuePort.set(defaultValue);
    input.value = defaultValue;
}

function onLabelTextChanged() {
    var labelText = labelPort.get();
    label.textContent = labelText;
    if(CABLES.UI) {
        op.setTitle('Text Input: ' + labelText);
    }
}

function onParentChanged() {
    var parent = parentPort.get();
    if(parent && parent.parentElement) {
        parent.parentElement.appendChild(el);
        siblingsPort.set(null);
        siblingsPort.set(parent);
    } else { // detach
        if(el.parentElement) {
            el.parentElement.removeChild(el);
        }
    }
}

function showElement(el) {
    if(el) {
        el.style.display = 'block';
    }
}

function hideElement(el) {
    if(el) {
        el.style.display = 'none';
    }
}

function onDelete() {
    removeElementFromDOM(el);
}

function removeElementFromDOM(el) {
    if(el && el.parentNode && el.parentNode.removeChild) {
        el.parentNode.removeChild(el);
    }
}


};

Ops.Sidebar.TextInput_v2.prototype = new CABLES.Op();
CABLES.OPS["6538a190-e73c-451b-964e-d010ee267aa9"]={f:Ops.Sidebar.TextInput_v2,objName:"Ops.Sidebar.TextInput_v2"};




// **************************************************************
// 
// Ops.Sidebar.NumberInput_v2
// 
// **************************************************************

Ops.Sidebar.NumberInput_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
// inputs
const parentPort = op.inObject("Link");
const labelPort = op.inString("Text", "Number");
const inputValuePort = op.inValue("Input", 0);
const setDefaultValueButtonPort = op.inTriggerButton("Set Default");
const defaultValuePort = op.inValue("Default", 0);
defaultValuePort.setUiAttribs({ "hidePort": true, "greyout": true });

// outputs
const siblingsPort = op.outObject("Children");
const valuePort = op.outValue("Result", defaultValuePort.get());

// vars
const el = document.createElement("div");
el.classList.add("sidebar__item");
el.classList.add("sidebar__text-input");
const label = document.createElement("div");
label.classList.add("sidebar__item-label");
const labelTextNode = document.createTextNode(labelPort.get());
label.appendChild(labelTextNode);
el.appendChild(label);
// var inputWrapper = document.createElement('div');
// inputWrapper.classList.add('sidebar__text-input-input-wrapper');
// el.appendChild(inputWrapper);
const input = document.createElement("input");
input.classList.add("sidebar__text-input-input");
input.setAttribute("type", "text");
input.setAttribute("value", defaultValuePort.get());
// inputWrapper.appendChild(input);
el.appendChild(input);
input.addEventListener("input", onInput);

// events
parentPort.onChange = onParentChanged;
labelPort.onChange = onLabelTextChanged;
defaultValuePort.onChange = onDefaultValueChanged;
op.onDelete = onDelete;
inputValuePort.onChange = onInputValuePortChanged;
setDefaultValueButtonPort.onTriggered = setDefaultValue;

// functions

function setDefaultValue()
{
    defaultValuePort.set(parseFloat(inputValuePort.get()));
    if (CABLES.UI && op.isCurrentUiOp())
    {
        gui.opParams.show(op); /* update DOM */
    }
}

function onInputValuePortChanged()
{
    let val = parseFloat(inputValuePort.get());
    if (isNaN(val)) { val = 0; }
    input.value = val;
    valuePort.set(val);
}

function onInput(ev)
{
    let newVal = parseFloat(ev.target.value);
    if (isNaN(newVal)) { newVal = 0; }
    valuePort.set(newVal);
    inputValuePort.set(newVal);
    if (CABLES.UI && op.isCurrentUiOp())
    {
        gui.opParams.show(op); /* update DOM */
    }
}

function onDefaultValueChanged()
{
    /*
    var defaultValue = defaultValuePort.get();
    valuePort.set(defaultValue);
    input.value = defaultValue;
    */
}

function onLabelTextChanged()
{
    const labelText = labelPort.get();
    label.textContent = labelText;
    if (CABLES.UI)
    {
        op.setTitle("Number Input: " + labelText);
    }
}

function onParentChanged()
{
    const parent = parentPort.get();
    if (parent && parent.parentElement)
    {
        parent.parentElement.appendChild(el);
        siblingsPort.set(null);
        siblingsPort.set(parent);
    }
    else
    { // detach
        if (el.parentElement)
        {
            el.parentElement.removeChild(el);
        }
    }
}

function showElement(element)
{
    if (element)
    {
        element.style.display = "block";
    }
}

function hideElement(element)
{
    if (element)
    {
        element.style.display = "none";
    }
}

function onDelete()
{
    removeElementFromDOM(el);
}

function removeElementFromDOM(element)
{
    if (element && element.parentNode && element.parentNode.removeChild)
    {
        element.parentNode.removeChild(element);
    }
}


};

Ops.Sidebar.NumberInput_v2.prototype = new CABLES.Op();
CABLES.OPS["c4f3f1d7-de07-4c06-921e-32baeef4fc68"]={f:Ops.Sidebar.NumberInput_v2,objName:"Ops.Sidebar.NumberInput_v2"};




// **************************************************************
// 
// Ops.Sidebar.DropDown_v2
// 
// **************************************************************

Ops.Sidebar.DropDown_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
// inputs
const parentPort = op.inObject("Link");
const labelPort = op.inString("Text", "Value");
const valuesPort = op.inArray("Values");
const defaultValuePort = op.inString("Default", "");
const inGreyOut = op.inBool("Grey Out", false);
const inVisible = op.inBool("Visible", true);


// outputs
const siblingsPort = op.outObject("Children");
const valuePort = op.outString("Result", defaultValuePort.get());
const outIndex = op.outNumber("Index");

// vars
const el = document.createElement("div");
el.classList.add("sidebar__item");
el.classList.add("sidebar__select");
const label = document.createElement("div");
label.classList.add("sidebar__item-label");
const labelText = document.createTextNode(labelPort.get());
label.appendChild(labelText);
el.appendChild(label);
const input = document.createElement("select");
input.classList.add("sidebar__select-select");
el.appendChild(input);
input.addEventListener("input", onInput);

const greyOut = document.createElement("div");
greyOut.classList.add("sidebar__greyout");
el.appendChild(greyOut);
greyOut.style.display = "none";

inGreyOut.onChange = function ()
{
    greyOut.style.display = inGreyOut.get() ? "block" : "none";
};

inVisible.onChange = function ()
{
    el.style.display = inVisible.get() ? "block" : "none";
};


// events
parentPort.onChange = onParentChanged;
labelPort.onChange = onLabelTextChanged;
defaultValuePort.onChange = onDefaultValueChanged;
op.onDelete = onDelete;
valuesPort.onChange = onValuesPortChange;

let options = [];
// functions

op.onLoaded = function ()
{
    valuePort.set(defaultValuePort.get());
};

function onValuesPortChange()
{
    // remove all children
    while (input.lastChild)
    {
        input.removeChild(input.lastChild);
    }
    options = valuesPort.get();
    const defaultValue = defaultValuePort.get();
    if (options)
    {
        options.forEach(function (option)
        {
            const optionEl = document.createElement("option");
            optionEl.setAttribute("value", option);
            if (option === defaultValue)
            {
                optionEl.setAttribute("selected", "");
            }
            const textEl = document.createTextNode(option);
            optionEl.appendChild(textEl);
            input.appendChild(optionEl);
        });
    }
    else
    {
        valuePort.set("");
    }
    setSelectedProperty(); /* set the selected property for the default value */
}

function setSelectedProperty()
{
    const defaultItem = defaultValuePort.get();
    const optionElements = input.querySelectorAll("option");
    optionElements.forEach(function (optionElement, index)
    {
        if (optionElement.value === defaultItem)
        {
            optionElement.setAttribute("selected", "");
            outIndex.set(index);
        }
        else
        {
            optionElement.removeAttribute("selected");
        }
    });
}

function onInput(ev)
{
    valuePort.set(ev.target.value);
    outIndex.set(options.indexOf(ev.target.value));
}

function onDefaultValueChanged()
{
    const defaultValue = defaultValuePort.get();
    valuePort.set(defaultValue);
    // input.value = defaultValue;
    setSelectedProperty();
}

function onLabelTextChanged()
{
    const labelText = labelPort.get();
    label.textContent = labelText;
    if (CABLES.UI)
    {
        op.setTitle("Dropdown: " + labelText);
    }
}

function onParentChanged()
{
    const parent = parentPort.get();
    if (parent && parent.parentElement)
    {
        parent.parentElement.appendChild(el);
        siblingsPort.set(null);
        siblingsPort.set(parent);
    }
    else
    { // detach
        if (el.parentElement)
        {
            el.parentElement.removeChild(el);
        }
    }
}

function showElement(el)
{
    if (el)
    {
        el.style.display = "block";
    }
}

function hideElement(el)
{
    if (el)
    {
        el.style.display = "none";
    }
}

function onDelete()
{
    removeElementFromDOM(el);
}

function removeElementFromDOM(el)
{
    if (el && el.parentNode && el.parentNode.removeChild)
    {
        el.parentNode.removeChild(el);
    }
}


};

Ops.Sidebar.DropDown_v2.prototype = new CABLES.Op();
CABLES.OPS["7b3f93d6-4de1-41fd-aa26-e74c8285c662"]={f:Ops.Sidebar.DropDown_v2,objName:"Ops.Sidebar.DropDown_v2"};




// **************************************************************
// 
// Ops.Array.ParseArray_v2
// 
// **************************************************************

Ops.Array.ParseArray_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const text = op.inStringEditor("text", "1,2,3"),
    separator = op.inString("separator", ","),
    toNumber = op.inValueBool("Numbers", true),
    parsed = op.outTrigger("Parsed"),
    arr = op.outArray("array"),
    len = op.outValue("length");

text.onChange = separator.onChange = toNumber.onChange = parse;

parse();

function parse()
{
    if (!text.get())
    {
        arr.set(null);
        arr.set([]);
        len.set(0);
        return;
    }

    const r = text.get().split(separator.get());

    if (r[r.length - 1] === "") r.length -= 1;

    len.set(r.length);

    op.setUiError("notnum", null);
    if (toNumber.get())
    {
        let hasStrings = false;
        for (let i = 0; i < r.length; i++)
        {
            r[i] = Number(r[i]);
            if (!CABLES.UTILS.isNumeric(r[i]))
            {
                hasStrings = true;
            }
        }
        if (hasStrings)
        {
            op.setUiError("notnum", "Parse Error / Not all values numerical!");
        }
    }

    arr.set(null);
    arr.set(r);
    parsed.trigger();
}


};

Ops.Array.ParseArray_v2.prototype = new CABLES.Op();
CABLES.OPS["c974de41-4ce4-4432-b94d-724741109c71"]={f:Ops.Array.ParseArray_v2,objName:"Ops.Array.ParseArray_v2"};




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
// Ops.Math.Log
// 
// **************************************************************

Ops.Math.Log = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const number=op.inValueFloat("number");
const result=op.outValue("result");

number.onChange=function()
{
    var r=Math.log( number.get() );
    if(isNaN(r))r=0;
    result.set(r);
};

};

Ops.Math.Log.prototype = new CABLES.Op();
CABLES.OPS["7440b1ca-71d9-42a3-a927-d7b45b8857f9"]={f:Ops.Math.Log,objName:"Ops.Math.Log"};




// **************************************************************
// 
// Ops.User.alivemachine.MyWebcam
// 
// **************************************************************

Ops.User.alivemachine.MyWebcam = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
// todo: https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode
loadDaFun();
function loadDaFun() {
   var script = document.createElement('script');
   script.src = 'https://webrtc.github.io/adapter/adapter-latest.js';
   var head = document.getElementsByTagName("head")[0];
   head.appendChild(script);
}
const
    inFacing = op.inSwitch("Facing", ["environment", "user"], "user"),
    flip = op.inValueBool("flip"),
    fps = op.inValueInt("fps"),
    width = op.inValueInt("Width", 640),
    height = op.inValueInt("Height", 480),
    inActive = op.inValueBool("Active", true),
    inStyle = op.inValueEditor("Style", "position:absolute;z-index:9999;", "none"),
    inCap = op.inTriggerButton("Capture"),
    textureOut = op.outTexture("texture"),
    outRatio = op.outValue("Ratio"),
    available = op.outValue("Available"),
    outWidth = op.outNumber("Width"),
    outHeight = op.outNumber("Height"),
    outEleId = op.outString("Element Id"),
    outObj = op.outObject("Element"),
    outClicked = op.outTrigger("Clicked"),
    outCap = op.outString("Captured");

width.onChange =
    height.onChange =
    inFacing.onChange = startWebcam;
inStyle.onChange = updateStyle;
inCap.onTriggered=onMouseClick;
fps.set(30);
flip.set(true);

const cgl = op.patch.cgl;
const videoElement = document.createElement("video");
const eleId = "webcam" + CABLES.uuid();
if(inActive.get()===false){
    videoElement.style.display = "none";
}else{
    videoElement.style.display = "block";
}
videoElement.setAttribute("id", eleId);
videoElement.setAttribute("autoplay", "");
videoElement.setAttribute("muted", "");
videoElement.setAttribute("playsinline", "");
videoElement.addEventListener("click", onMouseClick);

op.patch.cgl.canvas.parentElement.appendChild(videoElement);

const tex = new CGL.Texture(cgl);
tex.setSize(8, 8);
textureOut.set(tex);
let timeout = null;

let canceled = false;

op.onDelete = removeElement;

function removeElement()
{
    if (videoElement) videoElement.remove();
    clearTimeout(timeout);
}


inActive.onChange = function ()
{
    if (inActive.get())
    {
        canceled = false;
        videoElement.style.display = "block";
        updateTexture();
    }
    else
    {
        videoElement.style.display = "none";
        canceled = true;
    }
};

fps.onChange = function ()
{
    if (fps.get() < 1)fps.set(1);
    clearTimeout(timeout);
    timeout = setTimeout(updateTexture, 1000 / fps.get());
};

function updateTexture()
{
    cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, tex.tex);
    cgl.gl.pixelStorei(cgl.gl.UNPACK_FLIP_Y_WEBGL, flip.get());

    cgl.gl.texImage2D(cgl.gl.TEXTURE_2D, 0, cgl.gl.RGBA, cgl.gl.RGBA, cgl.gl.UNSIGNED_BYTE, videoElement);
    cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, null);

    if (!canceled) timeout = setTimeout(updateTexture, 1000 / fps.get());
}

function camInitComplete(stream)
{
    tex.videoElement = videoElement;
    // videoElement.src = window.URL.createObjectURL(stream);
    videoElement.srcObject = stream;
    // tex.videoElement=stream;
    videoElement.onloadedmetadata = function (e)
    {
        available.set(true);

        outHeight.set(videoElement.videoHeight);
        outWidth.set(videoElement.videoWidth);

        tex.setSize(videoElement.videoWidth, videoElement.videoHeight);

        outRatio.set(videoElement.videoWidth / videoElement.videoHeight);

        videoElement.play();
        outObj.set(videoElement);
        updateTexture();
    };
}

function startWebcam()
{
    //removeElement();
    const constraints = { "audio": false, "video": {} };

    constraints.video.facingMode = inFacing.get();
    constraints.video.width = width.get();
    constraints.video.height = height.get();

    //navigator.getUserMedia = navigator.getUserMedia || navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
/*
    if (navigator.getUserMedia)
    {
        navigator.getUserMedia(constraints, camInitComplete,
            function ()
            {
                available.set(false);
                // console.log('error webcam');
            });
    }
    else
    {
        // the ios way...
*/
        navigator.mediaDevices.getUserMedia(constraints)
            .then(camInitComplete)
            .catch(function (error)
            {
                console.log(error.name + ": " + error.message);
            });
//    }
}
function updateStyle()
{
    if (inStyle.get() != videoElement.style)
    {
        videoElement.setAttribute("style", inStyle.get());
        outObj.set(null);
        outObj.set(videoElement);
    }
}
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
function onMouseClick()
{
   //if(inActive.get()){
    canvas.width = width.get();
    canvas.height = height.get();
    ctx.drawImage(videoElement, 0, 0, width.get(),height.get());
    var b64webcam = canvas.toDataURL('image/png', .1);
	outCap.set(b64webcam);

    outClicked.trigger();
    //}else{
    //    outCap.set('');
    //}
}


updateStyle();
startWebcam();


};

Ops.User.alivemachine.MyWebcam.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.User.alivemachine.StringAccumlator
// 
// **************************************************************

Ops.User.alivemachine.StringAccumlator = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const inString = op.inString("String");
var inClean = op.inTriggerButton("Clean");
var invert = op.inBool("invert",false);
var inLink = op.inString("Liaison");
var outText = op.outString("Text");

inString.onChange=addUp;
inClean.onTriggered=cleanUp;
function addUp ()
{
    if(invert.get()==true){
        outText.set(inString.get()+inLink.get()+outText.get());
    }else{
        outText.set(outText.get()+inLink.get()+inString.get());
    }
}
function cleanUp(){
    outText.set("");
}

};

Ops.User.alivemachine.StringAccumlator.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.Trigger.TriggerExtender
// 
// **************************************************************

Ops.Trigger.TriggerExtender = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
// inputs
var inTriggerPort = op.inTriggerButton('Execute');

// outputs
var outTriggerPort = op.outTrigger('Next');

// trigger listener
inTriggerPort.onTriggered = function() {
    outTriggerPort.trigger();
};

};

Ops.Trigger.TriggerExtender.prototype = new CABLES.Op();
CABLES.OPS["7ef594f3-4907-47b0-a2d3-9854eda1679d"]={f:Ops.Trigger.TriggerExtender,objName:"Ops.Trigger.TriggerExtender"};




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
    inStr=op.inString("String","A message"),
    infilter=op.inString("Filter","null"),
    checkNull=op.inBool("Invalid if null",true),
    checkUndefined=op.inBool("Invalid if undefined",true),
    checkEmpty=op.inBool("Invalid if empty",true),
    checkZero=op.inBool("Invalid if 0",true),
    checkguill=op.inBool("Remove '",true),
    outStr=op.outString("Last Valid String"),
    result=op.outBool("Is Valid");

inStr.onChange=
infilter.onChange=
checkNull.onChange=
checkUndefined.onChange=
checkEmpty.onChange=
checkguill.onChange=
function()
{
    var str=inStr.get();
    var r=true;

    if(r===false)r=false;
    if(r && checkZero.get() && (str===0 || str==="0")) r=false;
    if(r && checkNull.get() && str===null) r=false;
    if(r && checkUndefined.get() && str===undefined) r=false;
    if(r && checkEmpty.get() && str==="") r=false;
    if(r && infilter.get()!=="" && str.includes(infilter.get())) r=false;

    if(r && checkguill.get()==true){
        var nstr = str.replace('"','').replace("'",'');
        outStr.set(nstr);
    }else{
        if(r)outStr.set(str);

    }

    //if(r && str.includes(infilter.get())) r=false;
    //alert(str.includes(infilter.get()));
    result.set(r);

};


};

Ops.User.alivemachine.MyFilterValidString.prototype = new CABLES.Op();





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
// Ops.User.alivemachine.FocusDiv
// 
// **************************************************************

Ops.User.alivemachine.FocusDiv = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const inButton = op.inTriggerButton("focus");
const divID = op.inString("div ID");


inButton.onTriggered= update;

function update()
{

    var str = divID.get();
    document.getElementById(str).focus();


}

};

Ops.User.alivemachine.FocusDiv.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.Boolean.TriggerChangedFalse
// 
// **************************************************************

Ops.Boolean.TriggerChangedFalse = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};

var val=op.inValueBool("Value",false);

var next=op.outTrigger("Next");

var oldVal=0;

val.onChange=function()
{
    var newVal=val.get();
    if(oldVal && !newVal)
    {
        oldVal=false;
        next.trigger();
    }
    else
    {
        oldVal=true;
    }
};

};

Ops.Boolean.TriggerChangedFalse.prototype = new CABLES.Op();
CABLES.OPS["6387bcb0-6091-4199-8ab7-f96ad4aa3c7d"]={f:Ops.Boolean.TriggerChangedFalse,objName:"Ops.Boolean.TriggerChangedFalse"};




// **************************************************************
// 
// Ops.User.alivemachine.MySpeech
// 
// **************************************************************

Ops.User.alivemachine.MySpeech = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inLang=op.inString("Language","us-US"),
    active=op.inBool("Active",true),
    result=op.outString("Result"),
    confidence=op.outNumber("Confidence"),
    outSupported=op.outBool("Supported",false),
    outResult=op.outTrigger("New Result",""),
    outActive=op.outBool("Started",false);


active.onChange=startStop;

window.SpeechRecognition = window.SpeechRecognition||window.webkitSpeechRecognition || window.mozSpeechRecognition;

var recognition=null;

inLang.onChange=changeLang;

function startStop(){
    if(!recognition) return;

    try{

        if(active.get()!=outActive.get())
        {
            if(active.get()) {
                console.log("start");
                recognition.start();
                console.log("started");
            }
            else {
                console.log("aborting");
                recognition.stop();
                outActive.set(false);
                console.log("aborted");
            }
        }

    }
    catch(e)
    {
        console.log(e);
    }
}


op.init=function()
{
   // startStop();
};

function changeLang()
{
    if(!recognition)return;

    recognition.lang = inLang.get();
    recognition.stop();

    setTimeout(function(){
        try{recognition.start();}catch(e){}},500);



}

startAPI();

function startAPI()
{
    if(window.SpeechRecognition)
    {
        outSupported.set(true);

        if(recognition) recognition.abort();

        recognition=new SpeechRecognition();

        recognition.lang = inLang.get();
        recognition.interimResults = false;
        recognition.maxAlternatives = 0;
        recognition.continuous=true;
        SpeechRecognition.interimResults=true;


        recognition.onstart = function() { outActive.set(true); console.log("Listenning to you");};
        recognition.onstop = function() { outActive.set(false); };
        recognition.onend = function() { outActive.set(false);console.log("Not listenning");recognition.stop(); /*if(active===true){startStop();}*/ };

        recognition.onresult = function(event) { op.log('recognition result'); };
        //recognition.onerror = function(event) { op.log('recognition error',result); };


        recognition.onresult = function(event)
        {
            const idx=event.results.length-1;

            result.set(event.results[idx][0].transcript);
            confidence.set(event.results[idx][0].confidence);
            op.log('', event.results[idx][0].transcript);
            outResult.trigger();
        };

    }

}



};

Ops.User.alivemachine.MySpeech.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.User.alivemachine.MyConsole
// 
// **************************************************************

Ops.User.alivemachine.MyConsole = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var visible=op.inValueBool("visible",true);
var result=op.outString("log");

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
    var html;
    for (var i = 0; i < arguments.length; i++)
    {
        if (typeof arguments[i] == 'object') html += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '';
        else html += arguments[i] ;
    }
    logger.innerHTML+=html;
    var ht;
    if(html!=undefined){ht=html.replace("undefined","")}
    if(visible.get()){
        result.set(ht);
    }
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

Ops.User.alivemachine.MyConsole.prototype = new CABLES.Op();





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
// Ops.User.alivemachine.GetHighlighted
// 
// **************************************************************

Ops.User.alivemachine.GetHighlighted = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const active = op.inBool('active',true);
const outString = op.outString("String out");


function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
      (activeElTagName == "textarea") || (activeElTagName == "input" &&
      /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
      (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}

document.onmouseup = document.onkeyup = function() {
    if(active.get()){
        outString.set(getSelectionText());
    }
};

};

Ops.User.alivemachine.GetHighlighted.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.User.alivemachine.Isotope
// 
// **************************************************************

Ops.User.alivemachine.Isotope = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
/*!
 * Isotope PACKAGED v3.0.6
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * https://isotope.metafizzy.co
 * Copyright 2010-2018 Metafizzy
 */

!function(t,e){"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jquery")):t.jQueryBridget=e(t,t.jQuery)}(window,function(t,e){"use strict";function i(i,s,a){function u(t,e,o){var n,s="$()."+i+'("'+e+'")';return t.each(function(t,u){var h=a.data(u,i);if(!h)return void r(i+" not initialized. Cannot call methods, i.e. "+s);var d=h[e];if(!d||"_"==e.charAt(0))return void r(s+" is not a valid method");var l=d.apply(h,o);n=void 0===n?l:n}),void 0!==n?n:t}function h(t,e){t.each(function(t,o){var n=a.data(o,i);n?(n.option(e),n._init()):(n=new s(o,e),a.data(o,i,n))})}a=a||e||t.jQuery,a&&(s.prototype.option||(s.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[i]=function(t){if("string"==typeof t){var e=n.call(arguments,1);return u(this,t,e)}return h(this,t),this},o(a))}function o(t){!t||t&&t.bridget||(t.bridget=i)}var n=Array.prototype.slice,s=t.console,r="undefined"==typeof s?function(){}:function(t){s.error(t)};return o(e||t.jQuery),i}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},o=i[t]=i[t]||[];return o.indexOf(e)==-1&&o.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},o=i[t]=i[t]||{};return o[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var o=i.indexOf(e);return o!=-1&&i.splice(o,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){i=i.slice(0),e=e||[];for(var o=this._onceEvents&&this._onceEvents[t],n=0;n<i.length;n++){var s=i[n],r=o&&o[s];r&&(this.off(t,s),delete o[s]),s.apply(this,e)}return this}},e.allOff=function(){delete this._events,delete this._onceEvents},t}),function(t,e){"function"==typeof define&&define.amd?define("get-size/get-size",e):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t),i=t.indexOf("%")==-1&&!isNaN(e);return i&&e}function e(){}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;e<h;e++){var i=u[e];t[i]=0}return t}function o(t){var e=getComputedStyle(t);return e||a("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),e}function n(){if(!d){d=!0;var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style.boxSizing="border-box";var i=document.body||document.documentElement;i.appendChild(e);var n=o(e);r=200==Math.round(t(n.width)),s.isBoxSizeOuter=r,i.removeChild(e)}}function s(e){if(n(),"string"==typeof e&&(e=document.querySelector(e)),e&&"object"==typeof e&&e.nodeType){var s=o(e);if("none"==s.display)return i();var a={};a.width=e.offsetWidth,a.height=e.offsetHeight;for(var d=a.isBorderBox="border-box"==s.boxSizing,l=0;l<h;l++){var f=u[l],c=s[f],m=parseFloat(c);a[f]=isNaN(m)?0:m}var p=a.paddingLeft+a.paddingRight,y=a.paddingTop+a.paddingBottom,g=a.marginLeft+a.marginRight,v=a.marginTop+a.marginBottom,_=a.borderLeftWidth+a.borderRightWidth,z=a.borderTopWidth+a.borderBottomWidth,I=d&&r,x=t(s.width);x!==!1&&(a.width=x+(I?0:p+_));var S=t(s.height);return S!==!1&&(a.height=S+(I?0:y+z)),a.innerWidth=a.width-(p+_),a.innerHeight=a.height-(y+z),a.outerWidth=a.width+g,a.outerHeight=a.height+v,a}}var r,a="undefined"==typeof console?e:function(t){console.error(t)},u=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],h=u.length,d=!1;return s}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=window.Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var o=e[i],n=o+"MatchesSelector";if(t[n])return n}}();return function(e,i){return e[t](i)}}),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var i={};i.extend=function(t,e){for(var i in e)t[i]=e[i];return t},i.modulo=function(t,e){return(t%e+e)%e};var o=Array.prototype.slice;i.makeArray=function(t){if(Array.isArray(t))return t;if(null===t||void 0===t)return[];var e="object"==typeof t&&"number"==typeof t.length;return e?o.call(t):[t]},i.removeFrom=function(t,e){var i=t.indexOf(e);i!=-1&&t.splice(i,1)},i.getParent=function(t,i){for(;t.parentNode&&t!=document.body;)if(t=t.parentNode,e(t,i))return t},i.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},i.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.filterFindElements=function(t,o){t=i.makeArray(t);var n=[];return t.forEach(function(t){if(t instanceof HTMLElement){if(!o)return void n.push(t);e(t,o)&&n.push(t);for(var i=t.querySelectorAll(o),s=0;s<i.length;s++)n.push(i[s])}}),n},i.debounceMethod=function(t,e,i){i=i||100;var o=t.prototype[e],n=e+"Timeout";t.prototype[e]=function(){var t=this[n];clearTimeout(t);var e=arguments,s=this;this[n]=setTimeout(function(){o.apply(s,e),delete s[n]},i)}},i.docReady=function(t){var e=document.readyState;"complete"==e||"interactive"==e?setTimeout(t):document.addEventListener("DOMContentLoaded",t)},i.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var n=t.console;return i.htmlInit=function(e,o){i.docReady(function(){var s=i.toDashed(o),r="data-"+s,a=document.querySelectorAll("["+r+"]"),u=document.querySelectorAll(".js-"+s),h=i.makeArray(a).concat(i.makeArray(u)),d=r+"-options",l=t.jQuery;h.forEach(function(t){var i,s=t.getAttribute(r)||t.getAttribute(d);try{i=s&&JSON.parse(s)}catch(a){return void(n&&n.error("Error parsing "+r+" on "+t.className+": "+a))}var u=new e(t,i);l&&l.data(t,o,u)})})},i}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["ev-emitter/ev-emitter","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("ev-emitter"),require("get-size")):(t.Outlayer={},t.Outlayer.Item=e(t.EvEmitter,t.getSize))}(window,function(t,e){"use strict";function i(t){for(var e in t)return!1;return e=null,!0}function o(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}function n(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}var s=document.documentElement.style,r="string"==typeof s.transition?"transition":"WebkitTransition",a="string"==typeof s.transform?"transform":"WebkitTransform",u={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[r],h={transform:a,transition:r,transitionDuration:r+"Duration",transitionProperty:r+"Property",transitionDelay:r+"Delay"},d=o.prototype=Object.create(t.prototype);d.constructor=o,d._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},d.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},d.getSize=function(){this.size=e(this.element)},d.css=function(t){var e=this.element.style;for(var i in t){var o=h[i]||i;e[o]=t[i]}},d.getPosition=function(){var t=getComputedStyle(this.element),e=this.layout._getOption("originLeft"),i=this.layout._getOption("originTop"),o=t[e?"left":"right"],n=t[i?"top":"bottom"],s=parseFloat(o),r=parseFloat(n),a=this.layout.size;o.indexOf("%")!=-1&&(s=s/100*a.width),n.indexOf("%")!=-1&&(r=r/100*a.height),s=isNaN(s)?0:s,r=isNaN(r)?0:r,s-=e?a.paddingLeft:a.paddingRight,r-=i?a.paddingTop:a.paddingBottom,this.position.x=s,this.position.y=r},d.layoutPosition=function(){var t=this.layout.size,e={},i=this.layout._getOption("originLeft"),o=this.layout._getOption("originTop"),n=i?"paddingLeft":"paddingRight",s=i?"left":"right",r=i?"right":"left",a=this.position.x+t[n];e[s]=this.getXValue(a),e[r]="";var u=o?"paddingTop":"paddingBottom",h=o?"top":"bottom",d=o?"bottom":"top",l=this.position.y+t[u];e[h]=this.getYValue(l),e[d]="",this.css(e),this.emitEvent("layout",[this])},d.getXValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!e?t/this.layout.size.width*100+"%":t+"px"},d.getYValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&e?t/this.layout.size.height*100+"%":t+"px"},d._transitionTo=function(t,e){this.getPosition();var i=this.position.x,o=this.position.y,n=t==this.position.x&&e==this.position.y;if(this.setPosition(t,e),n&&!this.isTransitioning)return void this.layoutPosition();var s=t-i,r=e-o,a={};a.transform=this.getTranslate(s,r),this.transition({to:a,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},d.getTranslate=function(t,e){var i=this.layout._getOption("originLeft"),o=this.layout._getOption("originTop");return t=i?t:-t,e=o?e:-e,"translate3d("+t+"px, "+e+"px, 0)"},d.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},d.moveTo=d._transitionTo,d.setPosition=function(t,e){this.position.x=parseFloat(t),this.position.y=parseFloat(e)},d._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},d.transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(t);var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var o=this.element.offsetHeight;o=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var l="opacity,"+n(a);d.enableTransition=function(){if(!this.isTransitioning){var t=this.layout.options.transitionDuration;t="number"==typeof t?t+"ms":t,this.css({transitionProperty:l,transitionDuration:t,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(u,this,!1)}},d.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},d.onotransitionend=function(t){this.ontransitionend(t)};var f={"-webkit-transform":"transform"};d.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,o=f[t.propertyName]||t.propertyName;if(delete e.ingProperties[o],i(e.ingProperties)&&this.disableTransition(),o in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[o]),o in e.onEnd){var n=e.onEnd[o];n.call(this),delete e.onEnd[o]}this.emitEvent("transitionEnd",[this])}},d.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(u,this,!1),this.isTransitioning=!1},d._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var c={transitionProperty:"",transitionDuration:"",transitionDelay:""};return d.removeTransitionStyles=function(){this.css(c)},d.stagger=function(t){t=isNaN(t)?0:t,this.staggerDelay=t+"ms"},d.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},d.remove=function(){return r&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),void this.hide()):void this.removeElem()},d.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("visibleStyle");e[i]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},d.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},d.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},d.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("hiddenStyle");e[i]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},d.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},d.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},o}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(i,o,n,s){return e(t,i,o,n,s)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):t.Outlayer=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,t.Outlayer.Item)}(window,function(t,e,i,o,n){"use strict";function s(t,e){var i=o.getQueryElement(t);if(!i)return void(u&&u.error("Bad element for "+this.constructor.namespace+": "+(i||t)));this.element=i,h&&(this.$element=h(this.element)),this.options=o.extend({},this.constructor.defaults),this.option(e);var n=++l;this.element.outlayerGUID=n,f[n]=this,this._create();var s=this._getOption("initLayout");s&&this.layout()}function r(t){function e(){t.apply(this,arguments)}return e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e}function a(t){if("number"==typeof t)return t;var e=t.match(/(^\d*\.?\d*)(\w*)/),i=e&&e[1],o=e&&e[2];if(!i.length)return 0;i=parseFloat(i);var n=m[o]||1;return i*n}var u=t.console,h=t.jQuery,d=function(){},l=0,f={};s.namespace="outlayer",s.Item=n,s.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var c=s.prototype;o.extend(c,e.prototype),c.option=function(t){o.extend(this.options,t)},c._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&void 0!==this.options[e]?this.options[e]:this.options[t]},s.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},c._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),o.extend(this.element.style,this.options.containerStyle);var t=this._getOption("resize");t&&this.bindResize()},c.reloadItems=function(){this.items=this._itemize(this.element.children)},c._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,o=[],n=0;n<e.length;n++){var s=e[n],r=new i(s,this);o.push(r)}return o},c._filterFindItemElements=function(t){return o.filterFindElements(t,this.options.itemSelector)},c.getItemElements=function(){return this.items.map(function(t){return t.element})},c.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},c._init=c.layout,c._resetLayout=function(){this.getSize()},c.getSize=function(){this.size=i(this.element)},c._getMeasurement=function(t,e){var o,n=this.options[t];n?("string"==typeof n?o=this.element.querySelector(n):n instanceof HTMLElement&&(o=n),this[t]=o?i(o)[e]:n):this[t]=0},c.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},c._getItemsForLayout=function(t){return t.filter(function(t){return!t.isIgnored})},c._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){var i=[];t.forEach(function(t){var o=this._getItemLayoutPosition(t);o.item=t,o.isInstant=e||t.isLayoutInstant,i.push(o)},this),this._processLayoutQueue(i)}},c._getItemLayoutPosition=function(){return{x:0,y:0}},c._processLayoutQueue=function(t){this.updateStagger(),t.forEach(function(t,e){this._positionItem(t.item,t.x,t.y,t.isInstant,e)},this)},c.updateStagger=function(){var t=this.options.stagger;return null===t||void 0===t?void(this.stagger=0):(this.stagger=a(t),this.stagger)},c._positionItem=function(t,e,i,o,n){o?t.goTo(e,i):(t.stagger(n*this.stagger),t.moveTo(e,i))},c._postLayout=function(){this.resizeContainer()},c.resizeContainer=function(){var t=this._getOption("resizeContainer");if(t){var e=this._getContainerSize();e&&(this._setContainerMeasure(e.width,!0),this._setContainerMeasure(e.height,!1))}},c._getContainerSize=d,c._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},c._emitCompleteOnItems=function(t,e){function i(){n.dispatchEvent(t+"Complete",null,[e])}function o(){r++,r==s&&i()}var n=this,s=e.length;if(!e||!s)return void i();var r=0;e.forEach(function(e){e.once(t,o)})},c.dispatchEvent=function(t,e,i){var o=e?[e].concat(i):i;if(this.emitEvent(t,o),h)if(this.$element=this.$element||h(this.element),e){var n=h.Event(e);n.type=t,this.$element.trigger(n,i)}else this.$element.trigger(t,i)},c.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},c.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},c.stamp=function(t){t=this._find(t),t&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},c.unstamp=function(t){t=this._find(t),t&&t.forEach(function(t){o.removeFrom(this.stamps,t),this.unignore(t)},this)},c._find=function(t){if(t)return"string"==typeof t&&(t=this.element.querySelectorAll(t)),t=o.makeArray(t)},c._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},c._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},c._manageStamp=d,c._getElementOffset=function(t){var e=t.getBoundingClientRect(),o=this._boundingRect,n=i(t),s={left:e.left-o.left-n.marginLeft,top:e.top-o.top-n.marginTop,right:o.right-e.right-n.marginRight,bottom:o.bottom-e.bottom-n.marginBottom};return s},c.handleEvent=o.handleEvent,c.bindResize=function(){t.addEventListener("resize",this),this.isResizeBound=!0},c.unbindResize=function(){t.removeEventListener("resize",this),this.isResizeBound=!1},c.onresize=function(){this.resize()},o.debounceMethod(s,"onresize",100),c.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},c.needsResizeLayout=function(){var t=i(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},c.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},c.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},c.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},c.reveal=function(t){if(this._emitCompleteOnItems("reveal",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.reveal()})}},c.hide=function(t){if(this._emitCompleteOnItems("hide",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.hide()})}},c.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},c.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},c.getItem=function(t){for(var e=0;e<this.items.length;e++){var i=this.items[e];if(i.element==t)return i}},c.getItems=function(t){t=o.makeArray(t);var e=[];return t.forEach(function(t){var i=this.getItem(t);i&&e.push(i)},this),e},c.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),e&&e.length&&e.forEach(function(t){t.remove(),o.removeFrom(this.items,t)},this)},c.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(t){t.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete f[e],delete this.element.outlayerGUID,h&&h.removeData(this.element,this.constructor.namespace)},s.data=function(t){t=o.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&f[e]},s.create=function(t,e){var i=r(s);return i.defaults=o.extend({},s.defaults),o.extend(i.defaults,e),i.compatOptions=o.extend({},s.compatOptions),i.namespace=t,i.data=s.data,i.Item=r(n),o.htmlInit(i,t),h&&h.bridget&&h.bridget(t,i),i};var m={ms:1,s:1e3};return s.Item=n,s}),function(t,e){"function"==typeof define&&define.amd?define("isotope-layout/js/item",["outlayer/outlayer"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer")):(t.Isotope=t.Isotope||{},t.Isotope.Item=e(t.Outlayer))}(window,function(t){"use strict";function e(){t.Item.apply(this,arguments)}var i=e.prototype=Object.create(t.Item.prototype),o=i._create;i._create=function(){this.id=this.layout.itemGUID++,o.call(this),this.sortData={}},i.updateSortData=function(){if(!this.isIgnored){this.sortData.id=this.id,this.sortData["original-order"]=this.id,this.sortData.random=Math.random();var t=this.layout.options.getSortData,e=this.layout._sorters;for(var i in t){var o=e[i];this.sortData[i]=o(this.element,this)}}};var n=i.destroy;return i.destroy=function(){n.apply(this,arguments),this.css({display:""})},e}),function(t,e){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-mode",["get-size/get-size","outlayer/outlayer"],e):"object"==typeof module&&module.exports?module.exports=e(require("get-size"),require("outlayer")):(t.Isotope=t.Isotope||{},t.Isotope.LayoutMode=e(t.getSize,t.Outlayer))}(window,function(t,e){"use strict";function i(t){this.isotope=t,t&&(this.options=t.options[this.namespace],this.element=t.element,this.items=t.filteredItems,this.size=t.size)}var o=i.prototype,n=["_resetLayout","_getItemLayoutPosition","_manageStamp","_getContainerSize","_getElementOffset","needsResizeLayout","_getOption"];return n.forEach(function(t){o[t]=function(){return e.prototype[t].apply(this.isotope,arguments)}}),o.needsVerticalResizeLayout=function(){var e=t(this.isotope.element),i=this.isotope.size&&e;return i&&e.innerHeight!=this.isotope.size.innerHeight},o._getMeasurement=function(){this.isotope._getMeasurement.apply(this,arguments)},o.getColumnWidth=function(){this.getSegmentSize("column","Width")},o.getRowHeight=function(){this.getSegmentSize("row","Height")},o.getSegmentSize=function(t,e){var i=t+e,o="outer"+e;if(this._getMeasurement(i,o),!this[i]){var n=this.getFirstItemSize();this[i]=n&&n[o]||this.isotope.size["inner"+e]}},o.getFirstItemSize=function(){var e=this.isotope.filteredItems[0];return e&&e.element&&t(e.element)},o.layout=function(){this.isotope.layout.apply(this.isotope,arguments)},o.getSize=function(){this.isotope.getSize(),this.size=this.isotope.size},i.modes={},i.create=function(t,e){function n(){i.apply(this,arguments)}return n.prototype=Object.create(o),n.prototype.constructor=n,e&&(n.options=e),n.prototype.namespace=t,i.modes[t]=n,n},i}),function(t,e){"function"==typeof define&&define.amd?define("masonry-layout/masonry",["outlayer/outlayer","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer"),require("get-size")):t.Masonry=e(t.Outlayer,t.getSize)}(window,function(t,e){var i=t.create("masonry");i.compatOptions.fitWidth="isFitWidth";var o=i.prototype;return o._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var t=0;t<this.cols;t++)this.colYs.push(0);this.maxY=0,this.horizontalColIndex=0},o.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}var o=this.columnWidth+=this.gutter,n=this.containerWidth+this.gutter,s=n/o,r=o-n%o,a=r&&r<1?"round":"floor";s=Math[a](s),this.cols=Math.max(s,1)},o.getContainerWidth=function(){var t=this._getOption("fitWidth"),i=t?this.element.parentNode:this.element,o=e(i);this.containerWidth=o&&o.innerWidth},o._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,i=e&&e<1?"round":"ceil",o=Math[i](t.size.outerWidth/this.columnWidth);o=Math.min(o,this.cols);for(var n=this.options.horizontalOrder?"_getHorizontalColPosition":"_getTopColPosition",s=this[n](o,t),r={x:this.columnWidth*s.col,y:s.y},a=s.y+t.size.outerHeight,u=o+s.col,h=s.col;h<u;h++)this.colYs[h]=a;return r},o._getTopColPosition=function(t){var e=this._getTopColGroup(t),i=Math.min.apply(Math,e);return{col:e.indexOf(i),y:i}},o._getTopColGroup=function(t){if(t<2)return this.colYs;for(var e=[],i=this.cols+1-t,o=0;o<i;o++)e[o]=this._getColGroupY(o,t);return e},o._getColGroupY=function(t,e){if(e<2)return this.colYs[t];var i=this.colYs.slice(t,t+e);return Math.max.apply(Math,i)},o._getHorizontalColPosition=function(t,e){var i=this.horizontalColIndex%this.cols,o=t>1&&i+t>this.cols;i=o?0:i;var n=e.size.outerWidth&&e.size.outerHeight;return this.horizontalColIndex=n?i+t:this.horizontalColIndex,{col:i,y:this._getColGroupY(i,t)}},o._manageStamp=function(t){var i=e(t),o=this._getElementOffset(t),n=this._getOption("originLeft"),s=n?o.left:o.right,r=s+i.outerWidth,a=Math.floor(s/this.columnWidth);a=Math.max(0,a);var u=Math.floor(r/this.columnWidth);u-=r%this.columnWidth?0:1,u=Math.min(this.cols-1,u);for(var h=this._getOption("originTop"),d=(h?o.top:o.bottom)+i.outerHeight,l=a;l<=u;l++)this.colYs[l]=Math.max(d,this.colYs[l])},o._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this._getOption("fitWidth")&&(t.width=this._getContainerFitWidth()),t},o._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},o.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!=this.containerWidth},i}),function(t,e){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-modes/masonry",["../layout-mode","masonry-layout/masonry"],e):"object"==typeof module&&module.exports?module.exports=e(require("../layout-mode"),require("masonry-layout")):e(t.Isotope.LayoutMode,t.Masonry)}(window,function(t,e){"use strict";var i=t.create("masonry"),o=i.prototype,n={_getElementOffset:!0,layout:!0,_getMeasurement:!0};for(var s in e.prototype)n[s]||(o[s]=e.prototype[s]);var r=o.measureColumns;o.measureColumns=function(){this.items=this.isotope.filteredItems,r.call(this)};var a=o._getOption;return o._getOption=function(t){return"fitWidth"==t?void 0!==this.options.isFitWidth?this.options.isFitWidth:this.options.fitWidth:a.apply(this.isotope,arguments)},i}),function(t,e){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-modes/fit-rows",["../layout-mode"],e):"object"==typeof exports?module.exports=e(require("../layout-mode")):e(t.Isotope.LayoutMode)}(window,function(t){"use strict";var e=t.create("fitRows"),i=e.prototype;return i._resetLayout=function(){this.x=0,this.y=0,this.maxY=0,this._getMeasurement("gutter","outerWidth")},i._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth+this.gutter,i=this.isotope.size.innerWidth+this.gutter;0!==this.x&&e+this.x>i&&(this.x=0,this.y=this.maxY);var o={x:this.x,y:this.y};return this.maxY=Math.max(this.maxY,this.y+t.size.outerHeight),this.x+=e,o},i._getContainerSize=function(){return{height:this.maxY}},e}),function(t,e){"function"==typeof define&&define.amd?define("isotope-layout/js/layout-modes/vertical",["../layout-mode"],e):"object"==typeof module&&module.exports?module.exports=e(require("../layout-mode")):e(t.Isotope.LayoutMode)}(window,function(t){"use strict";var e=t.create("vertical",{horizontalAlignment:0}),i=e.prototype;return i._resetLayout=function(){this.y=0},i._getItemLayoutPosition=function(t){t.getSize();var e=(this.isotope.size.innerWidth-t.size.outerWidth)*this.options.horizontalAlignment,i=this.y;return this.y+=t.size.outerHeight,{x:e,y:i}},i._getContainerSize=function(){return{height:this.y}},e}),function(t,e){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","desandro-matches-selector/matches-selector","fizzy-ui-utils/utils","isotope-layout/js/item","isotope-layout/js/layout-mode","isotope-layout/js/layout-modes/masonry","isotope-layout/js/layout-modes/fit-rows","isotope-layout/js/layout-modes/vertical"],function(i,o,n,s,r,a){return e(t,i,o,n,s,r,a)}):"object"==typeof module&&module.exports?module.exports=e(t,require("outlayer"),require("get-size"),require("desandro-matches-selector"),require("fizzy-ui-utils"),require("isotope-layout/js/item"),require("isotope-layout/js/layout-mode"),require("isotope-layout/js/layout-modes/masonry"),require("isotope-layout/js/layout-modes/fit-rows"),require("isotope-layout/js/layout-modes/vertical")):t.Isotope=e(t,t.Outlayer,t.getSize,t.matchesSelector,t.fizzyUIUtils,t.Isotope.Item,t.Isotope.LayoutMode)}(window,function(t,e,i,o,n,s,r){function a(t,e){return function(i,o){for(var n=0;n<t.length;n++){var s=t[n],r=i.sortData[s],a=o.sortData[s];if(r>a||r<a){var u=void 0!==e[s]?e[s]:e,h=u?1:-1;return(r>a?1:-1)*h}}return 0}}var u=t.jQuery,h=String.prototype.trim?function(t){return t.trim()}:function(t){return t.replace(/^\s+|\s+$/g,"")},d=e.create("isotope",{layoutMode:"masonry",isJQueryFiltering:!0,sortAscending:!0});d.Item=s,d.LayoutMode=r;var l=d.prototype;l._create=function(){this.itemGUID=0,this._sorters={},this._getSorters(),e.prototype._create.call(this),this.modes={},this.filteredItems=this.items,this.sortHistory=["original-order"];for(var t in r.modes)this._initLayoutMode(t)},l.reloadItems=function(){this.itemGUID=0,e.prototype.reloadItems.call(this)},l._itemize=function(){for(var t=e.prototype._itemize.apply(this,arguments),i=0;i<t.length;i++){var o=t[i];o.id=this.itemGUID++}return this._updateItemsSortData(t),t},l._initLayoutMode=function(t){var e=r.modes[t],i=this.options[t]||{};this.options[t]=e.options?n.extend(e.options,i):i,this.modes[t]=new e(this)},l.layout=function(){return!this._isLayoutInited&&this._getOption("initLayout")?void this.arrange():void this._layout()},l._layout=function(){var t=this._getIsInstant();this._resetLayout(),this._manageStamps(),this.layoutItems(this.filteredItems,t),this._isLayoutInited=!0},l.arrange=function(t){this.option(t),this._getIsInstant();var e=this._filter(this.items);this.filteredItems=e.matches,this._bindArrangeComplete(),this._isInstant?this._noTransition(this._hideReveal,[e]):this._hideReveal(e),this._sort(),this._layout()},l._init=l.arrange,l._hideReveal=function(t){this.reveal(t.needReveal),this.hide(t.needHide)},l._getIsInstant=function(){var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;return this._isInstant=e,e},l._bindArrangeComplete=function(){function t(){e&&i&&o&&n.dispatchEvent("arrangeComplete",null,[n.filteredItems])}var e,i,o,n=this;this.once("layoutComplete",function(){e=!0,t()}),this.once("hideComplete",function(){i=!0,t()}),this.once("revealComplete",function(){o=!0,t()})},l._filter=function(t){var e=this.options.filter;e=e||"*";for(var i=[],o=[],n=[],s=this._getFilterTest(e),r=0;r<t.length;r++){var a=t[r];if(!a.isIgnored){var u=s(a);u&&i.push(a),u&&a.isHidden?o.push(a):u||a.isHidden||n.push(a)}}return{matches:i,needReveal:o,needHide:n}},l._getFilterTest=function(t){return u&&this.options.isJQueryFiltering?function(e){return u(e.element).is(t);
}:"function"==typeof t?function(e){return t(e.element)}:function(e){return o(e.element,t)}},l.updateSortData=function(t){var e;t?(t=n.makeArray(t),e=this.getItems(t)):e=this.items,this._getSorters(),this._updateItemsSortData(e)},l._getSorters=function(){var t=this.options.getSortData;for(var e in t){var i=t[e];this._sorters[e]=f(i)}},l._updateItemsSortData=function(t){for(var e=t&&t.length,i=0;e&&i<e;i++){var o=t[i];o.updateSortData()}};var f=function(){function t(t){if("string"!=typeof t)return t;var i=h(t).split(" "),o=i[0],n=o.match(/^\[(.+)\]$/),s=n&&n[1],r=e(s,o),a=d.sortDataParsers[i[1]];return t=a?function(t){return t&&a(r(t))}:function(t){return t&&r(t)}}function e(t,e){return t?function(e){return e.getAttribute(t)}:function(t){var i=t.querySelector(e);return i&&i.textContent}}return t}();d.sortDataParsers={parseInt:function(t){return parseInt(t,10)},parseFloat:function(t){return parseFloat(t)}},l._sort=function(){if(this.options.sortBy){var t=n.makeArray(this.options.sortBy);this._getIsSameSortBy(t)||(this.sortHistory=t.concat(this.sortHistory));var e=a(this.sortHistory,this.options.sortAscending);this.filteredItems.sort(e)}},l._getIsSameSortBy=function(t){for(var e=0;e<t.length;e++)if(t[e]!=this.sortHistory[e])return!1;return!0},l._mode=function(){var t=this.options.layoutMode,e=this.modes[t];if(!e)throw new Error("No layout mode: "+t);return e.options=this.options[t],e},l._resetLayout=function(){e.prototype._resetLayout.call(this),this._mode()._resetLayout()},l._getItemLayoutPosition=function(t){return this._mode()._getItemLayoutPosition(t)},l._manageStamp=function(t){this._mode()._manageStamp(t)},l._getContainerSize=function(){return this._mode()._getContainerSize()},l.needsResizeLayout=function(){return this._mode().needsResizeLayout()},l.appended=function(t){var e=this.addItems(t);if(e.length){var i=this._filterRevealAdded(e);this.filteredItems=this.filteredItems.concat(i)}},l.prepended=function(t){var e=this._itemize(t);if(e.length){this._resetLayout(),this._manageStamps();var i=this._filterRevealAdded(e);this.layoutItems(this.filteredItems),this.filteredItems=i.concat(this.filteredItems),this.items=e.concat(this.items)}},l._filterRevealAdded=function(t){var e=this._filter(t);return this.hide(e.needHide),this.reveal(e.matches),this.layoutItems(e.matches,!0),e.matches},l.insert=function(t){var e=this.addItems(t);if(e.length){var i,o,n=e.length;for(i=0;i<n;i++)o=e[i],this.element.appendChild(o.element);var s=this._filter(e).matches;for(i=0;i<n;i++)e[i].isLayoutInstant=!0;for(this.arrange(),i=0;i<n;i++)delete e[i].isLayoutInstant;this.reveal(s)}};var c=l.remove;return l.remove=function(t){t=n.makeArray(t);var e=this.getItems(t);c.call(this,t);for(var i=e&&e.length,o=0;i&&o<i;o++){var s=e[o];n.removeFrom(this.filteredItems,s)}},l.shuffle=function(){for(var t=0;t<this.items.length;t++){var e=this.items[t];e.sortData.random=Math.random()}this.options.sortBy="random",this._sort(),this._layout()},l._noTransition=function(t,e){var i=this.options.transitionDuration;this.options.transitionDuration=0;var o=t.apply(this,e);return this.options.transitionDuration=i,o},l.getFilteredItemElements=function(){return this.filteredItems.map(function(t){return t.element})},d});




const inArr   = op.inArray("Array in");
const outArray  = op.outArray("Array out");
var outContent = op.outString("last cell content");
var parentin = op.inString("parent ID");
var inMeta = op.inString("meta");
var inImg = op.inString("img");
var inTxt = op.inString("text");
var metaGo = op.inBool("meta go",true);
var imgGo = op.inBool("img go",true);
var txtGo = op.inBool("text go",true);
var pardiv;
var iso;
var order = op.inTriggerButton("order");
var outTrig=op.outTrigger("new data");
order.onTriggered=reorder;

parentin.onChange= update;

var boards = [];
inMeta.onChange=function(){if(metaGo.get()){update(inMeta.get(),'meta');}};
inImg.onChange=function(){if(imgGo.get()){update(inImg.get(),'img');}};
inTxt.onChange=function(){if(txtGo.get()){update(inTxt.get(),'text');}};

metaGo.onChange=imgGo.onChange=txtGo.onChange=filter;
function update(data, typ)
{
    if(pardiv==null){
        pardiv = document.getElementById(parentin.get());
        iso = new Isotope(pardiv,{
        itemSelector: '.cell',
        layoutMode: 'fitRows',
        getSortData: {
            weight: function( itemElem ) {
            var weight = itemElem.innerHTML.length;
            return parseFloat( weight );
            }
        }
        });
    }
    if(pardiv!=null && data!=null && data!=''){
        outContent.set(data);
        let element = document.createElement("div");
        addClass(element, 'cell');
        addClass(element, typ);
        if(typ=='meta'){
            element.innerHTML = '<textarea style="font-size:50px;" id="'+getRandomInt()+'">'+data+'</textarea>';
        }else if(typ=='text'){
            if(data.substring(0,4)=="<div"){
                element.innerHTML = data;
            }else{
                element.innerHTML = '<textarea style="font-size:50px;" id="'+getRandomInt()+'">'+data+'</textarea>';
            }
        }else if(typ=='img'){
            element.innerHTML = '<img class="imgclass" id="'+getRandomInt()+'" src="'+data+'"/>';

        }
        if(element.innerHTML!=''){
            boards.push(element);
            pardiv.appendChild(element);
            iso.appended( element );
            iso.layout();
            var ta = element.getElementsByTagName("textarea")[0];
            if(ta!=null){
            resize(ta);
        }
        }
        outTrig.trigger();
    }

}

function resize(el){
    let fontSize = parseInt(el.style.fontSize);
        for (let i = fontSize; i >= 4; i--) {
            if (isOverflown(el)) {
                fontSize--;
                el.style.fontSize = fontSize + "px";
            }
        }

}
function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}
var sorts = ['weight','original-order','random'];
var sortindex=0;
function reorder(){
    if(sortindex>=sorts.length){sortindex=0;}
    iso.arrange({ sortBy : sorts[sortindex] });
    sortindex++;

}

function filter(){
    var str = '';

    if(imgGo.get()==true){str += '.img';}
    if(metaGo.get()==true){if(str!=''){str+=', '}str += '.meta';}
    if(txtGo.get()==true){if(str!=''){str+=', '}str += '.text';}
    iso.arrange({ filter: str });
}
function getRandomInt() {
  return Math.floor(Math.random() * Math.floor(999999999999));
}
function addClass(elem, str) {
  var arr;
  arr = elem.className.split(" ");
  if (arr.indexOf(str) == -1) {
    elem.className += " " + str;
  }
}

};

Ops.User.alivemachine.Isotope.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.WebAudio.Output
// 
// **************************************************************

Ops.WebAudio.Output = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
op.requirements=[CABLES.Requirements.WEBAUDIO];

var audioCtx = CABLES.WEBAUDIO.createAudioContext(op);

// constants
var VOLUME_DEFAULT = 1.0;
var VOLUME_MIN = 0;
var VOLUME_MAX = 1;

// vars
var gainNode = audioCtx.createGain();
var destinationNode = audioCtx.destination;
gainNode.connect(destinationNode);
var masterVolume = 1;

// inputs
var audioInPort = CABLES.WEBAUDIO.createAudioInPort(op, "Audio In", gainNode);
var volumePort = op.inValueSlider("Volume", VOLUME_DEFAULT);
var mutePort = op.inValueBool("Mute", false);

// functions
// sets the volume, multiplied by master volume
function setVolume() {
    var volume = volumePort.get() * masterVolume;
    if(volume >= VOLUME_MIN && volume <= VOLUME_MAX) {
        // gainNode.gain.value = volume;
        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    } else {
        // gainNode.gain.value = VOLUME_DEFAULT * masterVolume;
        gainNode.gain.setValueAtTime(VOLUME_DEFAULT * masterVolume, audioCtx.currentTime);
    }
}

function mute(b) {
    if(b) {
        // gainNode.gain.value = 0;
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    } else {
        setVolume();
    }
}

// change listeners
mutePort.onChange = function() {
    mute(mutePort.get());
};

volumePort.onChange = function() {
    if(mutePort.get()) {
        return;
    }
    setVolume();
};

op.onMasterVolumeChanged = function(v) {
    masterVolume = v;
    setVolume();
};




};

Ops.WebAudio.Output.prototype = new CABLES.Op();
CABLES.OPS["53fdbf4a-bc8d-4c5d-a698-f34fdeb53827"]={f:Ops.WebAudio.Output,objName:"Ops.WebAudio.Output"};




// **************************************************************
// 
// Ops.User.alivemachine.MyAudioPlayer02
// 
// **************************************************************

Ops.User.alivemachine.MyAudioPlayer02 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const self = this;
const patch = this.patch;
// todo: audio object: firefox does not support .loop=true
//
// myAudio = new Audio('someSound.ogg');
// myAudio.addEventListener('ended', function() {
//     this.currentTime = 0;
//     this.play();
// }, false);
// myAudio.play();


this.file = op.inFile("file", "audio");
const play = op.addInPort(new CABLES.Port(this, "play", CABLES.OP_PORT_TYPE_VALUE, { "display": "bool" }));
const autoPlay = op.addInPort(new CABLES.Port(this, "Autoplay", CABLES.OP_PORT_TYPE_VALUE, { "display": "bool" }));

const volume = this.addInPort(new CABLES.Port(this, "volume", CABLES.OP_PORT_TYPE_VALUE, { "display": "range" }));
const synchronizedPlayer = this.addInPort(new CABLES.Port(this, "Synchronized Player", CABLES.OP_PORT_TYPE_VALUE, { "display": "bool" }));

this.audioOut = this.addOutPort(new CABLES.Port(this, "audio out", CABLES.OP_PORT_TYPE_OBJECT));
const outPlaying = this.addOutPort(new CABLES.Port(this, "playing", CABLES.OP_PORT_TYPE_VALUE));
const outEnded = this.addOutPort(new CABLES.Port(this, "ended", CABLES.OP_PORT_TYPE_FUNCTION));
var triggeronce = op.inTriggerButton("play once");
triggeronce.onTriggered=playonce;

const doLoop = op.addInPort(new CABLES.Port(this, "Loop", CABLES.OP_PORT_TYPE_VALUE, { "display": "bool" }));

autoPlay.set(true);
volume.set(1.0);

outPlaying.ignoreValueSerialize = true;
outEnded.ignoreValueSerialize = true;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
if (!window.audioContext) window.audioContext = new AudioContext();

if (!window.audioContext)
{
    if (this.patch.config.onError) this.patch.config.onError("sorry, could not initialize WebAudio. Please check if your Browser supports WebAudio");
}

this.filter = audioContext.createGain();
self.audio = null;
let buffer = null;
let playing = false;
outPlaying.set(false);
function playonce(){
playing = true;
        const prom = self.audio.play();
        if (prom instanceof Promise)
            prom.then(null, function (e) {});
}

play.onChange = function ()
{
    if (!self.audio)
    {
        op.uiAttr({ "error": "No audio file selected" });
        return;
    }
    else op.uiAttr({ "error": null });


    if (play.get())
    {
        playing = true;
        const prom = self.audio.play();
        if (prom instanceof Promise)
            prom.then(null, function (e) {});
    }
    else
    {
        playing = false;
        self.audio.pause();
    }
    outPlaying.set(playing);
};


this.onDelete = function ()
{
    if (self.audio) self.audio.pause();
};


doLoop.onChange = function ()
{
    if (self.audio) self.audio.loop = doLoop.get();
    else if (self.media) self.media.loop = doLoop.get();
};

function seek()
{
    // if(!window.gui && CGL.getLoadingStatus()>=1.0)
    // {
    //     console.log('seek canceled',CGL.getLoadingStatus());
    //     return;
    // }

    if (!synchronizedPlayer.get())
    {
        if (!self.audio) return;

        let prom;
        if (self.patch.timer.isPlaying() && self.audio.paused) prom = self.audio.play();
        else if (!self.patch.timer.isPlaying() && !self.audio.paused) prom = self.audio.pause();

        if (prom instanceof Promise)
            prom.then(null, function (e) {});

        self.audio.currentTime = self.patch.timer.getTime();
    }
    else
    {
        if (buffer === null) return;

        const t = self.patch.timer.getTime();
        if (!isFinite(t))
        {
            return;
            // console.log('not finite time...',t);
            // t=0.0;
        }

        playing = false;

        // console.log('seek.....',self.patch.timer.isPlaying());

        if (self.patch.timer.isPlaying())
        {
            console.log("play!");
            outPlaying.set(true);

            self.media.start(t);
            playing = true;
        }
    }
}

function playPause()
{
    if (!self.audio) return;

    let prom;
    if (self.patch.timer.isPlaying()) prom = self.audio.play();
    else prom = self.audio.pause();
    if (prom instanceof Promise)
        prom.then(null, function (e) {});
}

function updateVolume()
{
    // self.filter.gain.value=(volume.get() || 0)*op.patch.config.masterVolume;
    self.filter.gain.setValueAtTime((volume.get() || 0) * op.patch.config.masterVolume, window.audioContext.currentTime);
}

volume.onChange = updateVolume;
op.onMasterVolumeChanged = updateVolume;

const firstTime = true;
let loadingFilename = "";
this.file.onChange = function ()
{
    if (!self.file.get()) return;
    loadingFilename = op.patch.getFilePath(self.file.get());

    const loadingId = patch.loading.start("audioplayer", self.file.get());


    if (!synchronizedPlayer.get())
    {
        if (self.audio)
        {
            self.audio.pause();
            outPlaying.set(false);
        }
        self.audio = new Audio();

        console.log("load audio", self.file.get());

        self.audio.crossOrigin = "anonymous";
        self.audio.src = op.patch.getFilePath(self.file.get());
        self.audio.loop = doLoop.get();
        self.audio.crossOrigin = "anonymous";

        var canplaythrough = function ()
        {
            if (autoPlay.get() || play.get())
            {
                const prom = self.audio.play();
                if (prom instanceof Promise)
                    prom.then(null, function (e) {});
            }
            outPlaying.set(true);
            patch.loading.finished(loadingId);
            self.audio.removeEventListener("canplaythrough", canplaythrough, false);
        };

        self.audio.addEventListener("stalled", (err) => { console.log("mediaplayer stalled...", err); patch.loading.finished(loadingId); });
        self.audio.addEventListener("error", (err) => { console.log("mediaplayer error...", err); patch.loading.finished(loadingId); });
        self.audio.addEventListener("abort", (err) => { console.log("mediaplayer abort...", err); patch.loading.finished(loadingId); });
        self.audio.addEventListener("suspend", (err) => { console.log("mediaplayer suspend...", err); patch.loading.finished(loadingId); });


        self.audio.addEventListener("canplaythrough", canplaythrough, false);

        self.audio.addEventListener("ended", function ()
        {
            // console.log('audio player ended...');
            outPlaying.set(false);
            playing = false;
            outEnded.trigger();
        }, false);


        self.media = audioContext.createMediaElementSource(self.audio);
        self.media.connect(self.filter);
        self.audioOut.val = self.filter;
    }
    else
    {
        self.media = audioContext.createBufferSource();
        self.media.loop = doLoop.get();

        const request = new XMLHttpRequest();

        request.open("GET", op.patch.getFilePath(self.file.get()), true);
        request.responseType = "arraybuffer";

        request.onload = function ()
        {
            const audioData = request.response;

            audioContext.decodeAudioData(audioData, function (res)
            {
                buffer = res;
                // console.log('sound load complete');
                self.media.buffer = res;
                self.media.connect(self.filter);
                self.audioOut.val = self.filter;
                self.media.loop = doLoop.get();

                patch.loading.finished(loadingId);

                // if(!window.gui)
                // {
                //     self.media.start(0);
                //     playing=true;
                // }
            });
        };

        request.send();

        self.patch.timer.onPlayPause(seek);
        self.patch.timer.onTimeChange(seek);
    }
};


};

Ops.User.alivemachine.MyAudioPlayer02.prototype = new CABLES.Op();



window.addEventListener('load', function(event) {
CABLES.jsLoaded=new Event('CABLES.jsLoaded');
document.dispatchEvent(CABLES.jsLoaded);
});
