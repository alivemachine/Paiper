"use strict";

var CABLES=CABLES||{};
CABLES.OPS=CABLES.OPS||{};

var Ops=Ops || {};
Ops.Ui=Ops.Ui || {};
Ops.Anim=Ops.Anim || {};
Ops.Date=Ops.Date || {};
Ops.Html=Ops.Html || {};
Ops.Json=Ops.Json || {};
Ops.Math=Ops.Math || {};
Ops.Time=Ops.Time || {};
Ops.User=Ops.User || {};
Ops.Array=Ops.Array || {};
Ops.Debug=Ops.Debug || {};
Ops.Value=Ops.Value || {};
Ops.String=Ops.String || {};
Ops.Boolean=Ops.Boolean || {};
Ops.Sidebar=Ops.Sidebar || {};
Ops.Trigger=Ops.Trigger || {};
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
    inStyle = op.inValueEditor("Style", "position:absolute;z-index:9999;", "css"),
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

    if (!div.parentElement)
    {
        canvas.appendChild(div);

        // console.log("parent:", div.parentElement);
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

    op.patch.loading.addAssetLoadingTask(() =>
    {
        const body = inBody.get();
        httpClient(
            url,
            (err, _data, xhr) =>
            {
                if (err)
                {
                    op.patch.loading.finished(loadingId);
                    isLoading.set(false);

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
    });
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
    str = op.inStringEditor("JSON String", "{}", "json"),
    outObj = op.outObject("Result"),
    isValid = op.outValue("Valid");

str.onChange = parse;
parse();

function parse()
{
    try
    {
        const obj = JSON.parse(str.get());
        outObj.set(null);
        outObj.set(obj);
        isValid.set(true);
        op.setUiError("invalidjson", null);
    }
    catch (ex)
    {
        op.error(ex);
        isValid.set(false);

        let outStr = "";
        const parts = ex.message.split(" ");
        for (let i = 0; i < parts.length - 1; i++)
        {
            const num = parseFloat(parts[i + 1]);
            if (num && parts[i] == "position")
            {
                const outStrA = str.get().substring(num - 15, num);
                const outStrB = str.get().substring(num, num + 1);
                const outStrC = str.get().substring(num + 1, num + 15);
                outStr = "<span style=\"font-family:monospace;background-color:black;\">" + outStrA + "<span style=\"font-weight:bold;background-color:red;\">" + outStrB + "</span>" + outStrC + " </span>";
            }
        }

        op.setUiError("invalidjson", "INVALID JSON<br/>can not parse string to object:<br/><b> " + ex.message + "</b><br/>" + outStr);
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
const
    inval = op.inFloat("Value"),
    next = op.outTrigger("Next"),
    number = op.outNumber("Number");

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
    inStr = op.inString("String"),
    result = op.outValue("Result");

inStr.onChange = function ()
{
    if (!inStr.get()) result.set(0);
    else result.set(String(inStr.get()).length);
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
    syntax = op.inValueSelect("Syntax", ["text", "glsl", "css", "html", "xml", "json"], "text"),
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
const code = op.inStringEditor("css code");

code.setUiAttribs({ "editorSyntax": "css" });

let styleEle = null;
const eleId = "css_" + CABLES.uuid();

code.onChange = update;
update();

function getCssContent()
{
    let css = code.get();
    css = css.replace(/{{ASSETPATH}}/g, op.patch.getAssetPath());
    return css;
}

function update()
{
    styleEle = document.getElementById(eleId);

    if (styleEle)
    {
        styleEle.textContent = getCssContent();
    }
    else
    {
        styleEle = document.createElement("style");
        styleEle.type = "text/css";
        styleEle.id = eleId;
        styleEle.textContent = attachments.css_spinner;

        const head = document.getElementsByTagName("body")[0];
        head.appendChild(styleEle);
    }
}

op.onDelete = function ()
{
    styleEle = document.getElementById(eleId);
    if (styleEle)styleEle.remove();
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
            op.error(e);
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
    inSize = op.inValueSelect("Size", ["auto", "length", "cover", "contain", "initial", "inherit", "75%", "50%", "25%", "20%", "10%"], "cover"),
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
let cacheBust = null;

op.onFileChanged = function (fn)
{
    if (filename.get() && filename.get().indexOf(fn) > -1)
    {
        if (ele)ele.style["background-image"] = "none";
        cacheBust = CABLES.uuid();
        update();
    }
};

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
            let cb = "";
            if (cacheBust)cb = "?cb=" + cacheBust;

            ele.style["background-image"] = "url(" + op.patch.getFilePath(String(filename.get())) + cb + ")";
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
    trigger = op.inTriggerButton("trigger"),
    reset = op.inTriggerButton("reset"),
    outBool = op.outBool("result");

let theBool = false;
outBool.set(theBool);
outBool.ignoreValueSerialize = true;

trigger.onTriggered = function ()
{
    theBool = !theBool;
    outBool.set(theBool);
};

reset.onTriggered = function ()
{
    theBool = false;
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
    src = op.inString("URL", "https://undev.studio"),
    elId = op.inString("ID"),
    active = op.inBool("Active", true),
    inStyle = op.inStringEditor("Style", "position:absolute;\nz-index:9999;\nborder:0;\nwidth:50%;\nheight:50%;"),
    outEle = op.outObject("Element");

op.setPortGroup("Attributes", [src, elId]);

let element = null;

op.onDelete = removeEle;

op.onLoaded = () =>
{
    addElement();
    updateSoon();

    inStyle.onChange =
        src.onChange =
        elId.onChange = updateSoon;

    active.onChange = updateActive;
};

function addElement()
{
    if (!active.get()) return;
    if (element) removeEle();
    element = document.createElement("iframe");
    updateAttribs();
    const parent = op.patch.cgl.canvas.parentElement;
    parent.appendChild(element);
    outEle.set(element);
}

let timeOut = null;

function updateSoon()
{
    clearTimeout(timeOut);
    timeOut = setTimeout(updateAttribs, 30);
}

function updateAttribs()
{
    if (!element) return;
    element.setAttribute("style", inStyle.get());
    element.setAttribute("src", src.get());
    element.setAttribute("id", elId.get());
}

function removeEle()
{
    if (element && element.parentNode)element.parentNode.removeChild(element);
    element = null;
    outEle.set(element);
}

function updateActive()
{
    if (!active.get())
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
const
    inTriggerPort = op.inTrigger("In Trigger"),
    timePort = op.inValue("Milliseconds", 300),
    outTriggerPort = op.outTrigger("Out Trigger"),
    progress = op.outValue("Progress");

let lastTriggerTime = 0;

// change listeners
inTriggerPort.onTriggered = function ()
{
    const now = CABLES.now();
    let prog = (now - lastTriggerTime) / timePort.get();

    if (prog > 1.0)prog = 1.0;
    if (prog < 0.0)prog = 0.0;

    progress.set(prog);

    if (now >= lastTriggerTime + timePort.get())
    {
        lastTriggerTime = now;
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
    trigger = op.inTriggerButton("Trigger"),
    duration = op.inValue("Duration", 1),
    valueTrue = op.inValue("Value True", 1),
    valueFalse = op.inValue("Value False", 0),
    resetButton = op.inTriggerButton("Reset"),
    outAct = op.outTrigger("Activated"),
    result = op.outValue("Result", false);

let lastTimeout = -1;

resetButton.onTriggered = function ()
{
    result.set(valueFalse.get());

    clearTimeout(lastTimeout);
};

trigger.onTriggered = function ()
{
    if (result.get() == valueFalse.get())outAct.trigger();
    result.set(valueTrue.get());


    clearTimeout(lastTimeout);
    lastTimeout = setTimeout(function ()
    {
        result.set(valueFalse.get());
    }, duration.get() * 1000);
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
            if (ele.style[inProperty.get()] != str)
                ele.style[inProperty.get()] = str;
        }
        catch (e)
        {
            op.error(e);
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
op.dyn = op.addInPort(new CABLES.Port(op, "create port", CABLES.OP_PORT_TYPE_DYNAMIC));
op.dynOut = op.addOutPort(new CABLES.Port(op, "create port out", CABLES.OP_PORT_TYPE_DYNAMIC));

const dataStr = op.addInPort(new CABLES.Port(op, "dataStr", CABLES.OP_PORT_TYPE_VALUE, { "display": "readonly" }));
op.patchId = op.addInPort(new CABLES.Port(op, "patchId", CABLES.OP_PORT_TYPE_VALUE, { "display": "readonly" }));

dataStr.setUiAttribs({ "hideParam": true });
op.patchId.setUiAttribs({ "hideParam": true });

let data = { "ports": [], "portsOut": [] };

// Ops.Ui.Patch.maxPatchId=CABLES.generateUUID();

op.patchId.onChange = function ()
{
    const oldPatchOps = op.patch.getSubPatchOps(oldPatchId);

    if (oldPatchOps.length == 2)
    {
        for (let i = 0; i < oldPatchOps.length; i++)
        {
            op.patch.deleteOp(oldPatchOps[i].id);
        }
    }
    else
    {
    }
};

var oldPatchId = CABLES.generateUUID();
op.patchId.set(oldPatchId);

op.onLoaded = function ()
{
    // op.patchId.set(CABLES.generateUUID());
};

op.onLoadedValueSet = function ()
{
    data = JSON.parse(dataStr.get());
    if (!data)
    {
        data = { "ports": [], "portsOut": [] };
    }
    setupPorts();
};

function loadData()
{
}

getSubPatchInputOp();
getSubPatchOutputOp();

let dataLoaded = false;
dataStr.onChange = function ()
{
    if (dataLoaded) return;

    if (!dataStr.get()) return;
    try
    {
        loadData();
    }
    catch (e)
    {
        op.error("cannot load subpatch data...");
        op.error(e);
    }
};

function saveData()
{
    dataStr.set(JSON.stringify(data));
}

function addPortListener(newPort, newPortInPatch)
{
    newPort.addEventListener("onUiAttrChange", function (attribs)
    {
        if (attribs.title)
        {
            let i = 0;
            for (i = 0; i < data.portsOut.length; i++)
                if (data.portsOut[i].name == newPort.name)
                    data.portsOut[i].title = attribs.title;

            for (i = 0; i < data.ports.length; i++)
                if (data.ports[i].name == newPort.name)
                    data.ports[i].title = attribs.title;

            saveData();
        }
    });

    if (newPort.direction == CABLES.PORT_DIR_IN)
    {
        if (newPort.type == CABLES.OP_PORT_TYPE_FUNCTION)
        {
            newPort.onTriggered = function ()
            {
                if (newPortInPatch.isLinked())
                    newPortInPatch.trigger();
            };
        }
        else
        {
            newPort.onChange = function ()
            {
                newPortInPatch.set(newPort.get());
            };
        }
    }
}

function setupPorts()
{
    if (!op.patchId.get()) return;
    const ports = data.ports || [];
    const portsOut = data.portsOut || [];
    let i = 0;

    for (i = 0; i < ports.length; i++)
    {
        if (!op.getPortByName(ports[i].name))
        {
            const newPort = op.addInPort(new CABLES.Port(op, ports[i].name, ports[i].type));
            const patchInputOp = getSubPatchInputOp();
            const newPortInPatch = patchInputOp.addOutPort(new CABLES.Port(patchInputOp, ports[i].name, ports[i].type));

            newPort.ignoreValueSerialize = true;
            newPort.setUiAttribs({ "editableTitle": true });
            if (ports[i].title)
            {
                newPort.setUiAttribs({ "title": ports[i].title });
                newPortInPatch.setUiAttribs({ "title": ports[i].title });
            }
            addPortListener(newPort, newPortInPatch);
        }
    }

    for (i = 0; i < portsOut.length; i++)
    {
        if (!op.getPortByName(portsOut[i].name))
        {
            const newPortOut = op.addOutPort(new CABLES.Port(op, portsOut[i].name, portsOut[i].type));
            const patchOutputOp = getSubPatchOutputOp();
            const newPortOutPatch = patchOutputOp.addInPort(new CABLES.Port(patchOutputOp, portsOut[i].name, portsOut[i].type));

            newPortOut.ignoreValueSerialize = true;
            newPortOut.setUiAttribs({ "editableTitle": true });

            if (portsOut[i].title)
            {
                newPortOut.setUiAttribs({ "title": portsOut[i].title });
                newPortOutPatch.setUiAttribs({ "title": portsOut[i].title });
            }

            // addPortListener(newPortOut,newPortOutPatch);
            addPortListener(newPortOutPatch, newPortOut);
        }
    }

    dataLoaded = true;
}

op.dyn.onLinkChanged = function ()
{
    if (op.dyn.isLinked())
    {
        const otherPort = op.dyn.links[0].getOtherPort(op.dyn);
        op.dyn.removeLinks();
        otherPort.removeLinkTo(op.dyn);

        const newName = "in" + data.ports.length + " " + otherPort.parent.name + " " + otherPort.name;

        data.ports.push({ "name": newName, "type": otherPort.type });

        setupPorts();

        const l = gui.scene().link(
            otherPort.parent,
            otherPort.getName(),
            op,
            newName
        );

        dataLoaded = true;
        saveData();
    }
    else
    {
        setTimeout(function ()
        {
            op.dyn.removeLinks();
            gui.patch().removeDeadLinks();
        }, 100);
    }
};

op.dynOut.onLinkChanged = function ()
{
    if (op.dynOut.isLinked())
    {
        const otherPort = op.dynOut.links[0].getOtherPort(op.dynOut);
        op.dynOut.removeLinks();
        otherPort.removeLinkTo(op.dynOut);
        const newName = "out" + data.ports.length + " " + otherPort.parent.name + " " + otherPort.name;

        data.portsOut.push({ "name": newName, "type": otherPort.type });

        setupPorts();

        gui.scene().link(
            otherPort.parent,
            otherPort.getName(),
            op,
            newName
        );

        dataLoaded = true;
        saveData();
    }
    else
    {
        setTimeout(function ()
        {
            op.dynOut.removeLinks();
            gui.patch().removeDeadLinks();
        }, 100);

        op.log("dynOut unlinked...");
    }
    gui.patch().removeDeadLinks();
};

function getSubPatchOutputOp()
{
    let patchOutputOP = op.patch.getSubPatchOp(op.patchId.get(), "Ops.Ui.PatchOutput");

    if (!patchOutputOP)
    {
        op.patch.addOp("Ops.Ui.PatchOutput", { "subPatch": op.patchId.get() });
        patchOutputOP = op.patch.getSubPatchOp(op.patchId.get(), "Ops.Ui.PatchOutput");

        if (!patchOutputOP) op.warn("no patchinput2!");
    }
    return patchOutputOP;
}

function getSubPatchInputOp()
{
    let patchInputOP = op.patch.getSubPatchOp(op.patchId.get(), "Ops.Ui.PatchInput");

    if (!patchInputOP)
    {
        op.patch.addOp("Ops.Ui.PatchInput", { "subPatch": op.patchId.get() });
        patchInputOP = op.patch.getSubPatchOp(op.patchId.get(), "Ops.Ui.PatchInput");
        if (!patchInputOP) op.warn("no patchinput2!");
    }

    return patchInputOP;
}

op.addSubLink = function (p, p2)
{
    const num = data.ports.length;
    const sublPortname = "in" + (num - 1) + " " + p2.parent.name + " " + p2.name;

    if (p.direction == CABLES.PORT_DIR_IN)
    {
        var l = gui.scene().link(
            p.parent,
            p.getName(),
            getSubPatchInputOp(),
            sublPortname
        );
    }
    else
    {
        var l = gui.scene().link(
            p.parent,
            p.getName(),
            getSubPatchOutputOp(),
            "out" + (num) + " " + p2.parent.name + " " + p2.name
        );
    }

    const bounds = gui.patch().getSubPatchBounds(op.patchId.get());

    getSubPatchInputOp().uiAttr(
        {
            "translate":
            {
                "x": bounds.minx,
                "y": bounds.miny - 100
            }
        });

    getSubPatchOutputOp().uiAttr(
        {
            "translate":
            {
                "x": bounds.minx,
                "y": bounds.maxy + 100
            }
        });
    saveData();
    return sublPortname;
};

op.onDelete = function ()
{
    for (let i = op.patch.ops.length - 1; i >= 0; i--)
    {
        if (op.patch.ops[i].uiAttribs && op.patch.ops[i].uiAttribs.subPatch == op.patchId.get())
        {
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
    exe = op.inTrigger("exe"),
    delay = op.inValueFloat("delay", 1),
    cancel = op.inTriggerButton("Cancel"),
    next = op.outTrigger("next"),
    outDelaying = op.outBool("Delaying");

let lastTimeout = null;

cancel.onTriggered = function ()
{
    if (lastTimeout)clearTimeout(lastTimeout);
    lastTimeout = null;
};

exe.onTriggered = function ()
{
    outDelaying.set(true);
    if (lastTimeout)clearTimeout(lastTimeout);

    lastTimeout = setTimeout(
        function ()
        {
            outDelaying.set(false);
            lastTimeout = null;
            next.trigger();
        },
        delay.get() * 1000);
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
const CSS_ELEMENT_CLASS = "cables-sidebar-style"; /* class for the style element to be generated */
const CSS_ELEMENT_DYNAMIC_CLASS = "cables-sidebar-dynamic-style"; /* things which can be set via op-port, but not attached to the elements themselves, e.g. minimized opacity */
const SIDEBAR_CLASS = "sidebar-cables";
const SIDEBAR_ID = "sidebar" + CABLES.uuid();
const SIDEBAR_ITEMS_CLASS = "sidebar__items";
const SIDEBAR_OPEN_CLOSE_BTN_CLASS = "sidebar__close-button";
const SIDEBAR_OPEN_CLOSE_BTN_ICON_CLASS = "sidebar__close-button-icon";
const BTN_TEXT_OPEN = ""; // 'Close';
const BTN_TEXT_CLOSED = ""; // 'Show Controls';

let openCloseBtn = null;
let openCloseBtnIcon = null;
let headerTitleText = null;

// inputs
const visiblePort = op.inValueBool("Visible", true);
const opacityPort = op.inValueSlider("Opacity", 1);
const defaultMinimizedPort = op.inValueBool("Default Minimized");
const minimizedOpacityPort = op.inValueSlider("Minimized Opacity", 0.5);

const inTitle = op.inString("Title", "Sidebar");
const side = op.inValueBool("Side");

// outputs
const childrenPort = op.outObject("childs");

let sidebarEl = document.querySelector("." + SIDEBAR_ID);
if (!sidebarEl)
{
    sidebarEl = initSidebarElement();
}
// if(!sidebarEl) return;
const sidebarItemsEl = sidebarEl.querySelector("." + SIDEBAR_ITEMS_CLASS);
childrenPort.set({
    "parentElement": sidebarItemsEl,
    "parentOp": op,
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

function onMinimizedOpacityPortChanged()
{
    updateDynamicStyles();
}

side.onChange = function ()
{
    if (side.get()) sidebarEl.classList.add("sidebar-cables-right");
    else sidebarEl.classList.remove("sidebar-cables-right");
};

function onDefaultMinimizedPortChanged()
{
    if (!openCloseBtn) { return; }
    if (defaultMinimizedPort.get())
    {
        sidebarEl.classList.add("sidebar--closed");
        // openCloseBtn.textContent = BTN_TEXT_CLOSED;
    }
    else
    {
        sidebarEl.classList.remove("sidebar--closed");
        // openCloseBtn.textContent = BTN_TEXT_OPEN;
    }
}

function onOpacityPortChange()
{
    const opacity = opacityPort.get();
    sidebarEl.style.opacity = opacity;
}

function onVisiblePortChange()
{
    if (visiblePort.get())
    {
        sidebarEl.style.display = "block";
    }
    else
    {
        sidebarEl.style.display = "none";
    }
}

side.onChanged = function ()
{

};

/**
 * Some styles cannot be set directly inline, so a dynamic stylesheet is needed.
 * Here hover states can be set later on e.g.
 */
function updateDynamicStyles()
{
    const dynamicStyles = document.querySelectorAll("." + CSS_ELEMENT_DYNAMIC_CLASS);
    if (dynamicStyles)
    {
        dynamicStyles.forEach(function (e)
        {
            e.parentNode.removeChild(e);
        });
    }
    const newDynamicStyle = document.createElement("style");
    newDynamicStyle.classList.add(CSS_ELEMENT_DYNAMIC_CLASS);
    let cssText = ".sidebar--closed .sidebar__close-button { ";
    cssText += "opacity: " + minimizedOpacityPort.get();
    cssText += "}";
    const cssTextEl = document.createTextNode(cssText);
    newDynamicStyle.appendChild(cssTextEl);
    document.body.appendChild(newDynamicStyle);
}

function initSidebarElement()
{
    const element = document.createElement("div");
    element.classList.add(SIDEBAR_CLASS);
    element.classList.add(SIDEBAR_ID);
    const canvasWrapper = op.patch.cgl.canvas.parentElement; /* maybe this is bad outside cables!? */

    // header...
    const headerGroup = document.createElement("div");
    headerGroup.classList.add("sidebar__group");
    element.appendChild(headerGroup);
    const header = document.createElement("div");
    header.classList.add("sidebar__group-header");
    element.appendChild(header);
    const headerTitle = document.createElement("div");
    headerTitle.classList.add("sidebar__group-header-title");
    headerTitleText = document.createElement("span");
    headerTitleText.classList.add("sidebar__group-header-title-text");
    headerTitleText.innerHTML = inTitle.get();
    headerTitle.appendChild(headerTitleText);
    header.appendChild(headerTitle);
    headerGroup.appendChild(header);
    element.appendChild(headerGroup);
    headerGroup.addEventListener("click", onOpenCloseBtnClick);

    if (!canvasWrapper)
    {
        op.warn("[sidebar] no canvas parentelement found...");
        return;
    }
    canvasWrapper.appendChild(element);
    const items = document.createElement("div");
    items.classList.add(SIDEBAR_ITEMS_CLASS);
    element.appendChild(items);
    openCloseBtn = document.createElement("div");
    openCloseBtn.classList.add(SIDEBAR_OPEN_CLOSE_BTN_CLASS);
    openCloseBtn.addEventListener("click", onOpenCloseBtnClick);
    // openCloseBtn.textContent = BTN_TEXT_OPEN;
    element.appendChild(openCloseBtn);
    openCloseBtnIcon = document.createElement("span");
    openCloseBtnIcon.classList.add(SIDEBAR_OPEN_CLOSE_BTN_ICON_CLASS);
    openCloseBtn.appendChild(openCloseBtnIcon);

    return element;
}

inTitle.onChange = function ()
{
    if (headerTitleText)headerTitleText.innerHTML = inTitle.get();
};

function setClosed(b)
{

}

function onOpenCloseBtnClick(ev)
{
    ev.stopPropagation();
    if (!sidebarEl) { op.error("Sidebar could not be closed..."); return; }
    sidebarEl.classList.toggle("sidebar--closed");
    const btn = ev.target;
    let btnText = BTN_TEXT_OPEN;
    if (sidebarEl.classList.contains("sidebar--closed")) btnText = BTN_TEXT_CLOSED;
}

function initSidebarCss()
{
    // var cssEl = document.getElementById(CSS_ELEMENT_ID);
    const cssElements = document.querySelectorAll("." + CSS_ELEMENT_CLASS);
    // remove old script tag
    if (cssElements)
    {
        cssElements.forEach(function (e)
        {
            e.parentNode.removeChild(e);
        });
    }
    const newStyle = document.createElement("style");
    newStyle.innerHTML = attachments.style_css;
    newStyle.classList.add(CSS_ELEMENT_CLASS);
    document.body.appendChild(newStyle);
}

function onDelete()
{
    removeElementFromDOM(sidebarEl);
}

function removeElementFromDOM(el)
{
    if (el && el.parentNode && el.parentNode.removeChild) el.parentNode.removeChild(el);
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
const parentPort = op.inObject("link");
const labelPort = op.inString("Text", "Value");
const inId = op.inValueString("Id", "");

// outputs
const siblingsPort = op.outObject("childs");

// vars
const el = document.createElement("div");
el.classList.add("sidebar__item");
el.classList.add("sidebar__text");
const label = document.createElement("div");
label.classList.add("sidebar__item-label");
const labelText = document.createTextNode(labelPort.get());
label.appendChild(labelText);
el.appendChild(label);

// events
parentPort.onChange = onParentChanged;
labelPort.onChange = onLabelTextChanged;
inId.onChange = onIdChanged;
op.onDelete = onDelete;

op.toWorkNeedsParent("Ops.Sidebar.Sidebar");

// functions

function onIdChanged()
{
    el.id = inId.get();
}

function onLabelTextChanged()
{
    const labelText = labelPort.get();
    label.textContent = labelText;
    if (CABLES.UI)
    {
        if (labelText && typeof labelText === "string")
        {
            op.setTitle("Text: " + labelText.substring(0, 10)); // display first 10 characters of text in op title
        }
        else
        {
            op.setTitle("Text");
        }
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
            if (option === defaultValue || option === valuePort.get())
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
        if (optionElement.value.trim() === defaultItem.trim() || optionElement.value.trim() === valuePort.get())
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

    const sep = separator.get();
    if (separator.get() == "\\n")sep == "\n";
    const r = text.get().split(sep);


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
    width = op.inValueInt("inWidth", 640),
    height = op.inValueInt("inHeight", 480),
    inActive = op.inValueBool("Active", true),
    inStyle = op.inValueEditor("Style", "position:absolute;z-index:9999;", "none"),
    inCap = op.inTriggerButton("Capture"),
    textureOut = op.outTexture("texture"),
    outRatio = op.outValue("Ratio"),
    available = op.outValue("Available"),
    outWidth = op.outNumber("outWidth"),
    outHeight = op.outNumber("outHeight"),
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
// Ops.Trigger.GateTrigger
// 
// **************************************************************

Ops.Trigger.GateTrigger = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    exe = op.inTrigger('Execute'),
    passThrough = op.inValueBool('Pass Through',true),
    triggerOut = op.outTrigger('Trigger out');

exe.onTriggered = function()
{
    if(passThrough.get())
        triggerOut.trigger();
}


};

Ops.Trigger.GateTrigger.prototype = new CABLES.Op();
CABLES.OPS["65e8b8a2-ba13-485f-883a-2bcf377989da"]={f:Ops.Trigger.GateTrigger,objName:"Ops.Trigger.GateTrigger"};




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
var rate = op.inFloat("playback rate",1);
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
rate.onChange=function(){
    if (!self.audio)
    {
        op.uiAttr({ "error": "No audio file selected" });
        return;
    }
    else{
        self.audio.playbackRate = rate.get();
    }
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
// Ops.WebAudio.WebAudioContextRunner
// 
// **************************************************************

Ops.WebAudio.WebAudioContextRunner = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
CABLES.WEBAUDIO.createAudioContext = function(op) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if(!AudioContext) return;
    if(!window.audioContext)
        window.audioContext = new AudioContext({sampleRate:44100});
    // check if tone.js lib is being used
    if(window.Tone && !CABLES.WEBAUDIO.toneJsInitialized) {
      // set current audio context in tone.js
      Tone.setContext(window.audioContext);
      CABLES.WEBAUDIO.toneJsInitialized = true;
    }
    return window.audioContext;
};


const context = CABLES.WEBAUDIO.createAudioContext(op);
context.addEventListener('statechange', onContextStateChange);
const canvasWrapper = op.patch.cgl.canvas.parentElement;
const showOverlayPort = op.inValueBool('Show Overlay', true);
let overlay = null;
let button = null;

// inputs
const inTrigger = op.inTriggerButton('Resume');

// outputs
const currentStatePort = op.outValueString('Current State');
currentStatePort.set(context.state);

inTrigger.onTriggered = checkState;
showOverlayPort.onChange = onShowOverlayPortChange;

if(showOverlayPort.get()) {
    checkOverlay();
}

function onShowOverlayPortChange() {
    if(showOverlayPort.get()) {
        checkOverlay();
    } else {
        removeOverlay();
    }
}

function checkState() {
    if(context.state !== 'running') {
        context.resume();
    }
    if(showOverlayPort.get()) {
        checkOverlay();
    }
}

function removeOverlay() {
    if(overlay) {
        overlay.parentNode.removeChild(overlay);
    }
    if(button) {
        button.parentNode.removeChild(button);
        button.removeEventListener('click', onButtonClick);
    }
    overlay = null;
    button = null;
}

function checkOverlay() {
    if(context.state !== 'running') {
        initElements();
    } else { /* context is running */
        removeOverlay();
    }
}

function onButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();
    checkState();
}

function onContextStateChange(event) {
    currentStatePort.set(event.target.state);
    // console.log('Web Audio State changed to: ', event.target.state);
    checkOverlay();
}

function initElements() {
    if(!overlay) {
        overlay = document.createElement('div');
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = '100000000';
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'white';
            overlay.style.opacity = '0.7';
        canvasWrapper.appendChild(overlay);
    }
    if(!button) {
        button = document.createElement('div');
            button.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyNGJhYTciIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLXBsYXktY2lyY2xlIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PHBvbHlnb24gcG9pbnRzPSIxMCA4IDE2IDEyIDEwIDE2IDEwIDgiPjwvcG9seWdvbj48L3N2Zz4=)';
            button.style.width = '20vh';
            button.style.height = '20vh';
            button.style.cursor = 'pointer';
            button.style.backgroundSize = 'cover';
        button.addEventListener('click', onButtonClick);
        overlay.appendChild(button);
    }
}

op.onDelete = removeOverlay;

};

Ops.WebAudio.WebAudioContextRunner.prototype = new CABLES.Op();
CABLES.OPS["9e670541-deda-4eff-89bf-b6c56a917256"]={f:Ops.WebAudio.WebAudioContextRunner,objName:"Ops.WebAudio.WebAudioContextRunner"};




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
// Ops.User.alivemachine.MyLogger
// 
// **************************************************************

Ops.User.alivemachine.MyLogger = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    inNumber=op.inFloat("Number",0),
    inString=op.inString("String","");
const intrig=op.inTriggerButton("trigger message"),
    inMsg=op.inString("Message");

intrig.onTriggered=function(){console.log(inMsg.get());}
inMsg.onChange=function(){console.log(inMsg.get());}
inNumber.onChange=function()
{
    console.log(inNumber.get());
};

inString.onChange=function()
{
    console.log(inString.get());
};

};

Ops.User.alivemachine.MyLogger.prototype = new CABLES.Op();





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
                //console.log("start");
                recognition.start();
                //console.log("started");
            }
            else {
                //console.log("aborting");
                recognition.stop();
                outActive.set(false);
                //console.log("aborted");
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
// Ops.User.alivemachine.Morphcast
// 
// **************************************************************

Ops.User.alivemachine.Morphcast = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var MphTools=function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="https://sdk.morphcast.com/mphtools/v1.0/",n(n.s=147)}([function(t,e,n){var r=n(2),i=n(18),o=n(11),a=n(12),s=n(19),c=function(t,e,n){var u,f,l,d,p=t&c.F,v=t&c.G,h=t&c.S,m=t&c.P,g=t&c.B,y=v?r:h?r[e]||(r[e]={}):(r[e]||{}).prototype,b=v?i:i[e]||(i[e]={}),_=b.prototype||(b.prototype={});for(u in v&&(n=e),n)l=((f=!p&&y&&void 0!==y[u])?y:n)[u],d=g&&f?s(l,r):m&&"function"==typeof l?s(Function.call,l):l,y&&a(y,u,l,t&c.U),b[u]!=l&&o(b,u,d),m&&_[u]!=l&&(_[u]=l)};r.core=i,c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,t.exports=c},function(t,e,n){var r=n(4);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e,n){var r=n(51)("wks"),i=n(37),o=n(2).Symbol,a="function"==typeof o;(t.exports=function(t){return r[t]||(r[t]=a&&o[t]||(a?o:i)("Symbol."+t))}).store=r},function(t,e,n){var r=n(21),i=Math.min;t.exports=function(t){return t>0?i(r(t),9007199254740991):0}},function(t,e,n){t.exports=!n(3)((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},function(t,e,n){var r=n(1),i=n(109),o=n(23),a=Object.defineProperty;e.f=n(7)?Object.defineProperty:function(t,e,n){if(r(t),e=o(e,!0),r(n),i)try{return a(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){var r=n(24);t.exports=function(t){return Object(r(t))}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e,n){var r=n(8),i=n(36);t.exports=n(7)?function(t,e,n){return r.f(t,e,i(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var r=n(2),i=n(11),o=n(14),a=n(37)("src"),s=n(151),c=(""+s).split("toString");n(18).inspectSource=function(t){return s.call(t)},(t.exports=function(t,e,n,s){var u="function"==typeof n;u&&(o(n,"name")||i(n,"name",e)),t[e]!==n&&(u&&(o(n,a)||i(n,a,t[e]?""+t[e]:c.join(String(e)))),t===r?t[e]=n:s?t[e]?t[e]=n:i(t,e,n):(delete t[e],i(t,e,n)))})(Function.prototype,"toString",(function(){return"function"==typeof this&&this[a]||s.call(this)}))},function(t,e,n){var r=n(0),i=n(3),o=n(24),a=/"/g,s=function(t,e,n,r){var i=String(o(t)),s="<"+e;return""!==n&&(s+=" "+n+'="'+String(r).replace(a,"&quot;")+'"'),s+">"+i+"</"+e+">"};t.exports=function(t,e){var n={};n[t]=e(s),r(r.P+r.F*i((function(){var e=""[t]('"');return e!==e.toLowerCase()||e.split('"').length>3})),"String",n)}},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){var r=n(52),i=n(24);t.exports=function(t){return r(i(t))}},function(t,e,n){var r=n(53),i=n(36),o=n(15),a=n(23),s=n(14),c=n(109),u=Object.getOwnPropertyDescriptor;e.f=n(7)?u:function(t,e){if(t=o(t),e=a(e,!0),c)try{return u(t,e)}catch(t){}if(s(t,e))return i(!r.f.call(t,e),t[e])}},function(t,e,n){var r=n(14),i=n(9),o=n(84)("IE_PROTO"),a=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=i(t),r(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?a:null}},function(t,e){var n=t.exports={version:"2.6.11"};"number"==typeof __e&&(__e=n)},function(t,e,n){var r=n(10);t.exports=function(t,e,n){if(r(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,i){return t.call(e,n,r,i)}}return function(){return t.apply(e,arguments)}}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e){var n=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:n)(t)}},function(t,e,n){"use strict";var r=n(3);t.exports=function(t,e){return!!t&&r((function(){e?t.call(null,(function(){}),1):t.call(null)}))}},function(t,e,n){var r=n(4);t.exports=function(t,e){if(!r(t))return t;var n,i;if(e&&"function"==typeof(n=t.toString)&&!r(i=n.call(t)))return i;if("function"==typeof(n=t.valueOf)&&!r(i=n.call(t)))return i;if(!e&&"function"==typeof(n=t.toString)&&!r(i=n.call(t)))return i;throw TypeError("Can't convert object to primitive value")}},function(t,e){t.exports=function(t){if(null==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e,n){var r=n(0),i=n(18),o=n(3);t.exports=function(t,e){var n=(i.Object||{})[t]||Object[t],a={};a[t]=e(n),r(r.S+r.F*o((function(){n(1)})),"Object",a)}},function(t,e,n){var r=n(19),i=n(52),o=n(9),a=n(6),s=n(100);t.exports=function(t,e){var n=1==t,c=2==t,u=3==t,f=4==t,l=6==t,d=5==t||l,p=e||s;return function(e,s,v){for(var h,m,g=o(e),y=i(g),b=r(s,v,3),_=a(y.length),w=0,x=n?p(e,_):c?p(e,0):void 0;_>w;w++)if((d||w in y)&&(m=b(h=y[w],w,g),t))if(n)x[w]=m;else if(m)switch(t){case 3:return!0;case 5:return h;case 6:return w;case 2:x.push(h)}else if(f)return!1;return l?-1:u||f?f:x}}},function(t,e,n){"use strict";if(n(7)){var r=n(29),i=n(2),o=n(3),a=n(0),s=n(67),c=n(108),u=n(19),f=n(43),l=n(36),d=n(11),p=n(45),v=n(21),h=n(6),m=n(137),g=n(39),y=n(23),b=n(14),_=n(48),w=n(4),x=n(9),S=n(97),O=n(40),M=n(17),A=n(41).f,k=n(99),C=n(37),P=n(5),E=n(26),T=n(57),F=n(55),$=n(102),N=n(50),I=n(62),j=n(42),R=n(101),L=n(126),D=n(8),B=n(16),W=D.f,G=B.f,U=i.RangeError,z=i.TypeError,V=i.Uint8Array,H=Array.prototype,q=c.ArrayBuffer,K=c.DataView,J=E(0),X=E(2),Y=E(3),Q=E(4),Z=E(5),tt=E(6),et=T(!0),nt=T(!1),rt=$.values,it=$.keys,ot=$.entries,at=H.lastIndexOf,st=H.reduce,ct=H.reduceRight,ut=H.join,ft=H.sort,lt=H.slice,dt=H.toString,pt=H.toLocaleString,vt=P("iterator"),ht=P("toStringTag"),mt=C("typed_constructor"),gt=C("def_constructor"),yt=s.CONSTR,bt=s.TYPED,_t=s.VIEW,wt=E(1,(function(t,e){return At(F(t,t[gt]),e)})),xt=o((function(){return 1===new V(new Uint16Array([1]).buffer)[0]})),St=!!V&&!!V.prototype.set&&o((function(){new V(1).set({})})),Ot=function(t,e){var n=v(t);if(n<0||n%e)throw U("Wrong offset!");return n},Mt=function(t){if(w(t)&&bt in t)return t;throw z(t+" is not a typed array!")},At=function(t,e){if(!(w(t)&&mt in t))throw z("It is not a typed array constructor!");return new t(e)},kt=function(t,e){return Ct(F(t,t[gt]),e)},Ct=function(t,e){for(var n=0,r=e.length,i=At(t,r);r>n;)i[n]=e[n++];return i},Pt=function(t,e,n){W(t,e,{get:function(){return this._d[n]}})},Et=function(t){var e,n,r,i,o,a,s=x(t),c=arguments.length,f=c>1?arguments[1]:void 0,l=void 0!==f,d=k(s);if(null!=d&&!S(d)){for(a=d.call(s),r=[],e=0;!(o=a.next()).done;e++)r.push(o.value);s=r}for(l&&c>2&&(f=u(f,arguments[2],2)),e=0,n=h(s.length),i=At(this,n);n>e;e++)i[e]=l?f(s[e],e):s[e];return i},Tt=function(){for(var t=0,e=arguments.length,n=At(this,e);e>t;)n[t]=arguments[t++];return n},Ft=!!V&&o((function(){pt.call(new V(1))})),$t=function(){return pt.apply(Ft?lt.call(Mt(this)):Mt(this),arguments)},Nt={copyWithin:function(t,e){return L.call(Mt(this),t,e,arguments.length>2?arguments[2]:void 0)},every:function(t){return Q(Mt(this),t,arguments.length>1?arguments[1]:void 0)},fill:function(t){return R.apply(Mt(this),arguments)},filter:function(t){return kt(this,X(Mt(this),t,arguments.length>1?arguments[1]:void 0))},find:function(t){return Z(Mt(this),t,arguments.length>1?arguments[1]:void 0)},findIndex:function(t){return tt(Mt(this),t,arguments.length>1?arguments[1]:void 0)},forEach:function(t){J(Mt(this),t,arguments.length>1?arguments[1]:void 0)},indexOf:function(t){return nt(Mt(this),t,arguments.length>1?arguments[1]:void 0)},includes:function(t){return et(Mt(this),t,arguments.length>1?arguments[1]:void 0)},join:function(t){return ut.apply(Mt(this),arguments)},lastIndexOf:function(t){return at.apply(Mt(this),arguments)},map:function(t){return wt(Mt(this),t,arguments.length>1?arguments[1]:void 0)},reduce:function(t){return st.apply(Mt(this),arguments)},reduceRight:function(t){return ct.apply(Mt(this),arguments)},reverse:function(){for(var t,e=Mt(this).length,n=Math.floor(e/2),r=0;r<n;)t=this[r],this[r++]=this[--e],this[e]=t;return this},some:function(t){return Y(Mt(this),t,arguments.length>1?arguments[1]:void 0)},sort:function(t){return ft.call(Mt(this),t)},subarray:function(t,e){var n=Mt(this),r=n.length,i=g(t,r);return new(F(n,n[gt]))(n.buffer,n.byteOffset+i*n.BYTES_PER_ELEMENT,h((void 0===e?r:g(e,r))-i))}},It=function(t,e){return kt(this,lt.call(Mt(this),t,e))},jt=function(t){Mt(this);var e=Ot(arguments[1],1),n=this.length,r=x(t),i=h(r.length),o=0;if(i+e>n)throw U("Wrong length!");for(;o<i;)this[e+o]=r[o++]},Rt={entries:function(){return ot.call(Mt(this))},keys:function(){return it.call(Mt(this))},values:function(){return rt.call(Mt(this))}},Lt=function(t,e){return w(t)&&t[bt]&&"symbol"!=typeof e&&e in t&&String(+e)==String(e)},Dt=function(t,e){return Lt(t,e=y(e,!0))?l(2,t[e]):G(t,e)},Bt=function(t,e,n){return!(Lt(t,e=y(e,!0))&&w(n)&&b(n,"value"))||b(n,"get")||b(n,"set")||n.configurable||b(n,"writable")&&!n.writable||b(n,"enumerable")&&!n.enumerable?W(t,e,n):(t[e]=n.value,t)};yt||(B.f=Dt,D.f=Bt),a(a.S+a.F*!yt,"Object",{getOwnPropertyDescriptor:Dt,defineProperty:Bt}),o((function(){dt.call({})}))&&(dt=pt=function(){return ut.call(this)});var Wt=p({},Nt);p(Wt,Rt),d(Wt,vt,Rt.values),p(Wt,{slice:It,set:jt,constructor:function(){},toString:dt,toLocaleString:$t}),Pt(Wt,"buffer","b"),Pt(Wt,"byteOffset","o"),Pt(Wt,"byteLength","l"),Pt(Wt,"length","e"),W(Wt,ht,{get:function(){return this[bt]}}),t.exports=function(t,e,n,c){var u=t+((c=!!c)?"Clamped":"")+"Array",l="get"+t,p="set"+t,v=i[u],g=v||{},y=v&&M(v),b=!v||!s.ABV,x={},S=v&&v.prototype,k=function(t,n){W(t,n,{get:function(){return function(t,n){var r=t._d;return r.v[l](n*e+r.o,xt)}(this,n)},set:function(t){return function(t,n,r){var i=t._d;c&&(r=(r=Math.round(r))<0?0:r>255?255:255&r),i.v[p](n*e+i.o,r,xt)}(this,n,t)},enumerable:!0})};b?(v=n((function(t,n,r,i){f(t,v,u,"_d");var o,a,s,c,l=0,p=0;if(w(n)){if(!(n instanceof q||"ArrayBuffer"==(c=_(n))||"SharedArrayBuffer"==c))return bt in n?Ct(v,n):Et.call(v,n);o=n,p=Ot(r,e);var g=n.byteLength;if(void 0===i){if(g%e)throw U("Wrong length!");if((a=g-p)<0)throw U("Wrong length!")}else if((a=h(i)*e)+p>g)throw U("Wrong length!");s=a/e}else s=m(n),o=new q(a=s*e);for(d(t,"_d",{b:o,o:p,l:a,e:s,v:new K(o)});l<s;)k(t,l++)})),S=v.prototype=O(Wt),d(S,"constructor",v)):o((function(){v(1)}))&&o((function(){new v(-1)}))&&I((function(t){new v,new v(null),new v(1.5),new v(t)}),!0)||(v=n((function(t,n,r,i){var o;return f(t,v,u),w(n)?n instanceof q||"ArrayBuffer"==(o=_(n))||"SharedArrayBuffer"==o?void 0!==i?new g(n,Ot(r,e),i):void 0!==r?new g(n,Ot(r,e)):new g(n):bt in n?Ct(v,n):Et.call(v,n):new g(m(n))})),J(y!==Function.prototype?A(g).concat(A(y)):A(g),(function(t){t in v||d(v,t,g[t])})),v.prototype=S,r||(S.constructor=v));var C=S[vt],P=!!C&&("values"==C.name||null==C.name),E=Rt.values;d(v,mt,!0),d(S,bt,u),d(S,_t,!0),d(S,gt,v),(c?new v(1)[ht]==u:ht in S)||W(S,ht,{get:function(){return u}}),x[u]=v,a(a.G+a.W+a.F*(v!=g),x),a(a.S,u,{BYTES_PER_ELEMENT:e}),a(a.S+a.F*o((function(){g.of.call(v,1)})),u,{from:Et,of:Tt}),"BYTES_PER_ELEMENT"in S||d(S,"BYTES_PER_ELEMENT",e),a(a.P,u,Nt),j(u),a(a.P+a.F*St,u,{set:jt}),a(a.P+a.F*!P,u,Rt),r||S.toString==dt||(S.toString=dt),a(a.P+a.F*o((function(){new v(1).slice()})),u,{slice:It}),a(a.P+a.F*(o((function(){return[1,2].toLocaleString()!=new v([1,2]).toLocaleString()}))||!o((function(){S.toLocaleString.call([1,2])}))),u,{toLocaleString:$t}),N[u]=P?C:E,r||P||d(S,vt,E)}}else t.exports=function(){}},function(t,e,n){var r=n(132),i=n(0),o=n(51)("metadata"),a=o.store||(o.store=new(n(135))),s=function(t,e,n){var i=a.get(t);if(!i){if(!n)return;a.set(t,i=new r)}var o=i.get(e);if(!o){if(!n)return;i.set(e,o=new r)}return o};t.exports={store:a,map:s,has:function(t,e,n){var r=s(e,n,!1);return void 0!==r&&r.has(t)},get:function(t,e,n){var r=s(e,n,!1);return void 0===r?void 0:r.get(t)},set:function(t,e,n,r){s(n,r,!0).set(t,e)},keys:function(t,e){var n=s(t,e,!1),r=[];return n&&n.forEach((function(t,e){r.push(e)})),r},key:function(t){return void 0===t||"symbol"==typeof t?t:String(t)},exp:function(t){i(i.S,"Reflect",t)}}},function(t,e){t.exports=!1},function(t,e,n){var r=n(37)("meta"),i=n(4),o=n(14),a=n(8).f,s=0,c=Object.isExtensible||function(){return!0},u=!n(3)((function(){return c(Object.preventExtensions({}))})),f=function(t){a(t,r,{value:{i:"O"+ ++s,w:{}}})},l=t.exports={KEY:r,NEED:!1,fastKey:function(t,e){if(!i(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!o(t,r)){if(!c(t))return"F";if(!e)return"E";f(t)}return t[r].i},getWeak:function(t,e){if(!o(t,r)){if(!c(t))return!0;if(!e)return!1;f(t)}return t[r].w},onFreeze:function(t){return u&&l.NEED&&c(t)&&!o(t,r)&&f(t),t}}},function(t,e,n){var r=n(5)("unscopables"),i=Array.prototype;null==i[r]&&n(11)(i,r,{}),t.exports=function(t){i[r][t]=!0}},function(t,e,n){t.exports=n.p+"5b451041bd67072d5a7a0ccc35c6dc0e.png"},function(t,e,n){"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=function(t,e){var n=t[1]||"",r=t[3];if(!r)return n;if(e&&"function"==typeof btoa){var i=(a=r,s=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),c="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(s),"/*# ".concat(c," */")),o=r.sources.map((function(t){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(t," */")}));return[n].concat(o).concat([i]).join("\n")}var a,s,c;return[n].join("\n")}(e,t);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n})).join("")},e.i=function(t,n,r){"string"==typeof t&&(t=[[null,t,""]]);var i={};if(r)for(var o=0;o<this.length;o++){var a=this[o][0];null!=a&&(i[a]=!0)}for(var s=0;s<t.length;s++){var c=[].concat(t[s]);r&&i[c[0]]||(n&&(c[2]?c[2]="".concat(n," and ").concat(c[2]):c[2]=n),e.push(c))}},e}},function(t,e,n){var r,i,o={},a=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===i&&(i=r.apply(this,arguments)),i}),s=function(t,e){return e?e.querySelector(t):document.querySelector(t)},c=function(t){var e={};return function(t,n){if("function"==typeof t)return t();if(void 0===e[t]){var r=s.call(this,t,n);if(window.HTMLIFrameElement&&r instanceof window.HTMLIFrameElement)try{r=r.contentDocument.head}catch(t){r=null}e[t]=r}return e[t]}}(),u=null,f=0,l=[],d=n(354);function p(t,e){for(var n=0;n<t.length;n++){var r=t[n],i=o[r.id];if(i){i.refs++;for(var a=0;a<i.parts.length;a++)i.parts[a](r.parts[a]);for(;a<r.parts.length;a++)i.parts.push(b(r.parts[a],e))}else{var s=[];for(a=0;a<r.parts.length;a++)s.push(b(r.parts[a],e));o[r.id]={id:r.id,refs:1,parts:s}}}}function v(t,e){for(var n=[],r={},i=0;i<t.length;i++){var o=t[i],a=e.base?o[0]+e.base:o[0],s={css:o[1],media:o[2],sourceMap:o[3]};r[a]?r[a].parts.push(s):n.push(r[a]={id:a,parts:[s]})}return n}function h(t,e){var n=c(t.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=l[l.length-1];if("top"===t.insertAt)r?r.nextSibling?n.insertBefore(e,r.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),l.push(e);else if("bottom"===t.insertAt)n.appendChild(e);else{if("object"!=typeof t.insertAt||!t.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var i=c(t.insertAt.before,n);n.insertBefore(e,i)}}function m(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t);var e=l.indexOf(t);e>=0&&l.splice(e,1)}function g(t){var e=document.createElement("style");if(void 0===t.attrs.type&&(t.attrs.type="text/css"),void 0===t.attrs.nonce){var r=function(){0;return n.nc}();r&&(t.attrs.nonce=r)}return y(e,t.attrs),h(t,e),e}function y(t,e){Object.keys(e).forEach((function(n){t.setAttribute(n,e[n])}))}function b(t,e){var n,r,i,o;if(e.transform&&t.css){if(!(o="function"==typeof e.transform?e.transform(t.css):e.transform.default(t.css)))return function(){};t.css=o}if(e.singleton){var a=f++;n=u||(u=g(e)),r=x.bind(null,n,a,!1),i=x.bind(null,n,a,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(t){var e=document.createElement("link");return void 0===t.attrs.type&&(t.attrs.type="text/css"),t.attrs.rel="stylesheet",y(e,t.attrs),h(t,e),e}(e),r=O.bind(null,n,e),i=function(){m(n),n.href&&URL.revokeObjectURL(n.href)}):(n=g(e),r=S.bind(null,n),i=function(){m(n)});return r(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;r(t=e)}else i()}}t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(e=e||{}).attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=a()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var n=v(t,e);return p(n,e),function(t){for(var r=[],i=0;i<n.length;i++){var a=n[i];(s=o[a.id]).refs--,r.push(s)}t&&p(v(t,e),e);for(i=0;i<r.length;i++){var s;if(0===(s=r[i]).refs){for(var c=0;c<s.parts.length;c++)s.parts[c]();delete o[s.id]}}}};var _,w=(_=[],function(t,e){return _[t]=e,_.filter(Boolean).join("\n")});function x(t,e,n,r){var i=n?"":r.css;if(t.styleSheet)t.styleSheet.cssText=w(e,i);else{var o=document.createTextNode(i),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(o,a[e]):t.appendChild(o)}}function S(t,e){var n=e.css,r=e.media;if(r&&t.setAttribute("media",r),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}function O(t,e,n){var r=n.css,i=n.sourceMap,o=void 0===e.convertToAbsoluteUrls&&i;(e.convertToAbsoluteUrls||o)&&(r=d(r)),i&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */");var a=new Blob([r],{type:"text/css"}),s=t.href;t.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e){var n=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+r).toString(36))}},function(t,e,n){var r=n(111),i=n(85);t.exports=Object.keys||function(t){return r(t,i)}},function(t,e,n){var r=n(21),i=Math.max,o=Math.min;t.exports=function(t,e){return(t=r(t))<0?i(t+e,0):o(t,e)}},function(t,e,n){var r=n(1),i=n(112),o=n(85),a=n(84)("IE_PROTO"),s=function(){},c=function(){var t,e=n(82)("iframe"),r=o.length;for(e.style.display="none",n(86).appendChild(e),e.src="javascript:",(t=e.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),c=t.F;r--;)delete c.prototype[o[r]];return c()};t.exports=Object.create||function(t,e){var n;return null!==t?(s.prototype=r(t),n=new s,s.prototype=null,n[a]=t):n=c(),void 0===e?n:i(n,e)}},function(t,e,n){var r=n(111),i=n(85).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return r(t,i)}},function(t,e,n){"use strict";var r=n(2),i=n(8),o=n(7),a=n(5)("species");t.exports=function(t){var e=r[t];o&&e&&!e[a]&&i.f(e,a,{configurable:!0,get:function(){return this}})}},function(t,e){t.exports=function(t,e,n,r){if(!(t instanceof e)||void 0!==r&&r in t)throw TypeError(n+": incorrect invocation!");return t}},function(t,e,n){var r=n(19),i=n(124),o=n(97),a=n(1),s=n(6),c=n(99),u={},f={};(e=t.exports=function(t,e,n,l,d){var p,v,h,m,g=d?function(){return t}:c(t),y=r(n,l,e?2:1),b=0;if("function"!=typeof g)throw TypeError(t+" is not iterable!");if(o(g)){for(p=s(t.length);p>b;b++)if((m=e?y(a(v=t[b])[0],v[1]):y(t[b]))===u||m===f)return m}else for(h=g.call(t);!(v=h.next()).done;)if((m=i(h,y,v.value,e))===u||m===f)return m}).BREAK=u,e.RETURN=f},function(t,e,n){var r=n(12);t.exports=function(t,e,n){for(var i in e)r(t,i,e[i],n);return t}},function(t,e,n){var r=n(4);t.exports=function(t,e){if(!r(t)||t._t!==e)throw TypeError("Incompatible receiver, "+e+" required!");return t}},function(t,e,n){var r=n(8).f,i=n(14),o=n(5)("toStringTag");t.exports=function(t,e,n){t&&!i(t=n?t:t.prototype,o)&&r(t,o,{configurable:!0,value:e})}},function(t,e,n){var r=n(20),i=n(5)("toStringTag"),o="Arguments"==r(function(){return arguments}());t.exports=function(t){var e,n,a;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=function(t,e){try{return t[e]}catch(t){}}(e=Object(t),i))?n:o?r(e):"Object"==(a=r(e))&&"function"==typeof e.callee?"Arguments":a}},function(t,e,n){var r=n(0),i=n(24),o=n(3),a=n(88),s="["+a+"]",c=RegExp("^"+s+s+"*"),u=RegExp(s+s+"*$"),f=function(t,e,n){var i={},s=o((function(){return!!a[t]()||"â€‹Â…"!="â€‹Â…"[t]()})),c=i[t]=s?e(l):a[t];n&&(i[n]=c),r(r.P+r.F*s,"String",i)},l=f.trim=function(t,e){return t=String(i(t)),1&e&&(t=t.replace(c,"")),2&e&&(t=t.replace(u,"")),t};t.exports=f},function(t,e){t.exports={}},function(t,e,n){var r=n(18),i=n(2),o=i["__core-js_shared__"]||(i["__core-js_shared__"]={});(t.exports=function(t,e){return o[t]||(o[t]=void 0!==e?e:{})})("versions",[]).push({version:r.version,mode:n(29)?"pure":"global",copyright:"Â© 2019 Denis Pushkarev (zloirock.ru)"})},function(t,e,n){var r=n(20);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},function(t,e){e.f={}.propertyIsEnumerable},function(t,e,n){"use strict";var r=n(1);t.exports=function(){var t=r(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}},function(t,e,n){var r=n(1),i=n(10),o=n(5)("species");t.exports=function(t,e){var n,a=r(t).constructor;return void 0===a||null==(n=r(a)[o])?e:i(n)}},function(t,e,n){"use strict";(function(t){n.d(e,"b",(function(){return b}));var r=("undefined"!=typeof window?window:void 0!==t?t:{}).__VUE_DEVTOOLS_GLOBAL_HOOK__;function i(t,e){Object.keys(t).forEach((function(n){return e(t[n],n)}))}function o(t){return null!==t&&"object"==typeof t}var a=function(t,e){this.runtime=e,this._children=Object.create(null),this._rawModule=t;var n=t.state;this.state=("function"==typeof n?n():n)||{}},s={namespaced:{configurable:!0}};s.namespaced.get=function(){return!!this._rawModule.namespaced},a.prototype.addChild=function(t,e){this._children[t]=e},a.prototype.removeChild=function(t){delete this._children[t]},a.prototype.getChild=function(t){return this._children[t]},a.prototype.update=function(t){this._rawModule.namespaced=t.namespaced,t.actions&&(this._rawModule.actions=t.actions),t.mutations&&(this._rawModule.mutations=t.mutations),t.getters&&(this._rawModule.getters=t.getters)},a.prototype.forEachChild=function(t){i(this._children,t)},a.prototype.forEachGetter=function(t){this._rawModule.getters&&i(this._rawModule.getters,t)},a.prototype.forEachAction=function(t){this._rawModule.actions&&i(this._rawModule.actions,t)},a.prototype.forEachMutation=function(t){this._rawModule.mutations&&i(this._rawModule.mutations,t)},Object.defineProperties(a.prototype,s);var c=function(t){this.register([],t,!1)};c.prototype.get=function(t){return t.reduce((function(t,e){return t.getChild(e)}),this.root)},c.prototype.getNamespace=function(t){var e=this.root;return t.reduce((function(t,n){return t+((e=e.getChild(n)).namespaced?n+"/":"")}),"")},c.prototype.update=function(t){!function t(e,n,r){0;if(n.update(r),r.modules)for(var i in r.modules){if(!n.getChild(i))return void 0;t(e.concat(i),n.getChild(i),r.modules[i])}}([],this.root,t)},c.prototype.register=function(t,e,n){var r=this;void 0===n&&(n=!0);var o=new a(e,n);0===t.length?this.root=o:this.get(t.slice(0,-1)).addChild(t[t.length-1],o);e.modules&&i(e.modules,(function(e,i){r.register(t.concat(i),e,n)}))},c.prototype.unregister=function(t){var e=this.get(t.slice(0,-1)),n=t[t.length-1];e.getChild(n).runtime&&e.removeChild(n)};var u;var f=function(t){var e=this;void 0===t&&(t={}),!u&&"undefined"!=typeof window&&window.Vue&&y(window.Vue);var n=t.plugins;void 0===n&&(n=[]);var i=t.strict;void 0===i&&(i=!1),this._committing=!1,this._actions=Object.create(null),this._actionSubscribers=[],this._mutations=Object.create(null),this._wrappedGetters=Object.create(null),this._modules=new c(t),this._modulesNamespaceMap=Object.create(null),this._subscribers=[],this._watcherVM=new u,this._makeLocalGettersCache=Object.create(null);var o=this,a=this.dispatch,s=this.commit;this.dispatch=function(t,e){return a.call(o,t,e)},this.commit=function(t,e,n){return s.call(o,t,e,n)},this.strict=i;var f=this._modules.root.state;h(this,f,[],this._modules.root),v(this,f),n.forEach((function(t){return t(e)})),(void 0!==t.devtools?t.devtools:u.config.devtools)&&function(t){r&&(t._devtoolHook=r,r.emit("vuex:init",t),r.on("vuex:travel-to-state",(function(e){t.replaceState(e)})),t.subscribe((function(t,e){r.emit("vuex:mutation",t,e)})))}(this)},l={state:{configurable:!0}};function d(t,e){return e.indexOf(t)<0&&e.push(t),function(){var n=e.indexOf(t);n>-1&&e.splice(n,1)}}function p(t,e){t._actions=Object.create(null),t._mutations=Object.create(null),t._wrappedGetters=Object.create(null),t._modulesNamespaceMap=Object.create(null);var n=t.state;h(t,n,[],t._modules.root,!0),v(t,n,e)}function v(t,e,n){var r=t._vm;t.getters={},t._makeLocalGettersCache=Object.create(null);var o=t._wrappedGetters,a={};i(o,(function(e,n){a[n]=function(t,e){return function(){return t(e)}}(e,t),Object.defineProperty(t.getters,n,{get:function(){return t._vm[n]},enumerable:!0})}));var s=u.config.silent;u.config.silent=!0,t._vm=new u({data:{$$state:e},computed:a}),u.config.silent=s,t.strict&&function(t){t._vm.$watch((function(){return this._data.$$state}),(function(){0}),{deep:!0,sync:!0})}(t),r&&(n&&t._withCommit((function(){r._data.$$state=null})),u.nextTick((function(){return r.$destroy()})))}function h(t,e,n,r,i){var o=!n.length,a=t._modules.getNamespace(n);if(r.namespaced&&(t._modulesNamespaceMap[a],t._modulesNamespaceMap[a]=r),!o&&!i){var s=m(e,n.slice(0,-1)),c=n[n.length-1];t._withCommit((function(){u.set(s,c,r.state)}))}var f=r.context=function(t,e,n){var r=""===e,i={dispatch:r?t.dispatch:function(n,r,i){var o=g(n,r,i),a=o.payload,s=o.options,c=o.type;return s&&s.root||(c=e+c),t.dispatch(c,a)},commit:r?t.commit:function(n,r,i){var o=g(n,r,i),a=o.payload,s=o.options,c=o.type;s&&s.root||(c=e+c),t.commit(c,a,s)}};return Object.defineProperties(i,{getters:{get:r?function(){return t.getters}:function(){return function(t,e){if(!t._makeLocalGettersCache[e]){var n={},r=e.length;Object.keys(t.getters).forEach((function(i){if(i.slice(0,r)===e){var o=i.slice(r);Object.defineProperty(n,o,{get:function(){return t.getters[i]},enumerable:!0})}})),t._makeLocalGettersCache[e]=n}return t._makeLocalGettersCache[e]}(t,e)}},state:{get:function(){return m(t.state,n)}}}),i}(t,a,n);r.forEachMutation((function(e,n){!function(t,e,n,r){(t._mutations[e]||(t._mutations[e]=[])).push((function(e){n.call(t,r.state,e)}))}(t,a+n,e,f)})),r.forEachAction((function(e,n){var r=e.root?n:a+n,i=e.handler||e;!function(t,e,n,r){(t._actions[e]||(t._actions[e]=[])).push((function(e){var i,o=n.call(t,{dispatch:r.dispatch,commit:r.commit,getters:r.getters,state:r.state,rootGetters:t.getters,rootState:t.state},e);return(i=o)&&"function"==typeof i.then||(o=Promise.resolve(o)),t._devtoolHook?o.catch((function(e){throw t._devtoolHook.emit("vuex:error",e),e})):o}))}(t,r,i,f)})),r.forEachGetter((function(e,n){!function(t,e,n,r){if(t._wrappedGetters[e])return void 0;t._wrappedGetters[e]=function(t){return n(r.state,r.getters,t.state,t.getters)}}(t,a+n,e,f)})),r.forEachChild((function(r,o){h(t,e,n.concat(o),r,i)}))}function m(t,e){return e.reduce((function(t,e){return t[e]}),t)}function g(t,e,n){return o(t)&&t.type&&(n=e,e=t,t=t.type),{type:t,payload:e,options:n}}function y(t){u&&t===u||
/**
 * vuex v3.1.3
 * (c) 2020 Evan You
 * @license MIT
 */
function(t){if(Number(t.version.split(".")[0])>=2)t.mixin({beforeCreate:n});else{var e=t.prototype._init;t.prototype._init=function(t){void 0===t&&(t={}),t.init=t.init?[n].concat(t.init):n,e.call(this,t)}}function n(){var t=this.$options;t.store?this.$store="function"==typeof t.store?t.store():t.store:t.parent&&t.parent.$store&&(this.$store=t.parent.$store)}}(u=t)}l.state.get=function(){return this._vm._data.$$state},l.state.set=function(t){0},f.prototype.commit=function(t,e,n){var r=this,i=g(t,e,n),o=i.type,a=i.payload,s=(i.options,{type:o,payload:a}),c=this._mutations[o];c&&(this._withCommit((function(){c.forEach((function(t){t(a)}))})),this._subscribers.slice().forEach((function(t){return t(s,r.state)})))},f.prototype.dispatch=function(t,e){var n=this,r=g(t,e),i=r.type,o=r.payload,a={type:i,payload:o},s=this._actions[i];if(s){try{this._actionSubscribers.slice().filter((function(t){return t.before})).forEach((function(t){return t.before(a,n.state)}))}catch(t){0}return(s.length>1?Promise.all(s.map((function(t){return t(o)}))):s[0](o)).then((function(t){try{n._actionSubscribers.filter((function(t){return t.after})).forEach((function(t){return t.after(a,n.state)}))}catch(t){0}return t}))}},f.prototype.subscribe=function(t){return d(t,this._subscribers)},f.prototype.subscribeAction=function(t){return d("function"==typeof t?{before:t}:t,this._actionSubscribers)},f.prototype.watch=function(t,e,n){var r=this;return this._watcherVM.$watch((function(){return t(r.state,r.getters)}),e,n)},f.prototype.replaceState=function(t){var e=this;this._withCommit((function(){e._vm._data.$$state=t}))},f.prototype.registerModule=function(t,e,n){void 0===n&&(n={}),"string"==typeof t&&(t=[t]),this._modules.register(t,e),h(this,this.state,t,this._modules.get(t),n.preserveState),v(this,this.state)},f.prototype.unregisterModule=function(t){var e=this;"string"==typeof t&&(t=[t]),this._modules.unregister(t),this._withCommit((function(){var n=m(e.state,t.slice(0,-1));u.delete(n,t[t.length-1])})),p(this)},f.prototype.hotUpdate=function(t){this._modules.update(t),p(this,!0)},f.prototype._withCommit=function(t){var e=this._committing;this._committing=!0,t(),this._committing=e},Object.defineProperties(f.prototype,l);var b=O((function(t,e){var n={};return S(e).forEach((function(e){var r=e.key,i=e.val;n[r]=function(){var e=this.$store.state,n=this.$store.getters;if(t){var r=M(this.$store,"mapState",t);if(!r)return;e=r.context.state,n=r.context.getters}return"function"==typeof i?i.call(this,e,n):e[i]},n[r].vuex=!0})),n})),_=O((function(t,e){var n={};return S(e).forEach((function(e){var r=e.key,i=e.val;n[r]=function(){for(var e=[],n=arguments.length;n--;)e[n]=arguments[n];var r=this.$store.commit;if(t){var o=M(this.$store,"mapMutations",t);if(!o)return;r=o.context.commit}return"function"==typeof i?i.apply(this,[r].concat(e)):r.apply(this.$store,[i].concat(e))}})),n})),w=O((function(t,e){var n={};return S(e).forEach((function(e){var r=e.key,i=e.val;i=t+i,n[r]=function(){if(!t||M(this.$store,"mapGetters",t))return this.$store.getters[i]},n[r].vuex=!0})),n})),x=O((function(t,e){var n={};return S(e).forEach((function(e){var r=e.key,i=e.val;n[r]=function(){for(var e=[],n=arguments.length;n--;)e[n]=arguments[n];var r=this.$store.dispatch;if(t){var o=M(this.$store,"mapActions",t);if(!o)return;r=o.context.dispatch}return"function"==typeof i?i.apply(this,[r].concat(e)):r.apply(this.$store,[i].concat(e))}})),n}));function S(t){return function(t){return Array.isArray(t)||o(t)}(t)?Array.isArray(t)?t.map((function(t){return{key:t,val:t}})):Object.keys(t).map((function(e){return{key:e,val:t[e]}})):[]}function O(t){return function(e,n){return"string"!=typeof e?(n=e,e=""):"/"!==e.charAt(e.length-1)&&(e+="/"),t(e,n)}}function M(t,e,n){return t._modulesNamespaceMap[n]}var A={Store:f,install:y,version:"3.1.3",mapState:b,mapMutations:_,mapGetters:w,mapActions:x,createNamespacedHelpers:function(t){return{mapState:b.bind(null,t),mapGetters:w.bind(null,t),mapMutations:_.bind(null,t),mapActions:x.bind(null,t)}}};e.a=A}).call(this,n(35))},function(t,e,n){var r=n(15),i=n(6),o=n(39);t.exports=function(t){return function(e,n,a){var s,c=r(e),u=i(c.length),f=o(a,u);if(t&&n!=n){for(;u>f;)if((s=c[f++])!=s)return!0}else for(;u>f;f++)if((t||f in c)&&c[f]===n)return t||f||0;return!t&&-1}}},function(t,e){e.f=Object.getOwnPropertySymbols},function(t,e,n){var r=n(20);t.exports=Array.isArray||function(t){return"Array"==r(t)}},function(t,e,n){var r=n(21),i=n(24);t.exports=function(t){return function(e,n){var o,a,s=String(i(e)),c=r(n),u=s.length;return c<0||c>=u?t?"":void 0:(o=s.charCodeAt(c))<55296||o>56319||c+1===u||(a=s.charCodeAt(c+1))<56320||a>57343?t?s.charAt(c):o:t?s.slice(c,c+2):a-56320+(o-55296<<10)+65536}}},function(t,e,n){var r=n(4),i=n(20),o=n(5)("match");t.exports=function(t){var e;return r(t)&&(void 0!==(e=t[o])?!!e:"RegExp"==i(t))}},function(t,e,n){var r=n(5)("iterator"),i=!1;try{var o=[7][r]();o.return=function(){i=!0},Array.from(o,(function(){throw 2}))}catch(t){}t.exports=function(t,e){if(!e&&!i)return!1;var n=!1;try{var o=[7],a=o[r]();a.next=function(){return{done:n=!0}},o[r]=function(){return a},t(o)}catch(t){}return n}},function(t,e,n){"use strict";var r=n(48),i=RegExp.prototype.exec;t.exports=function(t,e){var n=t.exec;if("function"==typeof n){var o=n.call(t,e);if("object"!=typeof o)throw new TypeError("RegExp exec method returned something other than an Object or null");return o}if("RegExp"!==r(t))throw new TypeError("RegExp#exec called on incompatible receiver");return i.call(t,e)}},function(t,e,n){"use strict";n(128);var r=n(12),i=n(11),o=n(3),a=n(24),s=n(5),c=n(103),u=s("species"),f=!o((function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")})),l=function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var n="ab".split(t);return 2===n.length&&"a"===n[0]&&"b"===n[1]}();t.exports=function(t,e,n){var d=s(t),p=!o((function(){var e={};return e[d]=function(){return 7},7!=""[t](e)})),v=p?!o((function(){var e=!1,n=/a/;return n.exec=function(){return e=!0,null},"split"===t&&(n.constructor={},n.constructor[u]=function(){return n}),n[d](""),!e})):void 0;if(!p||!v||"replace"===t&&!f||"split"===t&&!l){var h=/./[d],m=n(a,d,""[t],(function(t,e,n,r,i){return e.exec===c?p&&!i?{done:!0,value:h.call(e,n,r)}:{done:!0,value:t.call(n,e,r)}:{done:!1}})),g=m[0],y=m[1];r(String.prototype,t,g),i(RegExp.prototype,d,2==e?function(t,e){return y.call(t,this,e)}:function(t){return y.call(t,this)})}}},function(t,e,n){var r=n(2).navigator;t.exports=r&&r.userAgent||""},function(t,e,n){"use strict";var r=n(2),i=n(0),o=n(12),a=n(45),s=n(30),c=n(44),u=n(43),f=n(4),l=n(3),d=n(62),p=n(47),v=n(89);t.exports=function(t,e,n,h,m,g){var y=r[t],b=y,_=m?"set":"add",w=b&&b.prototype,x={},S=function(t){var e=w[t];o(w,t,"delete"==t?function(t){return!(g&&!f(t))&&e.call(this,0===t?0:t)}:"has"==t?function(t){return!(g&&!f(t))&&e.call(this,0===t?0:t)}:"get"==t?function(t){return g&&!f(t)?void 0:e.call(this,0===t?0:t)}:"add"==t?function(t){return e.call(this,0===t?0:t),this}:function(t,n){return e.call(this,0===t?0:t,n),this})};if("function"==typeof b&&(g||w.forEach&&!l((function(){(new b).entries().next()})))){var O=new b,M=O[_](g?{}:-0,1)!=O,A=l((function(){O.has(1)})),k=d((function(t){new b(t)})),C=!g&&l((function(){for(var t=new b,e=5;e--;)t[_](e,e);return!t.has(-0)}));k||((b=e((function(e,n){u(e,b,t);var r=v(new y,e,b);return null!=n&&c(n,m,r[_],r),r}))).prototype=w,w.constructor=b),(A||C)&&(S("delete"),S("has"),m&&S("get")),(C||M)&&S(_),g&&w.clear&&delete w.clear}else b=h.getConstructor(e,t,m,_),a(b.prototype,n),s.NEED=!0;return p(b,t),x[t]=b,i(i.G+i.W+i.F*(b!=y),x),g||h.setStrong(b,t,m),b}},function(t,e,n){for(var r,i=n(2),o=n(11),a=n(37),s=a("typed_array"),c=a("view"),u=!(!i.ArrayBuffer||!i.DataView),f=u,l=0,d="Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array".split(",");l<9;)(r=i[d[l++]])?(o(r.prototype,s,!0),o(r.prototype,c,!0)):f=!1;t.exports={ABV:u,CONSTR:f,TYPED:s,VIEW:c}},function(t,e,n){"use strict";t.exports=n(29)||!n(3)((function(){var t=Math.random();__defineSetter__.call(null,t,(function(){})),delete n(2)[t]}))},function(t,e,n){"use strict";var r=n(0);t.exports=function(t){r(r.S,t,{of:function(){for(var t=arguments.length,e=new Array(t);t--;)e[t]=arguments[t];return new this(e)}})}},function(t,e,n){"use strict";var r=n(0),i=n(10),o=n(19),a=n(44);t.exports=function(t){r(r.S,t,{from:function(t){var e,n,r,s,c=arguments[1];return i(this),(e=void 0!==c)&&i(c),null==t?new this:(n=[],e?(r=0,s=o(c,arguments[2],2),a(t,!1,(function(t){n.push(s(t,r++))}))):a(t,!1,n.push,n),new this(n))}})}},function(t,e,n){var r=n(353);"string"==typeof r&&(r=[[t.i,r,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n(34)(r,i);r.locals&&(t.exports=r.locals)},function(t,e,n){var r=n(356);"string"==typeof r&&(r=[[t.i,r,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n(34)(r,i);r.locals&&(t.exports=r.locals)},function(t,e,n){var r=n(358);"string"==typeof r&&(r=[[t.i,r,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n(34)(r,i);r.locals&&(t.exports=r.locals)},function(t,e,n){var r=n(360);"string"==typeof r&&(r=[[t.i,r,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n(34)(r,i);r.locals&&(t.exports=r.locals)},function(t,e,n){var r=n(362);"string"==typeof r&&(r=[[t.i,r,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n(34)(r,i);r.locals&&(t.exports=r.locals)},function(t,e,n){var r=n(364);"string"==typeof r&&(r=[[t.i,r,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n(34)(r,i);r.locals&&(t.exports=r.locals)},function(t,e,n){var r=n(366);"string"==typeof r&&(r=[[t.i,r,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n(34)(r,i);r.locals&&(t.exports=r.locals)},function(t,e,n){var r=n(368);"string"==typeof r&&(r=[[t.i,r,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n(34)(r,i);r.locals&&(t.exports=r.locals)},function(t,e,n){t.exports=function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=90)}({17:function(t,e,n){"use strict";e.__esModule=!0,e.default=void 0;var r=n(18),i=function(){function t(){}return t.getFirstMatch=function(t,e){var n=e.match(t);return n&&n.length>0&&n[1]||""},t.getSecondMatch=function(t,e){var n=e.match(t);return n&&n.length>1&&n[2]||""},t.matchAndReturnConst=function(t,e,n){if(t.test(e))return n},t.getWindowsVersionName=function(t){switch(t){case"NT":return"NT";case"XP":return"XP";case"NT 5.0":return"2000";case"NT 5.1":return"XP";case"NT 5.2":return"2003";case"NT 6.0":return"Vista";case"NT 6.1":return"7";case"NT 6.2":return"8";case"NT 6.3":return"8.1";case"NT 10.0":return"10";default:return}},t.getMacOSVersionName=function(t){var e=t.split(".").splice(0,2).map((function(t){return parseInt(t,10)||0}));if(e.push(0),10===e[0])switch(e[1]){case 5:return"Leopard";case 6:return"Snow Leopard";case 7:return"Lion";case 8:return"Mountain Lion";case 9:return"Mavericks";case 10:return"Yosemite";case 11:return"El Capitan";case 12:return"Sierra";case 13:return"High Sierra";case 14:return"Mojave";case 15:return"Catalina";default:return}},t.getAndroidVersionName=function(t){var e=t.split(".").splice(0,2).map((function(t){return parseInt(t,10)||0}));if(e.push(0),!(1===e[0]&&e[1]<5))return 1===e[0]&&e[1]<6?"Cupcake":1===e[0]&&e[1]>=6?"Donut":2===e[0]&&e[1]<2?"Eclair":2===e[0]&&2===e[1]?"Froyo":2===e[0]&&e[1]>2?"Gingerbread":3===e[0]?"Honeycomb":4===e[0]&&e[1]<1?"Ice Cream Sandwich":4===e[0]&&e[1]<4?"Jelly Bean":4===e[0]&&e[1]>=4?"KitKat":5===e[0]?"Lollipop":6===e[0]?"Marshmallow":7===e[0]?"Nougat":8===e[0]?"Oreo":9===e[0]?"Pie":void 0},t.getVersionPrecision=function(t){return t.split(".").length},t.compareVersions=function(e,n,r){void 0===r&&(r=!1);var i=t.getVersionPrecision(e),o=t.getVersionPrecision(n),a=Math.max(i,o),s=0,c=t.map([e,n],(function(e){var n=a-t.getVersionPrecision(e),r=e+new Array(n+1).join(".0");return t.map(r.split("."),(function(t){return new Array(20-t.length).join("0")+t})).reverse()}));for(r&&(s=a-Math.min(i,o)),a-=1;a>=s;){if(c[0][a]>c[1][a])return 1;if(c[0][a]===c[1][a]){if(a===s)return 0;a-=1}else if(c[0][a]<c[1][a])return-1}},t.map=function(t,e){var n,r=[];if(Array.prototype.map)return Array.prototype.map.call(t,e);for(n=0;n<t.length;n+=1)r.push(e(t[n]));return r},t.find=function(t,e){var n,r;if(Array.prototype.find)return Array.prototype.find.call(t,e);for(n=0,r=t.length;n<r;n+=1){var i=t[n];if(e(i,n))return i}},t.assign=function(t){for(var e,n,r=t,i=arguments.length,o=new Array(i>1?i-1:0),a=1;a<i;a++)o[a-1]=arguments[a];if(Object.assign)return Object.assign.apply(Object,[t].concat(o));var s=function(){var t=o[e];"object"==typeof t&&null!==t&&Object.keys(t).forEach((function(e){r[e]=t[e]}))};for(e=0,n=o.length;e<n;e+=1)s();return t},t.getBrowserAlias=function(t){return r.BROWSER_ALIASES_MAP[t]},t.getBrowserTypeByAlias=function(t){return r.BROWSER_MAP[t]||""},t}();e.default=i,t.exports=e.default},18:function(t,e,n){"use strict";e.__esModule=!0,e.ENGINE_MAP=e.OS_MAP=e.PLATFORMS_MAP=e.BROWSER_MAP=e.BROWSER_ALIASES_MAP=void 0,e.BROWSER_ALIASES_MAP={"Amazon Silk":"amazon_silk","Android Browser":"android",Bada:"bada",BlackBerry:"blackberry",Chrome:"chrome",Chromium:"chromium",Electron:"electron",Epiphany:"epiphany",Firefox:"firefox",Focus:"focus",Generic:"generic","Google Search":"google_search",Googlebot:"googlebot","Internet Explorer":"ie","K-Meleon":"k_meleon",Maxthon:"maxthon","Microsoft Edge":"edge","MZ Browser":"mz","NAVER Whale Browser":"naver",Opera:"opera","Opera Coast":"opera_coast",PhantomJS:"phantomjs",Puffin:"puffin",QupZilla:"qupzilla",QQ:"qq",QQLite:"qqlite",Safari:"safari",Sailfish:"sailfish","Samsung Internet for Android":"samsung_internet",SeaMonkey:"seamonkey",Sleipnir:"sleipnir",Swing:"swing",Tizen:"tizen","UC Browser":"uc",Vivaldi:"vivaldi","WebOS Browser":"webos",WeChat:"wechat","Yandex Browser":"yandex",Roku:"roku"},e.BROWSER_MAP={amazon_silk:"Amazon Silk",android:"Android Browser",bada:"Bada",blackberry:"BlackBerry",chrome:"Chrome",chromium:"Chromium",electron:"Electron",epiphany:"Epiphany",firefox:"Firefox",focus:"Focus",generic:"Generic",googlebot:"Googlebot",google_search:"Google Search",ie:"Internet Explorer",k_meleon:"K-Meleon",maxthon:"Maxthon",edge:"Microsoft Edge",mz:"MZ Browser",naver:"NAVER Whale Browser",opera:"Opera",opera_coast:"Opera Coast",phantomjs:"PhantomJS",puffin:"Puffin",qupzilla:"QupZilla",qq:"QQ Browser",qqlite:"QQ Browser Lite",safari:"Safari",sailfish:"Sailfish",samsung_internet:"Samsung Internet for Android",seamonkey:"SeaMonkey",sleipnir:"Sleipnir",swing:"Swing",tizen:"Tizen",uc:"UC Browser",vivaldi:"Vivaldi",webos:"WebOS Browser",wechat:"WeChat",yandex:"Yandex Browser"},e.PLATFORMS_MAP={tablet:"tablet",mobile:"mobile",desktop:"desktop",tv:"tv"},e.OS_MAP={WindowsPhone:"Windows Phone",Windows:"Windows",MacOS:"macOS",iOS:"iOS",Android:"Android",WebOS:"WebOS",BlackBerry:"BlackBerry",Bada:"Bada",Tizen:"Tizen",Linux:"Linux",ChromeOS:"Chrome OS",PlayStation4:"PlayStation 4",Roku:"Roku"},e.ENGINE_MAP={EdgeHTML:"EdgeHTML",Blink:"Blink",Trident:"Trident",Presto:"Presto",Gecko:"Gecko",WebKit:"WebKit"}},90:function(t,e,n){"use strict";e.__esModule=!0,e.default=void 0;var r,i=(r=n(91))&&r.__esModule?r:{default:r},o=n(18);function a(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var s=function(){function t(){}var e,n;return t.getParser=function(t,e){if(void 0===e&&(e=!1),"string"!=typeof t)throw new Error("UserAgent should be a string");return new i.default(t,e)},t.parse=function(t){return new i.default(t).getResult()},e=t,(n=[{key:"BROWSER_MAP",get:function(){return o.BROWSER_MAP}},{key:"ENGINE_MAP",get:function(){return o.ENGINE_MAP}},{key:"OS_MAP",get:function(){return o.OS_MAP}},{key:"PLATFORMS_MAP",get:function(){return o.PLATFORMS_MAP}}])&&a(e,n),t}();e.default=s,t.exports=e.default},91:function(t,e,n){"use strict";e.__esModule=!0,e.default=void 0;var r=c(n(92)),i=c(n(93)),o=c(n(94)),a=c(n(95)),s=c(n(17));function c(t){return t&&t.__esModule?t:{default:t}}var u=function(){function t(t,e){if(void 0===e&&(e=!1),null==t||""===t)throw new Error("UserAgent parameter can't be empty");this._ua=t,this.parsedResult={},!0!==e&&this.parse()}var e=t.prototype;return e.getUA=function(){return this._ua},e.test=function(t){return t.test(this._ua)},e.parseBrowser=function(){var t=this;this.parsedResult.browser={};var e=s.default.find(r.default,(function(e){if("function"==typeof e.test)return e.test(t);if(e.test instanceof Array)return e.test.some((function(e){return t.test(e)}));throw new Error("Browser's test function is not valid")}));return e&&(this.parsedResult.browser=e.describe(this.getUA())),this.parsedResult.browser},e.getBrowser=function(){return this.parsedResult.browser?this.parsedResult.browser:this.parseBrowser()},e.getBrowserName=function(t){return t?String(this.getBrowser().name).toLowerCase()||"":this.getBrowser().name||""},e.getBrowserVersion=function(){return this.getBrowser().version},e.getOS=function(){return this.parsedResult.os?this.parsedResult.os:this.parseOS()},e.parseOS=function(){var t=this;this.parsedResult.os={};var e=s.default.find(i.default,(function(e){if("function"==typeof e.test)return e.test(t);if(e.test instanceof Array)return e.test.some((function(e){return t.test(e)}));throw new Error("Browser's test function is not valid")}));return e&&(this.parsedResult.os=e.describe(this.getUA())),this.parsedResult.os},e.getOSName=function(t){var e=this.getOS().name;return t?String(e).toLowerCase()||"":e||""},e.getOSVersion=function(){return this.getOS().version},e.getPlatform=function(){return this.parsedResult.platform?this.parsedResult.platform:this.parsePlatform()},e.getPlatformType=function(t){void 0===t&&(t=!1);var e=this.getPlatform().type;return t?String(e).toLowerCase()||"":e||""},e.parsePlatform=function(){var t=this;this.parsedResult.platform={};var e=s.default.find(o.default,(function(e){if("function"==typeof e.test)return e.test(t);if(e.test instanceof Array)return e.test.some((function(e){return t.test(e)}));throw new Error("Browser's test function is not valid")}));return e&&(this.parsedResult.platform=e.describe(this.getUA())),this.parsedResult.platform},e.getEngine=function(){return this.parsedResult.engine?this.parsedResult.engine:this.parseEngine()},e.getEngineName=function(t){return t?String(this.getEngine().name).toLowerCase()||"":this.getEngine().name||""},e.parseEngine=function(){var t=this;this.parsedResult.engine={};var e=s.default.find(a.default,(function(e){if("function"==typeof e.test)return e.test(t);if(e.test instanceof Array)return e.test.some((function(e){return t.test(e)}));throw new Error("Browser's test function is not valid")}));return e&&(this.parsedResult.engine=e.describe(this.getUA())),this.parsedResult.engine},e.parse=function(){return this.parseBrowser(),this.parseOS(),this.parsePlatform(),this.parseEngine(),this},e.getResult=function(){return s.default.assign({},this.parsedResult)},e.satisfies=function(t){var e=this,n={},r=0,i={},o=0;if(Object.keys(t).forEach((function(e){var a=t[e];"string"==typeof a?(i[e]=a,o+=1):"object"==typeof a&&(n[e]=a,r+=1)})),r>0){var a=Object.keys(n),c=s.default.find(a,(function(t){return e.isOS(t)}));if(c){var u=this.satisfies(n[c]);if(void 0!==u)return u}var f=s.default.find(a,(function(t){return e.isPlatform(t)}));if(f){var l=this.satisfies(n[f]);if(void 0!==l)return l}}if(o>0){var d=Object.keys(i),p=s.default.find(d,(function(t){return e.isBrowser(t,!0)}));if(void 0!==p)return this.compareVersion(i[p])}},e.isBrowser=function(t,e){void 0===e&&(e=!1);var n=this.getBrowserName().toLowerCase(),r=t.toLowerCase(),i=s.default.getBrowserTypeByAlias(r);return e&&i&&(r=i.toLowerCase()),r===n},e.compareVersion=function(t){var e=[0],n=t,r=!1,i=this.getBrowserVersion();if("string"==typeof i)return">"===t[0]||"<"===t[0]?(n=t.substr(1),"="===t[1]?(r=!0,n=t.substr(2)):e=[],">"===t[0]?e.push(1):e.push(-1)):"="===t[0]?n=t.substr(1):"~"===t[0]&&(r=!0,n=t.substr(1)),e.indexOf(s.default.compareVersions(i,n,r))>-1},e.isOS=function(t){return this.getOSName(!0)===String(t).toLowerCase()},e.isPlatform=function(t){return this.getPlatformType(!0)===String(t).toLowerCase()},e.isEngine=function(t){return this.getEngineName(!0)===String(t).toLowerCase()},e.is=function(t){return this.isBrowser(t)||this.isOS(t)||this.isPlatform(t)},e.some=function(t){var e=this;return void 0===t&&(t=[]),t.some((function(t){return e.is(t)}))},t}();e.default=u,t.exports=e.default},92:function(t,e,n){"use strict";e.__esModule=!0,e.default=void 0;var r,i=(r=n(17))&&r.__esModule?r:{default:r},o=/version\/(\d+(\.?_?\d+)+)/i,a=[{test:[/googlebot/i],describe:function(t){var e={name:"Googlebot"},n=i.default.getFirstMatch(/googlebot\/(\d+(\.\d+))/i,t)||i.default.getFirstMatch(o,t);return n&&(e.version=n),e}},{test:[/opera/i],describe:function(t){var e={name:"Opera"},n=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/opr\/|opios/i],describe:function(t){var e={name:"Opera"},n=i.default.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i,t)||i.default.getFirstMatch(o,t);return n&&(e.version=n),e}},{test:[/SamsungBrowser/i],describe:function(t){var e={name:"Samsung Internet for Android"},n=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/Whale/i],describe:function(t){var e={name:"NAVER Whale Browser"},n=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/MZBrowser/i],describe:function(t){var e={name:"MZ Browser"},n=i.default.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i,t)||i.default.getFirstMatch(o,t);return n&&(e.version=n),e}},{test:[/focus/i],describe:function(t){var e={name:"Focus"},n=i.default.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i,t)||i.default.getFirstMatch(o,t);return n&&(e.version=n),e}},{test:[/swing/i],describe:function(t){var e={name:"Swing"},n=i.default.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i,t)||i.default.getFirstMatch(o,t);return n&&(e.version=n),e}},{test:[/coast/i],describe:function(t){var e={name:"Opera Coast"},n=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/yabrowser/i],describe:function(t){var e={name:"Yandex Browser"},n=i.default.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i,t)||i.default.getFirstMatch(o,t);return n&&(e.version=n),e}},{test:[/ucbrowser/i],describe:function(t){var e={name:"UC Browser"},n=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/Maxthon|mxios/i],describe:function(t){var e={name:"Maxthon"},n=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/epiphany/i],describe:function(t){var e={name:"Epiphany"},n=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/puffin/i],describe:function(t){var e={name:"Puffin"},n=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/sleipnir/i],describe:function(t){var e={name:"Sleipnir"},n=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/k-meleon/i],describe:function(t){var e={name:"K-Meleon"},n=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/micromessenger/i],describe:function(t){var e={name:"WeChat"},n=i.default.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i,t)||i.default.getFirstMatch(o,t);return n&&(e.version=n),e}},{test:[/qqbrowser/i],describe:function(t){var e={name:/qqbrowserlite/i.test(t)?"QQ Browser Lite":"QQ Browser"},n=i.default.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i,t)||i.default.getFirstMatch(o,t);return n&&(e.version=n),e}},{test:[/msie|trident/i],describe:function(t){var e={name:"Internet Explorer"},n=i.default.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/\sedg\//i],describe:function(t){var e={name:"Microsoft Edge"},n=i.default.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/edg([ea]|ios)/i],describe:function(t){var e={name:"Microsoft Edge"},n=i.default.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/vivaldi/i],describe:function(t){var e={name:"Vivaldi"},n=i.default.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/seamonkey/i],describe:function(t){var e={name:"SeaMonkey"},n=i.default.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/sailfish/i],describe:function(t){var e={name:"Sailfish"},n=i.default.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i,t);return n&&(e.version=n),e}},{test:[/silk/i],describe:function(t){var e={name:"Amazon Silk"},n=i.default.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/phantom/i],describe:function(t){var e={name:"PhantomJS"},n=i.default.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/slimerjs/i],describe:function(t){var e={name:"SlimerJS"},n=i.default.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/blackberry|\bbb\d+/i,/rim\stablet/i],describe:function(t){var e={name:"BlackBerry"},n=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/(web|hpw)[o0]s/i],describe:function(t){var e={name:"WebOS Browser"},n=i.default.getFirstMatch(o,t)||i.default.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/bada/i],describe:function(t){var e={name:"Bada"},n=i.default.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/tizen/i],describe:function(t){var e={name:"Tizen"},n=i.default.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i,t)||i.default.getFirstMatch(o,t);return n&&(e.version=n),e}},{test:[/qupzilla/i],describe:function(t){var e={name:"QupZilla"},n=i.default.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i,t)||i.default.getFirstMatch(o,t);return n&&(e.version=n),e}},{test:[/firefox|iceweasel|fxios/i],describe:function(t){var e={name:"Firefox"},n=i.default.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/electron/i],describe:function(t){var e={name:"Electron"},n=i.default.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/chromium/i],describe:function(t){var e={name:"Chromium"},n=i.default.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i,t)||i.default.getFirstMatch(o,t);return n&&(e.version=n),e}},{test:[/chrome|crios|crmo/i],describe:function(t){var e={name:"Chrome"},n=i.default.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/GSA/i],describe:function(t){var e={name:"Google Search"},n=i.default.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:function(t){var e=!t.test(/like android/i),n=t.test(/android/i);return e&&n},describe:function(t){var e={name:"Android Browser"},n=i.default.getFirstMatch(o,t);return n&&(e.version=n),e}},{test:[/playstation 4/i],describe:function(t){var e={name:"PlayStation 4"},n=i.default.getFirstMatch(o,t);return n&&(e.version=n),e}},{test:[/safari|applewebkit/i],describe:function(t){var e={name:"Safari"},n=i.default.getFirstMatch(o,t);return n&&(e.version=n),e}},{test:[/.*/i],describe:function(t){var e=-1!==t.search("\\(")?/^(.*)\/(.*)[ \t]\((.*)/:/^(.*)\/(.*) /;return{name:i.default.getFirstMatch(e,t),version:i.default.getSecondMatch(e,t)}}}];e.default=a,t.exports=e.default},93:function(t,e,n){"use strict";e.__esModule=!0,e.default=void 0;var r,i=(r=n(17))&&r.__esModule?r:{default:r},o=n(18),a=[{test:[/Roku\/DVP/],describe:function(t){var e=i.default.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i,t);return{name:o.OS_MAP.Roku,version:e}}},{test:[/windows phone/i],describe:function(t){var e=i.default.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i,t);return{name:o.OS_MAP.WindowsPhone,version:e}}},{test:[/windows /i],describe:function(t){var e=i.default.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i,t),n=i.default.getWindowsVersionName(e);return{name:o.OS_MAP.Windows,version:e,versionName:n}}},{test:[/Macintosh(.*?) FxiOS(.*?) Version\//],describe:function(t){var e=i.default.getSecondMatch(/(Version\/)(\d[\d.]+)/,t);return{name:o.OS_MAP.iOS,version:e}}},{test:[/macintosh/i],describe:function(t){var e=i.default.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i,t).replace(/[_\s]/g,"."),n=i.default.getMacOSVersionName(e),r={name:o.OS_MAP.MacOS,version:e};return n&&(r.versionName=n),r}},{test:[/(ipod|iphone|ipad)/i],describe:function(t){var e=i.default.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i,t).replace(/[_\s]/g,".");return{name:o.OS_MAP.iOS,version:e}}},{test:function(t){var e=!t.test(/like android/i),n=t.test(/android/i);return e&&n},describe:function(t){var e=i.default.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i,t),n=i.default.getAndroidVersionName(e),r={name:o.OS_MAP.Android,version:e};return n&&(r.versionName=n),r}},{test:[/(web|hpw)[o0]s/i],describe:function(t){var e=i.default.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i,t),n={name:o.OS_MAP.WebOS};return e&&e.length&&(n.version=e),n}},{test:[/blackberry|\bbb\d+/i,/rim\stablet/i],describe:function(t){var e=i.default.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i,t)||i.default.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i,t)||i.default.getFirstMatch(/\bbb(\d+)/i,t);return{name:o.OS_MAP.BlackBerry,version:e}}},{test:[/bada/i],describe:function(t){var e=i.default.getFirstMatch(/bada\/(\d+(\.\d+)*)/i,t);return{name:o.OS_MAP.Bada,version:e}}},{test:[/tizen/i],describe:function(t){var e=i.default.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i,t);return{name:o.OS_MAP.Tizen,version:e}}},{test:[/linux/i],describe:function(){return{name:o.OS_MAP.Linux}}},{test:[/CrOS/],describe:function(){return{name:o.OS_MAP.ChromeOS}}},{test:[/PlayStation 4/],describe:function(t){var e=i.default.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i,t);return{name:o.OS_MAP.PlayStation4,version:e}}}];e.default=a,t.exports=e.default},94:function(t,e,n){"use strict";e.__esModule=!0,e.default=void 0;var r,i=(r=n(17))&&r.__esModule?r:{default:r},o=n(18),a=[{test:[/googlebot/i],describe:function(){return{type:"bot",vendor:"Google"}}},{test:[/huawei/i],describe:function(t){var e=i.default.getFirstMatch(/(can-l01)/i,t)&&"Nova",n={type:o.PLATFORMS_MAP.mobile,vendor:"Huawei"};return e&&(n.model=e),n}},{test:[/nexus\s*(?:7|8|9|10).*/i],describe:function(){return{type:o.PLATFORMS_MAP.tablet,vendor:"Nexus"}}},{test:[/ipad/i],describe:function(){return{type:o.PLATFORMS_MAP.tablet,vendor:"Apple",model:"iPad"}}},{test:[/Macintosh(.*?) FxiOS(.*?) Version\//],describe:function(){return{type:o.PLATFORMS_MAP.tablet,vendor:"Apple",model:"iPad"}}},{test:[/kftt build/i],describe:function(){return{type:o.PLATFORMS_MAP.tablet,vendor:"Amazon",model:"Kindle Fire HD 7"}}},{test:[/silk/i],describe:function(){return{type:o.PLATFORMS_MAP.tablet,vendor:"Amazon"}}},{test:[/tablet(?! pc)/i],describe:function(){return{type:o.PLATFORMS_MAP.tablet}}},{test:function(t){var e=t.test(/ipod|iphone/i),n=t.test(/like (ipod|iphone)/i);return e&&!n},describe:function(t){var e=i.default.getFirstMatch(/(ipod|iphone)/i,t);return{type:o.PLATFORMS_MAP.mobile,vendor:"Apple",model:e}}},{test:[/nexus\s*[0-6].*/i,/galaxy nexus/i],describe:function(){return{type:o.PLATFORMS_MAP.mobile,vendor:"Nexus"}}},{test:[/[^-]mobi/i],describe:function(){return{type:o.PLATFORMS_MAP.mobile}}},{test:function(t){return"blackberry"===t.getBrowserName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.mobile,vendor:"BlackBerry"}}},{test:function(t){return"bada"===t.getBrowserName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.mobile}}},{test:function(t){return"windows phone"===t.getBrowserName()},describe:function(){return{type:o.PLATFORMS_MAP.mobile,vendor:"Microsoft"}}},{test:function(t){var e=Number(String(t.getOSVersion()).split(".")[0]);return"android"===t.getOSName(!0)&&e>=3},describe:function(){return{type:o.PLATFORMS_MAP.tablet}}},{test:function(t){return"android"===t.getOSName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.mobile}}},{test:function(t){return"macos"===t.getOSName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.desktop,vendor:"Apple"}}},{test:function(t){return"windows"===t.getOSName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.desktop}}},{test:function(t){return"linux"===t.getOSName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.desktop}}},{test:function(t){return"playstation 4"===t.getOSName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.tv}}},{test:function(t){return"roku"===t.getOSName(!0)},describe:function(){return{type:o.PLATFORMS_MAP.tv}}}];e.default=a,t.exports=e.default},95:function(t,e,n){"use strict";e.__esModule=!0,e.default=void 0;var r,i=(r=n(17))&&r.__esModule?r:{default:r},o=n(18),a=[{test:function(t){return"microsoft edge"===t.getBrowserName(!0)},describe:function(t){if(/\sedg\//i.test(t))return{name:o.ENGINE_MAP.Blink};var e=i.default.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i,t);return{name:o.ENGINE_MAP.EdgeHTML,version:e}}},{test:[/trident/i],describe:function(t){var e={name:o.ENGINE_MAP.Trident},n=i.default.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:function(t){return t.test(/presto/i)},describe:function(t){var e={name:o.ENGINE_MAP.Presto},n=i.default.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:function(t){var e=t.test(/gecko/i),n=t.test(/like gecko/i);return e&&!n},describe:function(t){var e={name:o.ENGINE_MAP.Gecko},n=i.default.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}},{test:[/(apple)?webkit\/537\.36/i],describe:function(){return{name:o.ENGINE_MAP.Blink}}},{test:[/(apple)?webkit/i],describe:function(t){var e={name:o.ENGINE_MAP.WebKit},n=i.default.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i,t);return n&&(e.version=n),e}}];e.default=a,t.exports=e.default}})},function(t,e,n){"use strict";(function(t,n){
/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
var r=Object.freeze({});function i(t){return null==t}function o(t){return null!=t}function a(t){return!0===t}function s(t){return"string"==typeof t||"number"==typeof t||"symbol"==typeof t||"boolean"==typeof t}function c(t){return null!==t&&"object"==typeof t}var u=Object.prototype.toString;function f(t){return"[object Object]"===u.call(t)}function l(t){return"[object RegExp]"===u.call(t)}function d(t){var e=parseFloat(String(t));return e>=0&&Math.floor(e)===e&&isFinite(t)}function p(t){return o(t)&&"function"==typeof t.then&&"function"==typeof t.catch}function v(t){return null==t?"":Array.isArray(t)||f(t)&&t.toString===u?JSON.stringify(t,null,2):String(t)}function h(t){var e=parseFloat(t);return isNaN(e)?t:e}function m(t,e){for(var n=Object.create(null),r=t.split(","),i=0;i<r.length;i++)n[r[i]]=!0;return e?function(t){return n[t.toLowerCase()]}:function(t){return n[t]}}var g=m("slot,component",!0),y=m("key,ref,slot,slot-scope,is");function b(t,e){if(t.length){var n=t.indexOf(e);if(n>-1)return t.splice(n,1)}}var _=Object.prototype.hasOwnProperty;function w(t,e){return _.call(t,e)}function x(t){var e=Object.create(null);return function(n){return e[n]||(e[n]=t(n))}}var S=/-(\w)/g,O=x((function(t){return t.replace(S,(function(t,e){return e?e.toUpperCase():""}))})),M=x((function(t){return t.charAt(0).toUpperCase()+t.slice(1)})),A=/\B([A-Z])/g,k=x((function(t){return t.replace(A,"-$1").toLowerCase()}));var C=Function.prototype.bind?function(t,e){return t.bind(e)}:function(t,e){function n(n){var r=arguments.length;return r?r>1?t.apply(e,arguments):t.call(e,n):t.call(e)}return n._length=t.length,n};function P(t,e){e=e||0;for(var n=t.length-e,r=new Array(n);n--;)r[n]=t[n+e];return r}function E(t,e){for(var n in e)t[n]=e[n];return t}function T(t){for(var e={},n=0;n<t.length;n++)t[n]&&E(e,t[n]);return e}function F(t,e,n){}var $=function(t,e,n){return!1},N=function(t){return t};function I(t,e){if(t===e)return!0;var n=c(t),r=c(e);if(!n||!r)return!n&&!r&&String(t)===String(e);try{var i=Array.isArray(t),o=Array.isArray(e);if(i&&o)return t.length===e.length&&t.every((function(t,n){return I(t,e[n])}));if(t instanceof Date&&e instanceof Date)return t.getTime()===e.getTime();if(i||o)return!1;var a=Object.keys(t),s=Object.keys(e);return a.length===s.length&&a.every((function(n){return I(t[n],e[n])}))}catch(t){return!1}}function j(t,e){for(var n=0;n<t.length;n++)if(I(t[n],e))return n;return-1}function R(t){var e=!1;return function(){e||(e=!0,t.apply(this,arguments))}}var L=["component","directive","filter"],D=["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed","activated","deactivated","errorCaptured","serverPrefetch"],B={optionMergeStrategies:Object.create(null),silent:!1,productionTip:!1,devtools:!1,performance:!1,errorHandler:null,warnHandler:null,ignoredElements:[],keyCodes:Object.create(null),isReservedTag:$,isReservedAttr:$,isUnknownElement:$,getTagNamespace:F,parsePlatformTagName:N,mustUseProp:$,async:!0,_lifecycleHooks:D},W=/a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;function G(t){var e=(t+"").charCodeAt(0);return 36===e||95===e}function U(t,e,n,r){Object.defineProperty(t,e,{value:n,enumerable:!!r,writable:!0,configurable:!0})}var z=new RegExp("[^"+W.source+".$_\\d]");var V,H="__proto__"in{},q="undefined"!=typeof window,K="undefined"!=typeof WXEnvironment&&!!WXEnvironment.platform,J=K&&WXEnvironment.platform.toLowerCase(),X=q&&window.navigator.userAgent.toLowerCase(),Y=X&&/msie|trident/.test(X),Q=X&&X.indexOf("msie 9.0")>0,Z=X&&X.indexOf("edge/")>0,tt=(X&&X.indexOf("android"),X&&/iphone|ipad|ipod|ios/.test(X)||"ios"===J),et=(X&&/chrome\/\d+/.test(X),X&&/phantomjs/.test(X),X&&X.match(/firefox\/(\d+)/)),nt={}.watch,rt=!1;if(q)try{var it={};Object.defineProperty(it,"passive",{get:function(){rt=!0}}),window.addEventListener("test-passive",null,it)}catch(t){}var ot=function(){return void 0===V&&(V=!q&&!K&&void 0!==t&&(t.process&&"server"===t.process.env.VUE_ENV)),V},at=q&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__;function st(t){return"function"==typeof t&&/native code/.test(t.toString())}var ct,ut="undefined"!=typeof Symbol&&st(Symbol)&&"undefined"!=typeof Reflect&&st(Reflect.ownKeys);ct="undefined"!=typeof Set&&st(Set)?Set:function(){function t(){this.set=Object.create(null)}return t.prototype.has=function(t){return!0===this.set[t]},t.prototype.add=function(t){this.set[t]=!0},t.prototype.clear=function(){this.set=Object.create(null)},t}();var ft=F,lt=0,dt=function(){this.id=lt++,this.subs=[]};dt.prototype.addSub=function(t){this.subs.push(t)},dt.prototype.removeSub=function(t){b(this.subs,t)},dt.prototype.depend=function(){dt.target&&dt.target.addDep(this)},dt.prototype.notify=function(){var t=this.subs.slice();for(var e=0,n=t.length;e<n;e++)t[e].update()},dt.target=null;var pt=[];function vt(t){pt.push(t),dt.target=t}function ht(){pt.pop(),dt.target=pt[pt.length-1]}var mt=function(t,e,n,r,i,o,a,s){this.tag=t,this.data=e,this.children=n,this.text=r,this.elm=i,this.ns=void 0,this.context=o,this.fnContext=void 0,this.fnOptions=void 0,this.fnScopeId=void 0,this.key=e&&e.key,this.componentOptions=a,this.componentInstance=void 0,this.parent=void 0,this.raw=!1,this.isStatic=!1,this.isRootInsert=!0,this.isComment=!1,this.isCloned=!1,this.isOnce=!1,this.asyncFactory=s,this.asyncMeta=void 0,this.isAsyncPlaceholder=!1},gt={child:{configurable:!0}};gt.child.get=function(){return this.componentInstance},Object.defineProperties(mt.prototype,gt);var yt=function(t){void 0===t&&(t="");var e=new mt;return e.text=t,e.isComment=!0,e};function bt(t){return new mt(void 0,void 0,void 0,String(t))}function _t(t){var e=new mt(t.tag,t.data,t.children&&t.children.slice(),t.text,t.elm,t.context,t.componentOptions,t.asyncFactory);return e.ns=t.ns,e.isStatic=t.isStatic,e.key=t.key,e.isComment=t.isComment,e.fnContext=t.fnContext,e.fnOptions=t.fnOptions,e.fnScopeId=t.fnScopeId,e.asyncMeta=t.asyncMeta,e.isCloned=!0,e}var wt=Array.prototype,xt=Object.create(wt);["push","pop","shift","unshift","splice","sort","reverse"].forEach((function(t){var e=wt[t];U(xt,t,(function(){for(var n=[],r=arguments.length;r--;)n[r]=arguments[r];var i,o=e.apply(this,n),a=this.__ob__;switch(t){case"push":case"unshift":i=n;break;case"splice":i=n.slice(2)}return i&&a.observeArray(i),a.dep.notify(),o}))}));var St=Object.getOwnPropertyNames(xt),Ot=!0;function Mt(t){Ot=t}var At=function(t){this.value=t,this.dep=new dt,this.vmCount=0,U(t,"__ob__",this),Array.isArray(t)?(H?function(t,e){t.__proto__=e}(t,xt):function(t,e,n){for(var r=0,i=n.length;r<i;r++){var o=n[r];U(t,o,e[o])}}(t,xt,St),this.observeArray(t)):this.walk(t)};function kt(t,e){var n;if(c(t)&&!(t instanceof mt))return w(t,"__ob__")&&t.__ob__ instanceof At?n=t.__ob__:Ot&&!ot()&&(Array.isArray(t)||f(t))&&Object.isExtensible(t)&&!t._isVue&&(n=new At(t)),e&&n&&n.vmCount++,n}function Ct(t,e,n,r,i){var o=new dt,a=Object.getOwnPropertyDescriptor(t,e);if(!a||!1!==a.configurable){var s=a&&a.get,c=a&&a.set;s&&!c||2!==arguments.length||(n=t[e]);var u=!i&&kt(n);Object.defineProperty(t,e,{enumerable:!0,configurable:!0,get:function(){var e=s?s.call(t):n;return dt.target&&(o.depend(),u&&(u.dep.depend(),Array.isArray(e)&&Tt(e))),e},set:function(e){var r=s?s.call(t):n;e===r||e!=e&&r!=r||s&&!c||(c?c.call(t,e):n=e,u=!i&&kt(e),o.notify())}})}}function Pt(t,e,n){if(Array.isArray(t)&&d(e))return t.length=Math.max(t.length,e),t.splice(e,1,n),n;if(e in t&&!(e in Object.prototype))return t[e]=n,n;var r=t.__ob__;return t._isVue||r&&r.vmCount?n:r?(Ct(r.value,e,n),r.dep.notify(),n):(t[e]=n,n)}function Et(t,e){if(Array.isArray(t)&&d(e))t.splice(e,1);else{var n=t.__ob__;t._isVue||n&&n.vmCount||w(t,e)&&(delete t[e],n&&n.dep.notify())}}function Tt(t){for(var e=void 0,n=0,r=t.length;n<r;n++)(e=t[n])&&e.__ob__&&e.__ob__.dep.depend(),Array.isArray(e)&&Tt(e)}At.prototype.walk=function(t){for(var e=Object.keys(t),n=0;n<e.length;n++)Ct(t,e[n])},At.prototype.observeArray=function(t){for(var e=0,n=t.length;e<n;e++)kt(t[e])};var Ft=B.optionMergeStrategies;function $t(t,e){if(!e)return t;for(var n,r,i,o=ut?Reflect.ownKeys(e):Object.keys(e),a=0;a<o.length;a++)"__ob__"!==(n=o[a])&&(r=t[n],i=e[n],w(t,n)?r!==i&&f(r)&&f(i)&&$t(r,i):Pt(t,n,i));return t}function Nt(t,e,n){return n?function(){var r="function"==typeof e?e.call(n,n):e,i="function"==typeof t?t.call(n,n):t;return r?$t(r,i):i}:e?t?function(){return $t("function"==typeof e?e.call(this,this):e,"function"==typeof t?t.call(this,this):t)}:e:t}function It(t,e){var n=e?t?t.concat(e):Array.isArray(e)?e:[e]:t;return n?function(t){for(var e=[],n=0;n<t.length;n++)-1===e.indexOf(t[n])&&e.push(t[n]);return e}(n):n}function jt(t,e,n,r){var i=Object.create(t||null);return e?E(i,e):i}Ft.data=function(t,e,n){return n?Nt(t,e,n):e&&"function"!=typeof e?t:Nt(t,e)},D.forEach((function(t){Ft[t]=It})),L.forEach((function(t){Ft[t+"s"]=jt})),Ft.watch=function(t,e,n,r){if(t===nt&&(t=void 0),e===nt&&(e=void 0),!e)return Object.create(t||null);if(!t)return e;var i={};for(var o in E(i,t),e){var a=i[o],s=e[o];a&&!Array.isArray(a)&&(a=[a]),i[o]=a?a.concat(s):Array.isArray(s)?s:[s]}return i},Ft.props=Ft.methods=Ft.inject=Ft.computed=function(t,e,n,r){if(!t)return e;var i=Object.create(null);return E(i,t),e&&E(i,e),i},Ft.provide=Nt;var Rt=function(t,e){return void 0===e?t:e};function Lt(t,e,n){if("function"==typeof e&&(e=e.options),function(t,e){var n=t.props;if(n){var r,i,o={};if(Array.isArray(n))for(r=n.length;r--;)"string"==typeof(i=n[r])&&(o[O(i)]={type:null});else if(f(n))for(var a in n)i=n[a],o[O(a)]=f(i)?i:{type:i};else 0;t.props=o}}(e),function(t,e){var n=t.inject;if(n){var r=t.inject={};if(Array.isArray(n))for(var i=0;i<n.length;i++)r[n[i]]={from:n[i]};else if(f(n))for(var o in n){var a=n[o];r[o]=f(a)?E({from:o},a):{from:a}}else 0}}(e),function(t){var e=t.directives;if(e)for(var n in e){var r=e[n];"function"==typeof r&&(e[n]={bind:r,update:r})}}(e),!e._base&&(e.extends&&(t=Lt(t,e.extends,n)),e.mixins))for(var r=0,i=e.mixins.length;r<i;r++)t=Lt(t,e.mixins[r],n);var o,a={};for(o in t)s(o);for(o in e)w(t,o)||s(o);function s(r){var i=Ft[r]||Rt;a[r]=i(t[r],e[r],n,r)}return a}function Dt(t,e,n,r){if("string"==typeof n){var i=t[e];if(w(i,n))return i[n];var o=O(n);if(w(i,o))return i[o];var a=M(o);return w(i,a)?i[a]:i[n]||i[o]||i[a]}}function Bt(t,e,n,r){var i=e[t],o=!w(n,t),a=n[t],s=Ut(Boolean,i.type);if(s>-1)if(o&&!w(i,"default"))a=!1;else if(""===a||a===k(t)){var c=Ut(String,i.type);(c<0||s<c)&&(a=!0)}if(void 0===a){a=function(t,e,n){if(!w(e,"default"))return;var r=e.default;0;if(t&&t.$options.propsData&&void 0===t.$options.propsData[n]&&void 0!==t._props[n])return t._props[n];return"function"==typeof r&&"Function"!==Wt(e.type)?r.call(t):r}(r,i,t);var u=Ot;Mt(!0),kt(a),Mt(u)}return a}function Wt(t){var e=t&&t.toString().match(/^\s*function (\w+)/);return e?e[1]:""}function Gt(t,e){return Wt(t)===Wt(e)}function Ut(t,e){if(!Array.isArray(e))return Gt(e,t)?0:-1;for(var n=0,r=e.length;n<r;n++)if(Gt(e[n],t))return n;return-1}function zt(t,e,n){vt();try{if(e)for(var r=e;r=r.$parent;){var i=r.$options.errorCaptured;if(i)for(var o=0;o<i.length;o++)try{if(!1===i[o].call(r,t,e,n))return}catch(t){Ht(t,r,"errorCaptured hook")}}Ht(t,e,n)}finally{ht()}}function Vt(t,e,n,r,i){var o;try{(o=n?t.apply(e,n):t.call(e))&&!o._isVue&&p(o)&&!o._handled&&(o.catch((function(t){return zt(t,r,i+" (Promise/async)")})),o._handled=!0)}catch(t){zt(t,r,i)}return o}function Ht(t,e,n){if(B.errorHandler)try{return B.errorHandler.call(null,t,e,n)}catch(e){e!==t&&qt(e,null,"config.errorHandler")}qt(t,e,n)}function qt(t,e,n){if(!q&&!K||"undefined"==typeof console)throw t;console.error(t)}var Kt,Jt=!1,Xt=[],Yt=!1;function Qt(){Yt=!1;var t=Xt.slice(0);Xt.length=0;for(var e=0;e<t.length;e++)t[e]()}if("undefined"!=typeof Promise&&st(Promise)){var Zt=Promise.resolve();Kt=function(){Zt.then(Qt),tt&&setTimeout(F)},Jt=!0}else if(Y||"undefined"==typeof MutationObserver||!st(MutationObserver)&&"[object MutationObserverConstructor]"!==MutationObserver.toString())Kt=void 0!==n&&st(n)?function(){n(Qt)}:function(){setTimeout(Qt,0)};else{var te=1,ee=new MutationObserver(Qt),ne=document.createTextNode(String(te));ee.observe(ne,{characterData:!0}),Kt=function(){te=(te+1)%2,ne.data=String(te)},Jt=!0}function re(t,e){var n;if(Xt.push((function(){if(t)try{t.call(e)}catch(t){zt(t,e,"nextTick")}else n&&n(e)})),Yt||(Yt=!0,Kt()),!t&&"undefined"!=typeof Promise)return new Promise((function(t){n=t}))}var ie=new ct;function oe(t){!function t(e,n){var r,i,o=Array.isArray(e);if(!o&&!c(e)||Object.isFrozen(e)||e instanceof mt)return;if(e.__ob__){var a=e.__ob__.dep.id;if(n.has(a))return;n.add(a)}if(o)for(r=e.length;r--;)t(e[r],n);else for(i=Object.keys(e),r=i.length;r--;)t(e[i[r]],n)}(t,ie),ie.clear()}var ae=x((function(t){var e="&"===t.charAt(0),n="~"===(t=e?t.slice(1):t).charAt(0),r="!"===(t=n?t.slice(1):t).charAt(0);return{name:t=r?t.slice(1):t,once:n,capture:r,passive:e}}));function se(t,e){function n(){var t=arguments,r=n.fns;if(!Array.isArray(r))return Vt(r,null,arguments,e,"v-on handler");for(var i=r.slice(),o=0;o<i.length;o++)Vt(i[o],null,t,e,"v-on handler")}return n.fns=t,n}function ce(t,e,n,r,o,s){var c,u,f,l;for(c in t)u=t[c],f=e[c],l=ae(c),i(u)||(i(f)?(i(u.fns)&&(u=t[c]=se(u,s)),a(l.once)&&(u=t[c]=o(l.name,u,l.capture)),n(l.name,u,l.capture,l.passive,l.params)):u!==f&&(f.fns=u,t[c]=f));for(c in e)i(t[c])&&r((l=ae(c)).name,e[c],l.capture)}function ue(t,e,n){var r;t instanceof mt&&(t=t.data.hook||(t.data.hook={}));var s=t[e];function c(){n.apply(this,arguments),b(r.fns,c)}i(s)?r=se([c]):o(s.fns)&&a(s.merged)?(r=s).fns.push(c):r=se([s,c]),r.merged=!0,t[e]=r}function fe(t,e,n,r,i){if(o(e)){if(w(e,n))return t[n]=e[n],i||delete e[n],!0;if(w(e,r))return t[n]=e[r],i||delete e[r],!0}return!1}function le(t){return s(t)?[bt(t)]:Array.isArray(t)?function t(e,n){var r,c,u,f,l=[];for(r=0;r<e.length;r++)i(c=e[r])||"boolean"==typeof c||(u=l.length-1,f=l[u],Array.isArray(c)?c.length>0&&(de((c=t(c,(n||"")+"_"+r))[0])&&de(f)&&(l[u]=bt(f.text+c[0].text),c.shift()),l.push.apply(l,c)):s(c)?de(f)?l[u]=bt(f.text+c):""!==c&&l.push(bt(c)):de(c)&&de(f)?l[u]=bt(f.text+c.text):(a(e._isVList)&&o(c.tag)&&i(c.key)&&o(n)&&(c.key="__vlist"+n+"_"+r+"__"),l.push(c)));return l}(t):void 0}function de(t){return o(t)&&o(t.text)&&!1===t.isComment}function pe(t,e){if(t){for(var n=Object.create(null),r=ut?Reflect.ownKeys(t):Object.keys(t),i=0;i<r.length;i++){var o=r[i];if("__ob__"!==o){for(var a=t[o].from,s=e;s;){if(s._provided&&w(s._provided,a)){n[o]=s._provided[a];break}s=s.$parent}if(!s)if("default"in t[o]){var c=t[o].default;n[o]="function"==typeof c?c.call(e):c}else 0}}return n}}function ve(t,e){if(!t||!t.length)return{};for(var n={},r=0,i=t.length;r<i;r++){var o=t[r],a=o.data;if(a&&a.attrs&&a.attrs.slot&&delete a.attrs.slot,o.context!==e&&o.fnContext!==e||!a||null==a.slot)(n.default||(n.default=[])).push(o);else{var s=a.slot,c=n[s]||(n[s]=[]);"template"===o.tag?c.push.apply(c,o.children||[]):c.push(o)}}for(var u in n)n[u].every(he)&&delete n[u];return n}function he(t){return t.isComment&&!t.asyncFactory||" "===t.text}function me(t,e,n){var i,o=Object.keys(e).length>0,a=t?!!t.$stable:!o,s=t&&t.$key;if(t){if(t._normalized)return t._normalized;if(a&&n&&n!==r&&s===n.$key&&!o&&!n.$hasNormal)return n;for(var c in i={},t)t[c]&&"$"!==c[0]&&(i[c]=ge(e,c,t[c]))}else i={};for(var u in e)u in i||(i[u]=ye(e,u));return t&&Object.isExtensible(t)&&(t._normalized=i),U(i,"$stable",a),U(i,"$key",s),U(i,"$hasNormal",o),i}function ge(t,e,n){var r=function(){var t=arguments.length?n.apply(null,arguments):n({});return(t=t&&"object"==typeof t&&!Array.isArray(t)?[t]:le(t))&&(0===t.length||1===t.length&&t[0].isComment)?void 0:t};return n.proxy&&Object.defineProperty(t,e,{get:r,enumerable:!0,configurable:!0}),r}function ye(t,e){return function(){return t[e]}}function be(t,e){var n,r,i,a,s;if(Array.isArray(t)||"string"==typeof t)for(n=new Array(t.length),r=0,i=t.length;r<i;r++)n[r]=e(t[r],r);else if("number"==typeof t)for(n=new Array(t),r=0;r<t;r++)n[r]=e(r+1,r);else if(c(t))if(ut&&t[Symbol.iterator]){n=[];for(var u=t[Symbol.iterator](),f=u.next();!f.done;)n.push(e(f.value,n.length)),f=u.next()}else for(a=Object.keys(t),n=new Array(a.length),r=0,i=a.length;r<i;r++)s=a[r],n[r]=e(t[s],s,r);return o(n)||(n=[]),n._isVList=!0,n}function _e(t,e,n,r){var i,o=this.$scopedSlots[t];o?(n=n||{},r&&(n=E(E({},r),n)),i=o(n)||e):i=this.$slots[t]||e;var a=n&&n.slot;return a?this.$createElement("template",{slot:a},i):i}function we(t){return Dt(this.$options,"filters",t)||N}function xe(t,e){return Array.isArray(t)?-1===t.indexOf(e):t!==e}function Se(t,e,n,r,i){var o=B.keyCodes[e]||n;return i&&r&&!B.keyCodes[e]?xe(i,r):o?xe(o,t):r?k(r)!==e:void 0}function Oe(t,e,n,r,i){if(n)if(c(n)){var o;Array.isArray(n)&&(n=T(n));var a=function(a){if("class"===a||"style"===a||y(a))o=t;else{var s=t.attrs&&t.attrs.type;o=r||B.mustUseProp(e,s,a)?t.domProps||(t.domProps={}):t.attrs||(t.attrs={})}var c=O(a),u=k(a);c in o||u in o||(o[a]=n[a],i&&((t.on||(t.on={}))["update:"+a]=function(t){n[a]=t}))};for(var s in n)a(s)}else;return t}function Me(t,e){var n=this._staticTrees||(this._staticTrees=[]),r=n[t];return r&&!e?r:(ke(r=n[t]=this.$options.staticRenderFns[t].call(this._renderProxy,null,this),"__static__"+t,!1),r)}function Ae(t,e,n){return ke(t,"__once__"+e+(n?"_"+n:""),!0),t}function ke(t,e,n){if(Array.isArray(t))for(var r=0;r<t.length;r++)t[r]&&"string"!=typeof t[r]&&Ce(t[r],e+"_"+r,n);else Ce(t,e,n)}function Ce(t,e,n){t.isStatic=!0,t.key=e,t.isOnce=n}function Pe(t,e){if(e)if(f(e)){var n=t.on=t.on?E({},t.on):{};for(var r in e){var i=n[r],o=e[r];n[r]=i?[].concat(i,o):o}}else;return t}function Ee(t,e,n,r){e=e||{$stable:!n};for(var i=0;i<t.length;i++){var o=t[i];Array.isArray(o)?Ee(o,e,n):o&&(o.proxy&&(o.fn.proxy=!0),e[o.key]=o.fn)}return r&&(e.$key=r),e}function Te(t,e){for(var n=0;n<e.length;n+=2){var r=e[n];"string"==typeof r&&r&&(t[e[n]]=e[n+1])}return t}function Fe(t,e){return"string"==typeof t?e+t:t}function $e(t){t._o=Ae,t._n=h,t._s=v,t._l=be,t._t=_e,t._q=I,t._i=j,t._m=Me,t._f=we,t._k=Se,t._b=Oe,t._v=bt,t._e=yt,t._u=Ee,t._g=Pe,t._d=Te,t._p=Fe}function Ne(t,e,n,i,o){var s,c=this,u=o.options;w(i,"_uid")?(s=Object.create(i))._original=i:(s=i,i=i._original);var f=a(u._compiled),l=!f;this.data=t,this.props=e,this.children=n,this.parent=i,this.listeners=t.on||r,this.injections=pe(u.inject,i),this.slots=function(){return c.$slots||me(t.scopedSlots,c.$slots=ve(n,i)),c.$slots},Object.defineProperty(this,"scopedSlots",{enumerable:!0,get:function(){return me(t.scopedSlots,this.slots())}}),f&&(this.$options=u,this.$slots=this.slots(),this.$scopedSlots=me(t.scopedSlots,this.$slots)),u._scopeId?this._c=function(t,e,n,r){var o=We(s,t,e,n,r,l);return o&&!Array.isArray(o)&&(o.fnScopeId=u._scopeId,o.fnContext=i),o}:this._c=function(t,e,n,r){return We(s,t,e,n,r,l)}}function Ie(t,e,n,r,i){var o=_t(t);return o.fnContext=n,o.fnOptions=r,e.slot&&((o.data||(o.data={})).slot=e.slot),o}function je(t,e){for(var n in e)t[O(n)]=e[n]}$e(Ne.prototype);var Re={init:function(t,e){if(t.componentInstance&&!t.componentInstance._isDestroyed&&t.data.keepAlive){var n=t;Re.prepatch(n,n)}else{(t.componentInstance=function(t,e){var n={_isComponent:!0,_parentVnode:t,parent:e},r=t.data.inlineTemplate;o(r)&&(n.render=r.render,n.staticRenderFns=r.staticRenderFns);return new t.componentOptions.Ctor(n)}(t,Ye)).$mount(e?t.elm:void 0,e)}},prepatch:function(t,e){var n=e.componentOptions;!function(t,e,n,i,o){0;var a=i.data.scopedSlots,s=t.$scopedSlots,c=!!(a&&!a.$stable||s!==r&&!s.$stable||a&&t.$scopedSlots.$key!==a.$key),u=!!(o||t.$options._renderChildren||c);t.$options._parentVnode=i,t.$vnode=i,t._vnode&&(t._vnode.parent=i);if(t.$options._renderChildren=o,t.$attrs=i.data.attrs||r,t.$listeners=n||r,e&&t.$options.props){Mt(!1);for(var f=t._props,l=t.$options._propKeys||[],d=0;d<l.length;d++){var p=l[d],v=t.$options.props;f[p]=Bt(p,v,e,t)}Mt(!0),t.$options.propsData=e}n=n||r;var h=t.$options._parentListeners;t.$options._parentListeners=n,Xe(t,n,h),u&&(t.$slots=ve(o,i.context),t.$forceUpdate());0}(e.componentInstance=t.componentInstance,n.propsData,n.listeners,e,n.children)},insert:function(t){var e,n=t.context,r=t.componentInstance;r._isMounted||(r._isMounted=!0,en(r,"mounted")),t.data.keepAlive&&(n._isMounted?((e=r)._inactive=!1,rn.push(e)):tn(r,!0))},destroy:function(t){var e=t.componentInstance;e._isDestroyed||(t.data.keepAlive?function t(e,n){if(n&&(e._directInactive=!0,Ze(e)))return;if(!e._inactive){e._inactive=!0;for(var r=0;r<e.$children.length;r++)t(e.$children[r]);en(e,"deactivated")}}(e,!0):e.$destroy())}},Le=Object.keys(Re);function De(t,e,n,s,u){if(!i(t)){var f=n.$options._base;if(c(t)&&(t=f.extend(t)),"function"==typeof t){var l;if(i(t.cid)&&void 0===(t=function(t,e){if(a(t.error)&&o(t.errorComp))return t.errorComp;if(o(t.resolved))return t.resolved;var n=Ue;n&&o(t.owners)&&-1===t.owners.indexOf(n)&&t.owners.push(n);if(a(t.loading)&&o(t.loadingComp))return t.loadingComp;if(n&&!o(t.owners)){var r=t.owners=[n],s=!0,u=null,f=null;n.$on("hook:destroyed",(function(){return b(r,n)}));var l=function(t){for(var e=0,n=r.length;e<n;e++)r[e].$forceUpdate();t&&(r.length=0,null!==u&&(clearTimeout(u),u=null),null!==f&&(clearTimeout(f),f=null))},d=R((function(n){t.resolved=ze(n,e),s?r.length=0:l(!0)})),v=R((function(e){o(t.errorComp)&&(t.error=!0,l(!0))})),h=t(d,v);return c(h)&&(p(h)?i(t.resolved)&&h.then(d,v):p(h.component)&&(h.component.then(d,v),o(h.error)&&(t.errorComp=ze(h.error,e)),o(h.loading)&&(t.loadingComp=ze(h.loading,e),0===h.delay?t.loading=!0:u=setTimeout((function(){u=null,i(t.resolved)&&i(t.error)&&(t.loading=!0,l(!1))}),h.delay||200)),o(h.timeout)&&(f=setTimeout((function(){f=null,i(t.resolved)&&v(null)}),h.timeout)))),s=!1,t.loading?t.loadingComp:t.resolved}}(l=t,f)))return function(t,e,n,r,i){var o=yt();return o.asyncFactory=t,o.asyncMeta={data:e,context:n,children:r,tag:i},o}(l,e,n,s,u);e=e||{},On(t),o(e.model)&&function(t,e){var n=t.model&&t.model.prop||"value",r=t.model&&t.model.event||"input";(e.attrs||(e.attrs={}))[n]=e.model.value;var i=e.on||(e.on={}),a=i[r],s=e.model.callback;o(a)?(Array.isArray(a)?-1===a.indexOf(s):a!==s)&&(i[r]=[s].concat(a)):i[r]=s}(t.options,e);var d=function(t,e,n){var r=e.options.props;if(!i(r)){var a={},s=t.attrs,c=t.props;if(o(s)||o(c))for(var u in r){var f=k(u);fe(a,c,u,f,!0)||fe(a,s,u,f,!1)}return a}}(e,t);if(a(t.options.functional))return function(t,e,n,i,a){var s=t.options,c={},u=s.props;if(o(u))for(var f in u)c[f]=Bt(f,u,e||r);else o(n.attrs)&&je(c,n.attrs),o(n.props)&&je(c,n.props);var l=new Ne(n,c,a,i,t),d=s.render.call(null,l._c,l);if(d instanceof mt)return Ie(d,n,l.parent,s,l);if(Array.isArray(d)){for(var p=le(d)||[],v=new Array(p.length),h=0;h<p.length;h++)v[h]=Ie(p[h],n,l.parent,s,l);return v}}(t,d,e,n,s);var v=e.on;if(e.on=e.nativeOn,a(t.options.abstract)){var h=e.slot;e={},h&&(e.slot=h)}!function(t){for(var e=t.hook||(t.hook={}),n=0;n<Le.length;n++){var r=Le[n],i=e[r],o=Re[r];i===o||i&&i._merged||(e[r]=i?Be(o,i):o)}}(e);var m=t.options.name||u;return new mt("vue-component-"+t.cid+(m?"-"+m:""),e,void 0,void 0,void 0,n,{Ctor:t,propsData:d,listeners:v,tag:u,children:s},l)}}}function Be(t,e){var n=function(n,r){t(n,r),e(n,r)};return n._merged=!0,n}function We(t,e,n,r,u,f){return(Array.isArray(n)||s(n))&&(u=r,r=n,n=void 0),a(f)&&(u=2),function(t,e,n,r,s){if(o(n)&&o(n.__ob__))return yt();o(n)&&o(n.is)&&(e=n.is);if(!e)return yt();0;Array.isArray(r)&&"function"==typeof r[0]&&((n=n||{}).scopedSlots={default:r[0]},r.length=0);2===s?r=le(r):1===s&&(r=function(t){for(var e=0;e<t.length;e++)if(Array.isArray(t[e]))return Array.prototype.concat.apply([],t);return t}(r));var u,f;if("string"==typeof e){var l;f=t.$vnode&&t.$vnode.ns||B.getTagNamespace(e),u=B.isReservedTag(e)?new mt(B.parsePlatformTagName(e),n,r,void 0,void 0,t):n&&n.pre||!o(l=Dt(t.$options,"components",e))?new mt(e,n,r,void 0,void 0,t):De(l,n,t,r,e)}else u=De(e,n,t,r);return Array.isArray(u)?u:o(u)?(o(f)&&function t(e,n,r){e.ns=n,"foreignObject"===e.tag&&(n=void 0,r=!0);if(o(e.children))for(var s=0,c=e.children.length;s<c;s++){var u=e.children[s];o(u.tag)&&(i(u.ns)||a(r)&&"svg"!==u.tag)&&t(u,n,r)}}(u,f),o(n)&&function(t){c(t.style)&&oe(t.style);c(t.class)&&oe(t.class)}(n),u):yt()}(t,e,n,r,u)}var Ge,Ue=null;function ze(t,e){return(t.__esModule||ut&&"Module"===t[Symbol.toStringTag])&&(t=t.default),c(t)?e.extend(t):t}function Ve(t){return t.isComment&&t.asyncFactory}function He(t){if(Array.isArray(t))for(var e=0;e<t.length;e++){var n=t[e];if(o(n)&&(o(n.componentOptions)||Ve(n)))return n}}function qe(t,e){Ge.$on(t,e)}function Ke(t,e){Ge.$off(t,e)}function Je(t,e){var n=Ge;return function r(){var i=e.apply(null,arguments);null!==i&&n.$off(t,r)}}function Xe(t,e,n){Ge=t,ce(e,n||{},qe,Ke,Je,t),Ge=void 0}var Ye=null;function Qe(t){var e=Ye;return Ye=t,function(){Ye=e}}function Ze(t){for(;t&&(t=t.$parent);)if(t._inactive)return!0;return!1}function tn(t,e){if(e){if(t._directInactive=!1,Ze(t))return}else if(t._directInactive)return;if(t._inactive||null===t._inactive){t._inactive=!1;for(var n=0;n<t.$children.length;n++)tn(t.$children[n]);en(t,"activated")}}function en(t,e){vt();var n=t.$options[e],r=e+" hook";if(n)for(var i=0,o=n.length;i<o;i++)Vt(n[i],t,null,t,r);t._hasHookEvent&&t.$emit("hook:"+e),ht()}var nn=[],rn=[],on={},an=!1,sn=!1,cn=0;var un=0,fn=Date.now;if(q&&!Y){var ln=window.performance;ln&&"function"==typeof ln.now&&fn()>document.createEvent("Event").timeStamp&&(fn=function(){return ln.now()})}function dn(){var t,e;for(un=fn(),sn=!0,nn.sort((function(t,e){return t.id-e.id})),cn=0;cn<nn.length;cn++)(t=nn[cn]).before&&t.before(),e=t.id,on[e]=null,t.run();var n=rn.slice(),r=nn.slice();cn=nn.length=rn.length=0,on={},an=sn=!1,function(t){for(var e=0;e<t.length;e++)t[e]._inactive=!0,tn(t[e],!0)}(n),function(t){var e=t.length;for(;e--;){var n=t[e],r=n.vm;r._watcher===n&&r._isMounted&&!r._isDestroyed&&en(r,"updated")}}(r),at&&B.devtools&&at.emit("flush")}var pn=0,vn=function(t,e,n,r,i){this.vm=t,i&&(t._watcher=this),t._watchers.push(this),r?(this.deep=!!r.deep,this.user=!!r.user,this.lazy=!!r.lazy,this.sync=!!r.sync,this.before=r.before):this.deep=this.user=this.lazy=this.sync=!1,this.cb=n,this.id=++pn,this.active=!0,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new ct,this.newDepIds=new ct,this.expression="","function"==typeof e?this.getter=e:(this.getter=function(t){if(!z.test(t)){var e=t.split(".");return function(t){for(var n=0;n<e.length;n++){if(!t)return;t=t[e[n]]}return t}}}(e),this.getter||(this.getter=F)),this.value=this.lazy?void 0:this.get()};vn.prototype.get=function(){var t;vt(this);var e=this.vm;try{t=this.getter.call(e,e)}catch(t){if(!this.user)throw t;zt(t,e,'getter for watcher "'+this.expression+'"')}finally{this.deep&&oe(t),ht(),this.cleanupDeps()}return t},vn.prototype.addDep=function(t){var e=t.id;this.newDepIds.has(e)||(this.newDepIds.add(e),this.newDeps.push(t),this.depIds.has(e)||t.addSub(this))},vn.prototype.cleanupDeps=function(){for(var t=this.deps.length;t--;){var e=this.deps[t];this.newDepIds.has(e.id)||e.removeSub(this)}var n=this.depIds;this.depIds=this.newDepIds,this.newDepIds=n,this.newDepIds.clear(),n=this.deps,this.deps=this.newDeps,this.newDeps=n,this.newDeps.length=0},vn.prototype.update=function(){this.lazy?this.dirty=!0:this.sync?this.run():function(t){var e=t.id;if(null==on[e]){if(on[e]=!0,sn){for(var n=nn.length-1;n>cn&&nn[n].id>t.id;)n--;nn.splice(n+1,0,t)}else nn.push(t);an||(an=!0,re(dn))}}(this)},vn.prototype.run=function(){if(this.active){var t=this.get();if(t!==this.value||c(t)||this.deep){var e=this.value;if(this.value=t,this.user)try{this.cb.call(this.vm,t,e)}catch(t){zt(t,this.vm,'callback for watcher "'+this.expression+'"')}else this.cb.call(this.vm,t,e)}}},vn.prototype.evaluate=function(){this.value=this.get(),this.dirty=!1},vn.prototype.depend=function(){for(var t=this.deps.length;t--;)this.deps[t].depend()},vn.prototype.teardown=function(){if(this.active){this.vm._isBeingDestroyed||b(this.vm._watchers,this);for(var t=this.deps.length;t--;)this.deps[t].removeSub(this);this.active=!1}};var hn={enumerable:!0,configurable:!0,get:F,set:F};function mn(t,e,n){hn.get=function(){return this[e][n]},hn.set=function(t){this[e][n]=t},Object.defineProperty(t,n,hn)}function gn(t){t._watchers=[];var e=t.$options;e.props&&function(t,e){var n=t.$options.propsData||{},r=t._props={},i=t.$options._propKeys=[];t.$parent&&Mt(!1);var o=function(o){i.push(o);var a=Bt(o,e,n,t);Ct(r,o,a),o in t||mn(t,"_props",o)};for(var a in e)o(a);Mt(!0)}(t,e.props),e.methods&&function(t,e){t.$options.props;for(var n in e)t[n]="function"!=typeof e[n]?F:C(e[n],t)}(t,e.methods),e.data?function(t){var e=t.$options.data;f(e=t._data="function"==typeof e?function(t,e){vt();try{return t.call(e,e)}catch(t){return zt(t,e,"data()"),{}}finally{ht()}}(e,t):e||{})||(e={});var n=Object.keys(e),r=t.$options.props,i=(t.$options.methods,n.length);for(;i--;){var o=n[i];0,r&&w(r,o)||G(o)||mn(t,"_data",o)}kt(e,!0)}(t):kt(t._data={},!0),e.computed&&function(t,e){var n=t._computedWatchers=Object.create(null),r=ot();for(var i in e){var o=e[i],a="function"==typeof o?o:o.get;0,r||(n[i]=new vn(t,a||F,F,yn)),i in t||bn(t,i,o)}}(t,e.computed),e.watch&&e.watch!==nt&&function(t,e){for(var n in e){var r=e[n];if(Array.isArray(r))for(var i=0;i<r.length;i++)xn(t,n,r[i]);else xn(t,n,r)}}(t,e.watch)}var yn={lazy:!0};function bn(t,e,n){var r=!ot();"function"==typeof n?(hn.get=r?_n(e):wn(n),hn.set=F):(hn.get=n.get?r&&!1!==n.cache?_n(e):wn(n.get):F,hn.set=n.set||F),Object.defineProperty(t,e,hn)}function _n(t){return function(){var e=this._computedWatchers&&this._computedWatchers[t];if(e)return e.dirty&&e.evaluate(),dt.target&&e.depend(),e.value}}function wn(t){return function(){return t.call(this,this)}}function xn(t,e,n,r){return f(n)&&(r=n,n=n.handler),"string"==typeof n&&(n=t[n]),t.$watch(e,n,r)}var Sn=0;function On(t){var e=t.options;if(t.super){var n=On(t.super);if(n!==t.superOptions){t.superOptions=n;var r=function(t){var e,n=t.options,r=t.sealedOptions;for(var i in n)n[i]!==r[i]&&(e||(e={}),e[i]=n[i]);return e}(t);r&&E(t.extendOptions,r),(e=t.options=Lt(n,t.extendOptions)).name&&(e.components[e.name]=t)}}return e}function Mn(t){this._init(t)}function An(t){t.cid=0;var e=1;t.extend=function(t){t=t||{};var n=this,r=n.cid,i=t._Ctor||(t._Ctor={});if(i[r])return i[r];var o=t.name||n.options.name;var a=function(t){this._init(t)};return(a.prototype=Object.create(n.prototype)).constructor=a,a.cid=e++,a.options=Lt(n.options,t),a.super=n,a.options.props&&function(t){var e=t.options.props;for(var n in e)mn(t.prototype,"_props",n)}(a),a.options.computed&&function(t){var e=t.options.computed;for(var n in e)bn(t.prototype,n,e[n])}(a),a.extend=n.extend,a.mixin=n.mixin,a.use=n.use,L.forEach((function(t){a[t]=n[t]})),o&&(a.options.components[o]=a),a.superOptions=n.options,a.extendOptions=t,a.sealedOptions=E({},a.options),i[r]=a,a}}function kn(t){return t&&(t.Ctor.options.name||t.tag)}function Cn(t,e){return Array.isArray(t)?t.indexOf(e)>-1:"string"==typeof t?t.split(",").indexOf(e)>-1:!!l(t)&&t.test(e)}function Pn(t,e){var n=t.cache,r=t.keys,i=t._vnode;for(var o in n){var a=n[o];if(a){var s=kn(a.componentOptions);s&&!e(s)&&En(n,o,r,i)}}}function En(t,e,n,r){var i=t[e];!i||r&&i.tag===r.tag||i.componentInstance.$destroy(),t[e]=null,b(n,e)}!function(t){t.prototype._init=function(t){var e=this;e._uid=Sn++,e._isVue=!0,t&&t._isComponent?function(t,e){var n=t.$options=Object.create(t.constructor.options),r=e._parentVnode;n.parent=e.parent,n._parentVnode=r;var i=r.componentOptions;n.propsData=i.propsData,n._parentListeners=i.listeners,n._renderChildren=i.children,n._componentTag=i.tag,e.render&&(n.render=e.render,n.staticRenderFns=e.staticRenderFns)}(e,t):e.$options=Lt(On(e.constructor),t||{},e),e._renderProxy=e,e._self=e,function(t){var e=t.$options,n=e.parent;if(n&&!e.abstract){for(;n.$options.abstract&&n.$parent;)n=n.$parent;n.$children.push(t)}t.$parent=n,t.$root=n?n.$root:t,t.$children=[],t.$refs={},t._watcher=null,t._inactive=null,t._directInactive=!1,t._isMounted=!1,t._isDestroyed=!1,t._isBeingDestroyed=!1}(e),function(t){t._events=Object.create(null),t._hasHookEvent=!1;var e=t.$options._parentListeners;e&&Xe(t,e)}(e),function(t){t._vnode=null,t._staticTrees=null;var e=t.$options,n=t.$vnode=e._parentVnode,i=n&&n.context;t.$slots=ve(e._renderChildren,i),t.$scopedSlots=r,t._c=function(e,n,r,i){return We(t,e,n,r,i,!1)},t.$createElement=function(e,n,r,i){return We(t,e,n,r,i,!0)};var o=n&&n.data;Ct(t,"$attrs",o&&o.attrs||r,null,!0),Ct(t,"$listeners",e._parentListeners||r,null,!0)}(e),en(e,"beforeCreate"),function(t){var e=pe(t.$options.inject,t);e&&(Mt(!1),Object.keys(e).forEach((function(n){Ct(t,n,e[n])})),Mt(!0))}(e),gn(e),function(t){var e=t.$options.provide;e&&(t._provided="function"==typeof e?e.call(t):e)}(e),en(e,"created"),e.$options.el&&e.$mount(e.$options.el)}}(Mn),function(t){var e={get:function(){return this._data}},n={get:function(){return this._props}};Object.defineProperty(t.prototype,"$data",e),Object.defineProperty(t.prototype,"$props",n),t.prototype.$set=Pt,t.prototype.$delete=Et,t.prototype.$watch=function(t,e,n){if(f(e))return xn(this,t,e,n);(n=n||{}).user=!0;var r=new vn(this,t,e,n);if(n.immediate)try{e.call(this,r.value)}catch(t){zt(t,this,'callback for immediate watcher "'+r.expression+'"')}return function(){r.teardown()}}}(Mn),function(t){var e=/^hook:/;t.prototype.$on=function(t,n){var r=this;if(Array.isArray(t))for(var i=0,o=t.length;i<o;i++)r.$on(t[i],n);else(r._events[t]||(r._events[t]=[])).push(n),e.test(t)&&(r._hasHookEvent=!0);return r},t.prototype.$once=function(t,e){var n=this;function r(){n.$off(t,r),e.apply(n,arguments)}return r.fn=e,n.$on(t,r),n},t.prototype.$off=function(t,e){var n=this;if(!arguments.length)return n._events=Object.create(null),n;if(Array.isArray(t)){for(var r=0,i=t.length;r<i;r++)n.$off(t[r],e);return n}var o,a=n._events[t];if(!a)return n;if(!e)return n._events[t]=null,n;for(var s=a.length;s--;)if((o=a[s])===e||o.fn===e){a.splice(s,1);break}return n},t.prototype.$emit=function(t){var e=this,n=e._events[t];if(n){n=n.length>1?P(n):n;for(var r=P(arguments,1),i='event handler for "'+t+'"',o=0,a=n.length;o<a;o++)Vt(n[o],e,r,e,i)}return e}}(Mn),function(t){t.prototype._update=function(t,e){var n=this,r=n.$el,i=n._vnode,o=Qe(n);n._vnode=t,n.$el=i?n.__patch__(i,t):n.__patch__(n.$el,t,e,!1),o(),r&&(r.__vue__=null),n.$el&&(n.$el.__vue__=n),n.$vnode&&n.$parent&&n.$vnode===n.$parent._vnode&&(n.$parent.$el=n.$el)},t.prototype.$forceUpdate=function(){this._watcher&&this._watcher.update()},t.prototype.$destroy=function(){var t=this;if(!t._isBeingDestroyed){en(t,"beforeDestroy"),t._isBeingDestroyed=!0;var e=t.$parent;!e||e._isBeingDestroyed||t.$options.abstract||b(e.$children,t),t._watcher&&t._watcher.teardown();for(var n=t._watchers.length;n--;)t._watchers[n].teardown();t._data.__ob__&&t._data.__ob__.vmCount--,t._isDestroyed=!0,t.__patch__(t._vnode,null),en(t,"destroyed"),t.$off(),t.$el&&(t.$el.__vue__=null),t.$vnode&&(t.$vnode.parent=null)}}}(Mn),function(t){$e(t.prototype),t.prototype.$nextTick=function(t){return re(t,this)},t.prototype._render=function(){var t,e=this,n=e.$options,r=n.render,i=n._parentVnode;i&&(e.$scopedSlots=me(i.data.scopedSlots,e.$slots,e.$scopedSlots)),e.$vnode=i;try{Ue=e,t=r.call(e._renderProxy,e.$createElement)}catch(n){zt(n,e,"render"),t=e._vnode}finally{Ue=null}return Array.isArray(t)&&1===t.length&&(t=t[0]),t instanceof mt||(t=yt()),t.parent=i,t}}(Mn);var Tn=[String,RegExp,Array],Fn={KeepAlive:{name:"keep-alive",abstract:!0,props:{include:Tn,exclude:Tn,max:[String,Number]},created:function(){this.cache=Object.create(null),this.keys=[]},destroyed:function(){for(var t in this.cache)En(this.cache,t,this.keys)},mounted:function(){var t=this;this.$watch("include",(function(e){Pn(t,(function(t){return Cn(e,t)}))})),this.$watch("exclude",(function(e){Pn(t,(function(t){return!Cn(e,t)}))}))},render:function(){var t=this.$slots.default,e=He(t),n=e&&e.componentOptions;if(n){var r=kn(n),i=this.include,o=this.exclude;if(i&&(!r||!Cn(i,r))||o&&r&&Cn(o,r))return e;var a=this.cache,s=this.keys,c=null==e.key?n.Ctor.cid+(n.tag?"::"+n.tag:""):e.key;a[c]?(e.componentInstance=a[c].componentInstance,b(s,c),s.push(c)):(a[c]=e,s.push(c),this.max&&s.length>parseInt(this.max)&&En(a,s[0],s,this._vnode)),e.data.keepAlive=!0}return e||t&&t[0]}}};!function(t){var e={get:function(){return B}};Object.defineProperty(t,"config",e),t.util={warn:ft,extend:E,mergeOptions:Lt,defineReactive:Ct},t.set=Pt,t.delete=Et,t.nextTick=re,t.observable=function(t){return kt(t),t},t.options=Object.create(null),L.forEach((function(e){t.options[e+"s"]=Object.create(null)})),t.options._base=t,E(t.options.components,Fn),function(t){t.use=function(t){var e=this._installedPlugins||(this._installedPlugins=[]);if(e.indexOf(t)>-1)return this;var n=P(arguments,1);return n.unshift(this),"function"==typeof t.install?t.install.apply(t,n):"function"==typeof t&&t.apply(null,n),e.push(t),this}}(t),function(t){t.mixin=function(t){return this.options=Lt(this.options,t),this}}(t),An(t),function(t){L.forEach((function(e){t[e]=function(t,n){return n?("component"===e&&f(n)&&(n.name=n.name||t,n=this.options._base.extend(n)),"directive"===e&&"function"==typeof n&&(n={bind:n,update:n}),this.options[e+"s"][t]=n,n):this.options[e+"s"][t]}}))}(t)}(Mn),Object.defineProperty(Mn.prototype,"$isServer",{get:ot}),Object.defineProperty(Mn.prototype,"$ssrContext",{get:function(){return this.$vnode&&this.$vnode.ssrContext}}),Object.defineProperty(Mn,"FunctionalRenderContext",{value:Ne}),Mn.version="2.6.11";var $n=m("style,class"),Nn=m("input,textarea,option,select,progress"),In=function(t,e,n){return"value"===n&&Nn(t)&&"button"!==e||"selected"===n&&"option"===t||"checked"===n&&"input"===t||"muted"===n&&"video"===t},jn=m("contenteditable,draggable,spellcheck"),Rn=m("events,caret,typing,plaintext-only"),Ln=m("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),Dn="http://www.w3.org/1999/xlink",Bn=function(t){return":"===t.charAt(5)&&"xlink"===t.slice(0,5)},Wn=function(t){return Bn(t)?t.slice(6,t.length):""},Gn=function(t){return null==t||!1===t};function Un(t){for(var e=t.data,n=t,r=t;o(r.componentInstance);)(r=r.componentInstance._vnode)&&r.data&&(e=zn(r.data,e));for(;o(n=n.parent);)n&&n.data&&(e=zn(e,n.data));return function(t,e){if(o(t)||o(e))return Vn(t,Hn(e));return""}(e.staticClass,e.class)}function zn(t,e){return{staticClass:Vn(t.staticClass,e.staticClass),class:o(t.class)?[t.class,e.class]:e.class}}function Vn(t,e){return t?e?t+" "+e:t:e||""}function Hn(t){return Array.isArray(t)?function(t){for(var e,n="",r=0,i=t.length;r<i;r++)o(e=Hn(t[r]))&&""!==e&&(n&&(n+=" "),n+=e);return n}(t):c(t)?function(t){var e="";for(var n in t)t[n]&&(e&&(e+=" "),e+=n);return e}(t):"string"==typeof t?t:""}var qn={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},Kn=m("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"),Jn=m("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",!0),Xn=function(t){return Kn(t)||Jn(t)};function Yn(t){return Jn(t)?"svg":"math"===t?"math":void 0}var Qn=Object.create(null);var Zn=m("text,number,password,search,email,tel,url");function tr(t){if("string"==typeof t){var e=document.querySelector(t);return e||document.createElement("div")}return t}var er=Object.freeze({createElement:function(t,e){var n=document.createElement(t);return"select"!==t?n:(e.data&&e.data.attrs&&void 0!==e.data.attrs.multiple&&n.setAttribute("multiple","multiple"),n)},createElementNS:function(t,e){return document.createElementNS(qn[t],e)},createTextNode:function(t){return document.createTextNode(t)},createComment:function(t){return document.createComment(t)},insertBefore:function(t,e,n){t.insertBefore(e,n)},removeChild:function(t,e){t.removeChild(e)},appendChild:function(t,e){t.appendChild(e)},parentNode:function(t){return t.parentNode},nextSibling:function(t){return t.nextSibling},tagName:function(t){return t.tagName},setTextContent:function(t,e){t.textContent=e},setStyleScope:function(t,e){t.setAttribute(e,"")}}),nr={create:function(t,e){rr(e)},update:function(t,e){t.data.ref!==e.data.ref&&(rr(t,!0),rr(e))},destroy:function(t){rr(t,!0)}};function rr(t,e){var n=t.data.ref;if(o(n)){var r=t.context,i=t.componentInstance||t.elm,a=r.$refs;e?Array.isArray(a[n])?b(a[n],i):a[n]===i&&(a[n]=void 0):t.data.refInFor?Array.isArray(a[n])?a[n].indexOf(i)<0&&a[n].push(i):a[n]=[i]:a[n]=i}}var ir=new mt("",{},[]),or=["create","activate","update","remove","destroy"];function ar(t,e){return t.key===e.key&&(t.tag===e.tag&&t.isComment===e.isComment&&o(t.data)===o(e.data)&&function(t,e){if("input"!==t.tag)return!0;var n,r=o(n=t.data)&&o(n=n.attrs)&&n.type,i=o(n=e.data)&&o(n=n.attrs)&&n.type;return r===i||Zn(r)&&Zn(i)}(t,e)||a(t.isAsyncPlaceholder)&&t.asyncFactory===e.asyncFactory&&i(e.asyncFactory.error))}function sr(t,e,n){var r,i,a={};for(r=e;r<=n;++r)o(i=t[r].key)&&(a[i]=r);return a}var cr={create:ur,update:ur,destroy:function(t){ur(t,ir)}};function ur(t,e){(t.data.directives||e.data.directives)&&function(t,e){var n,r,i,o=t===ir,a=e===ir,s=lr(t.data.directives,t.context),c=lr(e.data.directives,e.context),u=[],f=[];for(n in c)r=s[n],i=c[n],r?(i.oldValue=r.value,i.oldArg=r.arg,pr(i,"update",e,t),i.def&&i.def.componentUpdated&&f.push(i)):(pr(i,"bind",e,t),i.def&&i.def.inserted&&u.push(i));if(u.length){var l=function(){for(var n=0;n<u.length;n++)pr(u[n],"inserted",e,t)};o?ue(e,"insert",l):l()}f.length&&ue(e,"postpatch",(function(){for(var n=0;n<f.length;n++)pr(f[n],"componentUpdated",e,t)}));if(!o)for(n in s)c[n]||pr(s[n],"unbind",t,t,a)}(t,e)}var fr=Object.create(null);function lr(t,e){var n,r,i=Object.create(null);if(!t)return i;for(n=0;n<t.length;n++)(r=t[n]).modifiers||(r.modifiers=fr),i[dr(r)]=r,r.def=Dt(e.$options,"directives",r.name);return i}function dr(t){return t.rawName||t.name+"."+Object.keys(t.modifiers||{}).join(".")}function pr(t,e,n,r,i){var o=t.def&&t.def[e];if(o)try{o(n.elm,t,n,r,i)}catch(r){zt(r,n.context,"directive "+t.name+" "+e+" hook")}}var vr=[nr,cr];function hr(t,e){var n=e.componentOptions;if(!(o(n)&&!1===n.Ctor.options.inheritAttrs||i(t.data.attrs)&&i(e.data.attrs))){var r,a,s=e.elm,c=t.data.attrs||{},u=e.data.attrs||{};for(r in o(u.__ob__)&&(u=e.data.attrs=E({},u)),u)a=u[r],c[r]!==a&&mr(s,r,a);for(r in(Y||Z)&&u.value!==c.value&&mr(s,"value",u.value),c)i(u[r])&&(Bn(r)?s.removeAttributeNS(Dn,Wn(r)):jn(r)||s.removeAttribute(r))}}function mr(t,e,n){t.tagName.indexOf("-")>-1?gr(t,e,n):Ln(e)?Gn(n)?t.removeAttribute(e):(n="allowfullscreen"===e&&"EMBED"===t.tagName?"true":e,t.setAttribute(e,n)):jn(e)?t.setAttribute(e,function(t,e){return Gn(e)||"false"===e?"false":"contenteditable"===t&&Rn(e)?e:"true"}(e,n)):Bn(e)?Gn(n)?t.removeAttributeNS(Dn,Wn(e)):t.setAttributeNS(Dn,e,n):gr(t,e,n)}function gr(t,e,n){if(Gn(n))t.removeAttribute(e);else{if(Y&&!Q&&"TEXTAREA"===t.tagName&&"placeholder"===e&&""!==n&&!t.__ieph){var r=function(e){e.stopImmediatePropagation(),t.removeEventListener("input",r)};t.addEventListener("input",r),t.__ieph=!0}t.setAttribute(e,n)}}var yr={create:hr,update:hr};function br(t,e){var n=e.elm,r=e.data,a=t.data;if(!(i(r.staticClass)&&i(r.class)&&(i(a)||i(a.staticClass)&&i(a.class)))){var s=Un(e),c=n._transitionClasses;o(c)&&(s=Vn(s,Hn(c))),s!==n._prevClass&&(n.setAttribute("class",s),n._prevClass=s)}}var _r,wr,xr,Sr,Or,Mr,Ar={create:br,update:br},kr=/[\w).+\-_$\]]/;function Cr(t){var e,n,r,i,o,a=!1,s=!1,c=!1,u=!1,f=0,l=0,d=0,p=0;for(r=0;r<t.length;r++)if(n=e,e=t.charCodeAt(r),a)39===e&&92!==n&&(a=!1);else if(s)34===e&&92!==n&&(s=!1);else if(c)96===e&&92!==n&&(c=!1);else if(u)47===e&&92!==n&&(u=!1);else if(124!==e||124===t.charCodeAt(r+1)||124===t.charCodeAt(r-1)||f||l||d){switch(e){case 34:s=!0;break;case 39:a=!0;break;case 96:c=!0;break;case 40:d++;break;case 41:d--;break;case 91:l++;break;case 93:l--;break;case 123:f++;break;case 125:f--}if(47===e){for(var v=r-1,h=void 0;v>=0&&" "===(h=t.charAt(v));v--);h&&kr.test(h)||(u=!0)}}else void 0===i?(p=r+1,i=t.slice(0,r).trim()):m();function m(){(o||(o=[])).push(t.slice(p,r).trim()),p=r+1}if(void 0===i?i=t.slice(0,r).trim():0!==p&&m(),o)for(r=0;r<o.length;r++)i=Pr(i,o[r]);return i}function Pr(t,e){var n=e.indexOf("(");if(n<0)return'_f("'+e+'")('+t+")";var r=e.slice(0,n),i=e.slice(n+1);return'_f("'+r+'")('+t+(")"!==i?","+i:i)}function Er(t,e){console.error("[Vue compiler]: "+t)}function Tr(t,e){return t?t.map((function(t){return t[e]})).filter((function(t){return t})):[]}function Fr(t,e,n,r,i){(t.props||(t.props=[])).push(Wr({name:e,value:n,dynamic:i},r)),t.plain=!1}function $r(t,e,n,r,i){(i?t.dynamicAttrs||(t.dynamicAttrs=[]):t.attrs||(t.attrs=[])).push(Wr({name:e,value:n,dynamic:i},r)),t.plain=!1}function Nr(t,e,n,r){t.attrsMap[e]=n,t.attrsList.push(Wr({name:e,value:n},r))}function Ir(t,e,n,r,i,o,a,s){(t.directives||(t.directives=[])).push(Wr({name:e,rawName:n,value:r,arg:i,isDynamicArg:o,modifiers:a},s)),t.plain=!1}function jr(t,e,n){return n?"_p("+e+',"'+t+'")':t+e}function Rr(t,e,n,i,o,a,s,c){var u;(i=i||r).right?c?e="("+e+")==='click'?'contextmenu':("+e+")":"click"===e&&(e="contextmenu",delete i.right):i.middle&&(c?e="("+e+")==='click'?'mouseup':("+e+")":"click"===e&&(e="mouseup")),i.capture&&(delete i.capture,e=jr("!",e,c)),i.once&&(delete i.once,e=jr("~",e,c)),i.passive&&(delete i.passive,e=jr("&",e,c)),i.native?(delete i.native,u=t.nativeEvents||(t.nativeEvents={})):u=t.events||(t.events={});var f=Wr({value:n.trim(),dynamic:c},s);i!==r&&(f.modifiers=i);var l=u[e];Array.isArray(l)?o?l.unshift(f):l.push(f):u[e]=l?o?[f,l]:[l,f]:f,t.plain=!1}function Lr(t,e,n){var r=Dr(t,":"+e)||Dr(t,"v-bind:"+e);if(null!=r)return Cr(r);if(!1!==n){var i=Dr(t,e);if(null!=i)return JSON.stringify(i)}}function Dr(t,e,n){var r;if(null!=(r=t.attrsMap[e]))for(var i=t.attrsList,o=0,a=i.length;o<a;o++)if(i[o].name===e){i.splice(o,1);break}return n&&delete t.attrsMap[e],r}function Br(t,e){for(var n=t.attrsList,r=0,i=n.length;r<i;r++){var o=n[r];if(e.test(o.name))return n.splice(r,1),o}}function Wr(t,e){return e&&(null!=e.start&&(t.start=e.start),null!=e.end&&(t.end=e.end)),t}function Gr(t,e,n){var r=n||{},i=r.number,o="$$v";r.trim&&(o="(typeof $$v === 'string'? $$v.trim(): $$v)"),i&&(o="_n("+o+")");var a=Ur(e,o);t.model={value:"("+e+")",expression:JSON.stringify(e),callback:"function ($$v) {"+a+"}"}}function Ur(t,e){var n=function(t){if(t=t.trim(),_r=t.length,t.indexOf("[")<0||t.lastIndexOf("]")<_r-1)return(Sr=t.lastIndexOf("."))>-1?{exp:t.slice(0,Sr),key:'"'+t.slice(Sr+1)+'"'}:{exp:t,key:null};wr=t,Sr=Or=Mr=0;for(;!Vr();)Hr(xr=zr())?Kr(xr):91===xr&&qr(xr);return{exp:t.slice(0,Or),key:t.slice(Or+1,Mr)}}(t);return null===n.key?t+"="+e:"$set("+n.exp+", "+n.key+", "+e+")"}function zr(){return wr.charCodeAt(++Sr)}function Vr(){return Sr>=_r}function Hr(t){return 34===t||39===t}function qr(t){var e=1;for(Or=Sr;!Vr();)if(Hr(t=zr()))Kr(t);else if(91===t&&e++,93===t&&e--,0===e){Mr=Sr;break}}function Kr(t){for(var e=t;!Vr()&&(t=zr())!==e;);}var Jr;function Xr(t,e,n){var r=Jr;return function i(){var o=e.apply(null,arguments);null!==o&&Zr(t,i,n,r)}}var Yr=Jt&&!(et&&Number(et[1])<=53);function Qr(t,e,n,r){if(Yr){var i=un,o=e;e=o._wrapper=function(t){if(t.target===t.currentTarget||t.timeStamp>=i||t.timeStamp<=0||t.target.ownerDocument!==document)return o.apply(this,arguments)}}Jr.addEventListener(t,e,rt?{capture:n,passive:r}:n)}function Zr(t,e,n,r){(r||Jr).removeEventListener(t,e._wrapper||e,n)}function ti(t,e){if(!i(t.data.on)||!i(e.data.on)){var n=e.data.on||{},r=t.data.on||{};Jr=e.elm,function(t){if(o(t.__r)){var e=Y?"change":"input";t[e]=[].concat(t.__r,t[e]||[]),delete t.__r}o(t.__c)&&(t.change=[].concat(t.__c,t.change||[]),delete t.__c)}(n),ce(n,r,Qr,Zr,Xr,e.context),Jr=void 0}}var ei,ni={create:ti,update:ti};function ri(t,e){if(!i(t.data.domProps)||!i(e.data.domProps)){var n,r,a=e.elm,s=t.data.domProps||{},c=e.data.domProps||{};for(n in o(c.__ob__)&&(c=e.data.domProps=E({},c)),s)n in c||(a[n]="");for(n in c){if(r=c[n],"textContent"===n||"innerHTML"===n){if(e.children&&(e.children.length=0),r===s[n])continue;1===a.childNodes.length&&a.removeChild(a.childNodes[0])}if("value"===n&&"PROGRESS"!==a.tagName){a._value=r;var u=i(r)?"":String(r);ii(a,u)&&(a.value=u)}else if("innerHTML"===n&&Jn(a.tagName)&&i(a.innerHTML)){(ei=ei||document.createElement("div")).innerHTML="<svg>"+r+"</svg>";for(var f=ei.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;f.firstChild;)a.appendChild(f.firstChild)}else if(r!==s[n])try{a[n]=r}catch(t){}}}}function ii(t,e){return!t.composing&&("OPTION"===t.tagName||function(t,e){var n=!0;try{n=document.activeElement!==t}catch(t){}return n&&t.value!==e}(t,e)||function(t,e){var n=t.value,r=t._vModifiers;if(o(r)){if(r.number)return h(n)!==h(e);if(r.trim)return n.trim()!==e.trim()}return n!==e}(t,e))}var oi={create:ri,update:ri},ai=x((function(t){var e={},n=/:(.+)/;return t.split(/;(?![^(]*\))/g).forEach((function(t){if(t){var r=t.split(n);r.length>1&&(e[r[0].trim()]=r[1].trim())}})),e}));function si(t){var e=ci(t.style);return t.staticStyle?E(t.staticStyle,e):e}function ci(t){return Array.isArray(t)?T(t):"string"==typeof t?ai(t):t}var ui,fi=/^--/,li=/\s*!important$/,di=function(t,e,n){if(fi.test(e))t.style.setProperty(e,n);else if(li.test(n))t.style.setProperty(k(e),n.replace(li,""),"important");else{var r=vi(e);if(Array.isArray(n))for(var i=0,o=n.length;i<o;i++)t.style[r]=n[i];else t.style[r]=n}},pi=["Webkit","Moz","ms"],vi=x((function(t){if(ui=ui||document.createElement("div").style,"filter"!==(t=O(t))&&t in ui)return t;for(var e=t.charAt(0).toUpperCase()+t.slice(1),n=0;n<pi.length;n++){var r=pi[n]+e;if(r in ui)return r}}));function hi(t,e){var n=e.data,r=t.data;if(!(i(n.staticStyle)&&i(n.style)&&i(r.staticStyle)&&i(r.style))){var a,s,c=e.elm,u=r.staticStyle,f=r.normalizedStyle||r.style||{},l=u||f,d=ci(e.data.style)||{};e.data.normalizedStyle=o(d.__ob__)?E({},d):d;var p=function(t,e){var n,r={};if(e)for(var i=t;i.componentInstance;)(i=i.componentInstance._vnode)&&i.data&&(n=si(i.data))&&E(r,n);(n=si(t.data))&&E(r,n);for(var o=t;o=o.parent;)o.data&&(n=si(o.data))&&E(r,n);return r}(e,!0);for(s in l)i(p[s])&&di(c,s,"");for(s in p)(a=p[s])!==l[s]&&di(c,s,null==a?"":a)}}var mi={create:hi,update:hi},gi=/\s+/;function yi(t,e){if(e&&(e=e.trim()))if(t.classList)e.indexOf(" ")>-1?e.split(gi).forEach((function(e){return t.classList.add(e)})):t.classList.add(e);else{var n=" "+(t.getAttribute("class")||"")+" ";n.indexOf(" "+e+" ")<0&&t.setAttribute("class",(n+e).trim())}}function bi(t,e){if(e&&(e=e.trim()))if(t.classList)e.indexOf(" ")>-1?e.split(gi).forEach((function(e){return t.classList.remove(e)})):t.classList.remove(e),t.classList.length||t.removeAttribute("class");else{for(var n=" "+(t.getAttribute("class")||"")+" ",r=" "+e+" ";n.indexOf(r)>=0;)n=n.replace(r," ");(n=n.trim())?t.setAttribute("class",n):t.removeAttribute("class")}}function _i(t){if(t){if("object"==typeof t){var e={};return!1!==t.css&&E(e,wi(t.name||"v")),E(e,t),e}return"string"==typeof t?wi(t):void 0}}var wi=x((function(t){return{enterClass:t+"-enter",enterToClass:t+"-enter-to",enterActiveClass:t+"-enter-active",leaveClass:t+"-leave",leaveToClass:t+"-leave-to",leaveActiveClass:t+"-leave-active"}})),xi=q&&!Q,Si="transition",Oi="transitionend",Mi="animation",Ai="animationend";xi&&(void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend&&(Si="WebkitTransition",Oi="webkitTransitionEnd"),void 0===window.onanimationend&&void 0!==window.onwebkitanimationend&&(Mi="WebkitAnimation",Ai="webkitAnimationEnd"));var ki=q?window.requestAnimationFrame?window.requestAnimationFrame.bind(window):setTimeout:function(t){return t()};function Ci(t){ki((function(){ki(t)}))}function Pi(t,e){var n=t._transitionClasses||(t._transitionClasses=[]);n.indexOf(e)<0&&(n.push(e),yi(t,e))}function Ei(t,e){t._transitionClasses&&b(t._transitionClasses,e),bi(t,e)}function Ti(t,e,n){var r=$i(t,e),i=r.type,o=r.timeout,a=r.propCount;if(!i)return n();var s="transition"===i?Oi:Ai,c=0,u=function(){t.removeEventListener(s,f),n()},f=function(e){e.target===t&&++c>=a&&u()};setTimeout((function(){c<a&&u()}),o+1),t.addEventListener(s,f)}var Fi=/\b(transform|all)(,|$)/;function $i(t,e){var n,r=window.getComputedStyle(t),i=(r[Si+"Delay"]||"").split(", "),o=(r[Si+"Duration"]||"").split(", "),a=Ni(i,o),s=(r[Mi+"Delay"]||"").split(", "),c=(r[Mi+"Duration"]||"").split(", "),u=Ni(s,c),f=0,l=0;return"transition"===e?a>0&&(n="transition",f=a,l=o.length):"animation"===e?u>0&&(n="animation",f=u,l=c.length):l=(n=(f=Math.max(a,u))>0?a>u?"transition":"animation":null)?"transition"===n?o.length:c.length:0,{type:n,timeout:f,propCount:l,hasTransform:"transition"===n&&Fi.test(r[Si+"Property"])}}function Ni(t,e){for(;t.length<e.length;)t=t.concat(t);return Math.max.apply(null,e.map((function(e,n){return Ii(e)+Ii(t[n])})))}function Ii(t){return 1e3*Number(t.slice(0,-1).replace(",","."))}function ji(t,e){var n=t.elm;o(n._leaveCb)&&(n._leaveCb.cancelled=!0,n._leaveCb());var r=_i(t.data.transition);if(!i(r)&&!o(n._enterCb)&&1===n.nodeType){for(var a=r.css,s=r.type,u=r.enterClass,f=r.enterToClass,l=r.enterActiveClass,d=r.appearClass,p=r.appearToClass,v=r.appearActiveClass,m=r.beforeEnter,g=r.enter,y=r.afterEnter,b=r.enterCancelled,_=r.beforeAppear,w=r.appear,x=r.afterAppear,S=r.appearCancelled,O=r.duration,M=Ye,A=Ye.$vnode;A&&A.parent;)M=A.context,A=A.parent;var k=!M._isMounted||!t.isRootInsert;if(!k||w||""===w){var C=k&&d?d:u,P=k&&v?v:l,E=k&&p?p:f,T=k&&_||m,F=k&&"function"==typeof w?w:g,$=k&&x||y,N=k&&S||b,I=h(c(O)?O.enter:O);0;var j=!1!==a&&!Q,L=Di(F),D=n._enterCb=R((function(){j&&(Ei(n,E),Ei(n,P)),D.cancelled?(j&&Ei(n,C),N&&N(n)):$&&$(n),n._enterCb=null}));t.data.show||ue(t,"insert",(function(){var e=n.parentNode,r=e&&e._pending&&e._pending[t.key];r&&r.tag===t.tag&&r.elm._leaveCb&&r.elm._leaveCb(),F&&F(n,D)})),T&&T(n),j&&(Pi(n,C),Pi(n,P),Ci((function(){Ei(n,C),D.cancelled||(Pi(n,E),L||(Li(I)?setTimeout(D,I):Ti(n,s,D)))}))),t.data.show&&(e&&e(),F&&F(n,D)),j||L||D()}}}function Ri(t,e){var n=t.elm;o(n._enterCb)&&(n._enterCb.cancelled=!0,n._enterCb());var r=_i(t.data.transition);if(i(r)||1!==n.nodeType)return e();if(!o(n._leaveCb)){var a=r.css,s=r.type,u=r.leaveClass,f=r.leaveToClass,l=r.leaveActiveClass,d=r.beforeLeave,p=r.leave,v=r.afterLeave,m=r.leaveCancelled,g=r.delayLeave,y=r.duration,b=!1!==a&&!Q,_=Di(p),w=h(c(y)?y.leave:y);0;var x=n._leaveCb=R((function(){n.parentNode&&n.parentNode._pending&&(n.parentNode._pending[t.key]=null),b&&(Ei(n,f),Ei(n,l)),x.cancelled?(b&&Ei(n,u),m&&m(n)):(e(),v&&v(n)),n._leaveCb=null}));g?g(S):S()}function S(){x.cancelled||(!t.data.show&&n.parentNode&&((n.parentNode._pending||(n.parentNode._pending={}))[t.key]=t),d&&d(n),b&&(Pi(n,u),Pi(n,l),Ci((function(){Ei(n,u),x.cancelled||(Pi(n,f),_||(Li(w)?setTimeout(x,w):Ti(n,s,x)))}))),p&&p(n,x),b||_||x())}}function Li(t){return"number"==typeof t&&!isNaN(t)}function Di(t){if(i(t))return!1;var e=t.fns;return o(e)?Di(Array.isArray(e)?e[0]:e):(t._length||t.length)>1}function Bi(t,e){!0!==e.data.show&&ji(e)}var Wi=function(t){var e,n,r={},c=t.modules,u=t.nodeOps;for(e=0;e<or.length;++e)for(r[or[e]]=[],n=0;n<c.length;++n)o(c[n][or[e]])&&r[or[e]].push(c[n][or[e]]);function f(t){var e=u.parentNode(t);o(e)&&u.removeChild(e,t)}function l(t,e,n,i,s,c,f){if(o(t.elm)&&o(c)&&(t=c[f]=_t(t)),t.isRootInsert=!s,!function(t,e,n,i){var s=t.data;if(o(s)){var c=o(t.componentInstance)&&s.keepAlive;if(o(s=s.hook)&&o(s=s.init)&&s(t,!1),o(t.componentInstance))return d(t,e),p(n,t.elm,i),a(c)&&function(t,e,n,i){var a,s=t;for(;s.componentInstance;)if(s=s.componentInstance._vnode,o(a=s.data)&&o(a=a.transition)){for(a=0;a<r.activate.length;++a)r.activate[a](ir,s);e.push(s);break}p(n,t.elm,i)}(t,e,n,i),!0}}(t,e,n,i)){var l=t.data,h=t.children,m=t.tag;o(m)?(t.elm=t.ns?u.createElementNS(t.ns,m):u.createElement(m,t),y(t),v(t,h,e),o(l)&&g(t,e),p(n,t.elm,i)):a(t.isComment)?(t.elm=u.createComment(t.text),p(n,t.elm,i)):(t.elm=u.createTextNode(t.text),p(n,t.elm,i))}}function d(t,e){o(t.data.pendingInsert)&&(e.push.apply(e,t.data.pendingInsert),t.data.pendingInsert=null),t.elm=t.componentInstance.$el,h(t)?(g(t,e),y(t)):(rr(t),e.push(t))}function p(t,e,n){o(t)&&(o(n)?u.parentNode(n)===t&&u.insertBefore(t,e,n):u.appendChild(t,e))}function v(t,e,n){if(Array.isArray(e)){0;for(var r=0;r<e.length;++r)l(e[r],n,t.elm,null,!0,e,r)}else s(t.text)&&u.appendChild(t.elm,u.createTextNode(String(t.text)))}function h(t){for(;t.componentInstance;)t=t.componentInstance._vnode;return o(t.tag)}function g(t,n){for(var i=0;i<r.create.length;++i)r.create[i](ir,t);o(e=t.data.hook)&&(o(e.create)&&e.create(ir,t),o(e.insert)&&n.push(t))}function y(t){var e;if(o(e=t.fnScopeId))u.setStyleScope(t.elm,e);else for(var n=t;n;)o(e=n.context)&&o(e=e.$options._scopeId)&&u.setStyleScope(t.elm,e),n=n.parent;o(e=Ye)&&e!==t.context&&e!==t.fnContext&&o(e=e.$options._scopeId)&&u.setStyleScope(t.elm,e)}function b(t,e,n,r,i,o){for(;r<=i;++r)l(n[r],o,t,e,!1,n,r)}function _(t){var e,n,i=t.data;if(o(i))for(o(e=i.hook)&&o(e=e.destroy)&&e(t),e=0;e<r.destroy.length;++e)r.destroy[e](t);if(o(e=t.children))for(n=0;n<t.children.length;++n)_(t.children[n])}function w(t,e,n){for(;e<=n;++e){var r=t[e];o(r)&&(o(r.tag)?(x(r),_(r)):f(r.elm))}}function x(t,e){if(o(e)||o(t.data)){var n,i=r.remove.length+1;for(o(e)?e.listeners+=i:e=function(t,e){function n(){0==--n.listeners&&f(t)}return n.listeners=e,n}(t.elm,i),o(n=t.componentInstance)&&o(n=n._vnode)&&o(n.data)&&x(n,e),n=0;n<r.remove.length;++n)r.remove[n](t,e);o(n=t.data.hook)&&o(n=n.remove)?n(t,e):e()}else f(t.elm)}function S(t,e,n,r){for(var i=n;i<r;i++){var a=e[i];if(o(a)&&ar(t,a))return i}}function O(t,e,n,s,c,f){if(t!==e){o(e.elm)&&o(s)&&(e=s[c]=_t(e));var d=e.elm=t.elm;if(a(t.isAsyncPlaceholder))o(e.asyncFactory.resolved)?k(t.elm,e,n):e.isAsyncPlaceholder=!0;else if(a(e.isStatic)&&a(t.isStatic)&&e.key===t.key&&(a(e.isCloned)||a(e.isOnce)))e.componentInstance=t.componentInstance;else{var p,v=e.data;o(v)&&o(p=v.hook)&&o(p=p.prepatch)&&p(t,e);var m=t.children,g=e.children;if(o(v)&&h(e)){for(p=0;p<r.update.length;++p)r.update[p](t,e);o(p=v.hook)&&o(p=p.update)&&p(t,e)}i(e.text)?o(m)&&o(g)?m!==g&&function(t,e,n,r,a){var s,c,f,d=0,p=0,v=e.length-1,h=e[0],m=e[v],g=n.length-1,y=n[0],_=n[g],x=!a;for(0;d<=v&&p<=g;)i(h)?h=e[++d]:i(m)?m=e[--v]:ar(h,y)?(O(h,y,r,n,p),h=e[++d],y=n[++p]):ar(m,_)?(O(m,_,r,n,g),m=e[--v],_=n[--g]):ar(h,_)?(O(h,_,r,n,g),x&&u.insertBefore(t,h.elm,u.nextSibling(m.elm)),h=e[++d],_=n[--g]):ar(m,y)?(O(m,y,r,n,p),x&&u.insertBefore(t,m.elm,h.elm),m=e[--v],y=n[++p]):(i(s)&&(s=sr(e,d,v)),i(c=o(y.key)?s[y.key]:S(y,e,d,v))?l(y,r,t,h.elm,!1,n,p):ar(f=e[c],y)?(O(f,y,r,n,p),e[c]=void 0,x&&u.insertBefore(t,f.elm,h.elm)):l(y,r,t,h.elm,!1,n,p),y=n[++p]);d>v?b(t,i(n[g+1])?null:n[g+1].elm,n,p,g,r):p>g&&w(e,d,v)}(d,m,g,n,f):o(g)?(o(t.text)&&u.setTextContent(d,""),b(d,null,g,0,g.length-1,n)):o(m)?w(m,0,m.length-1):o(t.text)&&u.setTextContent(d,""):t.text!==e.text&&u.setTextContent(d,e.text),o(v)&&o(p=v.hook)&&o(p=p.postpatch)&&p(t,e)}}}function M(t,e,n){if(a(n)&&o(t.parent))t.parent.data.pendingInsert=e;else for(var r=0;r<e.length;++r)e[r].data.hook.insert(e[r])}var A=m("attrs,class,staticClass,staticStyle,key");function k(t,e,n,r){var i,s=e.tag,c=e.data,u=e.children;if(r=r||c&&c.pre,e.elm=t,a(e.isComment)&&o(e.asyncFactory))return e.isAsyncPlaceholder=!0,!0;if(o(c)&&(o(i=c.hook)&&o(i=i.init)&&i(e,!0),o(i=e.componentInstance)))return d(e,n),!0;if(o(s)){if(o(u))if(t.hasChildNodes())if(o(i=c)&&o(i=i.domProps)&&o(i=i.innerHTML)){if(i!==t.innerHTML)return!1}else{for(var f=!0,l=t.firstChild,p=0;p<u.length;p++){if(!l||!k(l,u[p],n,r)){f=!1;break}l=l.nextSibling}if(!f||l)return!1}else v(e,u,n);if(o(c)){var h=!1;for(var m in c)if(!A(m)){h=!0,g(e,n);break}!h&&c.class&&oe(c.class)}}else t.data!==e.text&&(t.data=e.text);return!0}return function(t,e,n,s){if(!i(e)){var c,f=!1,d=[];if(i(t))f=!0,l(e,d);else{var p=o(t.nodeType);if(!p&&ar(t,e))O(t,e,d,null,null,s);else{if(p){if(1===t.nodeType&&t.hasAttribute("data-server-rendered")&&(t.removeAttribute("data-server-rendered"),n=!0),a(n)&&k(t,e,d))return M(e,d,!0),t;c=t,t=new mt(u.tagName(c).toLowerCase(),{},[],void 0,c)}var v=t.elm,m=u.parentNode(v);if(l(e,d,v._leaveCb?null:m,u.nextSibling(v)),o(e.parent))for(var g=e.parent,y=h(e);g;){for(var b=0;b<r.destroy.length;++b)r.destroy[b](g);if(g.elm=e.elm,y){for(var x=0;x<r.create.length;++x)r.create[x](ir,g);var S=g.data.hook.insert;if(S.merged)for(var A=1;A<S.fns.length;A++)S.fns[A]()}else rr(g);g=g.parent}o(m)?w([t],0,0):o(t.tag)&&_(t)}}return M(e,d,f),e.elm}o(t)&&_(t)}}({nodeOps:er,modules:[yr,Ar,ni,oi,mi,q?{create:Bi,activate:Bi,remove:function(t,e){!0!==t.data.show?Ri(t,e):e()}}:{}].concat(vr)});Q&&document.addEventListener("selectionchange",(function(){var t=document.activeElement;t&&t.vmodel&&Ji(t,"input")}));var Gi={inserted:function(t,e,n,r){"select"===n.tag?(r.elm&&!r.elm._vOptions?ue(n,"postpatch",(function(){Gi.componentUpdated(t,e,n)})):Ui(t,e,n.context),t._vOptions=[].map.call(t.options,Hi)):("textarea"===n.tag||Zn(t.type))&&(t._vModifiers=e.modifiers,e.modifiers.lazy||(t.addEventListener("compositionstart",qi),t.addEventListener("compositionend",Ki),t.addEventListener("change",Ki),Q&&(t.vmodel=!0)))},componentUpdated:function(t,e,n){if("select"===n.tag){Ui(t,e,n.context);var r=t._vOptions,i=t._vOptions=[].map.call(t.options,Hi);if(i.some((function(t,e){return!I(t,r[e])})))(t.multiple?e.value.some((function(t){return Vi(t,i)})):e.value!==e.oldValue&&Vi(e.value,i))&&Ji(t,"change")}}};function Ui(t,e,n){zi(t,e,n),(Y||Z)&&setTimeout((function(){zi(t,e,n)}),0)}function zi(t,e,n){var r=e.value,i=t.multiple;if(!i||Array.isArray(r)){for(var o,a,s=0,c=t.options.length;s<c;s++)if(a=t.options[s],i)o=j(r,Hi(a))>-1,a.selected!==o&&(a.selected=o);else if(I(Hi(a),r))return void(t.selectedIndex!==s&&(t.selectedIndex=s));i||(t.selectedIndex=-1)}}function Vi(t,e){return e.every((function(e){return!I(e,t)}))}function Hi(t){return"_value"in t?t._value:t.value}function qi(t){t.target.composing=!0}function Ki(t){t.target.composing&&(t.target.composing=!1,Ji(t.target,"input"))}function Ji(t,e){var n=document.createEvent("HTMLEvents");n.initEvent(e,!0,!0),t.dispatchEvent(n)}function Xi(t){return!t.componentInstance||t.data&&t.data.transition?t:Xi(t.componentInstance._vnode)}var Yi={model:Gi,show:{bind:function(t,e,n){var r=e.value,i=(n=Xi(n)).data&&n.data.transition,o=t.__vOriginalDisplay="none"===t.style.display?"":t.style.display;r&&i?(n.data.show=!0,ji(n,(function(){t.style.display=o}))):t.style.display=r?o:"none"},update:function(t,e,n){var r=e.value;!r!=!e.oldValue&&((n=Xi(n)).data&&n.data.transition?(n.data.show=!0,r?ji(n,(function(){t.style.display=t.__vOriginalDisplay})):Ri(n,(function(){t.style.display="none"}))):t.style.display=r?t.__vOriginalDisplay:"none")},unbind:function(t,e,n,r,i){i||(t.style.display=t.__vOriginalDisplay)}}},Qi={name:String,appear:Boolean,css:Boolean,mode:String,type:String,enterClass:String,leaveClass:String,enterToClass:String,leaveToClass:String,enterActiveClass:String,leaveActiveClass:String,appearClass:String,appearActiveClass:String,appearToClass:String,duration:[Number,String,Object]};function Zi(t){var e=t&&t.componentOptions;return e&&e.Ctor.options.abstract?Zi(He(e.children)):t}function to(t){var e={},n=t.$options;for(var r in n.propsData)e[r]=t[r];var i=n._parentListeners;for(var o in i)e[O(o)]=i[o];return e}function eo(t,e){if(/\d-keep-alive$/.test(e.tag))return t("keep-alive",{props:e.componentOptions.propsData})}var no=function(t){return t.tag||Ve(t)},ro=function(t){return"show"===t.name},io={name:"transition",props:Qi,abstract:!0,render:function(t){var e=this,n=this.$slots.default;if(n&&(n=n.filter(no)).length){0;var r=this.mode;0;var i=n[0];if(function(t){for(;t=t.parent;)if(t.data.transition)return!0}(this.$vnode))return i;var o=Zi(i);if(!o)return i;if(this._leaving)return eo(t,i);var a="__transition-"+this._uid+"-";o.key=null==o.key?o.isComment?a+"comment":a+o.tag:s(o.key)?0===String(o.key).indexOf(a)?o.key:a+o.key:o.key;var c=(o.data||(o.data={})).transition=to(this),u=this._vnode,f=Zi(u);if(o.data.directives&&o.data.directives.some(ro)&&(o.data.show=!0),f&&f.data&&!function(t,e){return e.key===t.key&&e.tag===t.tag}(o,f)&&!Ve(f)&&(!f.componentInstance||!f.componentInstance._vnode.isComment)){var l=f.data.transition=E({},c);if("out-in"===r)return this._leaving=!0,ue(l,"afterLeave",(function(){e._leaving=!1,e.$forceUpdate()})),eo(t,i);if("in-out"===r){if(Ve(o))return u;var d,p=function(){d()};ue(c,"afterEnter",p),ue(c,"enterCancelled",p),ue(l,"delayLeave",(function(t){d=t}))}}return i}}},oo=E({tag:String,moveClass:String},Qi);function ao(t){t.elm._moveCb&&t.elm._moveCb(),t.elm._enterCb&&t.elm._enterCb()}function so(t){t.data.newPos=t.elm.getBoundingClientRect()}function co(t){var e=t.data.pos,n=t.data.newPos,r=e.left-n.left,i=e.top-n.top;if(r||i){t.data.moved=!0;var o=t.elm.style;o.transform=o.WebkitTransform="translate("+r+"px,"+i+"px)",o.transitionDuration="0s"}}delete oo.mode;var uo={Transition:io,TransitionGroup:{props:oo,beforeMount:function(){var t=this,e=this._update;this._update=function(n,r){var i=Qe(t);t.__patch__(t._vnode,t.kept,!1,!0),t._vnode=t.kept,i(),e.call(t,n,r)}},render:function(t){for(var e=this.tag||this.$vnode.data.tag||"span",n=Object.create(null),r=this.prevChildren=this.children,i=this.$slots.default||[],o=this.children=[],a=to(this),s=0;s<i.length;s++){var c=i[s];if(c.tag)if(null!=c.key&&0!==String(c.key).indexOf("__vlist"))o.push(c),n[c.key]=c,(c.data||(c.data={})).transition=a;else;}if(r){for(var u=[],f=[],l=0;l<r.length;l++){var d=r[l];d.data.transition=a,d.data.pos=d.elm.getBoundingClientRect(),n[d.key]?u.push(d):f.push(d)}this.kept=t(e,null,u),this.removed=f}return t(e,null,o)},updated:function(){var t=this.prevChildren,e=this.moveClass||(this.name||"v")+"-move";t.length&&this.hasMove(t[0].elm,e)&&(t.forEach(ao),t.forEach(so),t.forEach(co),this._reflow=document.body.offsetHeight,t.forEach((function(t){if(t.data.moved){var n=t.elm,r=n.style;Pi(n,e),r.transform=r.WebkitTransform=r.transitionDuration="",n.addEventListener(Oi,n._moveCb=function t(r){r&&r.target!==n||r&&!/transform$/.test(r.propertyName)||(n.removeEventListener(Oi,t),n._moveCb=null,Ei(n,e))})}})))},methods:{hasMove:function(t,e){if(!xi)return!1;if(this._hasMove)return this._hasMove;var n=t.cloneNode();t._transitionClasses&&t._transitionClasses.forEach((function(t){bi(n,t)})),yi(n,e),n.style.display="none",this.$el.appendChild(n);var r=$i(n);return this.$el.removeChild(n),this._hasMove=r.hasTransform}}}};Mn.config.mustUseProp=In,Mn.config.isReservedTag=Xn,Mn.config.isReservedAttr=$n,Mn.config.getTagNamespace=Yn,Mn.config.isUnknownElement=function(t){if(!q)return!0;if(Xn(t))return!1;if(t=t.toLowerCase(),null!=Qn[t])return Qn[t];var e=document.createElement(t);return t.indexOf("-")>-1?Qn[t]=e.constructor===window.HTMLUnknownElement||e.constructor===window.HTMLElement:Qn[t]=/HTMLUnknownElement/.test(e.toString())},E(Mn.options.directives,Yi),E(Mn.options.components,uo),Mn.prototype.__patch__=q?Wi:F,Mn.prototype.$mount=function(t,e){return function(t,e,n){var r;return t.$el=e,t.$options.render||(t.$options.render=yt),en(t,"beforeMount"),r=function(){t._update(t._render(),n)},new vn(t,r,F,{before:function(){t._isMounted&&!t._isDestroyed&&en(t,"beforeUpdate")}},!0),n=!1,null==t.$vnode&&(t._isMounted=!0,en(t,"mounted")),t}(this,t=t&&q?tr(t):void 0,e)},q&&setTimeout((function(){B.devtools&&at&&at.emit("init",Mn)}),0);var fo=/\{\{((?:.|\r?\n)+?)\}\}/g,lo=/[-.*+?^${}()|[\]\/\\]/g,po=x((function(t){var e=t[0].replace(lo,"\\$&"),n=t[1].replace(lo,"\\$&");return new RegExp(e+"((?:.|\\n)+?)"+n,"g")}));var vo={staticKeys:["staticClass"],transformNode:function(t,e){e.warn;var n=Dr(t,"class");n&&(t.staticClass=JSON.stringify(n));var r=Lr(t,"class",!1);r&&(t.classBinding=r)},genData:function(t){var e="";return t.staticClass&&(e+="staticClass:"+t.staticClass+","),t.classBinding&&(e+="class:"+t.classBinding+","),e}};var ho,mo={staticKeys:["staticStyle"],transformNode:function(t,e){e.warn;var n=Dr(t,"style");n&&(t.staticStyle=JSON.stringify(ai(n)));var r=Lr(t,"style",!1);r&&(t.styleBinding=r)},genData:function(t){var e="";return t.staticStyle&&(e+="staticStyle:"+t.staticStyle+","),t.styleBinding&&(e+="style:("+t.styleBinding+"),"),e}},go=function(t){return(ho=ho||document.createElement("div")).innerHTML=t,ho.textContent},yo=m("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr"),bo=m("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source"),_o=m("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"),wo=/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,xo=/^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,So="[a-zA-Z_][\\-\\.0-9_a-zA-Z"+W.source+"]*",Oo="((?:"+So+"\\:)?"+So+")",Mo=new RegExp("^<"+Oo),Ao=/^\s*(\/?)>/,ko=new RegExp("^<\\/"+Oo+"[^>]*>"),Co=/^<!DOCTYPE [^>]+>/i,Po=/^<!\--/,Eo=/^<!\[/,To=m("script,style,textarea",!0),Fo={},$o={"&lt;":"<","&gt;":">","&quot;":'"',"&amp;":"&","&#10;":"\n","&#9;":"\t","&#39;":"'"},No=/&(?:lt|gt|quot|amp|#39);/g,Io=/&(?:lt|gt|quot|amp|#39|#10|#9);/g,jo=m("pre,textarea",!0),Ro=function(t,e){return t&&jo(t)&&"\n"===e[0]};function Lo(t,e){var n=e?Io:No;return t.replace(n,(function(t){return $o[t]}))}var Do,Bo,Wo,Go,Uo,zo,Vo,Ho,qo=/^@|^v-on:/,Ko=/^v-|^@|^:|^#/,Jo=/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,Xo=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,Yo=/^\(|\)$/g,Qo=/^\[.*\]$/,Zo=/:(.*)$/,ta=/^:|^\.|^v-bind:/,ea=/\.[^.\]]+(?=[^\]]*$)/g,na=/^v-slot(:|$)|^#/,ra=/[\r\n]/,ia=/\s+/g,oa=x(go);function aa(t,e,n){return{type:1,tag:t,attrsList:e,attrsMap:pa(e),rawAttrsMap:{},parent:n,children:[]}}function sa(t,e){Do=e.warn||Er,zo=e.isPreTag||$,Vo=e.mustUseProp||$,Ho=e.getTagNamespace||$;var n=e.isReservedTag||$;(function(t){return!!t.component||!n(t.tag)}),Wo=Tr(e.modules,"transformNode"),Go=Tr(e.modules,"preTransformNode"),Uo=Tr(e.modules,"postTransformNode"),Bo=e.delimiters;var r,i,o=[],a=!1!==e.preserveWhitespace,s=e.whitespace,c=!1,u=!1;function f(t){if(l(t),c||t.processed||(t=ca(t,e)),o.length||t===r||r.if&&(t.elseif||t.else)&&fa(r,{exp:t.elseif,block:t}),i&&!t.forbidden)if(t.elseif||t.else)a=t,(s=function(t){for(var e=t.length;e--;){if(1===t[e].type)return t[e];t.pop()}}(i.children))&&s.if&&fa(s,{exp:a.elseif,block:a});else{if(t.slotScope){var n=t.slotTarget||'"default"';(i.scopedSlots||(i.scopedSlots={}))[n]=t}i.children.push(t),t.parent=i}var a,s;t.children=t.children.filter((function(t){return!t.slotScope})),l(t),t.pre&&(c=!1),zo(t.tag)&&(u=!1);for(var f=0;f<Uo.length;f++)Uo[f](t,e)}function l(t){if(!u)for(var e;(e=t.children[t.children.length-1])&&3===e.type&&" "===e.text;)t.children.pop()}return function(t,e){for(var n,r,i=[],o=e.expectHTML,a=e.isUnaryTag||$,s=e.canBeLeftOpenTag||$,c=0;t;){if(n=t,r&&To(r)){var u=0,f=r.toLowerCase(),l=Fo[f]||(Fo[f]=new RegExp("([\\s\\S]*?)(</"+f+"[^>]*>)","i")),d=t.replace(l,(function(t,n,r){return u=r.length,To(f)||"noscript"===f||(n=n.replace(/<!\--([\s\S]*?)-->/g,"$1").replace(/<!\[CDATA\[([\s\S]*?)]]>/g,"$1")),Ro(f,n)&&(n=n.slice(1)),e.chars&&e.chars(n),""}));c+=t.length-d.length,t=d,A(f,c-u,c)}else{var p=t.indexOf("<");if(0===p){if(Po.test(t)){var v=t.indexOf("--\x3e");if(v>=0){e.shouldKeepComment&&e.comment(t.substring(4,v),c,c+v+3),S(v+3);continue}}if(Eo.test(t)){var h=t.indexOf("]>");if(h>=0){S(h+2);continue}}var m=t.match(Co);if(m){S(m[0].length);continue}var g=t.match(ko);if(g){var y=c;S(g[0].length),A(g[1],y,c);continue}var b=O();if(b){M(b),Ro(b.tagName,t)&&S(1);continue}}var _=void 0,w=void 0,x=void 0;if(p>=0){for(w=t.slice(p);!(ko.test(w)||Mo.test(w)||Po.test(w)||Eo.test(w)||(x=w.indexOf("<",1))<0);)p+=x,w=t.slice(p);_=t.substring(0,p)}p<0&&(_=t),_&&S(_.length),e.chars&&_&&e.chars(_,c-_.length,c)}if(t===n){e.chars&&e.chars(t);break}}function S(e){c+=e,t=t.substring(e)}function O(){var e=t.match(Mo);if(e){var n,r,i={tagName:e[1],attrs:[],start:c};for(S(e[0].length);!(n=t.match(Ao))&&(r=t.match(xo)||t.match(wo));)r.start=c,S(r[0].length),r.end=c,i.attrs.push(r);if(n)return i.unarySlash=n[1],S(n[0].length),i.end=c,i}}function M(t){var n=t.tagName,c=t.unarySlash;o&&("p"===r&&_o(n)&&A(r),s(n)&&r===n&&A(n));for(var u=a(n)||!!c,f=t.attrs.length,l=new Array(f),d=0;d<f;d++){var p=t.attrs[d],v=p[3]||p[4]||p[5]||"",h="a"===n&&"href"===p[1]?e.shouldDecodeNewlinesForHref:e.shouldDecodeNewlines;l[d]={name:p[1],value:Lo(v,h)}}u||(i.push({tag:n,lowerCasedTag:n.toLowerCase(),attrs:l,start:t.start,end:t.end}),r=n),e.start&&e.start(n,l,u,t.start,t.end)}function A(t,n,o){var a,s;if(null==n&&(n=c),null==o&&(o=c),t)for(s=t.toLowerCase(),a=i.length-1;a>=0&&i[a].lowerCasedTag!==s;a--);else a=0;if(a>=0){for(var u=i.length-1;u>=a;u--)e.end&&e.end(i[u].tag,n,o);i.length=a,r=a&&i[a-1].tag}else"br"===s?e.start&&e.start(t,[],!0,n,o):"p"===s&&(e.start&&e.start(t,[],!1,n,o),e.end&&e.end(t,n,o))}A()}(t,{warn:Do,expectHTML:e.expectHTML,isUnaryTag:e.isUnaryTag,canBeLeftOpenTag:e.canBeLeftOpenTag,shouldDecodeNewlines:e.shouldDecodeNewlines,shouldDecodeNewlinesForHref:e.shouldDecodeNewlinesForHref,shouldKeepComment:e.comments,outputSourceRange:e.outputSourceRange,start:function(t,n,a,s,l){var d=i&&i.ns||Ho(t);Y&&"svg"===d&&(n=function(t){for(var e=[],n=0;n<t.length;n++){var r=t[n];va.test(r.name)||(r.name=r.name.replace(ha,""),e.push(r))}return e}(n));var p,v=aa(t,n,i);d&&(v.ns=d),"style"!==(p=v).tag&&("script"!==p.tag||p.attrsMap.type&&"text/javascript"!==p.attrsMap.type)||ot()||(v.forbidden=!0);for(var h=0;h<Go.length;h++)v=Go[h](v,e)||v;c||(!function(t){null!=Dr(t,"v-pre")&&(t.pre=!0)}(v),v.pre&&(c=!0)),zo(v.tag)&&(u=!0),c?function(t){var e=t.attrsList,n=e.length;if(n)for(var r=t.attrs=new Array(n),i=0;i<n;i++)r[i]={name:e[i].name,value:JSON.stringify(e[i].value)},null!=e[i].start&&(r[i].start=e[i].start,r[i].end=e[i].end);else t.pre||(t.plain=!0)}(v):v.processed||(ua(v),function(t){var e=Dr(t,"v-if");if(e)t.if=e,fa(t,{exp:e,block:t});else{null!=Dr(t,"v-else")&&(t.else=!0);var n=Dr(t,"v-else-if");n&&(t.elseif=n)}}(v),function(t){null!=Dr(t,"v-once")&&(t.once=!0)}(v)),r||(r=v),a?f(v):(i=v,o.push(v))},end:function(t,e,n){var r=o[o.length-1];o.length-=1,i=o[o.length-1],f(r)},chars:function(t,e,n){if(i&&(!Y||"textarea"!==i.tag||i.attrsMap.placeholder!==t)){var r,o,f,l=i.children;if(t=u||t.trim()?"script"===(r=i).tag||"style"===r.tag?t:oa(t):l.length?s?"condense"===s&&ra.test(t)?"":" ":a?" ":"":"")u||"condense"!==s||(t=t.replace(ia," ")),!c&&" "!==t&&(o=function(t,e){var n=e?po(e):fo;if(n.test(t)){for(var r,i,o,a=[],s=[],c=n.lastIndex=0;r=n.exec(t);){(i=r.index)>c&&(s.push(o=t.slice(c,i)),a.push(JSON.stringify(o)));var u=Cr(r[1].trim());a.push("_s("+u+")"),s.push({"@binding":u}),c=i+r[0].length}return c<t.length&&(s.push(o=t.slice(c)),a.push(JSON.stringify(o))),{expression:a.join("+"),tokens:s}}}(t,Bo))?f={type:2,expression:o.expression,tokens:o.tokens,text:t}:" "===t&&l.length&&" "===l[l.length-1].text||(f={type:3,text:t}),f&&l.push(f)}},comment:function(t,e,n){if(i){var r={type:3,text:t,isComment:!0};0,i.children.push(r)}}}),r}function ca(t,e){var n;!function(t){var e=Lr(t,"key");if(e){t.key=e}}(t),t.plain=!t.key&&!t.scopedSlots&&!t.attrsList.length,function(t){var e=Lr(t,"ref");e&&(t.ref=e,t.refInFor=function(t){var e=t;for(;e;){if(void 0!==e.for)return!0;e=e.parent}return!1}(t))}(t),function(t){var e;"template"===t.tag?(e=Dr(t,"scope"),t.slotScope=e||Dr(t,"slot-scope")):(e=Dr(t,"slot-scope"))&&(t.slotScope=e);var n=Lr(t,"slot");n&&(t.slotTarget='""'===n?'"default"':n,t.slotTargetDynamic=!(!t.attrsMap[":slot"]&&!t.attrsMap["v-bind:slot"]),"template"===t.tag||t.slotScope||$r(t,"slot",n,function(t,e){return t.rawAttrsMap[":"+e]||t.rawAttrsMap["v-bind:"+e]||t.rawAttrsMap[e]}(t,"slot")));if("template"===t.tag){var r=Br(t,na);if(r){0;var i=la(r),o=i.name,a=i.dynamic;t.slotTarget=o,t.slotTargetDynamic=a,t.slotScope=r.value||"_empty_"}}else{var s=Br(t,na);if(s){0;var c=t.scopedSlots||(t.scopedSlots={}),u=la(s),f=u.name,l=u.dynamic,d=c[f]=aa("template",[],t);d.slotTarget=f,d.slotTargetDynamic=l,d.children=t.children.filter((function(t){if(!t.slotScope)return t.parent=d,!0})),d.slotScope=s.value||"_empty_",t.children=[],t.plain=!1}}}(t),"slot"===(n=t).tag&&(n.slotName=Lr(n,"name")),function(t){var e;(e=Lr(t,"is"))&&(t.component=e);null!=Dr(t,"inline-template")&&(t.inlineTemplate=!0)}(t);for(var r=0;r<Wo.length;r++)t=Wo[r](t,e)||t;return function(t){var e,n,r,i,o,a,s,c,u=t.attrsList;for(e=0,n=u.length;e<n;e++){if(r=i=u[e].name,o=u[e].value,Ko.test(r))if(t.hasBindings=!0,(a=da(r.replace(Ko,"")))&&(r=r.replace(ea,"")),ta.test(r))r=r.replace(ta,""),o=Cr(o),(c=Qo.test(r))&&(r=r.slice(1,-1)),a&&(a.prop&&!c&&"innerHtml"===(r=O(r))&&(r="innerHTML"),a.camel&&!c&&(r=O(r)),a.sync&&(s=Ur(o,"$event"),c?Rr(t,'"update:"+('+r+")",s,null,!1,0,u[e],!0):(Rr(t,"update:"+O(r),s,null,!1,0,u[e]),k(r)!==O(r)&&Rr(t,"update:"+k(r),s,null,!1,0,u[e])))),a&&a.prop||!t.component&&Vo(t.tag,t.attrsMap.type,r)?Fr(t,r,o,u[e],c):$r(t,r,o,u[e],c);else if(qo.test(r))r=r.replace(qo,""),(c=Qo.test(r))&&(r=r.slice(1,-1)),Rr(t,r,o,a,!1,0,u[e],c);else{var f=(r=r.replace(Ko,"")).match(Zo),l=f&&f[1];c=!1,l&&(r=r.slice(0,-(l.length+1)),Qo.test(l)&&(l=l.slice(1,-1),c=!0)),Ir(t,r,i,o,l,c,a,u[e])}else $r(t,r,JSON.stringify(o),u[e]),!t.component&&"muted"===r&&Vo(t.tag,t.attrsMap.type,r)&&Fr(t,r,"true",u[e])}}(t),t}function ua(t){var e;if(e=Dr(t,"v-for")){var n=function(t){var e=t.match(Jo);if(!e)return;var n={};n.for=e[2].trim();var r=e[1].trim().replace(Yo,""),i=r.match(Xo);i?(n.alias=r.replace(Xo,"").trim(),n.iterator1=i[1].trim(),i[2]&&(n.iterator2=i[2].trim())):n.alias=r;return n}(e);n&&E(t,n)}}function fa(t,e){t.ifConditions||(t.ifConditions=[]),t.ifConditions.push(e)}function la(t){var e=t.name.replace(na,"");return e||"#"!==t.name[0]&&(e="default"),Qo.test(e)?{name:e.slice(1,-1),dynamic:!0}:{name:'"'+e+'"',dynamic:!1}}function da(t){var e=t.match(ea);if(e){var n={};return e.forEach((function(t){n[t.slice(1)]=!0})),n}}function pa(t){for(var e={},n=0,r=t.length;n<r;n++)e[t[n].name]=t[n].value;return e}var va=/^xmlns:NS\d+/,ha=/^NS\d+:/;function ma(t){return aa(t.tag,t.attrsList.slice(),t.parent)}var ga=[vo,mo,{preTransformNode:function(t,e){if("input"===t.tag){var n,r=t.attrsMap;if(!r["v-model"])return;if((r[":type"]||r["v-bind:type"])&&(n=Lr(t,"type")),r.type||n||!r["v-bind"]||(n="("+r["v-bind"]+").type"),n){var i=Dr(t,"v-if",!0),o=i?"&&("+i+")":"",a=null!=Dr(t,"v-else",!0),s=Dr(t,"v-else-if",!0),c=ma(t);ua(c),Nr(c,"type","checkbox"),ca(c,e),c.processed=!0,c.if="("+n+")==='checkbox'"+o,fa(c,{exp:c.if,block:c});var u=ma(t);Dr(u,"v-for",!0),Nr(u,"type","radio"),ca(u,e),fa(c,{exp:"("+n+")==='radio'"+o,block:u});var f=ma(t);return Dr(f,"v-for",!0),Nr(f,":type",n),ca(f,e),fa(c,{exp:i,block:f}),a?c.else=!0:s&&(c.elseif=s),c}}}}];var ya,ba,_a={expectHTML:!0,modules:ga,directives:{model:function(t,e,n){n;var r=e.value,i=e.modifiers,o=t.tag,a=t.attrsMap.type;if(t.component)return Gr(t,r,i),!1;if("select"===o)!function(t,e,n){var r='var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return '+(n&&n.number?"_n(val)":"val")+"});";r=r+" "+Ur(e,"$event.target.multiple ? $$selectedVal : $$selectedVal[0]"),Rr(t,"change",r,null,!0)}(t,r,i);else if("input"===o&&"checkbox"===a)!function(t,e,n){var r=n&&n.number,i=Lr(t,"value")||"null",o=Lr(t,"true-value")||"true",a=Lr(t,"false-value")||"false";Fr(t,"checked","Array.isArray("+e+")?_i("+e+","+i+")>-1"+("true"===o?":("+e+")":":_q("+e+","+o+")")),Rr(t,"change","var $$a="+e+",$$el=$event.target,$$c=$$el.checked?("+o+"):("+a+");if(Array.isArray($$a)){var $$v="+(r?"_n("+i+")":i)+",$$i=_i($$a,$$v);if($$el.checked){$$i<0&&("+Ur(e,"$$a.concat([$$v])")+")}else{$$i>-1&&("+Ur(e,"$$a.slice(0,$$i).concat($$a.slice($$i+1))")+")}}else{"+Ur(e,"$$c")+"}",null,!0)}(t,r,i);else if("input"===o&&"radio"===a)!function(t,e,n){var r=n&&n.number,i=Lr(t,"value")||"null";Fr(t,"checked","_q("+e+","+(i=r?"_n("+i+")":i)+")"),Rr(t,"change",Ur(e,i),null,!0)}(t,r,i);else if("input"===o||"textarea"===o)!function(t,e,n){var r=t.attrsMap.type;0;var i=n||{},o=i.lazy,a=i.number,s=i.trim,c=!o&&"range"!==r,u=o?"change":"range"===r?"__r":"input",f="$event.target.value";s&&(f="$event.target.value.trim()");a&&(f="_n("+f+")");var l=Ur(e,f);c&&(l="if($event.target.composing)return;"+l);Fr(t,"value","("+e+")"),Rr(t,u,l,null,!0),(s||a)&&Rr(t,"blur","$forceUpdate()")}(t,r,i);else{if(!B.isReservedTag(o))return Gr(t,r,i),!1}return!0},text:function(t,e){e.value&&Fr(t,"textContent","_s("+e.value+")",e)},html:function(t,e){e.value&&Fr(t,"innerHTML","_s("+e.value+")",e)}},isPreTag:function(t){return"pre"===t},isUnaryTag:yo,mustUseProp:In,canBeLeftOpenTag:bo,isReservedTag:Xn,getTagNamespace:Yn,staticKeys:function(t){return t.reduce((function(t,e){return t.concat(e.staticKeys||[])}),[]).join(",")}(ga)},wa=x((function(t){return m("type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap"+(t?","+t:""))}));function xa(t,e){t&&(ya=wa(e.staticKeys||""),ba=e.isReservedTag||$,function t(e){if(e.static=function(t){if(2===t.type)return!1;if(3===t.type)return!0;return!(!t.pre&&(t.hasBindings||t.if||t.for||g(t.tag)||!ba(t.tag)||function(t){for(;t.parent;){if("template"!==(t=t.parent).tag)return!1;if(t.for)return!0}return!1}(t)||!Object.keys(t).every(ya)))}(e),1===e.type){if(!ba(e.tag)&&"slot"!==e.tag&&null==e.attrsMap["inline-template"])return;for(var n=0,r=e.children.length;n<r;n++){var i=e.children[n];t(i),i.static||(e.static=!1)}if(e.ifConditions)for(var o=1,a=e.ifConditions.length;o<a;o++){var s=e.ifConditions[o].block;t(s),s.static||(e.static=!1)}}}(t),function t(e,n){if(1===e.type){if((e.static||e.once)&&(e.staticInFor=n),e.static&&e.children.length&&(1!==e.children.length||3!==e.children[0].type))return void(e.staticRoot=!0);if(e.staticRoot=!1,e.children)for(var r=0,i=e.children.length;r<i;r++)t(e.children[r],n||!!e.for);if(e.ifConditions)for(var o=1,a=e.ifConditions.length;o<a;o++)t(e.ifConditions[o].block,n)}}(t,!1))}var Sa=/^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/,Oa=/\([^)]*?\);*$/,Ma=/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/,Aa={esc:27,tab:9,enter:13,space:32,up:38,left:37,right:39,down:40,delete:[8,46]},ka={esc:["Esc","Escape"],tab:"Tab",enter:"Enter",space:[" ","Spacebar"],up:["Up","ArrowUp"],left:["Left","ArrowLeft"],right:["Right","ArrowRight"],down:["Down","ArrowDown"],delete:["Backspace","Delete","Del"]},Ca=function(t){return"if("+t+")return null;"},Pa={stop:"$event.stopPropagation();",prevent:"$event.preventDefault();",self:Ca("$event.target !== $event.currentTarget"),ctrl:Ca("!$event.ctrlKey"),shift:Ca("!$event.shiftKey"),alt:Ca("!$event.altKey"),meta:Ca("!$event.metaKey"),left:Ca("'button' in $event && $event.button !== 0"),middle:Ca("'button' in $event && $event.button !== 1"),right:Ca("'button' in $event && $event.button !== 2")};function Ea(t,e){var n=e?"nativeOn:":"on:",r="",i="";for(var o in t){var a=Ta(t[o]);t[o]&&t[o].dynamic?i+=o+","+a+",":r+='"'+o+'":'+a+","}return r="{"+r.slice(0,-1)+"}",i?n+"_d("+r+",["+i.slice(0,-1)+"])":n+r}function Ta(t){if(!t)return"function(){}";if(Array.isArray(t))return"["+t.map((function(t){return Ta(t)})).join(",")+"]";var e=Ma.test(t.value),n=Sa.test(t.value),r=Ma.test(t.value.replace(Oa,""));if(t.modifiers){var i="",o="",a=[];for(var s in t.modifiers)if(Pa[s])o+=Pa[s],Aa[s]&&a.push(s);else if("exact"===s){var c=t.modifiers;o+=Ca(["ctrl","shift","alt","meta"].filter((function(t){return!c[t]})).map((function(t){return"$event."+t+"Key"})).join("||"))}else a.push(s);return a.length&&(i+=function(t){return"if(!$event.type.indexOf('key')&&"+t.map(Fa).join("&&")+")return null;"}(a)),o&&(i+=o),"function($event){"+i+(e?"return "+t.value+"($event)":n?"return ("+t.value+")($event)":r?"return "+t.value:t.value)+"}"}return e||n?t.value:"function($event){"+(r?"return "+t.value:t.value)+"}"}function Fa(t){var e=parseInt(t,10);if(e)return"$event.keyCode!=="+e;var n=Aa[t],r=ka[t];return"_k($event.keyCode,"+JSON.stringify(t)+","+JSON.stringify(n)+",$event.key,"+JSON.stringify(r)+")"}var $a={on:function(t,e){t.wrapListeners=function(t){return"_g("+t+","+e.value+")"}},bind:function(t,e){t.wrapData=function(n){return"_b("+n+",'"+t.tag+"',"+e.value+","+(e.modifiers&&e.modifiers.prop?"true":"false")+(e.modifiers&&e.modifiers.sync?",true":"")+")"}},cloak:F},Na=function(t){this.options=t,this.warn=t.warn||Er,this.transforms=Tr(t.modules,"transformCode"),this.dataGenFns=Tr(t.modules,"genData"),this.directives=E(E({},$a),t.directives);var e=t.isReservedTag||$;this.maybeComponent=function(t){return!!t.component||!e(t.tag)},this.onceId=0,this.staticRenderFns=[],this.pre=!1};function Ia(t,e){var n=new Na(e);return{render:"with(this){return "+(t?ja(t,n):'_c("div")')+"}",staticRenderFns:n.staticRenderFns}}function ja(t,e){if(t.parent&&(t.pre=t.pre||t.parent.pre),t.staticRoot&&!t.staticProcessed)return Ra(t,e);if(t.once&&!t.onceProcessed)return La(t,e);if(t.for&&!t.forProcessed)return Ba(t,e);if(t.if&&!t.ifProcessed)return Da(t,e);if("template"!==t.tag||t.slotTarget||e.pre){if("slot"===t.tag)return function(t,e){var n=t.slotName||'"default"',r=za(t,e),i="_t("+n+(r?","+r:""),o=t.attrs||t.dynamicAttrs?qa((t.attrs||[]).concat(t.dynamicAttrs||[]).map((function(t){return{name:O(t.name),value:t.value,dynamic:t.dynamic}}))):null,a=t.attrsMap["v-bind"];!o&&!a||r||(i+=",null");o&&(i+=","+o);a&&(i+=(o?"":",null")+","+a);return i+")"}(t,e);var n;if(t.component)n=function(t,e,n){var r=e.inlineTemplate?null:za(e,n,!0);return"_c("+t+","+Wa(e,n)+(r?","+r:"")+")"}(t.component,t,e);else{var r;(!t.plain||t.pre&&e.maybeComponent(t))&&(r=Wa(t,e));var i=t.inlineTemplate?null:za(t,e,!0);n="_c('"+t.tag+"'"+(r?","+r:"")+(i?","+i:"")+")"}for(var o=0;o<e.transforms.length;o++)n=e.transforms[o](t,n);return n}return za(t,e)||"void 0"}function Ra(t,e){t.staticProcessed=!0;var n=e.pre;return t.pre&&(e.pre=t.pre),e.staticRenderFns.push("with(this){return "+ja(t,e)+"}"),e.pre=n,"_m("+(e.staticRenderFns.length-1)+(t.staticInFor?",true":"")+")"}function La(t,e){if(t.onceProcessed=!0,t.if&&!t.ifProcessed)return Da(t,e);if(t.staticInFor){for(var n="",r=t.parent;r;){if(r.for){n=r.key;break}r=r.parent}return n?"_o("+ja(t,e)+","+e.onceId+++","+n+")":ja(t,e)}return Ra(t,e)}function Da(t,e,n,r){return t.ifProcessed=!0,function t(e,n,r,i){if(!e.length)return i||"_e()";var o=e.shift();return o.exp?"("+o.exp+")?"+a(o.block)+":"+t(e,n,r,i):""+a(o.block);function a(t){return r?r(t,n):t.once?La(t,n):ja(t,n)}}(t.ifConditions.slice(),e,n,r)}function Ba(t,e,n,r){var i=t.for,o=t.alias,a=t.iterator1?","+t.iterator1:"",s=t.iterator2?","+t.iterator2:"";return t.forProcessed=!0,(r||"_l")+"(("+i+"),function("+o+a+s+"){return "+(n||ja)(t,e)+"})"}function Wa(t,e){var n="{",r=function(t,e){var n=t.directives;if(!n)return;var r,i,o,a,s="directives:[",c=!1;for(r=0,i=n.length;r<i;r++){o=n[r],a=!0;var u=e.directives[o.name];u&&(a=!!u(t,o,e.warn)),a&&(c=!0,s+='{name:"'+o.name+'",rawName:"'+o.rawName+'"'+(o.value?",value:("+o.value+"),expression:"+JSON.stringify(o.value):"")+(o.arg?",arg:"+(o.isDynamicArg?o.arg:'"'+o.arg+'"'):"")+(o.modifiers?",modifiers:"+JSON.stringify(o.modifiers):"")+"},")}if(c)return s.slice(0,-1)+"]"}(t,e);r&&(n+=r+","),t.key&&(n+="key:"+t.key+","),t.ref&&(n+="ref:"+t.ref+","),t.refInFor&&(n+="refInFor:true,"),t.pre&&(n+="pre:true,"),t.component&&(n+='tag:"'+t.tag+'",');for(var i=0;i<e.dataGenFns.length;i++)n+=e.dataGenFns[i](t);if(t.attrs&&(n+="attrs:"+qa(t.attrs)+","),t.props&&(n+="domProps:"+qa(t.props)+","),t.events&&(n+=Ea(t.events,!1)+","),t.nativeEvents&&(n+=Ea(t.nativeEvents,!0)+","),t.slotTarget&&!t.slotScope&&(n+="slot:"+t.slotTarget+","),t.scopedSlots&&(n+=function(t,e,n){var r=t.for||Object.keys(e).some((function(t){var n=e[t];return n.slotTargetDynamic||n.if||n.for||Ga(n)})),i=!!t.if;if(!r)for(var o=t.parent;o;){if(o.slotScope&&"_empty_"!==o.slotScope||o.for){r=!0;break}o.if&&(i=!0),o=o.parent}var a=Object.keys(e).map((function(t){return Ua(e[t],n)})).join(",");return"scopedSlots:_u(["+a+"]"+(r?",null,true":"")+(!r&&i?",null,false,"+function(t){var e=5381,n=t.length;for(;n;)e=33*e^t.charCodeAt(--n);return e>>>0}(a):"")+")"}(t,t.scopedSlots,e)+","),t.model&&(n+="model:{value:"+t.model.value+",callback:"+t.model.callback+",expression:"+t.model.expression+"},"),t.inlineTemplate){var o=function(t,e){var n=t.children[0];0;if(n&&1===n.type){var r=Ia(n,e.options);return"inlineTemplate:{render:function(){"+r.render+"},staticRenderFns:["+r.staticRenderFns.map((function(t){return"function(){"+t+"}"})).join(",")+"]}"}}(t,e);o&&(n+=o+",")}return n=n.replace(/,$/,"")+"}",t.dynamicAttrs&&(n="_b("+n+',"'+t.tag+'",'+qa(t.dynamicAttrs)+")"),t.wrapData&&(n=t.wrapData(n)),t.wrapListeners&&(n=t.wrapListeners(n)),n}function Ga(t){return 1===t.type&&("slot"===t.tag||t.children.some(Ga))}function Ua(t,e){var n=t.attrsMap["slot-scope"];if(t.if&&!t.ifProcessed&&!n)return Da(t,e,Ua,"null");if(t.for&&!t.forProcessed)return Ba(t,e,Ua);var r="_empty_"===t.slotScope?"":String(t.slotScope),i="function("+r+"){return "+("template"===t.tag?t.if&&n?"("+t.if+")?"+(za(t,e)||"undefined")+":undefined":za(t,e)||"undefined":ja(t,e))+"}",o=r?"":",proxy:true";return"{key:"+(t.slotTarget||'"default"')+",fn:"+i+o+"}"}function za(t,e,n,r,i){var o=t.children;if(o.length){var a=o[0];if(1===o.length&&a.for&&"template"!==a.tag&&"slot"!==a.tag){var s=n?e.maybeComponent(a)?",1":",0":"";return""+(r||ja)(a,e)+s}var c=n?function(t,e){for(var n=0,r=0;r<t.length;r++){var i=t[r];if(1===i.type){if(Va(i)||i.ifConditions&&i.ifConditions.some((function(t){return Va(t.block)}))){n=2;break}(e(i)||i.ifConditions&&i.ifConditions.some((function(t){return e(t.block)})))&&(n=1)}}return n}(o,e.maybeComponent):0,u=i||Ha;return"["+o.map((function(t){return u(t,e)})).join(",")+"]"+(c?","+c:"")}}function Va(t){return void 0!==t.for||"template"===t.tag||"slot"===t.tag}function Ha(t,e){return 1===t.type?ja(t,e):3===t.type&&t.isComment?function(t){return"_e("+JSON.stringify(t.text)+")"}(t):function(t){return"_v("+(2===t.type?t.expression:Ka(JSON.stringify(t.text)))+")"}(t)}function qa(t){for(var e="",n="",r=0;r<t.length;r++){var i=t[r],o=Ka(i.value);i.dynamic?n+=i.name+","+o+",":e+='"'+i.name+'":'+o+","}return e="{"+e.slice(0,-1)+"}",n?"_d("+e+",["+n.slice(0,-1)+"])":e}function Ka(t){return t.replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}new RegExp("\\b"+"do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments".split(",").join("\\b|\\b")+"\\b"),new RegExp("\\b"+"delete,typeof,void".split(",").join("\\s*\\([^\\)]*\\)|\\b")+"\\s*\\([^\\)]*\\)");function Ja(t,e){try{return new Function(t)}catch(n){return e.push({err:n,code:t}),F}}function Xa(t){var e=Object.create(null);return function(n,r,i){(r=E({},r)).warn;delete r.warn;var o=r.delimiters?String(r.delimiters)+n:n;if(e[o])return e[o];var a=t(n,r);var s={},c=[];return s.render=Ja(a.render,c),s.staticRenderFns=a.staticRenderFns.map((function(t){return Ja(t,c)})),e[o]=s}}var Ya,Qa,Za=(Ya=function(t,e){var n=sa(t.trim(),e);!1!==e.optimize&&xa(n,e);var r=Ia(n,e);return{ast:n,render:r.render,staticRenderFns:r.staticRenderFns}},function(t){function e(e,n){var r=Object.create(t),i=[],o=[];if(n)for(var a in n.modules&&(r.modules=(t.modules||[]).concat(n.modules)),n.directives&&(r.directives=E(Object.create(t.directives||null),n.directives)),n)"modules"!==a&&"directives"!==a&&(r[a]=n[a]);r.warn=function(t,e,n){(n?o:i).push(t)};var s=Ya(e.trim(),r);return s.errors=i,s.tips=o,s}return{compile:e,compileToFunctions:Xa(e)}})(_a),ts=(Za.compile,Za.compileToFunctions);function es(t){return(Qa=Qa||document.createElement("div")).innerHTML=t?'<a href="\n"/>':'<div a="\n"/>',Qa.innerHTML.indexOf("&#10;")>0}var ns=!!q&&es(!1),rs=!!q&&es(!0),is=x((function(t){var e=tr(t);return e&&e.innerHTML})),os=Mn.prototype.$mount;Mn.prototype.$mount=function(t,e){if((t=t&&tr(t))===document.body||t===document.documentElement)return this;var n=this.$options;if(!n.render){var r=n.template;if(r)if("string"==typeof r)"#"===r.charAt(0)&&(r=is(r));else{if(!r.nodeType)return this;r=r.innerHTML}else t&&(r=function(t){if(t.outerHTML)return t.outerHTML;var e=document.createElement("div");return e.appendChild(t.cloneNode(!0)),e.innerHTML}(t));if(r){0;var i=ts(r,{outputSourceRange:!1,shouldDecodeNewlines:ns,shouldDecodeNewlinesForHref:rs,delimiters:n.delimiters,comments:n.comments},this),o=i.render,a=i.staticRenderFns;n.render=o,n.staticRenderFns=a}}return os.call(this,t,e)},Mn.compile=ts,e.a=Mn}).call(this,n(35),n(350).setImmediate)},function(t,e,n){"use strict";(function(n,r){var i;!function(){var o,a="Fake/5.0 (FakeOS) AppleWebKit/123 (KHTML, like Gecko) Fake/12.3.4567.89 Fake/123.45";if(S="object"==typeof n&&"object"==typeof n.versions&&n.versions.node&&!n.browser){var s=n.versions.node.toString().replace("v","");a="Nodejs/"+s+" (NodeOS) AppleWebKit/"+s+" (KHTML, like Gecko) Nodejs/"+s+" Nodejs/"+s}o=void 0!==r?r:window,"undefined"==typeof window&&("undefined"==typeof window&&void 0!==r&&(r.navigator={userAgent:a,getUserMedia:function(){}},o.window=r),"undefined"==typeof location&&(o.location={protocol:"file:",href:"",hash:""}),"undefined"==typeof screen&&(o.screen={width:0,height:0}));var c=window.navigator;void 0!==c?(void 0!==c.webkitGetUserMedia&&(c.getUserMedia=c.webkitGetUserMedia),void 0!==c.mozGetUserMedia&&(c.getUserMedia=c.mozGetUserMedia)):c={getUserMedia:function(){},userAgent:a};var u=!!/Android|webOS|iPhone|iPad|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(c.userAgent||""),f=!(-1===c.userAgent.indexOf("Edge")||!c.msSaveOrOpenBlob&&!c.msSaveBlob),l=!!window.opera||c.userAgent.indexOf(" OPR/")>=0,d=void 0!==window.InstallTrigger,p=/^((?!chrome|android).)*safari/i.test(c.userAgent),v=!!window.chrome&&!l,h="undefined"!=typeof document&&!!document.documentMode&&!f;function m(t,e){var n=0,r=!1,i=window.setInterval((function(){t()&&(window.clearInterval(i),e(r)),n++>50&&(window.clearInterval(i),e(r=!0))}),10)}var g={Android:function(){return c.userAgent.match(/Android/i)},BlackBerry:function(){return c.userAgent.match(/BlackBerry|BB10/i)},iOS:function(){return c.userAgent.match(/iPhone|iPad|iPod/i)},Opera:function(){return c.userAgent.match(/Opera Mini/i)},Windows:function(){return c.userAgent.match(/IEMobile/i)},any:function(){return g.Android()||g.BlackBerry()||g.iOS()||g.Opera()||g.Windows()},getOsName:function(){var t="Unknown OS";return g.Android()&&(t="Android"),g.BlackBerry()&&(t="BlackBerry"),g.iOS()&&(t="iOS"),g.Opera()&&(t="Opera Mini"),g.Windows()&&(t="Windows"),t}};var y="Unknown OS",b="Unknown OS Version";var _,w,x=function(){for(var t,e=c.appVersion,n=c.userAgent,r="-",i=[{s:"Windows 10",r:/(Windows 10.0|Windows NT 10.0)/},{s:"Windows 8.1",r:/(Windows 8.1|Windows NT 6.3)/},{s:"Windows 8",r:/(Windows 8|Windows NT 6.2)/},{s:"Windows 7",r:/(Windows 7|Windows NT 6.1)/},{s:"Windows Vista",r:/Windows NT 6.0/},{s:"Windows Server 2003",r:/Windows NT 5.2/},{s:"Windows XP",r:/(Windows NT 5.1|Windows XP)/},{s:"Windows 2000",r:/(Windows NT 5.0|Windows 2000)/},{s:"Windows ME",r:/(Win 9x 4.90|Windows ME)/},{s:"Windows 98",r:/(Windows 98|Win98)/},{s:"Windows 95",r:/(Windows 95|Win95|Windows_95)/},{s:"Windows NT 4.0",r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},{s:"Windows CE",r:/Windows CE/},{s:"Windows 3.11",r:/Win16/},{s:"Android",r:/Android/},{s:"Open BSD",r:/OpenBSD/},{s:"Sun OS",r:/SunOS/},{s:"Linux",r:/(Linux|X11)/},{s:"iOS",r:/(iPhone|iPad|iPod)/},{s:"Mac OS X",r:/Mac OS X/},{s:"Mac OS",r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},{s:"QNX",r:/QNX/},{s:"UNIX",r:/UNIX/},{s:"BeOS",r:/BeOS/},{s:"OS/2",r:/OS\/2/},{s:"Search Bot",r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}],o=0;t=i[o];o++)if(t.r.test(n)){r=t.s;break}var a="-";switch(/Windows/.test(r)&&(/Windows (.*)/.test(r)&&(a=/Windows (.*)/.exec(r)[1]),r="Windows"),r){case"Mac OS X":/Mac OS X (10[\.\_\d]+)/.test(n)&&(a=/Mac OS X (10[\.\_\d]+)/.exec(n)[1]);break;case"Android":/Android ([\.\_\d]+)/.test(n)&&(a=/Android ([\.\_\d]+)/.exec(n)[1]);break;case"iOS":/OS (\d+)_(\d+)_?(\d+)?/.test(n)&&(a=(a=/OS (\d+)_(\d+)_?(\d+)?/.exec(e))[1]+"."+a[2]+"."+(0|a[3]))}return{osName:r,osVersion:a}}();x&&x.osName&&"-"!=x.osName?(y=x.osName,b=x.osVersion):g.any()&&"Android"==(y=g.getOsName())&&(b=!!(w=(_=(_||c.userAgent).toLowerCase()).match(/android\s([0-9\.]*)/))&&w[1]);var S="object"==typeof n&&"object"==typeof n.versions&&n.versions.node;"Unknown OS"===y&&S&&(y="Nodejs",b=n.versions.node.toString().replace("v",""));var O=!1,M=!1;["captureStream","mozCaptureStream","webkitCaptureStream"].forEach((function(t){"undefined"!=typeof document&&"function"==typeof document.createElement&&(!O&&t in document.createElement("canvas")&&(O=!0),!M&&t in document.createElement("video")&&(M=!0))}));var A=/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/,k=/([0-9]{1,3}(\.[0-9]{1,3}){3})/,C=/[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}/;var P=[],E=[],T=[],F=[];c.mediaDevices&&c.mediaDevices.enumerateDevices&&(c.enumerateDevices=function(t){var e=c.mediaDevices.enumerateDevices();e&&e.then?c.mediaDevices.enumerateDevices().then(t).catch((function(){t([])})):t([])});var $=!1;"undefined"!=typeof MediaStreamTrack&&"getSources"in MediaStreamTrack?$=!0:c.mediaDevices&&c.mediaDevices.enumerateDevices&&($=!0);var N=!1,I=!1,j=!1,R=!1,L=!1;function D(t){if($)if(!c.enumerateDevices&&window.MediaStreamTrack&&window.MediaStreamTrack.getSources&&(c.enumerateDevices=window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack)),!c.enumerateDevices&&c.enumerateDevices&&(c.enumerateDevices=c.enumerateDevices.bind(c)),c.enumerateDevices){P=[],E=[],T=[],F=[],N=!1,I=!1,j=!1,R=!1,L=!1;var e={};c.enumerateDevices((function(n){n.forEach((function(t){var n={};for(var r in t)try{"function"!=typeof t[r]&&(n[r]=t[r])}catch(t){}e[n.deviceId+n.label+n.kind]||("audio"===n.kind&&(n.kind="audioinput"),"video"===n.kind&&(n.kind="videoinput"),n.deviceId||(n.deviceId=n.id),n.id||(n.id=n.deviceId),n.label?("videoinput"!==n.kind||L||(L=!0),"audioinput"!==n.kind||R||(R=!0)):(n.isCustomLabel=!0,"videoinput"===n.kind?n.label="Camera "+(F.length+1):"audioinput"===n.kind?n.label="Microphone "+(E.length+1):"audiooutput"===n.kind?n.label="Speaker "+(T.length+1):n.label="Please invoke getUserMedia once.",void 0!==B&&B.browser.isChrome&&B.browser.version>=46&&!/^(https:|chrome-extension:)$/g.test(location.protocol||"")&&"undefined"!=typeof document&&"string"==typeof document.domain&&document.domain.search&&-1===document.domain.search(/localhost|127.0./g)&&(n.label="HTTPs is required to get label of this "+n.kind+" device.")),"audioinput"===n.kind&&(N=!0,-1===E.indexOf(n)&&E.push(n)),"audiooutput"===n.kind&&(I=!0,-1===T.indexOf(n)&&T.push(n)),"videoinput"===n.kind&&(j=!0,-1===F.indexOf(n)&&F.push(n)),P.push(n),e[n.deviceId+n.label+n.kind]=n)})),void 0!==B&&(B.MediaDevices=P,B.hasMicrophone=N,B.hasSpeakers=I,B.hasWebcam=j,B.isWebsiteHasWebcamPermissions=L,B.isWebsiteHasMicrophonePermissions=R,B.audioInputDevices=E,B.audioOutputDevices=T,B.videoInputDevices=F),t&&t()}))}else t&&t();else t&&t()}var B=window.DetectRTC||{};B.browser=function(){c.appVersion;var t,e,n,r=c.userAgent,i=c.appName,o=""+parseFloat(c.appVersion),a=parseInt(c.appVersion,10);if(p&&!v&&-1!==r.indexOf("CriOS")&&(p=!1,v=!0),l){i="Opera";try{a=(o=c.userAgent.split("OPR/")[1].split(" ")[0]).split(".")[0]}catch(t){o="0.0.0.0",a=0}}else h?((e=r.indexOf("rv:"))>0?o=r.substring(e+3):(e=r.indexOf("MSIE"),o=r.substring(e+5)),i="IE"):v?(e=r.indexOf("Chrome"),i="Chrome",o=r.substring(e+7)):p?(e=r.indexOf("Safari"),i="Safari",o=r.substring(e+7),-1!==(e=r.indexOf("Version"))&&(o=r.substring(e+8)),-1!==c.userAgent.indexOf("Version/")&&(o=c.userAgent.split("Version/")[1].split(" ")[0])):d?(e=r.indexOf("Firefox"),i="Firefox",o=r.substring(e+8)):(t=r.lastIndexOf(" ")+1)<(e=r.lastIndexOf("/"))&&(i=r.substring(t,e),o=r.substring(e+1),i.toLowerCase()===i.toUpperCase()&&(i=c.appName));return f&&(i="Edge",o=c.userAgent.split("Edge/")[1]),-1!==(n=o.search(/[; \)]/))&&(o=o.substring(0,n)),a=parseInt(""+o,10),isNaN(a)&&(o=""+parseFloat(c.appVersion),a=parseInt(c.appVersion,10)),{fullVersion:o,version:a,name:i,isPrivateBrowsing:!1}}(),function(t){var e;try{if(window.webkitRequestFileSystem)window.webkitRequestFileSystem(window.TEMPORARY,1,(function(){e=!1}),(function(t){e=!0}));else if(window.indexedDB&&/Firefox/.test(window.navigator.userAgent)){var n;try{(n=window.indexedDB.open("test")).onerror=function(){return!0}}catch(t){e=!0}void 0===e&&m((function(){return"done"===n.readyState}),(function(t){t||(e=!n.result)}))}else if(function(t){var e=t.toLowerCase();if(0===e.indexOf("msie")&&0===e.indexOf("trident"))return!1;var n=/(?:msie|rv:)\s?([\d\.]+)/.exec(e);return!!(n&&parseInt(n[1],10)>=10)}(window.navigator.userAgent)){e=!1;try{window.indexedDB||(e=!0)}catch(t){e=!0}}else if(window.localStorage&&/Safari/.test(window.navigator.userAgent)){try{window.localStorage.setItem("test",1)}catch(t){e=!0}void 0===e&&(e=!1,window.localStorage.removeItem("test"))}}catch(t){e=!1}m((function(){return void 0!==e}),(function(n){t(e)}))}((function(t){B.browser.isPrivateBrowsing=!!t})),B.browser["is"+B.browser.name]=!0,B.osName=y,B.osVersion=b;"object"==typeof n&&"object"==typeof n.versions&&n.versions["node-webkit"];var W=!1;["RTCPeerConnection","webkitRTCPeerConnection","mozRTCPeerConnection","RTCIceGatherer"].forEach((function(t){W||t in window&&(W=!0)})),B.isWebRTCSupported=W,B.isORTCSupported="undefined"!=typeof RTCIceGatherer;var G=!1;(B.browser.isChrome&&B.browser.version>=35?G=!0:B.browser.isFirefox&&B.browser.version>=34?G=!0:B.browser.isEdge&&B.browser.version>=17?G=!0:"Android"===B.osName&&B.browser.isChrome&&(G=!0),/^(https:|chrome-extension:)$/g.test(location.protocol||""))||("undefined"!=typeof document&&"string"==typeof document.domain&&document.domain.search&&-1===document.domain.search(/localhost|127.0./g)&&(B.browser.isChrome||B.browser.isEdge||B.browser.isOpera)?G=!1:B.browser.isFirefox&&(G=!1));B.isScreenCapturingSupported=G;var U={isSupported:!1,isCreateMediaStreamSourceSupported:!1};["AudioContext","webkitAudioContext","mozAudioContext","msAudioContext"].forEach((function(t){U.isSupported||t in window&&(U.isSupported=!0,window[t]&&"createMediaStreamSource"in window[t].prototype&&(U.isCreateMediaStreamSourceSupported=!0))})),B.isAudioContextSupported=U.isSupported,B.isCreateMediaStreamSourceSupported=U.isCreateMediaStreamSourceSupported;var z=!1;B.browser.isChrome&&B.browser.version>31&&(z=!0),B.isRtpDataChannelsSupported=z;var V=!1;B.browser.isFirefox&&B.browser.version>28?V=!0:B.browser.isChrome&&B.browser.version>25?V=!0:B.browser.isOpera&&B.browser.version>=11&&(V=!0),B.isSctpDataChannelsSupported=V,B.isMobileDevice=u;var H=!1;c.getUserMedia?H=!0:c.mediaDevices&&c.mediaDevices.getUserMedia&&(H=!0),B.browser.isChrome&&B.browser.version>=46&&!/^(https:|chrome-extension:)$/g.test(location.protocol||"")&&"undefined"!=typeof document&&"string"==typeof document.domain&&document.domain.search&&-1===document.domain.search(/localhost|127.0./g)&&(H="Requires HTTPs"),"Nodejs"===B.osName&&(H=!1),B.isGetUserMediaSupported=H;var q,K,J,X="";screen.width&&(X+=(screen.width?screen.width:"")+" x "+(screen.height?screen.height:""));B.displayResolution=X,B.displayAspectRatio=(q=screen.width,K=screen.height,J=function t(e,n){return 0==n?e:t(n,e%n)}(q,K),q/J/(K/J)).toFixed(2),B.isCanvasSupportsStreamCapturing=O,B.isVideoSupportsStreamCapturing=M,"Chrome"==B.browser.name&&B.browser.version>=53&&(B.isCanvasSupportsStreamCapturing||(B.isCanvasSupportsStreamCapturing="Requires chrome flag: enable-experimental-web-platform-features"),B.isVideoSupportsStreamCapturing||(B.isVideoSupportsStreamCapturing="Requires chrome flag: enable-experimental-web-platform-features")),B.DetectLocalIPAddress=function(t,e){if(B.isWebRTCSupported){var n=!0,r=!0;!function(t,e){if("undefined"==typeof document||"function"!=typeof document.getElementById)return;var n={},r=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection;if(!r){var i=document.getElementById("iframe");if(!i)return;var o=i.contentWindow;r=o.RTCPeerConnection||o.mozRTCPeerConnection||o.webkitRTCPeerConnection}if(!r)return;var a=null;"Chrome"===B.browser&&B.browser.version<58&&(a={optional:[{RtpDataChannels:!0}]});var s=new r({iceServers:[{urls:"stun:stun.l.google.com:19302"}]},a);e&&(s.addStream?s.addStream(e):s.addTrack&&e.getTracks()[0]&&s.addTrack(e.getTracks()[0],e));function c(e){if(e){var r=k.exec(e);if(r){var i=r[1],o=e.match(A);void 0===n[i]&&t(i,o,!0),n[i]=!0}}else t()}if(s.onicecandidate=function(t){t.candidate&&t.candidate.candidate?c(t.candidate.candidate):c()},!e)try{s.createDataChannel("sctp",{})}catch(t){}B.isPromisesSupported?s.createOffer().then((function(t){s.setLocalDescription(t).then(u)})):s.createOffer((function(t){s.setLocalDescription(t,u,(function(){}))}),(function(){}));function u(){s.localDescription.sdp.split("\n").forEach((function(t){t&&0===t.indexOf("a=candidate:")&&c(t)}))}}((function(e){e?e.match(A)?t("Local: "+e,n=!1,r):e.match(C)?t("Public: "+e,n,r=!1):t("Public: "+e,n,r):t()}),e)}},B.isWebSocketsSupported="WebSocket"in window&&2===window.WebSocket.CLOSING,B.isWebSocketsBlocked=!B.isWebSocketsSupported,"Nodejs"===B.osName&&(B.isWebSocketsSupported=!0,B.isWebSocketsBlocked=!1),B.checkWebSocketsSupport=function(t){t=t||function(){};try{var e,n=new WebSocket("wss://echo.websocket.org:443/");n.onopen=function(){B.isWebSocketsBlocked=!1,e=(new Date).getTime(),n.send("ping")},n.onmessage=function(){B.WebsocketLatency=(new Date).getTime()-e+"ms",t(),n.close(),n=null},n.onerror=function(){B.isWebSocketsBlocked=!0,t()}}catch(e){B.isWebSocketsBlocked=!0,t()}},B.load=function(t){D(t=t||function(){})},B.MediaDevices=void 0!==P?P:[],B.hasMicrophone=N,B.hasSpeakers=I,B.hasWebcam=j,B.isWebsiteHasWebcamPermissions=L,B.isWebsiteHasMicrophonePermissions=R,B.audioInputDevices=E,B.audioOutputDevices=T,B.videoInputDevices=F;var Y=!1;"undefined"!=typeof document&&"function"==typeof document.createElement&&"setSinkId"in document.createElement("video")&&(Y=!0),B.isSetSinkIdSupported=Y;var Q=!1;B.browser.isFirefox&&"undefined"!=typeof mozRTCPeerConnection?"getSenders"in mozRTCPeerConnection.prototype&&(Q=!0):B.browser.isChrome&&"undefined"!=typeof webkitRTCPeerConnection&&"getSenders"in webkitRTCPeerConnection.prototype&&(Q=!0),B.isRTPSenderReplaceTracksSupported=Q;var Z=!1;B.browser.isFirefox&&B.browser.version>38&&(Z=!0),B.isRemoteStreamProcessingSupported=Z;var tt=!1;"undefined"!=typeof MediaStreamTrack&&"applyConstraints"in MediaStreamTrack.prototype&&(tt=!0),B.isApplyConstraintsSupported=tt;var et=!1;B.browser.isFirefox&&B.browser.version>=43&&(et=!0),B.isMultiMonitorScreenCapturingSupported=et,B.isPromisesSupported=!!("Promise"in window),B.version="1.3.9",void 0===B&&(window.DetectRTC={});var nt=window.MediaStream;void 0===nt&&"undefined"!=typeof webkitMediaStream&&(nt=webkitMediaStream),B.MediaStream=void 0!==nt&&"function"==typeof nt&&Object.keys(nt.prototype),"undefined"!=typeof MediaStreamTrack?B.MediaStreamTrack=Object.keys(MediaStreamTrack.prototype):B.MediaStreamTrack=!1;var rt=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection;B.RTCPeerConnection=void 0!==rt&&Object.keys(rt.prototype),window.DetectRTC=B,t.exports=B,void 0===(i=function(){return B}.apply(e,[]))||(t.exports=i)}()}).call(this,n(145),n(35))},function(t,e,n){var r=n(4),i=n(2).document,o=r(i)&&r(i.createElement);t.exports=function(t){return o?i.createElement(t):{}}},function(t,e,n){var r=n(2),i=n(18),o=n(29),a=n(110),s=n(8).f;t.exports=function(t){var e=i.Symbol||(i.Symbol=o?{}:r.Symbol||{});"_"==t.charAt(0)||t in e||s(e,t,{value:a.f(t)})}},function(t,e,n){var r=n(51)("keys"),i=n(37);t.exports=function(t){return r[t]||(r[t]=i(t))}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e,n){var r=n(2).document;t.exports=r&&r.documentElement},function(t,e,n){var r=n(4),i=n(1),o=function(t,e){if(i(t),!r(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e,r){try{(r=n(19)(Function.call,n(16).f(Object.prototype,"__proto__").set,2))(t,[]),e=!(t instanceof Array)}catch(t){e=!0}return function(t,n){return o(t,n),e?t.__proto__=n:r(t,n),t}}({},!1):void 0),check:o}},function(t,e){t.exports="\t\n\v\f\r Â áš€á Žâ€€â€â€‚â€ƒâ€„â€…â€†â€‡â€ˆâ€‰â€Šâ€¯âŸã€€\u2028\u2029\ufeff"},function(t,e,n){var r=n(4),i=n(87).set;t.exports=function(t,e,n){var o,a=e.constructor;return a!==n&&"function"==typeof a&&(o=a.prototype)!==n.prototype&&r(o)&&i&&i(t,o),t}},function(t,e,n){"use strict";var r=n(21),i=n(24);t.exports=function(t){var e=String(i(this)),n="",o=r(t);if(o<0||o==1/0)throw RangeError("Count can't be negative");for(;o>0;(o>>>=1)&&(e+=e))1&o&&(n+=e);return n}},function(t,e){t.exports=Math.sign||function(t){return 0==(t=+t)||t!=t?t:t<0?-1:1}},function(t,e){var n=Math.expm1;t.exports=!n||n(10)>22025.465794806718||n(10)<22025.465794806718||-2e-17!=n(-2e-17)?function(t){return 0==(t=+t)?t:t>-1e-6&&t<1e-6?t+t*t/2:Math.exp(t)-1}:n},function(t,e,n){"use strict";var r=n(29),i=n(0),o=n(12),a=n(11),s=n(50),c=n(94),u=n(47),f=n(17),l=n(5)("iterator"),d=!([].keys&&"next"in[].keys()),p=function(){return this};t.exports=function(t,e,n,v,h,m,g){c(n,e,v);var y,b,_,w=function(t){if(!d&&t in M)return M[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},x=e+" Iterator",S="values"==h,O=!1,M=t.prototype,A=M[l]||M["@@iterator"]||h&&M[h],k=A||w(h),C=h?S?w("entries"):k:void 0,P="Array"==e&&M.entries||A;if(P&&(_=f(P.call(new t)))!==Object.prototype&&_.next&&(u(_,x,!0),r||"function"==typeof _[l]||a(_,l,p)),S&&A&&"values"!==A.name&&(O=!0,k=function(){return A.call(this)}),r&&!g||!d&&!O&&M[l]||a(M,l,k),s[e]=k,s[x]=p,h)if(y={values:S?k:w("values"),keys:m?k:w("keys"),entries:C},g)for(b in y)b in M||o(M,b,y[b]);else i(i.P+i.F*(d||O),e,y);return y}},function(t,e,n){"use strict";var r=n(40),i=n(36),o=n(47),a={};n(11)(a,n(5)("iterator"),(function(){return this})),t.exports=function(t,e,n){t.prototype=r(a,{next:i(1,n)}),o(t,e+" Iterator")}},function(t,e,n){var r=n(61),i=n(24);t.exports=function(t,e,n){if(r(e))throw TypeError("String#"+n+" doesn't accept regex!");return String(i(t))}},function(t,e,n){var r=n(5)("match");t.exports=function(t){var e=/./;try{"/./"[t](e)}catch(n){try{return e[r]=!1,!"/./"[t](e)}catch(t){}}return!0}},function(t,e,n){var r=n(50),i=n(5)("iterator"),o=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||o[i]===t)}},function(t,e,n){"use strict";var r=n(8),i=n(36);t.exports=function(t,e,n){e in t?r.f(t,e,i(0,n)):t[e]=n}},function(t,e,n){var r=n(48),i=n(5)("iterator"),o=n(50);t.exports=n(18).getIteratorMethod=function(t){if(null!=t)return t[i]||t["@@iterator"]||o[r(t)]}},function(t,e,n){var r=n(240);t.exports=function(t,e){return new(r(t))(e)}},function(t,e,n){"use strict";var r=n(9),i=n(39),o=n(6);t.exports=function(t){for(var e=r(this),n=o(e.length),a=arguments.length,s=i(a>1?arguments[1]:void 0,n),c=a>2?arguments[2]:void 0,u=void 0===c?n:i(c,n);u>s;)e[s++]=t;return e}},function(t,e,n){"use strict";var r=n(31),i=n(127),o=n(50),a=n(15);t.exports=n(93)(Array,"Array",(function(t,e){this._t=a(t),this._i=0,this._k=e}),(function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,i(1)):i(0,"keys"==e?n:"values"==e?t[n]:[n,t[n]])}),"values"),o.Arguments=o.Array,r("keys"),r("values"),r("entries")},function(t,e,n){"use strict";var r,i,o=n(54),a=RegExp.prototype.exec,s=String.prototype.replace,c=a,u=(r=/a/,i=/b*/g,a.call(r,"a"),a.call(i,"a"),0!==r.lastIndex||0!==i.lastIndex),f=void 0!==/()??/.exec("")[1];(u||f)&&(c=function(t){var e,n,r,i,c=this;return f&&(n=new RegExp("^"+c.source+"$(?!\\s)",o.call(c))),u&&(e=c.lastIndex),r=a.call(c,t),u&&r&&(c.lastIndex=c.global?r.index+r[0].length:e),f&&r&&r.length>1&&s.call(r[0],n,(function(){for(i=1;i<arguments.length-2;i++)void 0===arguments[i]&&(r[i]=void 0)})),r}),t.exports=c},function(t,e,n){"use strict";var r=n(60)(!0);t.exports=function(t,e,n){return e+(n?r(t,e).length:1)}},function(t,e,n){var r,i,o,a=n(19),s=n(117),c=n(86),u=n(82),f=n(2),l=f.process,d=f.setImmediate,p=f.clearImmediate,v=f.MessageChannel,h=f.Dispatch,m=0,g={},y=function(){var t=+this;if(g.hasOwnProperty(t)){var e=g[t];delete g[t],e()}},b=function(t){y.call(t.data)};d&&p||(d=function(t){for(var e=[],n=1;arguments.length>n;)e.push(arguments[n++]);return g[++m]=function(){s("function"==typeof t?t:Function(t),e)},r(m),m},p=function(t){delete g[t]},"process"==n(20)(l)?r=function(t){l.nextTick(a(y,t,1))}:h&&h.now?r=function(t){h.now(a(y,t,1))}:v?(o=(i=new v).port2,i.port1.onmessage=b,r=a(o.postMessage,o,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(r=function(t){f.postMessage(t+"","*")},f.addEventListener("message",b,!1)):r="onreadystatechange"in u("script")?function(t){c.appendChild(u("script")).onreadystatechange=function(){c.removeChild(this),y.call(t)}}:function(t){setTimeout(a(y,t,1),0)}),t.exports={set:d,clear:p}},function(t,e,n){var r=n(2),i=n(105).set,o=r.MutationObserver||r.WebKitMutationObserver,a=r.process,s=r.Promise,c="process"==n(20)(a);t.exports=function(){var t,e,n,u=function(){var r,i;for(c&&(r=a.domain)&&r.exit();t;){i=t.fn,t=t.next;try{i()}catch(r){throw t?n():e=void 0,r}}e=void 0,r&&r.enter()};if(c)n=function(){a.nextTick(u)};else if(!o||r.navigator&&r.navigator.standalone)if(s&&s.resolve){var f=s.resolve(void 0);n=function(){f.then(u)}}else n=function(){i.call(r,u)};else{var l=!0,d=document.createTextNode("");new o(u).observe(d,{characterData:!0}),n=function(){d.data=l=!l}}return function(r){var i={fn:r,next:void 0};e&&(e.next=i),t||(t=i,n()),e=i}}},function(t,e,n){"use strict";var r=n(10);function i(t){var e,n;this.promise=new t((function(t,r){if(void 0!==e||void 0!==n)throw TypeError("Bad Promise constructor");e=t,n=r})),this.resolve=r(e),this.reject=r(n)}t.exports.f=function(t){return new i(t)}},function(t,e,n){"use strict";var r=n(2),i=n(7),o=n(29),a=n(67),s=n(11),c=n(45),u=n(3),f=n(43),l=n(21),d=n(6),p=n(137),v=n(41).f,h=n(8).f,m=n(101),g=n(47),y=r.ArrayBuffer,b=r.DataView,_=r.Math,w=r.RangeError,x=r.Infinity,S=y,O=_.abs,M=_.pow,A=_.floor,k=_.log,C=_.LN2,P=i?"_b":"buffer",E=i?"_l":"byteLength",T=i?"_o":"byteOffset";function F(t,e,n){var r,i,o,a=new Array(n),s=8*n-e-1,c=(1<<s)-1,u=c>>1,f=23===e?M(2,-24)-M(2,-77):0,l=0,d=t<0||0===t&&1/t<0?1:0;for((t=O(t))!=t||t===x?(i=t!=t?1:0,r=c):(r=A(k(t)/C),t*(o=M(2,-r))<1&&(r--,o*=2),(t+=r+u>=1?f/o:f*M(2,1-u))*o>=2&&(r++,o/=2),r+u>=c?(i=0,r=c):r+u>=1?(i=(t*o-1)*M(2,e),r+=u):(i=t*M(2,u-1)*M(2,e),r=0));e>=8;a[l++]=255&i,i/=256,e-=8);for(r=r<<e|i,s+=e;s>0;a[l++]=255&r,r/=256,s-=8);return a[--l]|=128*d,a}function $(t,e,n){var r,i=8*n-e-1,o=(1<<i)-1,a=o>>1,s=i-7,c=n-1,u=t[c--],f=127&u;for(u>>=7;s>0;f=256*f+t[c],c--,s-=8);for(r=f&(1<<-s)-1,f>>=-s,s+=e;s>0;r=256*r+t[c],c--,s-=8);if(0===f)f=1-a;else{if(f===o)return r?NaN:u?-x:x;r+=M(2,e),f-=a}return(u?-1:1)*r*M(2,f-e)}function N(t){return t[3]<<24|t[2]<<16|t[1]<<8|t[0]}function I(t){return[255&t]}function j(t){return[255&t,t>>8&255]}function R(t){return[255&t,t>>8&255,t>>16&255,t>>24&255]}function L(t){return F(t,52,8)}function D(t){return F(t,23,4)}function B(t,e,n){h(t.prototype,e,{get:function(){return this[n]}})}function W(t,e,n,r){var i=p(+n);if(i+e>t[E])throw w("Wrong index!");var o=t[P]._b,a=i+t[T],s=o.slice(a,a+e);return r?s:s.reverse()}function G(t,e,n,r,i,o){var a=p(+n);if(a+e>t[E])throw w("Wrong index!");for(var s=t[P]._b,c=a+t[T],u=r(+i),f=0;f<e;f++)s[c+f]=u[o?f:e-f-1]}if(a.ABV){if(!u((function(){y(1)}))||!u((function(){new y(-1)}))||u((function(){return new y,new y(1.5),new y(NaN),"ArrayBuffer"!=y.name}))){for(var U,z=(y=function(t){return f(this,y),new S(p(t))}).prototype=S.prototype,V=v(S),H=0;V.length>H;)(U=V[H++])in y||s(y,U,S[U]);o||(z.constructor=y)}var q=new b(new y(2)),K=b.prototype.setInt8;q.setInt8(0,2147483648),q.setInt8(1,2147483649),!q.getInt8(0)&&q.getInt8(1)||c(b.prototype,{setInt8:function(t,e){K.call(this,t,e<<24>>24)},setUint8:function(t,e){K.call(this,t,e<<24>>24)}},!0)}else y=function(t){f(this,y,"ArrayBuffer");var e=p(t);this._b=m.call(new Array(e),0),this[E]=e},b=function(t,e,n){f(this,b,"DataView"),f(t,y,"DataView");var r=t[E],i=l(e);if(i<0||i>r)throw w("Wrong offset!");if(i+(n=void 0===n?r-i:d(n))>r)throw w("Wrong length!");this[P]=t,this[T]=i,this[E]=n},i&&(B(y,"byteLength","_l"),B(b,"buffer","_b"),B(b,"byteLength","_l"),B(b,"byteOffset","_o")),c(b.prototype,{getInt8:function(t){return W(this,1,t)[0]<<24>>24},getUint8:function(t){return W(this,1,t)[0]},getInt16:function(t){var e=W(this,2,t,arguments[1]);return(e[1]<<8|e[0])<<16>>16},getUint16:function(t){var e=W(this,2,t,arguments[1]);return e[1]<<8|e[0]},getInt32:function(t){return N(W(this,4,t,arguments[1]))},getUint32:function(t){return N(W(this,4,t,arguments[1]))>>>0},getFloat32:function(t){return $(W(this,4,t,arguments[1]),23,4)},getFloat64:function(t){return $(W(this,8,t,arguments[1]),52,8)},setInt8:function(t,e){G(this,1,t,I,e)},setUint8:function(t,e){G(this,1,t,I,e)},setInt16:function(t,e){G(this,2,t,j,e,arguments[2])},setUint16:function(t,e){G(this,2,t,j,e,arguments[2])},setInt32:function(t,e){G(this,4,t,R,e,arguments[2])},setUint32:function(t,e){G(this,4,t,R,e,arguments[2])},setFloat32:function(t,e){G(this,4,t,D,e,arguments[2])},setFloat64:function(t,e){G(this,8,t,L,e,arguments[2])}});g(y,"ArrayBuffer"),g(b,"DataView"),s(b.prototype,a.VIEW,!0),e.ArrayBuffer=y,e.DataView=b},function(t,e,n){t.exports=!n(7)&&!n(3)((function(){return 7!=Object.defineProperty(n(82)("div"),"a",{get:function(){return 7}}).a}))},function(t,e,n){e.f=n(5)},function(t,e,n){var r=n(14),i=n(15),o=n(57)(!1),a=n(84)("IE_PROTO");t.exports=function(t,e){var n,s=i(t),c=0,u=[];for(n in s)n!=a&&r(s,n)&&u.push(n);for(;e.length>c;)r(s,n=e[c++])&&(~o(u,n)||u.push(n));return u}},function(t,e,n){var r=n(8),i=n(1),o=n(38);t.exports=n(7)?Object.defineProperties:function(t,e){i(t);for(var n,a=o(e),s=a.length,c=0;s>c;)r.f(t,n=a[c++],e[n]);return t}},function(t,e,n){var r=n(15),i=n(41).f,o={}.toString,a="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];t.exports.f=function(t){return a&&"[object Window]"==o.call(t)?function(t){try{return i(t)}catch(t){return a.slice()}}(t):i(r(t))}},function(t,e,n){"use strict";var r=n(7),i=n(38),o=n(58),a=n(53),s=n(9),c=n(52),u=Object.assign;t.exports=!u||n(3)((function(){var t={},e={},n=Symbol(),r="abcdefghijklmnopqrst";return t[n]=7,r.split("").forEach((function(t){e[t]=t})),7!=u({},t)[n]||Object.keys(u({},e)).join("")!=r}))?function(t,e){for(var n=s(t),u=arguments.length,f=1,l=o.f,d=a.f;u>f;)for(var p,v=c(arguments[f++]),h=l?i(v).concat(l(v)):i(v),m=h.length,g=0;m>g;)p=h[g++],r&&!d.call(v,p)||(n[p]=v[p]);return n}:u},function(t,e){t.exports=Object.is||function(t,e){return t===e?0!==t||1/t==1/e:t!=t&&e!=e}},function(t,e,n){"use strict";var r=n(10),i=n(4),o=n(117),a=[].slice,s={},c=function(t,e,n){if(!(e in s)){for(var r=[],i=0;i<e;i++)r[i]="a["+i+"]";s[e]=Function("F,a","return new F("+r.join(",")+")")}return s[e](t,n)};t.exports=Function.bind||function(t){var e=r(this),n=a.call(arguments,1),s=function(){var r=n.concat(a.call(arguments));return this instanceof s?c(e,r.length,r):o(e,r,t)};return i(e.prototype)&&(s.prototype=e.prototype),s}},function(t,e){t.exports=function(t,e,n){var r=void 0===n;switch(e.length){case 0:return r?t():t.call(n);case 1:return r?t(e[0]):t.call(n,e[0]);case 2:return r?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return r?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return r?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)}},function(t,e,n){var r=n(2).parseInt,i=n(49).trim,o=n(88),a=/^[-+]?0[xX]/;t.exports=8!==r(o+"08")||22!==r(o+"0x16")?function(t,e){var n=i(String(t),3);return r(n,e>>>0||(a.test(n)?16:10))}:r},function(t,e,n){var r=n(2).parseFloat,i=n(49).trim;t.exports=1/r(n(88)+"-0")!=-1/0?function(t){var e=i(String(t),3),n=r(e);return 0===n&&"-"==e.charAt(0)?-0:n}:r},function(t,e,n){var r=n(20);t.exports=function(t,e){if("number"!=typeof t&&"Number"!=r(t))throw TypeError(e);return+t}},function(t,e,n){var r=n(4),i=Math.floor;t.exports=function(t){return!r(t)&&isFinite(t)&&i(t)===t}},function(t,e){t.exports=Math.log1p||function(t){return(t=+t)>-1e-8&&t<1e-8?t-t*t/2:Math.log(1+t)}},function(t,e,n){var r=n(91),i=Math.pow,o=i(2,-52),a=i(2,-23),s=i(2,127)*(2-a),c=i(2,-126);t.exports=Math.fround||function(t){var e,n,i=Math.abs(t),u=r(t);return i<c?u*(i/c/a+1/o-1/o)*c*a:(n=(e=(1+a/o)*i)-(e-i))>s||n!=n?u*(1/0):u*n}},function(t,e,n){var r=n(1);t.exports=function(t,e,n,i){try{return i?e(r(n)[0],n[1]):e(n)}catch(e){var o=t.return;throw void 0!==o&&r(o.call(t)),e}}},function(t,e,n){var r=n(10),i=n(9),o=n(52),a=n(6);t.exports=function(t,e,n,s,c){r(e);var u=i(t),f=o(u),l=a(u.length),d=c?l-1:0,p=c?-1:1;if(n<2)for(;;){if(d in f){s=f[d],d+=p;break}if(d+=p,c?d<0:l<=d)throw TypeError("Reduce of empty array with no initial value")}for(;c?d>=0:l>d;d+=p)d in f&&(s=e(s,f[d],d,u));return s}},function(t,e,n){"use strict";var r=n(9),i=n(39),o=n(6);t.exports=[].copyWithin||function(t,e){var n=r(this),a=o(n.length),s=i(t,a),c=i(e,a),u=arguments.length>2?arguments[2]:void 0,f=Math.min((void 0===u?a:i(u,a))-c,a-s),l=1;for(c<s&&s<c+f&&(l=-1,c+=f-1,s+=f-1);f-- >0;)c in n?n[s]=n[c]:delete n[s],s+=l,c+=l;return n}},function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},function(t,e,n){"use strict";var r=n(103);n(0)({target:"RegExp",proto:!0,forced:r!==/./.exec},{exec:r})},function(t,e,n){n(7)&&"g"!=/./g.flags&&n(8).f(RegExp.prototype,"flags",{configurable:!0,get:n(54)})},function(t,e){t.exports=function(t){try{return{e:!1,v:t()}}catch(t){return{e:!0,v:t}}}},function(t,e,n){var r=n(1),i=n(4),o=n(107);t.exports=function(t,e){if(r(t),i(e)&&e.constructor===t)return e;var n=o.f(t);return(0,n.resolve)(e),n.promise}},function(t,e,n){"use strict";var r=n(133),i=n(46);t.exports=n(66)("Map",(function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}}),{get:function(t){var e=r.getEntry(i(this,"Map"),t);return e&&e.v},set:function(t,e){return r.def(i(this,"Map"),0===t?0:t,e)}},r,!0)},function(t,e,n){"use strict";var r=n(8).f,i=n(40),o=n(45),a=n(19),s=n(43),c=n(44),u=n(93),f=n(127),l=n(42),d=n(7),p=n(30).fastKey,v=n(46),h=d?"_s":"size",m=function(t,e){var n,r=p(e);if("F"!==r)return t._i[r];for(n=t._f;n;n=n.n)if(n.k==e)return n};t.exports={getConstructor:function(t,e,n,u){var f=t((function(t,r){s(t,f,e,"_i"),t._t=e,t._i=i(null),t._f=void 0,t._l=void 0,t[h]=0,null!=r&&c(r,n,t[u],t)}));return o(f.prototype,{clear:function(){for(var t=v(this,e),n=t._i,r=t._f;r;r=r.n)r.r=!0,r.p&&(r.p=r.p.n=void 0),delete n[r.i];t._f=t._l=void 0,t[h]=0},delete:function(t){var n=v(this,e),r=m(n,t);if(r){var i=r.n,o=r.p;delete n._i[r.i],r.r=!0,o&&(o.n=i),i&&(i.p=o),n._f==r&&(n._f=i),n._l==r&&(n._l=o),n[h]--}return!!r},forEach:function(t){v(this,e);for(var n,r=a(t,arguments.length>1?arguments[1]:void 0,3);n=n?n.n:this._f;)for(r(n.v,n.k,this);n&&n.r;)n=n.p},has:function(t){return!!m(v(this,e),t)}}),d&&r(f.prototype,"size",{get:function(){return v(this,e)[h]}}),f},def:function(t,e,n){var r,i,o=m(t,e);return o?o.v=n:(t._l=o={i:i=p(e,!0),k:e,v:n,p:r=t._l,n:void 0,r:!1},t._f||(t._f=o),r&&(r.n=o),t[h]++,"F"!==i&&(t._i[i]=o)),t},getEntry:m,setStrong:function(t,e,n){u(t,e,(function(t,n){this._t=v(t,e),this._k=n,this._l=void 0}),(function(){for(var t=this._k,e=this._l;e&&e.r;)e=e.p;return this._t&&(this._l=e=e?e.n:this._t._f)?f(0,"keys"==t?e.k:"values"==t?e.v:[e.k,e.v]):(this._t=void 0,f(1))}),n?"entries":"values",!n,!0),l(e)}}},function(t,e,n){"use strict";var r=n(133),i=n(46);t.exports=n(66)("Set",(function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}}),{add:function(t){return r.def(i(this,"Set"),t=0===t?0:t,t)}},r)},function(t,e,n){"use strict";var r,i=n(2),o=n(26)(0),a=n(12),s=n(30),c=n(114),u=n(136),f=n(4),l=n(46),d=n(46),p=!i.ActiveXObject&&"ActiveXObject"in i,v=s.getWeak,h=Object.isExtensible,m=u.ufstore,g=function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},y={get:function(t){if(f(t)){var e=v(t);return!0===e?m(l(this,"WeakMap")).get(t):e?e[this._i]:void 0}},set:function(t,e){return u.def(l(this,"WeakMap"),t,e)}},b=t.exports=n(66)("WeakMap",g,y,u,!0,!0);d&&p&&(c((r=u.getConstructor(g,"WeakMap")).prototype,y),s.NEED=!0,o(["delete","has","get","set"],(function(t){var e=b.prototype,n=e[t];a(e,t,(function(e,i){if(f(e)&&!h(e)){this._f||(this._f=new r);var o=this._f[t](e,i);return"set"==t?this:o}return n.call(this,e,i)}))})))},function(t,e,n){"use strict";var r=n(45),i=n(30).getWeak,o=n(1),a=n(4),s=n(43),c=n(44),u=n(26),f=n(14),l=n(46),d=u(5),p=u(6),v=0,h=function(t){return t._l||(t._l=new m)},m=function(){this.a=[]},g=function(t,e){return d(t.a,(function(t){return t[0]===e}))};m.prototype={get:function(t){var e=g(this,t);if(e)return e[1]},has:function(t){return!!g(this,t)},set:function(t,e){var n=g(this,t);n?n[1]=e:this.a.push([t,e])},delete:function(t){var e=p(this.a,(function(e){return e[0]===t}));return~e&&this.a.splice(e,1),!!~e}},t.exports={getConstructor:function(t,e,n,o){var u=t((function(t,r){s(t,u,e,"_i"),t._t=e,t._i=v++,t._l=void 0,null!=r&&c(r,n,t[o],t)}));return r(u.prototype,{delete:function(t){if(!a(t))return!1;var n=i(t);return!0===n?h(l(this,e)).delete(t):n&&f(n,this._i)&&delete n[this._i]},has:function(t){if(!a(t))return!1;var n=i(t);return!0===n?h(l(this,e)).has(t):n&&f(n,this._i)}}),u},def:function(t,e,n){var r=i(o(e),!0);return!0===r?h(t).set(e,n):r[t._i]=n,t},ufstore:h}},function(t,e,n){var r=n(21),i=n(6);t.exports=function(t){if(void 0===t)return 0;var e=r(t),n=i(e);if(e!==n)throw RangeError("Wrong length!");return n}},function(t,e,n){var r=n(41),i=n(58),o=n(1),a=n(2).Reflect;t.exports=a&&a.ownKeys||function(t){var e=r.f(o(t)),n=i.f;return n?e.concat(n(t)):e}},function(t,e,n){"use strict";var r=n(59),i=n(4),o=n(6),a=n(19),s=n(5)("isConcatSpreadable");t.exports=function t(e,n,c,u,f,l,d,p){for(var v,h,m=f,g=0,y=!!d&&a(d,p,3);g<u;){if(g in c){if(v=y?y(c[g],g,n):c[g],h=!1,i(v)&&(h=void 0!==(h=v[s])?!!h:r(v)),h&&l>0)m=t(e,n,v,o(v.length),m,l-1)-1;else{if(m>=9007199254740991)throw TypeError();e[m]=v}m++}g++}return m}},function(t,e,n){var r=n(6),i=n(90),o=n(24);t.exports=function(t,e,n,a){var s=String(o(t)),c=s.length,u=void 0===n?" ":String(n),f=r(e);if(f<=c||""==u)return s;var l=f-c,d=i.call(u,Math.ceil(l/u.length));return d.length>l&&(d=d.slice(0,l)),a?d+s:s+d}},function(t,e,n){var r=n(7),i=n(38),o=n(15),a=n(53).f;t.exports=function(t){return function(e){for(var n,s=o(e),c=i(s),u=c.length,f=0,l=[];u>f;)n=c[f++],r&&!a.call(s,n)||l.push(t?[n,s[n]]:s[n]);return l}}},function(t,e,n){var r=n(48),i=n(143);t.exports=function(t){return function(){if(r(this)!=t)throw TypeError(t+"#toJSON isn't generic");return i(this)}}},function(t,e,n){var r=n(44);t.exports=function(t,e){var n=[];return r(t,!1,n.push,n,e),n}},function(t,e){t.exports=Math.scale||function(t,e,n,r,i){return 0===arguments.length||t!=t||e!=e||n!=n||r!=r||i!=i?NaN:t===1/0||t===-1/0?t:(t-e)*(i-r)/(n-e)+r}},function(t,e){var n,r,i=t.exports={};function o(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function s(t){if(n===setTimeout)return setTimeout(t,0);if((n===o||!n)&&setTimeout)return n=setTimeout,setTimeout(t,0);try{return n(t,0)}catch(e){try{return n.call(null,t,0)}catch(e){return n.call(this,t,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:o}catch(t){n=o}try{r="function"==typeof clearTimeout?clearTimeout:a}catch(t){r=a}}();var c,u=[],f=!1,l=-1;function d(){f&&c&&(f=!1,c.length?u=c.concat(u):l=-1,u.length&&p())}function p(){if(!f){var t=s(d);f=!0;for(var e=u.length;e;){for(c=u,u=[];++l<e;)c&&c[l].run();l=-1,e=u.length}c=null,f=!1,function(t){if(r===clearTimeout)return clearTimeout(t);if((r===a||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(t);try{r(t)}catch(e){try{return r.call(null,t)}catch(e){return r.call(this,t)}}}(t)}}function v(t,e){this.fun=t,this.array=e}function h(){}i.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];u.push(new v(t,e)),1!==u.length||f||s(p)},v.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=h,i.addListener=h,i.once=h,i.off=h,i.removeListener=h,i.removeAllListeners=h,i.emit=h,i.prependListener=h,i.prependOnceListener=h,i.listeners=function(t){return[]},i.binding=function(t){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(t){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},function(t,e,n){t.exports=n.p+"f82451c3a8b8cc26ee5edd962267fe51.png"},function(t,e,n){t.exports=n(369)},function(t,e,n){"use strict";(function(t){if(n(149),n(346),n(347),t._babelPolyfill)throw new Error("only one instance of babel-polyfill is allowed");t._babelPolyfill=!0;function e(t,e,n){t[e]||Object.defineProperty(t,e,{writable:!0,configurable:!0,value:n})}e(String.prototype,"padLeft","".padStart),e(String.prototype,"padRight","".padEnd),"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach((function(t){[][t]&&e(Array,t,Function.call.bind([][t]))}))}).call(this,n(35))},function(t,e,n){n(150),n(153),n(154),n(155),n(156),n(157),n(158),n(159),n(160),n(161),n(162),n(163),n(164),n(165),n(166),n(167),n(168),n(169),n(170),n(171),n(172),n(173),n(174),n(175),n(176),n(177),n(178),n(179),n(180),n(181),n(182),n(183),n(184),n(185),n(186),n(187),n(188),n(189),n(190),n(191),n(192),n(193),n(194),n(195),n(196),n(197),n(198),n(199),n(200),n(201),n(202),n(203),n(204),n(205),n(206),n(207),n(208),n(209),n(210),n(211),n(212),n(213),n(214),n(215),n(216),n(217),n(218),n(219),n(220),n(221),n(222),n(223),n(224),n(225),n(226),n(227),n(228),n(230),n(231),n(233),n(234),n(235),n(236),n(237),n(238),n(239),n(241),n(242),n(243),n(244),n(245),n(246),n(247),n(248),n(249),n(250),n(251),n(252),n(253),n(102),n(254),n(128),n(255),n(129),n(256),n(257),n(258),n(259),n(260),n(132),n(134),n(135),n(261),n(262),n(263),n(264),n(265),n(266),n(267),n(268),n(269),n(270),n(271),n(272),n(273),n(274),n(275),n(276),n(277),n(278),n(279),n(280),n(281),n(282),n(283),n(284),n(285),n(286),n(287),n(288),n(289),n(290),n(291),n(292),n(293),n(294),n(295),n(296),n(297),n(298),n(299),n(300),n(301),n(302),n(303),n(304),n(305),n(306),n(307),n(308),n(309),n(310),n(311),n(312),n(313),n(314),n(315),n(316),n(317),n(318),n(319),n(320),n(321),n(322),n(323),n(324),n(325),n(326),n(327),n(328),n(329),n(330),n(331),n(332),n(333),n(334),n(335),n(336),n(337),n(338),n(339),n(340),n(341),n(342),n(343),n(344),n(345),t.exports=n(18)},function(t,e,n){"use strict";var r=n(2),i=n(14),o=n(7),a=n(0),s=n(12),c=n(30).KEY,u=n(3),f=n(51),l=n(47),d=n(37),p=n(5),v=n(110),h=n(83),m=n(152),g=n(59),y=n(1),b=n(4),_=n(9),w=n(15),x=n(23),S=n(36),O=n(40),M=n(113),A=n(16),k=n(58),C=n(8),P=n(38),E=A.f,T=C.f,F=M.f,$=r.Symbol,N=r.JSON,I=N&&N.stringify,j=p("_hidden"),R=p("toPrimitive"),L={}.propertyIsEnumerable,D=f("symbol-registry"),B=f("symbols"),W=f("op-symbols"),G=Object.prototype,U="function"==typeof $&&!!k.f,z=r.QObject,V=!z||!z.prototype||!z.prototype.findChild,H=o&&u((function(){return 7!=O(T({},"a",{get:function(){return T(this,"a",{value:7}).a}})).a}))?function(t,e,n){var r=E(G,e);r&&delete G[e],T(t,e,n),r&&t!==G&&T(G,e,r)}:T,q=function(t){var e=B[t]=O($.prototype);return e._k=t,e},K=U&&"symbol"==typeof $.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof $},J=function(t,e,n){return t===G&&J(W,e,n),y(t),e=x(e,!0),y(n),i(B,e)?(n.enumerable?(i(t,j)&&t[j][e]&&(t[j][e]=!1),n=O(n,{enumerable:S(0,!1)})):(i(t,j)||T(t,j,S(1,{})),t[j][e]=!0),H(t,e,n)):T(t,e,n)},X=function(t,e){y(t);for(var n,r=m(e=w(e)),i=0,o=r.length;o>i;)J(t,n=r[i++],e[n]);return t},Y=function(t){var e=L.call(this,t=x(t,!0));return!(this===G&&i(B,t)&&!i(W,t))&&(!(e||!i(this,t)||!i(B,t)||i(this,j)&&this[j][t])||e)},Q=function(t,e){if(t=w(t),e=x(e,!0),t!==G||!i(B,e)||i(W,e)){var n=E(t,e);return!n||!i(B,e)||i(t,j)&&t[j][e]||(n.enumerable=!0),n}},Z=function(t){for(var e,n=F(w(t)),r=[],o=0;n.length>o;)i(B,e=n[o++])||e==j||e==c||r.push(e);return r},tt=function(t){for(var e,n=t===G,r=F(n?W:w(t)),o=[],a=0;r.length>a;)!i(B,e=r[a++])||n&&!i(G,e)||o.push(B[e]);return o};U||(s(($=function(){if(this instanceof $)throw TypeError("Symbol is not a constructor!");var t=d(arguments.length>0?arguments[0]:void 0),e=function(n){this===G&&e.call(W,n),i(this,j)&&i(this[j],t)&&(this[j][t]=!1),H(this,t,S(1,n))};return o&&V&&H(G,t,{configurable:!0,set:e}),q(t)}).prototype,"toString",(function(){return this._k})),A.f=Q,C.f=J,n(41).f=M.f=Z,n(53).f=Y,k.f=tt,o&&!n(29)&&s(G,"propertyIsEnumerable",Y,!0),v.f=function(t){return q(p(t))}),a(a.G+a.W+a.F*!U,{Symbol:$});for(var et="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),nt=0;et.length>nt;)p(et[nt++]);for(var rt=P(p.store),it=0;rt.length>it;)h(rt[it++]);a(a.S+a.F*!U,"Symbol",{for:function(t){return i(D,t+="")?D[t]:D[t]=$(t)},keyFor:function(t){if(!K(t))throw TypeError(t+" is not a symbol!");for(var e in D)if(D[e]===t)return e},useSetter:function(){V=!0},useSimple:function(){V=!1}}),a(a.S+a.F*!U,"Object",{create:function(t,e){return void 0===e?O(t):X(O(t),e)},defineProperty:J,defineProperties:X,getOwnPropertyDescriptor:Q,getOwnPropertyNames:Z,getOwnPropertySymbols:tt});var ot=u((function(){k.f(1)}));a(a.S+a.F*ot,"Object",{getOwnPropertySymbols:function(t){return k.f(_(t))}}),N&&a(a.S+a.F*(!U||u((function(){var t=$();return"[null]"!=I([t])||"{}"!=I({a:t})||"{}"!=I(Object(t))}))),"JSON",{stringify:function(t){for(var e,n,r=[t],i=1;arguments.length>i;)r.push(arguments[i++]);if(n=e=r[1],(b(e)||void 0!==t)&&!K(t))return g(e)||(e=function(t,e){if("function"==typeof n&&(e=n.call(this,t,e)),!K(e))return e}),r[1]=e,I.apply(N,r)}}),$.prototype[R]||n(11)($.prototype,R,$.prototype.valueOf),l($,"Symbol"),l(Math,"Math",!0),l(r.JSON,"JSON",!0)},function(t,e,n){t.exports=n(51)("native-function-to-string",Function.toString)},function(t,e,n){var r=n(38),i=n(58),o=n(53);t.exports=function(t){var e=r(t),n=i.f;if(n)for(var a,s=n(t),c=o.f,u=0;s.length>u;)c.call(t,a=s[u++])&&e.push(a);return e}},function(t,e,n){var r=n(0);r(r.S,"Object",{create:n(40)})},function(t,e,n){var r=n(0);r(r.S+r.F*!n(7),"Object",{defineProperty:n(8).f})},function(t,e,n){var r=n(0);r(r.S+r.F*!n(7),"Object",{defineProperties:n(112)})},function(t,e,n){var r=n(15),i=n(16).f;n(25)("getOwnPropertyDescriptor",(function(){return function(t,e){return i(r(t),e)}}))},function(t,e,n){var r=n(9),i=n(17);n(25)("getPrototypeOf",(function(){return function(t){return i(r(t))}}))},function(t,e,n){var r=n(9),i=n(38);n(25)("keys",(function(){return function(t){return i(r(t))}}))},function(t,e,n){n(25)("getOwnPropertyNames",(function(){return n(113).f}))},function(t,e,n){var r=n(4),i=n(30).onFreeze;n(25)("freeze",(function(t){return function(e){return t&&r(e)?t(i(e)):e}}))},function(t,e,n){var r=n(4),i=n(30).onFreeze;n(25)("seal",(function(t){return function(e){return t&&r(e)?t(i(e)):e}}))},function(t,e,n){var r=n(4),i=n(30).onFreeze;n(25)("preventExtensions",(function(t){return function(e){return t&&r(e)?t(i(e)):e}}))},function(t,e,n){var r=n(4);n(25)("isFrozen",(function(t){return function(e){return!r(e)||!!t&&t(e)}}))},function(t,e,n){var r=n(4);n(25)("isSealed",(function(t){return function(e){return!r(e)||!!t&&t(e)}}))},function(t,e,n){var r=n(4);n(25)("isExtensible",(function(t){return function(e){return!!r(e)&&(!t||t(e))}}))},function(t,e,n){var r=n(0);r(r.S+r.F,"Object",{assign:n(114)})},function(t,e,n){var r=n(0);r(r.S,"Object",{is:n(115)})},function(t,e,n){var r=n(0);r(r.S,"Object",{setPrototypeOf:n(87).set})},function(t,e,n){"use strict";var r=n(48),i={};i[n(5)("toStringTag")]="z",i+""!="[object z]"&&n(12)(Object.prototype,"toString",(function(){return"[object "+r(this)+"]"}),!0)},function(t,e,n){var r=n(0);r(r.P,"Function",{bind:n(116)})},function(t,e,n){var r=n(8).f,i=Function.prototype,o=/^\s*function ([^ (]*)/;"name"in i||n(7)&&r(i,"name",{configurable:!0,get:function(){try{return(""+this).match(o)[1]}catch(t){return""}}})},function(t,e,n){"use strict";var r=n(4),i=n(17),o=n(5)("hasInstance"),a=Function.prototype;o in a||n(8).f(a,o,{value:function(t){if("function"!=typeof this||!r(t))return!1;if(!r(this.prototype))return t instanceof this;for(;t=i(t);)if(this.prototype===t)return!0;return!1}})},function(t,e,n){var r=n(0),i=n(118);r(r.G+r.F*(parseInt!=i),{parseInt:i})},function(t,e,n){var r=n(0),i=n(119);r(r.G+r.F*(parseFloat!=i),{parseFloat:i})},function(t,e,n){"use strict";var r=n(2),i=n(14),o=n(20),a=n(89),s=n(23),c=n(3),u=n(41).f,f=n(16).f,l=n(8).f,d=n(49).trim,p=r.Number,v=p,h=p.prototype,m="Number"==o(n(40)(h)),g="trim"in String.prototype,y=function(t){var e=s(t,!1);if("string"==typeof e&&e.length>2){var n,r,i,o=(e=g?e.trim():d(e,3)).charCodeAt(0);if(43===o||45===o){if(88===(n=e.charCodeAt(2))||120===n)return NaN}else if(48===o){switch(e.charCodeAt(1)){case 66:case 98:r=2,i=49;break;case 79:case 111:r=8,i=55;break;default:return+e}for(var a,c=e.slice(2),u=0,f=c.length;u<f;u++)if((a=c.charCodeAt(u))<48||a>i)return NaN;return parseInt(c,r)}}return+e};if(!p(" 0o1")||!p("0b1")||p("+0x1")){p=function(t){var e=arguments.length<1?0:t,n=this;return n instanceof p&&(m?c((function(){h.valueOf.call(n)})):"Number"!=o(n))?a(new v(y(e)),n,p):y(e)};for(var b,_=n(7)?u(v):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),w=0;_.length>w;w++)i(v,b=_[w])&&!i(p,b)&&l(p,b,f(v,b));p.prototype=h,h.constructor=p,n(12)(r,"Number",p)}},function(t,e,n){"use strict";var r=n(0),i=n(21),o=n(120),a=n(90),s=1..toFixed,c=Math.floor,u=[0,0,0,0,0,0],f="Number.toFixed: incorrect invocation!",l=function(t,e){for(var n=-1,r=e;++n<6;)r+=t*u[n],u[n]=r%1e7,r=c(r/1e7)},d=function(t){for(var e=6,n=0;--e>=0;)n+=u[e],u[e]=c(n/t),n=n%t*1e7},p=function(){for(var t=6,e="";--t>=0;)if(""!==e||0===t||0!==u[t]){var n=String(u[t]);e=""===e?n:e+a.call("0",7-n.length)+n}return e},v=function(t,e,n){return 0===e?n:e%2==1?v(t,e-1,n*t):v(t*t,e/2,n)};r(r.P+r.F*(!!s&&("0.000"!==8e-5.toFixed(3)||"1"!==.9.toFixed(0)||"1.25"!==1.255.toFixed(2)||"1000000000000000128"!==(0xde0b6b3a7640080).toFixed(0))||!n(3)((function(){s.call({})}))),"Number",{toFixed:function(t){var e,n,r,s,c=o(this,f),u=i(t),h="",m="0";if(u<0||u>20)throw RangeError(f);if(c!=c)return"NaN";if(c<=-1e21||c>=1e21)return String(c);if(c<0&&(h="-",c=-c),c>1e-21)if(n=(e=function(t){for(var e=0,n=t;n>=4096;)e+=12,n/=4096;for(;n>=2;)e+=1,n/=2;return e}(c*v(2,69,1))-69)<0?c*v(2,-e,1):c/v(2,e,1),n*=4503599627370496,(e=52-e)>0){for(l(0,n),r=u;r>=7;)l(1e7,0),r-=7;for(l(v(10,r,1),0),r=e-1;r>=23;)d(1<<23),r-=23;d(1<<r),l(1,1),d(2),m=p()}else l(0,n),l(1<<-e,0),m=p()+a.call("0",u);return m=u>0?h+((s=m.length)<=u?"0."+a.call("0",u-s)+m:m.slice(0,s-u)+"."+m.slice(s-u)):h+m}})},function(t,e,n){"use strict";var r=n(0),i=n(3),o=n(120),a=1..toPrecision;r(r.P+r.F*(i((function(){return"1"!==a.call(1,void 0)}))||!i((function(){a.call({})}))),"Number",{toPrecision:function(t){var e=o(this,"Number#toPrecision: incorrect invocation!");return void 0===t?a.call(e):a.call(e,t)}})},function(t,e,n){var r=n(0);r(r.S,"Number",{EPSILON:Math.pow(2,-52)})},function(t,e,n){var r=n(0),i=n(2).isFinite;r(r.S,"Number",{isFinite:function(t){return"number"==typeof t&&i(t)}})},function(t,e,n){var r=n(0);r(r.S,"Number",{isInteger:n(121)})},function(t,e,n){var r=n(0);r(r.S,"Number",{isNaN:function(t){return t!=t}})},function(t,e,n){var r=n(0),i=n(121),o=Math.abs;r(r.S,"Number",{isSafeInteger:function(t){return i(t)&&o(t)<=9007199254740991}})},function(t,e,n){var r=n(0);r(r.S,"Number",{MAX_SAFE_INTEGER:9007199254740991})},function(t,e,n){var r=n(0);r(r.S,"Number",{MIN_SAFE_INTEGER:-9007199254740991})},function(t,e,n){var r=n(0),i=n(119);r(r.S+r.F*(Number.parseFloat!=i),"Number",{parseFloat:i})},function(t,e,n){var r=n(0),i=n(118);r(r.S+r.F*(Number.parseInt!=i),"Number",{parseInt:i})},function(t,e,n){var r=n(0),i=n(122),o=Math.sqrt,a=Math.acosh;r(r.S+r.F*!(a&&710==Math.floor(a(Number.MAX_VALUE))&&a(1/0)==1/0),"Math",{acosh:function(t){return(t=+t)<1?NaN:t>94906265.62425156?Math.log(t)+Math.LN2:i(t-1+o(t-1)*o(t+1))}})},function(t,e,n){var r=n(0),i=Math.asinh;r(r.S+r.F*!(i&&1/i(0)>0),"Math",{asinh:function t(e){return isFinite(e=+e)&&0!=e?e<0?-t(-e):Math.log(e+Math.sqrt(e*e+1)):e}})},function(t,e,n){var r=n(0),i=Math.atanh;r(r.S+r.F*!(i&&1/i(-0)<0),"Math",{atanh:function(t){return 0==(t=+t)?t:Math.log((1+t)/(1-t))/2}})},function(t,e,n){var r=n(0),i=n(91);r(r.S,"Math",{cbrt:function(t){return i(t=+t)*Math.pow(Math.abs(t),1/3)}})},function(t,e,n){var r=n(0);r(r.S,"Math",{clz32:function(t){return(t>>>=0)?31-Math.floor(Math.log(t+.5)*Math.LOG2E):32}})},function(t,e,n){var r=n(0),i=Math.exp;r(r.S,"Math",{cosh:function(t){return(i(t=+t)+i(-t))/2}})},function(t,e,n){var r=n(0),i=n(92);r(r.S+r.F*(i!=Math.expm1),"Math",{expm1:i})},function(t,e,n){var r=n(0);r(r.S,"Math",{fround:n(123)})},function(t,e,n){var r=n(0),i=Math.abs;r(r.S,"Math",{hypot:function(t,e){for(var n,r,o=0,a=0,s=arguments.length,c=0;a<s;)c<(n=i(arguments[a++]))?(o=o*(r=c/n)*r+1,c=n):o+=n>0?(r=n/c)*r:n;return c===1/0?1/0:c*Math.sqrt(o)}})},function(t,e,n){var r=n(0),i=Math.imul;r(r.S+r.F*n(3)((function(){return-5!=i(4294967295,5)||2!=i.length})),"Math",{imul:function(t,e){var n=+t,r=+e,i=65535&n,o=65535&r;return 0|i*o+((65535&n>>>16)*o+i*(65535&r>>>16)<<16>>>0)}})},function(t,e,n){var r=n(0);r(r.S,"Math",{log10:function(t){return Math.log(t)*Math.LOG10E}})},function(t,e,n){var r=n(0);r(r.S,"Math",{log1p:n(122)})},function(t,e,n){var r=n(0);r(r.S,"Math",{log2:function(t){return Math.log(t)/Math.LN2}})},function(t,e,n){var r=n(0);r(r.S,"Math",{sign:n(91)})},function(t,e,n){var r=n(0),i=n(92),o=Math.exp;r(r.S+r.F*n(3)((function(){return-2e-17!=!Math.sinh(-2e-17)})),"Math",{sinh:function(t){return Math.abs(t=+t)<1?(i(t)-i(-t))/2:(o(t-1)-o(-t-1))*(Math.E/2)}})},function(t,e,n){var r=n(0),i=n(92),o=Math.exp;r(r.S,"Math",{tanh:function(t){var e=i(t=+t),n=i(-t);return e==1/0?1:n==1/0?-1:(e-n)/(o(t)+o(-t))}})},function(t,e,n){var r=n(0);r(r.S,"Math",{trunc:function(t){return(t>0?Math.floor:Math.ceil)(t)}})},function(t,e,n){var r=n(0),i=n(39),o=String.fromCharCode,a=String.fromCodePoint;r(r.S+r.F*(!!a&&1!=a.length),"String",{fromCodePoint:function(t){for(var e,n=[],r=arguments.length,a=0;r>a;){if(e=+arguments[a++],i(e,1114111)!==e)throw RangeError(e+" is not a valid code point");n.push(e<65536?o(e):o(55296+((e-=65536)>>10),e%1024+56320))}return n.join("")}})},function(t,e,n){var r=n(0),i=n(15),o=n(6);r(r.S,"String",{raw:function(t){for(var e=i(t.raw),n=o(e.length),r=arguments.length,a=[],s=0;n>s;)a.push(String(e[s++])),s<r&&a.push(String(arguments[s]));return a.join("")}})},function(t,e,n){"use strict";n(49)("trim",(function(t){return function(){return t(this,3)}}))},function(t,e,n){"use strict";var r=n(60)(!0);n(93)(String,"String",(function(t){this._t=String(t),this._i=0}),(function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=r(e,n),this._i+=t.length,{value:t,done:!1})}))},function(t,e,n){"use strict";var r=n(0),i=n(60)(!1);r(r.P,"String",{codePointAt:function(t){return i(this,t)}})},function(t,e,n){"use strict";var r=n(0),i=n(6),o=n(95),a="".endsWith;r(r.P+r.F*n(96)("endsWith"),"String",{endsWith:function(t){var e=o(this,t,"endsWith"),n=arguments.length>1?arguments[1]:void 0,r=i(e.length),s=void 0===n?r:Math.min(i(n),r),c=String(t);return a?a.call(e,c,s):e.slice(s-c.length,s)===c}})},function(t,e,n){"use strict";var r=n(0),i=n(95);r(r.P+r.F*n(96)("includes"),"String",{includes:function(t){return!!~i(this,t,"includes").indexOf(t,arguments.length>1?arguments[1]:void 0)}})},function(t,e,n){var r=n(0);r(r.P,"String",{repeat:n(90)})},function(t,e,n){"use strict";var r=n(0),i=n(6),o=n(95),a="".startsWith;r(r.P+r.F*n(96)("startsWith"),"String",{startsWith:function(t){var e=o(this,t,"startsWith"),n=i(Math.min(arguments.length>1?arguments[1]:void 0,e.length)),r=String(t);return a?a.call(e,r,n):e.slice(n,n+r.length)===r}})},function(t,e,n){"use strict";n(13)("anchor",(function(t){return function(e){return t(this,"a","name",e)}}))},function(t,e,n){"use strict";n(13)("big",(function(t){return function(){return t(this,"big","","")}}))},function(t,e,n){"use strict";n(13)("blink",(function(t){return function(){return t(this,"blink","","")}}))},function(t,e,n){"use strict";n(13)("bold",(function(t){return function(){return t(this,"b","","")}}))},function(t,e,n){"use strict";n(13)("fixed",(function(t){return function(){return t(this,"tt","","")}}))},function(t,e,n){"use strict";n(13)("fontcolor",(function(t){return function(e){return t(this,"font","color",e)}}))},function(t,e,n){"use strict";n(13)("fontsize",(function(t){return function(e){return t(this,"font","size",e)}}))},function(t,e,n){"use strict";n(13)("italics",(function(t){return function(){return t(this,"i","","")}}))},function(t,e,n){"use strict";n(13)("link",(function(t){return function(e){return t(this,"a","href",e)}}))},function(t,e,n){"use strict";n(13)("small",(function(t){return function(){return t(this,"small","","")}}))},function(t,e,n){"use strict";n(13)("strike",(function(t){return function(){return t(this,"strike","","")}}))},function(t,e,n){"use strict";n(13)("sub",(function(t){return function(){return t(this,"sub","","")}}))},function(t,e,n){"use strict";n(13)("sup",(function(t){return function(){return t(this,"sup","","")}}))},function(t,e,n){var r=n(0);r(r.S,"Date",{now:function(){return(new Date).getTime()}})},function(t,e,n){"use strict";var r=n(0),i=n(9),o=n(23);r(r.P+r.F*n(3)((function(){return null!==new Date(NaN).toJSON()||1!==Date.prototype.toJSON.call({toISOString:function(){return 1}})})),"Date",{toJSON:function(t){var e=i(this),n=o(e);return"number"!=typeof n||isFinite(n)?e.toISOString():null}})},function(t,e,n){var r=n(0),i=n(229);r(r.P+r.F*(Date.prototype.toISOString!==i),"Date",{toISOString:i})},function(t,e,n){"use strict";var r=n(3),i=Date.prototype.getTime,o=Date.prototype.toISOString,a=function(t){return t>9?t:"0"+t};t.exports=r((function(){return"0385-07-25T07:06:39.999Z"!=o.call(new Date(-5e13-1))}))||!r((function(){o.call(new Date(NaN))}))?function(){if(!isFinite(i.call(this)))throw RangeError("Invalid time value");var t=this,e=t.getUTCFullYear(),n=t.getUTCMilliseconds(),r=e<0?"-":e>9999?"+":"";return r+("00000"+Math.abs(e)).slice(r?-6:-4)+"-"+a(t.getUTCMonth()+1)+"-"+a(t.getUTCDate())+"T"+a(t.getUTCHours())+":"+a(t.getUTCMinutes())+":"+a(t.getUTCSeconds())+"."+(n>99?n:"0"+a(n))+"Z"}:o},function(t,e,n){var r=Date.prototype,i=r.toString,o=r.getTime;new Date(NaN)+""!="Invalid Date"&&n(12)(r,"toString",(function(){var t=o.call(this);return t==t?i.call(this):"Invalid Date"}))},function(t,e,n){var r=n(5)("toPrimitive"),i=Date.prototype;r in i||n(11)(i,r,n(232))},function(t,e,n){"use strict";var r=n(1),i=n(23);t.exports=function(t){if("string"!==t&&"number"!==t&&"default"!==t)throw TypeError("Incorrect hint");return i(r(this),"number"!=t)}},function(t,e,n){var r=n(0);r(r.S,"Array",{isArray:n(59)})},function(t,e,n){"use strict";var r=n(19),i=n(0),o=n(9),a=n(124),s=n(97),c=n(6),u=n(98),f=n(99);i(i.S+i.F*!n(62)((function(t){Array.from(t)})),"Array",{from:function(t){var e,n,i,l,d=o(t),p="function"==typeof this?this:Array,v=arguments.length,h=v>1?arguments[1]:void 0,m=void 0!==h,g=0,y=f(d);if(m&&(h=r(h,v>2?arguments[2]:void 0,2)),null==y||p==Array&&s(y))for(n=new p(e=c(d.length));e>g;g++)u(n,g,m?h(d[g],g):d[g]);else for(l=y.call(d),n=new p;!(i=l.next()).done;g++)u(n,g,m?a(l,h,[i.value,g],!0):i.value);return n.length=g,n}})},function(t,e,n){"use strict";var r=n(0),i=n(98);r(r.S+r.F*n(3)((function(){function t(){}return!(Array.of.call(t)instanceof t)})),"Array",{of:function(){for(var t=0,e=arguments.length,n=new("function"==typeof this?this:Array)(e);e>t;)i(n,t,arguments[t++]);return n.length=e,n}})},function(t,e,n){"use strict";var r=n(0),i=n(15),o=[].join;r(r.P+r.F*(n(52)!=Object||!n(22)(o)),"Array",{join:function(t){return o.call(i(this),void 0===t?",":t)}})},function(t,e,n){"use strict";var r=n(0),i=n(86),o=n(20),a=n(39),s=n(6),c=[].slice;r(r.P+r.F*n(3)((function(){i&&c.call(i)})),"Array",{slice:function(t,e){var n=s(this.length),r=o(this);if(e=void 0===e?n:e,"Array"==r)return c.call(this,t,e);for(var i=a(t,n),u=a(e,n),f=s(u-i),l=new Array(f),d=0;d<f;d++)l[d]="String"==r?this.charAt(i+d):this[i+d];return l}})},function(t,e,n){"use strict";var r=n(0),i=n(10),o=n(9),a=n(3),s=[].sort,c=[1,2,3];r(r.P+r.F*(a((function(){c.sort(void 0)}))||!a((function(){c.sort(null)}))||!n(22)(s)),"Array",{sort:function(t){return void 0===t?s.call(o(this)):s.call(o(this),i(t))}})},function(t,e,n){"use strict";var r=n(0),i=n(26)(0),o=n(22)([].forEach,!0);r(r.P+r.F*!o,"Array",{forEach:function(t){return i(this,t,arguments[1])}})},function(t,e,n){var r=n(4),i=n(59),o=n(5)("species");t.exports=function(t){var e;return i(t)&&("function"!=typeof(e=t.constructor)||e!==Array&&!i(e.prototype)||(e=void 0),r(e)&&null===(e=e[o])&&(e=void 0)),void 0===e?Array:e}},function(t,e,n){"use strict";var r=n(0),i=n(26)(1);r(r.P+r.F*!n(22)([].map,!0),"Array",{map:function(t){return i(this,t,arguments[1])}})},function(t,e,n){"use strict";var r=n(0),i=n(26)(2);r(r.P+r.F*!n(22)([].filter,!0),"Array",{filter:function(t){return i(this,t,arguments[1])}})},function(t,e,n){"use strict";var r=n(0),i=n(26)(3);r(r.P+r.F*!n(22)([].some,!0),"Array",{some:function(t){return i(this,t,arguments[1])}})},function(t,e,n){"use strict";var r=n(0),i=n(26)(4);r(r.P+r.F*!n(22)([].every,!0),"Array",{every:function(t){return i(this,t,arguments[1])}})},function(t,e,n){"use strict";var r=n(0),i=n(125);r(r.P+r.F*!n(22)([].reduce,!0),"Array",{reduce:function(t){return i(this,t,arguments.length,arguments[1],!1)}})},function(t,e,n){"use strict";var r=n(0),i=n(125);r(r.P+r.F*!n(22)([].reduceRight,!0),"Array",{reduceRight:function(t){return i(this,t,arguments.length,arguments[1],!0)}})},function(t,e,n){"use strict";var r=n(0),i=n(57)(!1),o=[].indexOf,a=!!o&&1/[1].indexOf(1,-0)<0;r(r.P+r.F*(a||!n(22)(o)),"Array",{indexOf:function(t){return a?o.apply(this,arguments)||0:i(this,t,arguments[1])}})},function(t,e,n){"use strict";var r=n(0),i=n(15),o=n(21),a=n(6),s=[].lastIndexOf,c=!!s&&1/[1].lastIndexOf(1,-0)<0;r(r.P+r.F*(c||!n(22)(s)),"Array",{lastIndexOf:function(t){if(c)return s.apply(this,arguments)||0;var e=i(this),n=a(e.length),r=n-1;for(arguments.length>1&&(r=Math.min(r,o(arguments[1]))),r<0&&(r=n+r);r>=0;r--)if(r in e&&e[r]===t)return r||0;return-1}})},function(t,e,n){var r=n(0);r(r.P,"Array",{copyWithin:n(126)}),n(31)("copyWithin")},function(t,e,n){var r=n(0);r(r.P,"Array",{fill:n(101)}),n(31)("fill")},function(t,e,n){"use strict";var r=n(0),i=n(26)(5),o=!0;"find"in[]&&Array(1).find((function(){o=!1})),r(r.P+r.F*o,"Array",{find:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}}),n(31)("find")},function(t,e,n){"use strict";var r=n(0),i=n(26)(6),o="findIndex",a=!0;o in[]&&Array(1)[o]((function(){a=!1})),r(r.P+r.F*a,"Array",{findIndex:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}}),n(31)(o)},function(t,e,n){n(42)("Array")},function(t,e,n){var r=n(2),i=n(89),o=n(8).f,a=n(41).f,s=n(61),c=n(54),u=r.RegExp,f=u,l=u.prototype,d=/a/g,p=/a/g,v=new u(d)!==d;if(n(7)&&(!v||n(3)((function(){return p[n(5)("match")]=!1,u(d)!=d||u(p)==p||"/a/i"!=u(d,"i")})))){u=function(t,e){var n=this instanceof u,r=s(t),o=void 0===e;return!n&&r&&t.constructor===u&&o?t:i(v?new f(r&&!o?t.source:t,e):f((r=t instanceof u)?t.source:t,r&&o?c.call(t):e),n?this:l,u)};for(var h=function(t){t in u||o(u,t,{configurable:!0,get:function(){return f[t]},set:function(e){f[t]=e}})},m=a(f),g=0;m.length>g;)h(m[g++]);l.constructor=u,u.prototype=l,n(12)(r,"RegExp",u)}n(42)("RegExp")},function(t,e,n){"use strict";n(129);var r=n(1),i=n(54),o=n(7),a=/./.toString,s=function(t){n(12)(RegExp.prototype,"toString",t,!0)};n(3)((function(){return"/a/b"!=a.call({source:"a",flags:"b"})}))?s((function(){var t=r(this);return"/".concat(t.source,"/","flags"in t?t.flags:!o&&t instanceof RegExp?i.call(t):void 0)})):"toString"!=a.name&&s((function(){return a.call(this)}))},function(t,e,n){"use strict";var r=n(1),i=n(6),o=n(104),a=n(63);n(64)("match",1,(function(t,e,n,s){return[function(n){var r=t(this),i=null==n?void 0:n[e];return void 0!==i?i.call(n,r):new RegExp(n)[e](String(r))},function(t){var e=s(n,t,this);if(e.done)return e.value;var c=r(t),u=String(this);if(!c.global)return a(c,u);var f=c.unicode;c.lastIndex=0;for(var l,d=[],p=0;null!==(l=a(c,u));){var v=String(l[0]);d[p]=v,""===v&&(c.lastIndex=o(u,i(c.lastIndex),f)),p++}return 0===p?null:d}]}))},function(t,e,n){"use strict";var r=n(1),i=n(9),o=n(6),a=n(21),s=n(104),c=n(63),u=Math.max,f=Math.min,l=Math.floor,d=/\$([$&`']|\d\d?|<[^>]*>)/g,p=/\$([$&`']|\d\d?)/g;n(64)("replace",2,(function(t,e,n,v){return[function(r,i){var o=t(this),a=null==r?void 0:r[e];return void 0!==a?a.call(r,o,i):n.call(String(o),r,i)},function(t,e){var i=v(n,t,this,e);if(i.done)return i.value;var l=r(t),d=String(this),p="function"==typeof e;p||(e=String(e));var m=l.global;if(m){var g=l.unicode;l.lastIndex=0}for(var y=[];;){var b=c(l,d);if(null===b)break;if(y.push(b),!m)break;""===String(b[0])&&(l.lastIndex=s(d,o(l.lastIndex),g))}for(var _,w="",x=0,S=0;S<y.length;S++){b=y[S];for(var O=String(b[0]),M=u(f(a(b.index),d.length),0),A=[],k=1;k<b.length;k++)A.push(void 0===(_=b[k])?_:String(_));var C=b.groups;if(p){var P=[O].concat(A,M,d);void 0!==C&&P.push(C);var E=String(e.apply(void 0,P))}else E=h(O,d,M,A,C,e);M>=x&&(w+=d.slice(x,M)+E,x=M+O.length)}return w+d.slice(x)}];function h(t,e,r,o,a,s){var c=r+t.length,u=o.length,f=p;return void 0!==a&&(a=i(a),f=d),n.call(s,f,(function(n,i){var s;switch(i.charAt(0)){case"$":return"$";case"&":return t;case"`":return e.slice(0,r);case"'":return e.slice(c);case"<":s=a[i.slice(1,-1)];break;default:var f=+i;if(0===f)return n;if(f>u){var d=l(f/10);return 0===d?n:d<=u?void 0===o[d-1]?i.charAt(1):o[d-1]+i.charAt(1):n}s=o[f-1]}return void 0===s?"":s}))}}))},function(t,e,n){"use strict";var r=n(1),i=n(115),o=n(63);n(64)("search",1,(function(t,e,n,a){return[function(n){var r=t(this),i=null==n?void 0:n[e];return void 0!==i?i.call(n,r):new RegExp(n)[e](String(r))},function(t){var e=a(n,t,this);if(e.done)return e.value;var s=r(t),c=String(this),u=s.lastIndex;i(u,0)||(s.lastIndex=0);var f=o(s,c);return i(s.lastIndex,u)||(s.lastIndex=u),null===f?-1:f.index}]}))},function(t,e,n){"use strict";var r=n(61),i=n(1),o=n(55),a=n(104),s=n(6),c=n(63),u=n(103),f=n(3),l=Math.min,d=[].push,p=!f((function(){RegExp(4294967295,"y")}));n(64)("split",2,(function(t,e,n,f){var v;return v="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(t,e){var i=String(this);if(void 0===t&&0===e)return[];if(!r(t))return n.call(i,t,e);for(var o,a,s,c=[],f=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),l=0,p=void 0===e?4294967295:e>>>0,v=new RegExp(t.source,f+"g");(o=u.call(v,i))&&!((a=v.lastIndex)>l&&(c.push(i.slice(l,o.index)),o.length>1&&o.index<i.length&&d.apply(c,o.slice(1)),s=o[0].length,l=a,c.length>=p));)v.lastIndex===o.index&&v.lastIndex++;return l===i.length?!s&&v.test("")||c.push(""):c.push(i.slice(l)),c.length>p?c.slice(0,p):c}:"0".split(void 0,0).length?function(t,e){return void 0===t&&0===e?[]:n.call(this,t,e)}:n,[function(n,r){var i=t(this),o=null==n?void 0:n[e];return void 0!==o?o.call(n,i,r):v.call(String(i),n,r)},function(t,e){var r=f(v,t,this,e,v!==n);if(r.done)return r.value;var u=i(t),d=String(this),h=o(u,RegExp),m=u.unicode,g=(u.ignoreCase?"i":"")+(u.multiline?"m":"")+(u.unicode?"u":"")+(p?"y":"g"),y=new h(p?u:"^(?:"+u.source+")",g),b=void 0===e?4294967295:e>>>0;if(0===b)return[];if(0===d.length)return null===c(y,d)?[d]:[];for(var _=0,w=0,x=[];w<d.length;){y.lastIndex=p?w:0;var S,O=c(y,p?d:d.slice(w));if(null===O||(S=l(s(y.lastIndex+(p?0:w)),d.length))===_)w=a(d,w,m);else{if(x.push(d.slice(_,w)),x.length===b)return x;for(var M=1;M<=O.length-1;M++)if(x.push(O[M]),x.length===b)return x;w=_=S}}return x.push(d.slice(_)),x}]}))},function(t,e,n){"use strict";var r,i,o,a,s=n(29),c=n(2),u=n(19),f=n(48),l=n(0),d=n(4),p=n(10),v=n(43),h=n(44),m=n(55),g=n(105).set,y=n(106)(),b=n(107),_=n(130),w=n(65),x=n(131),S=c.TypeError,O=c.process,M=O&&O.versions,A=M&&M.v8||"",k=c.Promise,C="process"==f(O),P=function(){},E=i=b.f,T=!!function(){try{var t=k.resolve(1),e=(t.constructor={})[n(5)("species")]=function(t){t(P,P)};return(C||"function"==typeof PromiseRejectionEvent)&&t.then(P)instanceof e&&0!==A.indexOf("6.6")&&-1===w.indexOf("Chrome/66")}catch(t){}}(),F=function(t){var e;return!(!d(t)||"function"!=typeof(e=t.then))&&e},$=function(t,e){if(!t._n){t._n=!0;var n=t._c;y((function(){for(var r=t._v,i=1==t._s,o=0,a=function(e){var n,o,a,s=i?e.ok:e.fail,c=e.resolve,u=e.reject,f=e.domain;try{s?(i||(2==t._h&&j(t),t._h=1),!0===s?n=r:(f&&f.enter(),n=s(r),f&&(f.exit(),a=!0)),n===e.promise?u(S("Promise-chain cycle")):(o=F(n))?o.call(n,c,u):c(n)):u(r)}catch(t){f&&!a&&f.exit(),u(t)}};n.length>o;)a(n[o++]);t._c=[],t._n=!1,e&&!t._h&&N(t)}))}},N=function(t){g.call(c,(function(){var e,n,r,i=t._v,o=I(t);if(o&&(e=_((function(){C?O.emit("unhandledRejection",i,t):(n=c.onunhandledrejection)?n({promise:t,reason:i}):(r=c.console)&&r.error&&r.error("Unhandled promise rejection",i)})),t._h=C||I(t)?2:1),t._a=void 0,o&&e.e)throw e.v}))},I=function(t){return 1!==t._h&&0===(t._a||t._c).length},j=function(t){g.call(c,(function(){var e;C?O.emit("rejectionHandled",t):(e=c.onrejectionhandled)&&e({promise:t,reason:t._v})}))},R=function(t){var e=this;e._d||(e._d=!0,(e=e._w||e)._v=t,e._s=2,e._a||(e._a=e._c.slice()),$(e,!0))},L=function(t){var e,n=this;if(!n._d){n._d=!0,n=n._w||n;try{if(n===t)throw S("Promise can't be resolved itself");(e=F(t))?y((function(){var r={_w:n,_d:!1};try{e.call(t,u(L,r,1),u(R,r,1))}catch(t){R.call(r,t)}})):(n._v=t,n._s=1,$(n,!1))}catch(t){R.call({_w:n,_d:!1},t)}}};T||(k=function(t){v(this,k,"Promise","_h"),p(t),r.call(this);try{t(u(L,this,1),u(R,this,1))}catch(t){R.call(this,t)}},(r=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1}).prototype=n(45)(k.prototype,{then:function(t,e){var n=E(m(this,k));return n.ok="function"!=typeof t||t,n.fail="function"==typeof e&&e,n.domain=C?O.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&$(this,!1),n.promise},catch:function(t){return this.then(void 0,t)}}),o=function(){var t=new r;this.promise=t,this.resolve=u(L,t,1),this.reject=u(R,t,1)},b.f=E=function(t){return t===k||t===a?new o(t):i(t)}),l(l.G+l.W+l.F*!T,{Promise:k}),n(47)(k,"Promise"),n(42)("Promise"),a=n(18).Promise,l(l.S+l.F*!T,"Promise",{reject:function(t){var e=E(this);return(0,e.reject)(t),e.promise}}),l(l.S+l.F*(s||!T),"Promise",{resolve:function(t){return x(s&&this===a?k:this,t)}}),l(l.S+l.F*!(T&&n(62)((function(t){k.all(t).catch(P)}))),"Promise",{all:function(t){var e=this,n=E(e),r=n.resolve,i=n.reject,o=_((function(){var n=[],o=0,a=1;h(t,!1,(function(t){var s=o++,c=!1;n.push(void 0),a++,e.resolve(t).then((function(t){c||(c=!0,n[s]=t,--a||r(n))}),i)})),--a||r(n)}));return o.e&&i(o.v),n.promise},race:function(t){var e=this,n=E(e),r=n.reject,i=_((function(){h(t,!1,(function(t){e.resolve(t).then(n.resolve,r)}))}));return i.e&&r(i.v),n.promise}})},function(t,e,n){"use strict";var r=n(136),i=n(46);n(66)("WeakSet",(function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}}),{add:function(t){return r.def(i(this,"WeakSet"),t,!0)}},r,!1,!0)},function(t,e,n){"use strict";var r=n(0),i=n(67),o=n(108),a=n(1),s=n(39),c=n(6),u=n(4),f=n(2).ArrayBuffer,l=n(55),d=o.ArrayBuffer,p=o.DataView,v=i.ABV&&f.isView,h=d.prototype.slice,m=i.VIEW;r(r.G+r.W+r.F*(f!==d),{ArrayBuffer:d}),r(r.S+r.F*!i.CONSTR,"ArrayBuffer",{isView:function(t){return v&&v(t)||u(t)&&m in t}}),r(r.P+r.U+r.F*n(3)((function(){return!new d(2).slice(1,void 0).byteLength})),"ArrayBuffer",{slice:function(t,e){if(void 0!==h&&void 0===e)return h.call(a(this),t);for(var n=a(this).byteLength,r=s(t,n),i=s(void 0===e?n:e,n),o=new(l(this,d))(c(i-r)),u=new p(this),f=new p(o),v=0;r<i;)f.setUint8(v++,u.getUint8(r++));return o}}),n(42)("ArrayBuffer")},function(t,e,n){var r=n(0);r(r.G+r.W+r.F*!n(67).ABV,{DataView:n(108).DataView})},function(t,e,n){n(27)("Int8",1,(function(t){return function(e,n,r){return t(this,e,n,r)}}))},function(t,e,n){n(27)("Uint8",1,(function(t){return function(e,n,r){return t(this,e,n,r)}}))},function(t,e,n){n(27)("Uint8",1,(function(t){return function(e,n,r){return t(this,e,n,r)}}),!0)},function(t,e,n){n(27)("Int16",2,(function(t){return function(e,n,r){return t(this,e,n,r)}}))},function(t,e,n){n(27)("Uint16",2,(function(t){return function(e,n,r){return t(this,e,n,r)}}))},function(t,e,n){n(27)("Int32",4,(function(t){return function(e,n,r){return t(this,e,n,r)}}))},function(t,e,n){n(27)("Uint32",4,(function(t){return function(e,n,r){return t(this,e,n,r)}}))},function(t,e,n){n(27)("Float32",4,(function(t){return function(e,n,r){return t(this,e,n,r)}}))},function(t,e,n){n(27)("Float64",8,(function(t){return function(e,n,r){return t(this,e,n,r)}}))},function(t,e,n){var r=n(0),i=n(10),o=n(1),a=(n(2).Reflect||{}).apply,s=Function.apply;r(r.S+r.F*!n(3)((function(){a((function(){}))})),"Reflect",{apply:function(t,e,n){var r=i(t),c=o(n);return a?a(r,e,c):s.call(r,e,c)}})},function(t,e,n){var r=n(0),i=n(40),o=n(10),a=n(1),s=n(4),c=n(3),u=n(116),f=(n(2).Reflect||{}).construct,l=c((function(){function t(){}return!(f((function(){}),[],t)instanceof t)})),d=!c((function(){f((function(){}))}));r(r.S+r.F*(l||d),"Reflect",{construct:function(t,e){o(t),a(e);var n=arguments.length<3?t:o(arguments[2]);if(d&&!l)return f(t,e,n);if(t==n){switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3])}var r=[null];return r.push.apply(r,e),new(u.apply(t,r))}var c=n.prototype,p=i(s(c)?c:Object.prototype),v=Function.apply.call(t,p,e);return s(v)?v:p}})},function(t,e,n){var r=n(8),i=n(0),o=n(1),a=n(23);i(i.S+i.F*n(3)((function(){Reflect.defineProperty(r.f({},1,{value:1}),1,{value:2})})),"Reflect",{defineProperty:function(t,e,n){o(t),e=a(e,!0),o(n);try{return r.f(t,e,n),!0}catch(t){return!1}}})},function(t,e,n){var r=n(0),i=n(16).f,o=n(1);r(r.S,"Reflect",{deleteProperty:function(t,e){var n=i(o(t),e);return!(n&&!n.configurable)&&delete t[e]}})},function(t,e,n){"use strict";var r=n(0),i=n(1),o=function(t){this._t=i(t),this._i=0;var e,n=this._k=[];for(e in t)n.push(e)};n(94)(o,"Object",(function(){var t,e=this._k;do{if(this._i>=e.length)return{value:void 0,done:!0}}while(!((t=e[this._i++])in this._t));return{value:t,done:!1}})),r(r.S,"Reflect",{enumerate:function(t){return new o(t)}})},function(t,e,n){var r=n(16),i=n(17),o=n(14),a=n(0),s=n(4),c=n(1);a(a.S,"Reflect",{get:function t(e,n){var a,u,f=arguments.length<3?e:arguments[2];return c(e)===f?e[n]:(a=r.f(e,n))?o(a,"value")?a.value:void 0!==a.get?a.get.call(f):void 0:s(u=i(e))?t(u,n,f):void 0}})},function(t,e,n){var r=n(16),i=n(0),o=n(1);i(i.S,"Reflect",{getOwnPropertyDescriptor:function(t,e){return r.f(o(t),e)}})},function(t,e,n){var r=n(0),i=n(17),o=n(1);r(r.S,"Reflect",{getPrototypeOf:function(t){return i(o(t))}})},function(t,e,n){var r=n(0);r(r.S,"Reflect",{has:function(t,e){return e in t}})},function(t,e,n){var r=n(0),i=n(1),o=Object.isExtensible;r(r.S,"Reflect",{isExtensible:function(t){return i(t),!o||o(t)}})},function(t,e,n){var r=n(0);r(r.S,"Reflect",{ownKeys:n(138)})},function(t,e,n){var r=n(0),i=n(1),o=Object.preventExtensions;r(r.S,"Reflect",{preventExtensions:function(t){i(t);try{return o&&o(t),!0}catch(t){return!1}}})},function(t,e,n){var r=n(8),i=n(16),o=n(17),a=n(14),s=n(0),c=n(36),u=n(1),f=n(4);s(s.S,"Reflect",{set:function t(e,n,s){var l,d,p=arguments.length<4?e:arguments[3],v=i.f(u(e),n);if(!v){if(f(d=o(e)))return t(d,n,s,p);v=c(0)}if(a(v,"value")){if(!1===v.writable||!f(p))return!1;if(l=i.f(p,n)){if(l.get||l.set||!1===l.writable)return!1;l.value=s,r.f(p,n,l)}else r.f(p,n,c(0,s));return!0}return void 0!==v.set&&(v.set.call(p,s),!0)}})},function(t,e,n){var r=n(0),i=n(87);i&&r(r.S,"Reflect",{setPrototypeOf:function(t,e){i.check(t,e);try{return i.set(t,e),!0}catch(t){return!1}}})},function(t,e,n){"use strict";var r=n(0),i=n(57)(!0);r(r.P,"Array",{includes:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}}),n(31)("includes")},function(t,e,n){"use strict";var r=n(0),i=n(139),o=n(9),a=n(6),s=n(10),c=n(100);r(r.P,"Array",{flatMap:function(t){var e,n,r=o(this);return s(t),e=a(r.length),n=c(r,0),i(n,r,r,e,0,1,t,arguments[1]),n}}),n(31)("flatMap")},function(t,e,n){"use strict";var r=n(0),i=n(139),o=n(9),a=n(6),s=n(21),c=n(100);r(r.P,"Array",{flatten:function(){var t=arguments[0],e=o(this),n=a(e.length),r=c(e,0);return i(r,e,e,n,0,void 0===t?1:s(t)),r}}),n(31)("flatten")},function(t,e,n){"use strict";var r=n(0),i=n(60)(!0);r(r.P,"String",{at:function(t){return i(this,t)}})},function(t,e,n){"use strict";var r=n(0),i=n(140),o=n(65),a=/Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(o);r(r.P+r.F*a,"String",{padStart:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0,!0)}})},function(t,e,n){"use strict";var r=n(0),i=n(140),o=n(65),a=/Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(o);r(r.P+r.F*a,"String",{padEnd:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0,!1)}})},function(t,e,n){"use strict";n(49)("trimLeft",(function(t){return function(){return t(this,1)}}),"trimStart")},function(t,e,n){"use strict";n(49)("trimRight",(function(t){return function(){return t(this,2)}}),"trimEnd")},function(t,e,n){"use strict";var r=n(0),i=n(24),o=n(6),a=n(61),s=n(54),c=RegExp.prototype,u=function(t,e){this._r=t,this._s=e};n(94)(u,"RegExp String",(function(){var t=this._r.exec(this._s);return{value:t,done:null===t}})),r(r.P,"String",{matchAll:function(t){if(i(this),!a(t))throw TypeError(t+" is not a regexp!");var e=String(this),n="flags"in c?String(t.flags):s.call(t),r=new RegExp(t.source,~n.indexOf("g")?n:"g"+n);return r.lastIndex=o(t.lastIndex),new u(r,e)}})},function(t,e,n){n(83)("asyncIterator")},function(t,e,n){n(83)("observable")},function(t,e,n){var r=n(0),i=n(138),o=n(15),a=n(16),s=n(98);r(r.S,"Object",{getOwnPropertyDescriptors:function(t){for(var e,n,r=o(t),c=a.f,u=i(r),f={},l=0;u.length>l;)void 0!==(n=c(r,e=u[l++]))&&s(f,e,n);return f}})},function(t,e,n){var r=n(0),i=n(141)(!1);r(r.S,"Object",{values:function(t){return i(t)}})},function(t,e,n){var r=n(0),i=n(141)(!0);r(r.S,"Object",{entries:function(t){return i(t)}})},function(t,e,n){"use strict";var r=n(0),i=n(9),o=n(10),a=n(8);n(7)&&r(r.P+n(68),"Object",{__defineGetter__:function(t,e){a.f(i(this),t,{get:o(e),enumerable:!0,configurable:!0})}})},function(t,e,n){"use strict";var r=n(0),i=n(9),o=n(10),a=n(8);n(7)&&r(r.P+n(68),"Object",{__defineSetter__:function(t,e){a.f(i(this),t,{set:o(e),enumerable:!0,configurable:!0})}})},function(t,e,n){"use strict";var r=n(0),i=n(9),o=n(23),a=n(17),s=n(16).f;n(7)&&r(r.P+n(68),"Object",{__lookupGetter__:function(t){var e,n=i(this),r=o(t,!0);do{if(e=s(n,r))return e.get}while(n=a(n))}})},function(t,e,n){"use strict";var r=n(0),i=n(9),o=n(23),a=n(17),s=n(16).f;n(7)&&r(r.P+n(68),"Object",{__lookupSetter__:function(t){var e,n=i(this),r=o(t,!0);do{if(e=s(n,r))return e.set}while(n=a(n))}})},function(t,e,n){var r=n(0);r(r.P+r.R,"Map",{toJSON:n(142)("Map")})},function(t,e,n){var r=n(0);r(r.P+r.R,"Set",{toJSON:n(142)("Set")})},function(t,e,n){n(69)("Map")},function(t,e,n){n(69)("Set")},function(t,e,n){n(69)("WeakMap")},function(t,e,n){n(69)("WeakSet")},function(t,e,n){n(70)("Map")},function(t,e,n){n(70)("Set")},function(t,e,n){n(70)("WeakMap")},function(t,e,n){n(70)("WeakSet")},function(t,e,n){var r=n(0);r(r.G,{global:n(2)})},function(t,e,n){var r=n(0);r(r.S,"System",{global:n(2)})},function(t,e,n){var r=n(0),i=n(20);r(r.S,"Error",{isError:function(t){return"Error"===i(t)}})},function(t,e,n){var r=n(0);r(r.S,"Math",{clamp:function(t,e,n){return Math.min(n,Math.max(e,t))}})},function(t,e,n){var r=n(0);r(r.S,"Math",{DEG_PER_RAD:Math.PI/180})},function(t,e,n){var r=n(0),i=180/Math.PI;r(r.S,"Math",{degrees:function(t){return t*i}})},function(t,e,n){var r=n(0),i=n(144),o=n(123);r(r.S,"Math",{fscale:function(t,e,n,r,a){return o(i(t,e,n,r,a))}})},function(t,e,n){var r=n(0);r(r.S,"Math",{iaddh:function(t,e,n,r){var i=t>>>0,o=n>>>0;return(e>>>0)+(r>>>0)+((i&o|(i|o)&~(i+o>>>0))>>>31)|0}})},function(t,e,n){var r=n(0);r(r.S,"Math",{isubh:function(t,e,n,r){var i=t>>>0,o=n>>>0;return(e>>>0)-(r>>>0)-((~i&o|~(i^o)&i-o>>>0)>>>31)|0}})},function(t,e,n){var r=n(0);r(r.S,"Math",{imulh:function(t,e){var n=+t,r=+e,i=65535&n,o=65535&r,a=n>>16,s=r>>16,c=(a*o>>>0)+(i*o>>>16);return a*s+(c>>16)+((i*s>>>0)+(65535&c)>>16)}})},function(t,e,n){var r=n(0);r(r.S,"Math",{RAD_PER_DEG:180/Math.PI})},function(t,e,n){var r=n(0),i=Math.PI/180;r(r.S,"Math",{radians:function(t){return t*i}})},function(t,e,n){var r=n(0);r(r.S,"Math",{scale:n(144)})},function(t,e,n){var r=n(0);r(r.S,"Math",{umulh:function(t,e){var n=+t,r=+e,i=65535&n,o=65535&r,a=n>>>16,s=r>>>16,c=(a*o>>>0)+(i*o>>>16);return a*s+(c>>>16)+((i*s>>>0)+(65535&c)>>>16)}})},function(t,e,n){var r=n(0);r(r.S,"Math",{signbit:function(t){return(t=+t)!=t?t:0==t?1/t==1/0:t>0}})},function(t,e,n){"use strict";var r=n(0),i=n(18),o=n(2),a=n(55),s=n(131);r(r.P+r.R,"Promise",{finally:function(t){var e=a(this,i.Promise||o.Promise),n="function"==typeof t;return this.then(n?function(n){return s(e,t()).then((function(){return n}))}:t,n?function(n){return s(e,t()).then((function(){throw n}))}:t)}})},function(t,e,n){"use strict";var r=n(0),i=n(107),o=n(130);r(r.S,"Promise",{try:function(t){var e=i.f(this),n=o(t);return(n.e?e.reject:e.resolve)(n.v),e.promise}})},function(t,e,n){var r=n(28),i=n(1),o=r.key,a=r.set;r.exp({defineMetadata:function(t,e,n,r){a(t,e,i(n),o(r))}})},function(t,e,n){var r=n(28),i=n(1),o=r.key,a=r.map,s=r.store;r.exp({deleteMetadata:function(t,e){var n=arguments.length<3?void 0:o(arguments[2]),r=a(i(e),n,!1);if(void 0===r||!r.delete(t))return!1;if(r.size)return!0;var c=s.get(e);return c.delete(n),!!c.size||s.delete(e)}})},function(t,e,n){var r=n(28),i=n(1),o=n(17),a=r.has,s=r.get,c=r.key,u=function(t,e,n){if(a(t,e,n))return s(t,e,n);var r=o(e);return null!==r?u(t,r,n):void 0};r.exp({getMetadata:function(t,e){return u(t,i(e),arguments.length<3?void 0:c(arguments[2]))}})},function(t,e,n){var r=n(134),i=n(143),o=n(28),a=n(1),s=n(17),c=o.keys,u=o.key,f=function(t,e){var n=c(t,e),o=s(t);if(null===o)return n;var a=f(o,e);return a.length?n.length?i(new r(n.concat(a))):a:n};o.exp({getMetadataKeys:function(t){return f(a(t),arguments.length<2?void 0:u(arguments[1]))}})},function(t,e,n){var r=n(28),i=n(1),o=r.get,a=r.key;r.exp({getOwnMetadata:function(t,e){return o(t,i(e),arguments.length<3?void 0:a(arguments[2]))}})},function(t,e,n){var r=n(28),i=n(1),o=r.keys,a=r.key;r.exp({getOwnMetadataKeys:function(t){return o(i(t),arguments.length<2?void 0:a(arguments[1]))}})},function(t,e,n){var r=n(28),i=n(1),o=n(17),a=r.has,s=r.key,c=function(t,e,n){if(a(t,e,n))return!0;var r=o(e);return null!==r&&c(t,r,n)};r.exp({hasMetadata:function(t,e){return c(t,i(e),arguments.length<3?void 0:s(arguments[2]))}})},function(t,e,n){var r=n(28),i=n(1),o=r.has,a=r.key;r.exp({hasOwnMetadata:function(t,e){return o(t,i(e),arguments.length<3?void 0:a(arguments[2]))}})},function(t,e,n){var r=n(28),i=n(1),o=n(10),a=r.key,s=r.set;r.exp({metadata:function(t,e){return function(n,r){s(t,e,(void 0!==r?i:o)(n),a(r))}}})},function(t,e,n){var r=n(0),i=n(106)(),o=n(2).process,a="process"==n(20)(o);r(r.G,{asap:function(t){var e=a&&o.domain;i(e?e.bind(t):t)}})},function(t,e,n){"use strict";var r=n(0),i=n(2),o=n(18),a=n(106)(),s=n(5)("observable"),c=n(10),u=n(1),f=n(43),l=n(45),d=n(11),p=n(44),v=p.RETURN,h=function(t){return null==t?void 0:c(t)},m=function(t){var e=t._c;e&&(t._c=void 0,e())},g=function(t){return void 0===t._o},y=function(t){g(t)||(t._o=void 0,m(t))},b=function(t,e){u(t),this._c=void 0,this._o=t,t=new _(this);try{var n=e(t),r=n;null!=n&&("function"==typeof n.unsubscribe?n=function(){r.unsubscribe()}:c(n),this._c=n)}catch(e){return void t.error(e)}g(this)&&m(this)};b.prototype=l({},{unsubscribe:function(){y(this)}});var _=function(t){this._s=t};_.prototype=l({},{next:function(t){var e=this._s;if(!g(e)){var n=e._o;try{var r=h(n.next);if(r)return r.call(n,t)}catch(t){try{y(e)}finally{throw t}}}},error:function(t){var e=this._s;if(g(e))throw t;var n=e._o;e._o=void 0;try{var r=h(n.error);if(!r)throw t;t=r.call(n,t)}catch(t){try{m(e)}finally{throw t}}return m(e),t},complete:function(t){var e=this._s;if(!g(e)){var n=e._o;e._o=void 0;try{var r=h(n.complete);t=r?r.call(n,t):void 0}catch(t){try{m(e)}finally{throw t}}return m(e),t}}});var w=function(t){f(this,w,"Observable","_f")._f=c(t)};l(w.prototype,{subscribe:function(t){return new b(t,this._f)},forEach:function(t){var e=this;return new(o.Promise||i.Promise)((function(n,r){c(t);var i=e.subscribe({next:function(e){try{return t(e)}catch(t){r(t),i.unsubscribe()}},error:r,complete:n})}))}}),l(w,{from:function(t){var e="function"==typeof this?this:w,n=h(u(t)[s]);if(n){var r=u(n.call(t));return r.constructor===e?r:new e((function(t){return r.subscribe(t)}))}return new e((function(e){var n=!1;return a((function(){if(!n){try{if(p(t,!1,(function(t){if(e.next(t),n)return v}))===v)return}catch(t){if(n)throw t;return void e.error(t)}e.complete()}})),function(){n=!0}}))},of:function(){for(var t=0,e=arguments.length,n=new Array(e);t<e;)n[t]=arguments[t++];return new("function"==typeof this?this:w)((function(t){var e=!1;return a((function(){if(!e){for(var r=0;r<n.length;++r)if(t.next(n[r]),e)return;t.complete()}})),function(){e=!0}}))}}),d(w.prototype,s,(function(){return this})),r(r.G,{Observable:w}),n(42)("Observable")},function(t,e,n){var r=n(2),i=n(0),o=n(65),a=[].slice,s=/MSIE .\./.test(o),c=function(t){return function(e,n){var r=arguments.length>2,i=!!r&&a.call(arguments,2);return t(r?function(){("function"==typeof e?e:Function(e)).apply(this,i)}:e,n)}};i(i.G+i.B+i.F*s,{setTimeout:c(r.setTimeout),setInterval:c(r.setInterval)})},function(t,e,n){var r=n(0),i=n(105);r(r.G+r.B,{setImmediate:i.set,clearImmediate:i.clear})},function(t,e,n){for(var r=n(102),i=n(38),o=n(12),a=n(2),s=n(11),c=n(50),u=n(5),f=u("iterator"),l=u("toStringTag"),d=c.Array,p={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},v=i(p),h=0;h<v.length;h++){var m,g=v[h],y=p[g],b=a[g],_=b&&b.prototype;if(_&&(_[f]||s(_,f,d),_[l]||s(_,l,g),c[g]=d,y))for(m in r)_[m]||o(_,m,r[m],!0)}},function(t,e,n){(function(e){!function(e){"use strict";var n=Object.prototype,r=n.hasOwnProperty,i="function"==typeof Symbol?Symbol:{},o=i.iterator||"@@iterator",a=i.asyncIterator||"@@asyncIterator",s=i.toStringTag||"@@toStringTag",c="object"==typeof t,u=e.regeneratorRuntime;if(u)c&&(t.exports=u);else{(u=e.regeneratorRuntime=c?t.exports:{}).wrap=h;var f={},l={};l[o]=function(){return this};var d=Object.getPrototypeOf,p=d&&d(d(A([])));p&&p!==n&&r.call(p,o)&&(l=p);var v=b.prototype=g.prototype=Object.create(l);y.prototype=v.constructor=b,b.constructor=y,b[s]=y.displayName="GeneratorFunction",u.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===y||"GeneratorFunction"===(e.displayName||e.name))},u.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,b):(t.__proto__=b,s in t||(t[s]="GeneratorFunction")),t.prototype=Object.create(v),t},u.awrap=function(t){return{__await:t}},_(w.prototype),w.prototype[a]=function(){return this},u.AsyncIterator=w,u.async=function(t,e,n,r){var i=new w(h(t,e,n,r));return u.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},_(v),v[s]="Generator",v[o]=function(){return this},v.toString=function(){return"[object Generator]"},u.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},u.values=A,M.prototype={constructor:M,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(O),!t)for(var e in this)"t"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,r){return a.type="throw",a.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var i=this.tryEntries.length-1;i>=0;--i){var o=this.tryEntries[i],a=o.completion;if("root"===o.tryLoc)return n("end");if(o.tryLoc<=this.prev){var s=r.call(o,"catchLoc"),c=r.call(o,"finallyLoc");if(s&&c){if(this.prev<o.catchLoc)return n(o.catchLoc,!0);if(this.prev<o.finallyLoc)return n(o.finallyLoc)}else if(s){if(this.prev<o.catchLoc)return n(o.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return n(o.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var i=this.tryEntries[n];if(i.tryLoc<=this.prev&&r.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var o=i;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,f):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),f},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),O(n),f}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var i=r.arg;O(n)}return i}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:A(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),f}}}function h(t,e,n,r){var i=e&&e.prototype instanceof g?e:g,o=Object.create(i.prototype),a=new M(r||[]);return o._invoke=function(t,e,n){var r="suspendedStart";return function(i,o){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===i)throw o;return k()}for(n.method=i,n.arg=o;;){var a=n.delegate;if(a){var s=x(a,n);if(s){if(s===f)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var c=m(t,e,n);if("normal"===c.type){if(r=n.done?"completed":"suspendedYield",c.arg===f)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(r="completed",n.method="throw",n.arg=c.arg)}}}(t,n,a),o}function m(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}function g(){}function y(){}function b(){}function _(t){["next","throw","return"].forEach((function(e){t[e]=function(t){return this._invoke(e,t)}}))}function w(t){function n(e,i,o,a){var s=m(t[e],t,i);if("throw"!==s.type){var c=s.arg,u=c.value;return u&&"object"==typeof u&&r.call(u,"__await")?Promise.resolve(u.__await).then((function(t){n("next",t,o,a)}),(function(t){n("throw",t,o,a)})):Promise.resolve(u).then((function(t){c.value=t,o(c)}),a)}a(s.arg)}var i;"object"==typeof e.process&&e.process.domain&&(n=e.process.domain.bind(n)),this._invoke=function(t,e){function r(){return new Promise((function(r,i){n(t,e,r,i)}))}return i=i?i.then(r,r):r()}}function x(t,e){var n=t.iterator[e.method];if(void 0===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,x(t,e),"throw"===e.method))return f;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return f}var r=m(n,t.iterator,e.arg);if("throw"===r.type)return e.method="throw",e.arg=r.arg,e.delegate=null,f;var i=r.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,f):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,f)}function S(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function O(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function M(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(S,this),this.reset(!0)}function A(t){if(t){var e=t[o];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,i=function e(){for(;++n<t.length;)if(r.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return i.next=i}}return{next:k}}function k(){return{value:void 0,done:!0}}}("object"==typeof e?e:"object"==typeof window?window:"object"==typeof self?self:this)}).call(this,n(35))},function(t,e,n){n(348),t.exports=n(18).RegExp.escape},function(t,e,n){var r=n(0),i=n(349)(/[\\^$*+?.()|[\]{}]/g,"\\$&");r(r.S,"RegExp",{escape:function(t){return i(t)}})},function(t,e){t.exports=function(t,e){var n=e===Object(e)?function(t){return e[t]}:e;return function(e){return String(e).replace(t,n)}}},function(t,e,n){(function(t){var r=void 0!==t&&t||"undefined"!=typeof self&&self||window,i=Function.prototype.apply;function o(t,e){this._id=t,this._clearFn=e}e.setTimeout=function(){return new o(i.call(setTimeout,r,arguments),clearTimeout)},e.setInterval=function(){return new o(i.call(setInterval,r,arguments),clearInterval)},e.clearTimeout=e.clearInterval=function(t){t&&t.close()},o.prototype.unref=o.prototype.ref=function(){},o.prototype.close=function(){this._clearFn.call(r,this._id)},e.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e},e.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1},e._unrefActive=e.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout((function(){t._onTimeout&&t._onTimeout()}),e))},n(351),e.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==t&&t.setImmediate||this&&this.setImmediate,e.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==t&&t.clearImmediate||this&&this.clearImmediate}).call(this,n(35))},function(t,e,n){(function(t,e){!function(t,n){"use strict";if(!t.setImmediate){var r,i,o,a,s,c=1,u={},f=!1,l=t.document,d=Object.getPrototypeOf&&Object.getPrototypeOf(t);d=d&&d.setTimeout?d:t,"[object process]"==={}.toString.call(t.process)?r=function(t){e.nextTick((function(){v(t)}))}:!function(){if(t.postMessage&&!t.importScripts){var e=!0,n=t.onmessage;return t.onmessage=function(){e=!1},t.postMessage("","*"),t.onmessage=n,e}}()?t.MessageChannel?((o=new MessageChannel).port1.onmessage=function(t){v(t.data)},r=function(t){o.port2.postMessage(t)}):l&&"onreadystatechange"in l.createElement("script")?(i=l.documentElement,r=function(t){var e=l.createElement("script");e.onreadystatechange=function(){v(t),e.onreadystatechange=null,i.removeChild(e),e=null},i.appendChild(e)}):r=function(t){setTimeout(v,0,t)}:(a="setImmediate$"+Math.random()+"$",s=function(e){e.source===t&&"string"==typeof e.data&&0===e.data.indexOf(a)&&v(+e.data.slice(a.length))},t.addEventListener?t.addEventListener("message",s,!1):t.attachEvent("onmessage",s),r=function(e){t.postMessage(a+e,"*")}),d.setImmediate=function(t){"function"!=typeof t&&(t=new Function(""+t));for(var e=new Array(arguments.length-1),n=0;n<e.length;n++)e[n]=arguments[n+1];var i={callback:t,args:e};return u[c]=i,r(c),c++},d.clearImmediate=p}function p(t){delete u[t]}function v(t){if(f)setTimeout(v,0,t);else{var e=u[t];if(e){f=!0;try{!function(t){var e=t.callback,n=t.args;switch(n.length){case 0:e();break;case 1:e(n[0]);break;case 2:e(n[0],n[1]);break;case 3:e(n[0],n[1],n[2]);break;default:e.apply(void 0,n)}}(e)}finally{p(t),f=!1}}}}}("undefined"==typeof self?void 0===t?this:t:self)}).call(this,n(35),n(145))},function(t,e,n){"use strict";var r=n(71);n.n(r).a},function(t,e,n){(e=n(33)(!1)).push([t.i,"#wrapper[data-v-4b84efce]{position:absolute;top:0;bottom:0;left:0;right:0;z-index:9999;background-color:#f3f3f3;color:#202124;font-family:Roboto,sans-serif;padding:40px 20px;text-align:left;box-sizing:content-box;pointer-events:auto}[dir=ltr] .wrapper ol[data-v-4b84efce]{margin-left:0}[dir=ltr] .wrapper ol[data-v-4b84efce],[dir=rtl] .wrapper ol[data-v-4b84efce]{margin-right:0}[dir=rtl] .wrapper ol[data-v-4b84efce]{margin-left:0}[dir=ltr] .wrapper ol[data-v-4b84efce]{padding-left:40px}[dir=rtl] .wrapper ol[data-v-4b84efce]{padding-right:40px}.wrapper ol[data-v-4b84efce]{display:block;list-style-type:decimal;margin-top:1em;margin-bottom:1em;padding-left:40px}.close[data-v-4b84efce]{position:absolute;top:20px;right:20px;cursor:pointer;width:14px;border-radius:50%;padding:5px;transition:background-color .5s}#dots[data-v-4b84efce]{display:inline;height:10px}.title[data-v-4b84efce]{font-size:24px;font-weight:700;margin-top:40px}.description[data-v-4b84efce]{font-size:20px}li .description[data-v-4b84efce]{font-size:18px}#gdpr img[data-v-4b84efce]{height:75px}",""]),t.exports=e},function(t,e){t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var n=e.protocol+"//"+e.host,r=n+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(t,e){var i,o=e.trim().replace(/^"(.*)"$/,(function(t,e){return e})).replace(/^'(.*)'$/,(function(t,e){return e}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(o)?t:(i=0===o.indexOf("//")?o:0===o.indexOf("/")?n+o:r+o.replace(/^\.\//,""),"url("+JSON.stringify(i)+")")}))}},function(t,e,n){"use strict";var r=n(72);n.n(r).a},function(t,e,n){(e=n(33)(!1)).push([t.i,"#wrapper[data-v-28c57144]{position:absolute;top:0;bottom:0;left:0;right:0;z-index:9999;background-color:#f3f3f3;color:#202124;font-family:Roboto,sans-serif;padding:40px 20px;text-align:left;box-sizing:content-box;pointer-events:auto}[dir=ltr] #wrapper ol[data-v-28c57144]{margin-left:0}[dir=ltr] #wrapper ol[data-v-28c57144],[dir=rtl] #wrapper ol[data-v-28c57144]{margin-right:0}[dir=rtl] #wrapper ol[data-v-28c57144]{margin-left:0}[dir=ltr] #wrapper ol[data-v-28c57144]{padding-left:40px}[dir=rtl] #wrapper ol[data-v-28c57144]{padding-right:40px}#wrapper ol[data-v-28c57144]{display:block;list-style-type:decimal;margin-top:1em;margin-bottom:1em;padding-left:40px}.close[data-v-28c57144]{position:absolute;top:20px;right:20px;cursor:pointer;width:14px;border-radius:50%;padding:5px;transition:background-color .5s}#dots[data-v-28c57144]{display:inline;height:10px}.title[data-v-28c57144]{font-size:24px;font-weight:700;margin-top:40px}.description[data-v-28c57144]{font-size:20px}li .description[data-v-28c57144]{font-size:18px}#gdpr img[data-v-28c57144]{height:75px}",""]),t.exports=e},function(t,e,n){"use strict";var r=n(73);n.n(r).a},function(t,e,n){(e=n(33)(!1)).push([t.i,"#wrapper[data-v-21e0a0a5]{top:0;bottom:0;left:0;right:0;z-index:9999;background-color:#f3f3f3;color:#202124;font-family:Roboto,sans-serif;padding:40px 20px;text-align:left;box-sizing:content-box;pointer-events:auto}#wrapper[data-v-21e0a0a5],.close[data-v-21e0a0a5]{position:absolute}.close[data-v-21e0a0a5]{top:20px;right:20px;cursor:pointer;width:14px;border-radius:50%;padding:5px;transition:background-color .5s}.title[data-v-21e0a0a5]{font-size:24px;font-weight:700;margin-top:40px}.description[data-v-21e0a0a5]{font-size:20px}li .description[data-v-21e0a0a5]{font-size:18px}#gdpr img[data-v-21e0a0a5]{height:75px}",""]),t.exports=e},function(t,e,n){"use strict";var r=n(74);n.n(r).a},function(t,e,n){(e=n(33)(!1)).push([t.i,"#wrapper[data-v-18b271d3]{top:0;bottom:0;left:0;right:0;z-index:9999;background-color:#f3f3f3;color:#202124;font-family:Roboto,sans-serif;padding:40px 20px;text-align:left;box-sizing:content-box;pointer-events:auto}#wrapper[data-v-18b271d3],.close[data-v-18b271d3]{position:absolute}.close[data-v-18b271d3]{top:20px;right:20px;cursor:pointer;width:14px;border-radius:50%;padding:5px;transition:background-color .5s}.title[data-v-18b271d3]{font-size:24px;font-weight:700;margin-top:40px}.description[data-v-18b271d3]{font-size:20px}li .description[data-v-18b271d3]{font-size:18px}#gdpr img[data-v-18b271d3]{height:75px}",""]),t.exports=e},function(t,e,n){"use strict";var r=n(75);n.n(r).a},function(t,e,n){(e=n(33)(!1)).push([t.i,"#wrapper[data-v-3d980948]{top:0;bottom:0;left:0;right:0;z-index:9999;background-color:#f3f3f3;color:#202124;font-family:Roboto,sans-serif;padding:40px 20px;text-align:left;box-sizing:content-box;pointer-events:auto}#wrapper[data-v-3d980948],.close[data-v-3d980948]{position:absolute}.close[data-v-3d980948]{top:20px;right:20px;cursor:pointer;width:14px;border-radius:50%;padding:5px;transition:background-color .5s}.title[data-v-3d980948]{font-size:24px;font-weight:700;margin-top:40px}.description[data-v-3d980948]{font-size:20px}li .description[data-v-3d980948]{font-size:18px}#gdpr img[data-v-3d980948]{height:75px}",""]),t.exports=e},function(t,e,n){"use strict";var r=n(76);n.n(r).a},function(t,e,n){(e=n(33)(!1)).push([t.i,"#bckg[data-v-3d366dbe]{z-index:9999;background-color:rgba(0,0,0,.2);box-sizing:content-box}#bckg[data-v-3d366dbe],.wrapper[data-v-3d366dbe]{position:absolute;top:0;bottom:0;left:0;right:0}.wrapper[data-v-3d366dbe]{color:#202124;font-family:Roboto,sans-serif;padding:24px;width:453px;height:121px;background-color:#fff;border-radius:8px;border:1px solid #bbb;box-shadow:0 1px 3px 0 rgba(60,64,67,.302),0 4px 8px 3px rgba(60,64,67,.149);margin:auto;text-align:left;pointer-events:auto}.wrapper.big[data-v-3d366dbe]{width:1000px;max-width:calc(90% - 48px);height:312px;max-height:90%;overflow-y:auto;color:#000}[dir=ltr] .wrapper.big ol[data-v-3d366dbe]{margin-left:0}[dir=ltr] .wrapper.big ol[data-v-3d366dbe],[dir=rtl] .wrapper.big ol[data-v-3d366dbe]{margin-right:0}[dir=rtl] .wrapper.big ol[data-v-3d366dbe]{margin-left:0}[dir=ltr] .wrapper.big ol[data-v-3d366dbe]{padding-left:40px}[dir=rtl] .wrapper.big ol[data-v-3d366dbe]{padding-right:40px}.wrapper.big ol[data-v-3d366dbe]{display:block;list-style-type:decimal;margin-top:1em;margin-bottom:1em;padding-left:40px}.title[data-v-3d366dbe]{font-size:22px;font-weight:700;margin-top:20px}.description[data-v-3d366dbe]{font-size:16px;color:rgba(0,0,0,.541);text-align:justify;margin-bottom:0}li .description[data-v-3d366dbe]{font-size:18px}.close[data-v-3d366dbe]{position:absolute;top:20px;right:20px;width:14px;border-radius:50%;padding:5px;transition:background-color .5s}.close[data-v-3d366dbe],.link[data-v-3d366dbe]{cursor:pointer}.link[data-v-3d366dbe]{color:#00f}.close[data-v-3d366dbe]:hover{background-color:#d8d9d9}#gdpr img[data-v-3d366dbe]{height:75px}@media screen and (max-width:798px){.wrapper[data-v-3d366dbe]{width:250px;height:149px}.wrapper.big[data-v-3d366dbe]{height:500px}.title[data-v-3d366dbe]{font-size:18px}.description[data-v-3d366dbe]{font-size:16px}}",""]),t.exports=e},function(t,e,n){"use strict";var r=n(77);n.n(r).a},function(t,e,n){(e=n(33)(!1)).push([t.i,"#bckg[data-v-4305a3d7]{z-index:9999;background-color:rgba(0,0,0,.2);box-sizing:content-box}#bckg[data-v-4305a3d7],.wrapper[data-v-4305a3d7]{position:absolute;top:0;bottom:0;left:0;right:0}.wrapper[data-v-4305a3d7]{color:#202124;font-family:Roboto,sans-serif;padding:24px;width:453px;height:103px;background-color:#fff;border-radius:8px;border:1px solid #bbb;box-shadow:0 1px 3px 0 rgba(60,64,67,.302),0 4px 8px 3px rgba(60,64,67,.149);margin:auto;text-align:left;pointer-events:auto}.title[data-v-4305a3d7]{font-size:22px;font-weight:700;margin-top:20px}.description[data-v-4305a3d7]{font-size:16px;color:rgba(0,0,0,.541);text-align:justify;margin-bottom:0}li .description[data-v-4305a3d7]{font-size:18px}.close[data-v-4305a3d7]{position:absolute;top:20px;right:20px;cursor:pointer;width:14px;border-radius:50%;padding:5px;transition:background-color .5s}.close[data-v-4305a3d7]:hover{background-color:#d8d9d9}#gdpr img[data-v-4305a3d7]{height:75px}@media screen and (max-width:798px){.wrapper[data-v-4305a3d7]{width:250px;height:113px}.title[data-v-4305a3d7]{font-size:18px}.description[data-v-4305a3d7]{font-size:16px}}",""]),t.exports=e},function(t,e,n){"use strict";var r=n(78);n.n(r).a},function(t,e,n){(e=n(33)(!1)).push([t.i,".mphTollsContainer[data-v-98fae124]{box-sizing:content-box;position:absolute;top:0;left:0;width:100vw;height:100vh;pointer-events:none}.fade-enter-active[data-v-98fae124],.fade-leave-active[data-v-98fae124]{transition:opacity .2s}.fade-enter[data-v-98fae124],.fade-leave-to[data-v-98fae124]{opacity:0}",""]),t.exports=e},function(t,e,n){"use strict";n.r(e);n(148);var r=n(80),i=n(79),o=n.n(i),a={compatibilityAutoCheck:!1,compatibilityUI:!1,cameraPrivacyPopup:!1,allowCompatibilityClose:!1,customPrivacyAlert:null},s=n(56);r.a.use(s.a);var c=new s.a.Store({state:{iosGuide:!1,andGuide:!1,genGuide:!1,notsafariGuide:!1,cameraDisc:!1,cameraDeny:!1,httpGuide:!1},mutations:{http:function(t,e){t.httpGuide=e},ios:function(t,e){t.iosGuide=e},and:function(t,e){t.andGuide=e},notSafari:function(t,e){t.notsafariGuide=e},generic:function(t,e){t.genGuide=e},cameraDisc:function(t,e){t.cameraDisc=e},cameraDeny:function(t,e){t.cameraDeny=e}}}),u=o.a.getParser(window.navigator.userAgent),f={COMPATIBLE:"compatible",HTTP:"not_https",SF_IOS:"not_sf_ios",FB_IOS:"fb_ios",FB_AND:"fb_and",IG_IOS:"ig_ios",IG_AND:"ig_and",LK_IOS:"lk_ios",WC_AND:"wc_and",WC_IOS:"wc_ios",INCOMPATIBLE:"incompatbile"},l=[function(){return"http:"===document.location.protocol&&(!(t=document.location.hostname).startsWith("localhost")&&"::"!==t&&"::1"!==t&&!/^(::f{4}:)?127\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(t))&&f.HTTP;var t},function(){return!(!p()||"Safari"===u.getBrowserName())&&f.SF_IOS},function(){return!(!p()||!h())&&f.FB_IOS},function(){return!(!v()||!h())&&f.FB_AND},function(){return!(!p()||!m())&&f.IG_IOS},function(){return!(!v()||!m())&&f.IG_AND},function(){return!!(p()&&u.getUA().toLowerCase().indexOf("linkedinapp")>-1)&&f.LK_IOS},function(){return!(!p()||!g())&&f.WC_IOS},function(){return!(!v()||!g())&&f.WC_AND},function(){return!("mediaDevices"in navigator&&"getUserMedia"in navigator.mediaDevices)&&f.INCOMPATIBLE},function(){return f.COMPATIBLE}],d={check:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=l.find((function(t){return t()}))();if(a.compatibilityUI&&!t)switch(e){case f.HTTP:c.commit("http",!0);break;case f.LK_IOS:case f.FB_IOS:case f.WC_IOS:case f.IG_IOS:c.commit("ios",!0);break;case f.WC_AND:case f.IG_AND:case f.FB_AND:c.commit("and",!0);break;case f.SF_IOS:c.commit("notSafari",!0);break;case f.INCOMPATIBLE:c.commit("generic",!0)}return e},status:f};function p(){return"iOS"===u.getOSName()}function v(){return"Android"===u.getOSName()}function h(){var t=u.getUA().toLowerCase();return t.indexOf("fban")>-1||t.indexOf("fbav")>-1}function m(){return u.getUA().toLowerCase().indexOf("instagram")>-1}function g(){return u.getUA().toLowerCase().indexOf("micromessenger")>-1}var y=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"mphTollsContainer"},[t.httpGuide?n("HttpPopup",{on:{close:function(e){return t.$store.commit("http",!1)}}}):t._e(),t._v(" "),t.iosGuide?n("iOSPopup",{on:{close:function(e){return t.$store.commit("ios",!1)}}}):t._e(),t._v(" "),t.andGuide?n("AndPopup",{on:{close:function(e){return t.$store.commit("and",!1)}}}):t._e(),t._v(" "),t.genGuide?n("GeneralPopup",{on:{close:function(e){return t.$store.commit("generic",!1)}}}):t._e(),t._v(" "),t.notsafariGuide?n("Notsafaripopup",{on:{close:function(e){return t.$store.commit("notSafari",!1)}}}):t._e(),t._v(" "),n("transition",{attrs:{name:"fade"}},[t.cameraDisc?n("CameraPrivacyPopup",{on:{close:function(e){return t.cam.hide()}}}):t._e(),t._v(" "),t.cameraDeny?n("CameraDenied",{on:{close:function(e){return t.$store.commit("cameraDeny",!1)}}}):t._e()],1)],1)};y._withStripped=!0;var b=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"wrapper"}},[r("p",{staticClass:"title"},[t._v("To continue the interactive experience")]),t._v(" "),t._m(0),t._v(" "),t.allowClose?r("img",{staticClass:"close",attrs:{alt:"close",src:n(32)},on:{click:function(e){return t.$emit("close")}}}):t._e()])},_=[function(){var t=this.$createElement,e=this._self._c||t;return e("ol",[e("li",[e("p",{staticClass:"description"},[this._v("click on "),e("img",{attrs:{alt:"dots...",id:"dots",src:n(146)}}),this._v(" at the top right")])]),this._v(" "),e("li",[e("p",{staticClass:"description"},[this._v("click on "),e("strong",[this._v("Open with Safari")])])])])}];b._withStripped=!0;var w={data:function(){return{allowClose:a.allowCompatibilityClose}}};n(352);function x(t,e,n,r,i,o,a,s){var c,u="function"==typeof t?t.options:t;if(e&&(u.render=e,u.staticRenderFns=n,u._compiled=!0),r&&(u.functional=!0),o&&(u._scopeId="data-v-"+o),a?(c=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),i&&i.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(a)},u._ssrRegister=c):i&&(c=s?function(){i.call(this,this.$root.$options.shadowRoot)}:i),c)if(u.functional){u._injectStyles=c;var f=u.render;u.render=function(t,e){return c.call(e),f(t,e)}}else{var l=u.beforeCreate;u.beforeCreate=l?[].concat(l,c):[c]}return{exports:t,options:u}}var S=x(w,b,_,!1,null,"4b84efce",null);S.options.__file="app/ui/iospopup.vue";var O=S.exports,M=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"wrapper"}},[r("p",{staticClass:"title"},[t._v("To continue the interactive experience")]),t._v(" "),t._m(0),t._v(" "),t.allowClose?r("img",{staticClass:"close",attrs:{alt:"close",src:n(32)},on:{click:function(e){return t.$emit("close")}}}):t._e()])},A=[function(){var t=this.$createElement,e=this._self._c||t;return e("ol",[e("li",[e("p",{staticClass:"description"},[this._v("click on "),e("img",{attrs:{alt:"dots...",id:"dots",src:n(146)}}),this._v(" at the top right corner")])]),this._v(" "),e("li",[e("p",{staticClass:"description"},[this._v("Open with the browser")])])])}];M._withStripped=!0;var k={data:function(){return{allowClose:a.allowCompatibilityClose}}},C=(n(355),x(k,M,A,!1,null,"28c57144",null));C.options.__file="app/ui/andpopup.vue";var P=C.exports,E=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"wrapper"}},[r("p",{staticClass:"title"},[t._v("Camera access requires https")]),t._v(" "),r("p",{staticClass:"description"},[t._v("Please enable SSL in your web server configuration")]),t._v(" "),t.allowClose?r("img",{staticClass:"close",attrs:{alt:"close",src:n(32)},on:{click:function(e){return t.$emit("close")}}}):t._e()])};E._withStripped=!0;var T={data:function(){return{allowClose:a.allowCompatibilityClose}},methods:{}},F=(n(357),x(T,E,[],!1,null,"21e0a0a5",null));F.options.__file="app/ui/httppopup.vue";var $=F.exports,N=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"wrapper"}},[r("p",{staticClass:"title"},[t._v("Unsupported browser")]),t._v(" "),t._m(0),t._v(" "),t.allowClose?r("img",{staticClass:"close",attrs:{alt:"close",src:n(32)},on:{click:function(e){return t.$emit("close")}}}):t._e()])};N._withStripped=!0;var I={data:function(){return{allowClose:a.allowCompatibilityClose}},methods:{}},j=(n(359),x(I,N,[function(){var t=this.$createElement,e=this._self._c||t;return e("p",{staticClass:"description"},[this._v("Unfortunately your browser does not support the interactive experience."),e("br"),this._v("Please use a modern browser")])}],!1,null,"18b271d3",null));j.options.__file="app/ui/generalpopup.vue";var R=j.exports,L=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"wrapper"}},[r("p",{staticClass:"title"},[t._v("To continue the interactive experience")]),t._v(" "),t._m(0),t._v(" "),t.allowClose?r("img",{staticClass:"close",attrs:{alt:"close",src:n(32)},on:{click:function(e){return t.$emit("close")}}}):t._e()])};L._withStripped=!0;var D={data:function(){return{allowClose:a.allowCompatibilityClose}}},B=(n(361),x(D,L,[function(){var t=this.$createElement,e=this._self._c||t;return e("p",{staticClass:"description"},[this._v("Open this web page with "),e("strong",[this._v("Safari")])])}],!1,null,"3d980948",null));B.options.__file="app/ui/notsafaripopup.vue";var W=B.exports,G=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"bckg"}},[t.showBig?t._e():r("div",{staticClass:"wrapper"},[r("p",{staticClass:"title"},[t._v("Allow us to use your camera")]),t._v(" "),r("p",{staticClass:"description"},[t._v("\n            We need access to your camera. We will ask you to confirm this decision on each browser and computer you\n            use."),r("br"),t._v("\n            For more information, click "),r("a",{staticClass:"link",on:{click:function(e){t.showBig=!0}}},[t._v("here")])]),t._v(" "),r("img",{staticClass:"close",attrs:{src:n(32)},on:{click:function(e){return t.$emit("close")}}})]),t._v(" "),t.showBig?r("div",{staticClass:"wrapper big"},[t._m(0),t._v(" "),r("img",{staticClass:"close",attrs:{src:n(32)},on:{click:function(e){return t.$emit("close")}}})]):t._e()])};G._withStripped=!0;var U={data:function(){return{showBig:!1}}},z=(n(363),x(U,G,[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("p",[t._v("This application process for analyzing image frames from the camera is as\n            follows:")]),t._v(" "),n("ol",[n("li",[t._v("A frame is taken from the camera stream memory and placed into a data structure in the Random\n                    Access Memory (RAM) allocated by the browser. This kind of memory is volatile, that is, it does\n                    not remain after the vision.\n                ")]),t._v(" "),n("li",[t._v("A set of computer vision and AI algorithms will process and transform the frame data into\n                    numbers representing anonymous traits such as apparent motion, emotions, age and gender. The\n                    algorithms can evaluate other similar attributes like for example wearing glasses or have a\n                    beard.\n                ")]),t._v(" "),n("li",[t._v("This set of data is then aggregated and used for taking decisions about content, layout and\n                    effects for the benefit of the viewer as for aggregate data for marketing purpose.\n                ")]),t._v(" "),n("li",[t._v("Immediately, a new frame is taken from the camera overwriting the previous frame in the RAM\n                    memory allocated.\n                ")]),t._v(" "),n("li",[t._v("At the end of the entire process, no one frame remains in the RAM. Equally, no frame data\n                    remains when the app or browser tab are closed.\n                ")])]),t._v(" "),n("p",[t._v("The average permanence time that the camera frame is in the volatile memory (RAM), is less than 300\n                milliseconds.Any risks are those that derive from the persistent threats within the deviceâ€™s\n                technological chain (smartphone-camera) and are independent of the App software. This App does\n                everything possible to mitigate risk with minimal amount of processing of personal data, which is\n                near instantaneously deleted.")])])}],!1,null,"3d366dbe",null));z.options.__file="app/ui/camera_popup.vue";var V=z.exports,H=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"bckg"}},[t.showBig?t._e():r("div",{staticClass:"wrapper"},[r("p",{staticClass:"title"},[t._v("Your camera is blocked")]),t._v(" "),r("p",{staticClass:"description"},[t._v("\n            Open the browser settings and allow us to access the camera to continue the interactive experience\n        ")]),t._v(" "),r("img",{staticClass:"close",attrs:{src:n(32)},on:{click:function(e){return t.$emit("close")}}})])])};H._withStripped=!0;var q={data:function(){return{showBig:!1}}},K=(n(365),x(q,H,[],!1,null,"4305a3d7",null));K.options.__file="app/ui/camera_negated.vue";var J,X=K.exports,Y=n(81),Q=n.n(Y),Z="Safari"!==o.a.getParser(window.navigator.userAgent).getBrowserName()?100:1200,tt=function(t){return t},et={show:function(){return a.cameraPrivacyPopup?(nt(),rt().then((function(){Q.a.isWebsiteHasWebcamPermissions||(null==a.customPrivacyAlert?c.commit("cameraDisc",!0):a.customPrivacyAlert.show())})).catch((function(t){return console.log(t)}))):Promise.reject("Disclaimer not enabled")},hide:function(){nt(),null==a.customPrivacyAlert?c.commit("cameraDisc",!1):a.customPrivacyAlert.hide()},deny:function(){return nt(),c.commit("cameraDisc",!1),rt(0).then((function(){Q.a.hasWebcam&&(null==a.customPrivacyAlert?c.commit("cameraDeny",!0):a.customPrivacyAlert.cameraDenied())})).catch((function(t){return console.log(t)}))}};function nt(){tt("Stop Show Called"),clearTimeout(J)}function rt(t){return new Promise((function(e,n){tt=n,J=setTimeout((function(){return Q.a.load((function(){return e()}))}),null!=t?t:Z)}))}var it={components:{HttpPopup:$,Notsafaripopup:W,iOSPopup:O,AndPopup:P,GeneralPopup:R,CameraPrivacyPopup:V,CameraDenied:X},data:function(){return{cam:et}},computed:Object(s.b)(["httpGuide","iosGuide","andGuide","genGuide","notsafariGuide","cameraDisc","cameraDeny"])},ot=(n(367),x(it,y,[],!1,null,"98fae124",null));ot.options.__file="app/ui/home.vue";var at,st=ot.exports;n.d(e,"config",(function(){return ft})),n.d(e,"Compatibility",(function(){return d})),n.d(e,"CameraPrivacyPopup",(function(){return et})),null!=(at=document.querySelector('meta[name="mphtools-feature"]'))&&at.content.replace(/\s/g,"").split(",").forEach((function(t){a[t]=!0}));var ct,ut=((ct=document.createElement("div")).setAttribute("id","mphToolsWrapper"),document.body.appendChild(ct),ct);function ft(t){Object.keys(t).forEach((function(e){return a[e]=t[e]}))}new r.a({store:c,render:function(t){return t(st)}}).$mount(ut),a.compatibilityAutoCheck&&d.check()}]);


var CY=function(e){function t(t){for(var r,i,o=t[0],a=t[1],s=0,u=[];s<o.length;s++)i=o[s],Object.prototype.hasOwnProperty.call(n,i)&&n[i]&&u.push(n[i][0]),n[i]=0;for(r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r]);for(c&&c(t);u.length;)u.shift()()}var r={},n={2:0};function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.e=function(e){var t=[],r=n[e];if(0!==r)if(r)t.push(r[2]);else{var o=new Promise((function(t,i){r=n[e]=[t,i]}));t.push(r[2]=o);var a,s=document.createElement("script");s.charset="utf-8",s.timeout=120,i.nc&&s.setAttribute("nonce",i.nc),s.src=function(e){return i.p+""+e+".ai-sdk.js"}(e);var c=new Error;a=function(t){s.onerror=s.onload=null,clearTimeout(u);var r=n[e];if(0!==r){if(r){var i=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;c.message="Loading chunk "+e+" failed.\n("+i+": "+o+")",c.name="ChunkLoadError",c.type=i,c.request=o,r[1](c)}n[e]=void 0}};var u=setTimeout((function(){a({type:"timeout",target:s})}),12e4);s.onerror=s.onload=a,document.head.appendChild(s)}return Promise.all(t)},i.m=e,i.c=r,i.d=function(e,t,r){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(r,n,function(t){return e[t]}.bind(null,n));return r},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="https://ai-sdk.morphcast.com/v1.14/",i.oe=function(e){throw console.error(e),e};var o=window.webpackJsonpCY=window.webpackJsonpCY||[],a=o.push.bind(o);o.push=t,o=o.slice();for(var s=0;s<o.length;s++)t(o[s]);var c=a;return i(i.s=30)}([function(e,t){e.exports=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},function(e,t){function r(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}e.exports=function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}},function(e,t,r){e.exports=r(31)},function(e,t,r){"use strict";var n=r(19),i=r(37),o=Object.prototype.toString;function a(e){return"[object Array]"===o.call(e)}function s(e){return null!==e&&"object"==typeof e}function c(e){return"[object Function]"===o.call(e)}function u(e,t){if(null!=e)if("object"!=typeof e&&(e=[e]),a(e))for(var r=0,n=e.length;r<n;r++)t.call(null,e[r],r,e);else for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.call(null,e[i],i,e)}e.exports={isArray:a,isArrayBuffer:function(e){return"[object ArrayBuffer]"===o.call(e)},isBuffer:i,isFormData:function(e){return"undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:s,isUndefined:function(e){return void 0===e},isDate:function(e){return"[object Date]"===o.call(e)},isFile:function(e){return"[object File]"===o.call(e)},isBlob:function(e){return"[object Blob]"===o.call(e)},isFunction:c,isStream:function(e){return s(e)&&c(e.pipe)},isURLSearchParams:function(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:u,merge:function e(){var t={};function r(r,n){"object"==typeof t[n]&&"object"==typeof r?t[n]=e(t[n],r):t[n]=r}for(var n=0,i=arguments.length;n<i;n++)u(arguments[n],r);return t},extend:function(e,t,r){return u(t,(function(t,i){e[i]=r&&"function"==typeof t?n(t,r):t})),e},trim:function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}}},function(e,t,r){"use strict";r.d(t,"a",(function(){return n})),r.d(t,"d",(function(){return i})),r.d(t,"e",(function(){return o})),r.d(t,"b",(function(){return a})),r.d(t,"c",(function(){return s}));var n={toString:function(){return"Node busy: previous process call not yet finished."}},i={toString:function(){return"No data from process"}},o={toString:function(){return"Module not loaded"}},a={toString:function(){return"Module disabled"}},s={toString:function(){return"Frame ignored: a decreasing timestamp was detected."}}},function(e,t){function r(e,t,r,n,i,o,a){try{var s=e[o](a),c=s.value}catch(e){return void r(e)}s.done?t(c):Promise.resolve(c).then(n,i)}e.exports=function(e){return function(){var t=this,n=arguments;return new Promise((function(i,o){var a=e.apply(t,n);function s(e){r(a,i,o,s,c,"next",e)}function c(e){r(a,i,o,s,c,"throw",e)}s(void 0)}))}}},function(e,t,r){"use strict";var n={generateIdentifier:function(){return Math.random().toString(36).substr(2,10)}};n.localCName=n.generateIdentifier(),n.splitLines=function(e){return e.trim().split("\n").map((function(e){return e.trim()}))},n.splitSections=function(e){return e.split("\nm=").map((function(e,t){return(t>0?"m="+e:e).trim()+"\r\n"}))},n.getDescription=function(e){var t=n.splitSections(e);return t&&t[0]},n.getMediaSections=function(e){var t=n.splitSections(e);return t.shift(),t},n.matchPrefix=function(e,t){return n.splitLines(e).filter((function(e){return 0===e.indexOf(t)}))},n.parseCandidate=function(e){for(var t,r={foundation:(t=0===e.indexOf("a=candidate:")?e.substring(12).split(" "):e.substring(10).split(" "))[0],component:parseInt(t[1],10),protocol:t[2].toLowerCase(),priority:parseInt(t[3],10),ip:t[4],address:t[4],port:parseInt(t[5],10),type:t[7]},n=8;n<t.length;n+=2)switch(t[n]){case"raddr":r.relatedAddress=t[n+1];break;case"rport":r.relatedPort=parseInt(t[n+1],10);break;case"tcptype":r.tcpType=t[n+1];break;case"ufrag":r.ufrag=t[n+1],r.usernameFragment=t[n+1];break;default:r[t[n]]=t[n+1]}return r},n.writeCandidate=function(e){var t=[];t.push(e.foundation),t.push(e.component),t.push(e.protocol.toUpperCase()),t.push(e.priority),t.push(e.address||e.ip),t.push(e.port);var r=e.type;return t.push("typ"),t.push(r),"host"!==r&&e.relatedAddress&&e.relatedPort&&(t.push("raddr"),t.push(e.relatedAddress),t.push("rport"),t.push(e.relatedPort)),e.tcpType&&"tcp"===e.protocol.toLowerCase()&&(t.push("tcptype"),t.push(e.tcpType)),(e.usernameFragment||e.ufrag)&&(t.push("ufrag"),t.push(e.usernameFragment||e.ufrag)),"candidate:"+t.join(" ")},n.parseIceOptions=function(e){return e.substr(14).split(" ")},n.parseRtpMap=function(e){var t=e.substr(9).split(" "),r={payloadType:parseInt(t.shift(),10)};return t=t[0].split("/"),r.name=t[0],r.clockRate=parseInt(t[1],10),r.channels=3===t.length?parseInt(t[2],10):1,r.numChannels=r.channels,r},n.writeRtpMap=function(e){var t=e.payloadType;void 0!==e.preferredPayloadType&&(t=e.preferredPayloadType);var r=e.channels||e.numChannels||1;return"a=rtpmap:"+t+" "+e.name+"/"+e.clockRate+(1!==r?"/"+r:"")+"\r\n"},n.parseExtmap=function(e){var t=e.substr(9).split(" ");return{id:parseInt(t[0],10),direction:t[0].indexOf("/")>0?t[0].split("/")[1]:"sendrecv",uri:t[1]}},n.writeExtmap=function(e){return"a=extmap:"+(e.id||e.preferredId)+(e.direction&&"sendrecv"!==e.direction?"/"+e.direction:"")+" "+e.uri+"\r\n"},n.parseFmtp=function(e){for(var t,r={},n=e.substr(e.indexOf(" ")+1).split(";"),i=0;i<n.length;i++)r[(t=n[i].trim().split("="))[0].trim()]=t[1];return r},n.writeFmtp=function(e){var t="",r=e.payloadType;if(void 0!==e.preferredPayloadType&&(r=e.preferredPayloadType),e.parameters&&Object.keys(e.parameters).length){var n=[];Object.keys(e.parameters).forEach((function(t){e.parameters[t]?n.push(t+"="+e.parameters[t]):n.push(t)})),t+="a=fmtp:"+r+" "+n.join(";")+"\r\n"}return t},n.parseRtcpFb=function(e){var t=e.substr(e.indexOf(" ")+1).split(" ");return{type:t.shift(),parameter:t.join(" ")}},n.writeRtcpFb=function(e){var t="",r=e.payloadType;return void 0!==e.preferredPayloadType&&(r=e.preferredPayloadType),e.rtcpFeedback&&e.rtcpFeedback.length&&e.rtcpFeedback.forEach((function(e){t+="a=rtcp-fb:"+r+" "+e.type+(e.parameter&&e.parameter.length?" "+e.parameter:"")+"\r\n"})),t},n.parseSsrcMedia=function(e){var t=e.indexOf(" "),r={ssrc:parseInt(e.substr(7,t-7),10)},n=e.indexOf(":",t);return n>-1?(r.attribute=e.substr(t+1,n-t-1),r.value=e.substr(n+1)):r.attribute=e.substr(t+1),r},n.parseSsrcGroup=function(e){var t=e.substr(13).split(" ");return{semantics:t.shift(),ssrcs:t.map((function(e){return parseInt(e,10)}))}},n.getMid=function(e){var t=n.matchPrefix(e,"a=mid:")[0];if(t)return t.substr(6)},n.parseFingerprint=function(e){var t=e.substr(14).split(" ");return{algorithm:t[0].toLowerCase(),value:t[1]}},n.getDtlsParameters=function(e,t){return{role:"auto",fingerprints:n.matchPrefix(e+t,"a=fingerprint:").map(n.parseFingerprint)}},n.writeDtlsParameters=function(e,t){var r="a=setup:"+t+"\r\n";return e.fingerprints.forEach((function(e){r+="a=fingerprint:"+e.algorithm+" "+e.value+"\r\n"})),r},n.parseCryptoLine=function(e){var t=e.substr(9).split(" ");return{tag:parseInt(t[0],10),cryptoSuite:t[1],keyParams:t[2],sessionParams:t.slice(3)}},n.writeCryptoLine=function(e){return"a=crypto:"+e.tag+" "+e.cryptoSuite+" "+("object"==typeof e.keyParams?n.writeCryptoKeyParams(e.keyParams):e.keyParams)+(e.sessionParams?" "+e.sessionParams.join(" "):"")+"\r\n"},n.parseCryptoKeyParams=function(e){if(0!==e.indexOf("inline:"))return null;var t=e.substr(7).split("|");return{keyMethod:"inline",keySalt:t[0],lifeTime:t[1],mkiValue:t[2]?t[2].split(":")[0]:void 0,mkiLength:t[2]?t[2].split(":")[1]:void 0}},n.writeCryptoKeyParams=function(e){return e.keyMethod+":"+e.keySalt+(e.lifeTime?"|"+e.lifeTime:"")+(e.mkiValue&&e.mkiLength?"|"+e.mkiValue+":"+e.mkiLength:"")},n.getCryptoParameters=function(e,t){return n.matchPrefix(e+t,"a=crypto:").map(n.parseCryptoLine)},n.getIceParameters=function(e,t){var r=n.matchPrefix(e+t,"a=ice-ufrag:")[0],i=n.matchPrefix(e+t,"a=ice-pwd:")[0];return r&&i?{usernameFragment:r.substr(12),password:i.substr(10)}:null},n.writeIceParameters=function(e){return"a=ice-ufrag:"+e.usernameFragment+"\r\na=ice-pwd:"+e.password+"\r\n"},n.parseRtpParameters=function(e){for(var t={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},r=n.splitLines(e)[0].split(" "),i=3;i<r.length;i++){var o=r[i],a=n.matchPrefix(e,"a=rtpmap:"+o+" ")[0];if(a){var s=n.parseRtpMap(a),c=n.matchPrefix(e,"a=fmtp:"+o+" ");switch(s.parameters=c.length?n.parseFmtp(c[0]):{},s.rtcpFeedback=n.matchPrefix(e,"a=rtcp-fb:"+o+" ").map(n.parseRtcpFb),t.codecs.push(s),s.name.toUpperCase()){case"RED":case"ULPFEC":t.fecMechanisms.push(s.name.toUpperCase())}}}return n.matchPrefix(e,"a=extmap:").forEach((function(e){t.headerExtensions.push(n.parseExtmap(e))})),t},n.writeRtpDescription=function(e,t){var r="";r+="m="+e+" ",r+=t.codecs.length>0?"9":"0",r+=" UDP/TLS/RTP/SAVPF ",r+=t.codecs.map((function(e){return void 0!==e.preferredPayloadType?e.preferredPayloadType:e.payloadType})).join(" ")+"\r\n",r+="c=IN IP4 0.0.0.0\r\n",r+="a=rtcp:9 IN IP4 0.0.0.0\r\n",t.codecs.forEach((function(e){r+=n.writeRtpMap(e),r+=n.writeFmtp(e),r+=n.writeRtcpFb(e)}));var i=0;return t.codecs.forEach((function(e){e.maxptime>i&&(i=e.maxptime)})),i>0&&(r+="a=maxptime:"+i+"\r\n"),r+="a=rtcp-mux\r\n",t.headerExtensions&&t.headerExtensions.forEach((function(e){r+=n.writeExtmap(e)})),r},n.parseRtpEncodingParameters=function(e){var t,r=[],i=n.parseRtpParameters(e),o=-1!==i.fecMechanisms.indexOf("RED"),a=-1!==i.fecMechanisms.indexOf("ULPFEC"),s=n.matchPrefix(e,"a=ssrc:").map((function(e){return n.parseSsrcMedia(e)})).filter((function(e){return"cname"===e.attribute})),c=s.length>0&&s[0].ssrc,u=n.matchPrefix(e,"a=ssrc-group:FID").map((function(e){return e.substr(17).split(" ").map((function(e){return parseInt(e,10)}))}));u.length>0&&u[0].length>1&&u[0][0]===c&&(t=u[0][1]),i.codecs.forEach((function(e){if("RTX"===e.name.toUpperCase()&&e.parameters.apt){var n={ssrc:c,codecPayloadType:parseInt(e.parameters.apt,10)};c&&t&&(n.rtx={ssrc:t}),r.push(n),o&&((n=JSON.parse(JSON.stringify(n))).fec={ssrc:c,mechanism:a?"red+ulpfec":"red"},r.push(n))}})),0===r.length&&c&&r.push({ssrc:c});var d=n.matchPrefix(e,"b=");return d.length&&(d=0===d[0].indexOf("b=TIAS:")?parseInt(d[0].substr(7),10):0===d[0].indexOf("b=AS:")?1e3*parseInt(d[0].substr(5),10)*.95-16e3:void 0,r.forEach((function(e){e.maxBitrate=d}))),r},n.parseRtcpParameters=function(e){var t={},r=n.matchPrefix(e,"a=ssrc:").map((function(e){return n.parseSsrcMedia(e)})).filter((function(e){return"cname"===e.attribute}))[0];r&&(t.cname=r.value,t.ssrc=r.ssrc);var i=n.matchPrefix(e,"a=rtcp-rsize");t.reducedSize=i.length>0,t.compound=0===i.length;var o=n.matchPrefix(e,"a=rtcp-mux");return t.mux=o.length>0,t},n.parseMsid=function(e){var t,r=n.matchPrefix(e,"a=msid:");if(1===r.length)return{stream:(t=r[0].substr(7).split(" "))[0],track:t[1]};var i=n.matchPrefix(e,"a=ssrc:").map((function(e){return n.parseSsrcMedia(e)})).filter((function(e){return"msid"===e.attribute}));return i.length>0?{stream:(t=i[0].value.split(" "))[0],track:t[1]}:void 0},n.parseSctpDescription=function(e){var t,r=n.parseMLine(e),i=n.matchPrefix(e,"a=max-message-size:");i.length>0&&(t=parseInt(i[0].substr(19),10)),isNaN(t)&&(t=65536);var o=n.matchPrefix(e,"a=sctp-port:");if(o.length>0)return{port:parseInt(o[0].substr(12),10),protocol:r.fmt,maxMessageSize:t};if(n.matchPrefix(e,"a=sctpmap:").length>0){var a=n.matchPrefix(e,"a=sctpmap:")[0].substr(10).split(" ");return{port:parseInt(a[0],10),protocol:a[1],maxMessageSize:t}}},n.writeSctpDescription=function(e,t){var r=[];return r="DTLS/SCTP"!==e.protocol?["m="+e.kind+" 9 "+e.protocol+" "+t.protocol+"\r\n","c=IN IP4 0.0.0.0\r\n","a=sctp-port:"+t.port+"\r\n"]:["m="+e.kind+" 9 "+e.protocol+" "+t.port+"\r\n","c=IN IP4 0.0.0.0\r\n","a=sctpmap:"+t.port+" "+t.protocol+" 65535\r\n"],void 0!==t.maxMessageSize&&r.push("a=max-message-size:"+t.maxMessageSize+"\r\n"),r.join("")},n.generateSessionId=function(){return Math.random().toString().substr(2,21)},n.writeSessionBoilerplate=function(e,t,r){var i=void 0!==t?t:2;return"v=0\r\no="+(r||"thisisadapterortc")+" "+(e||n.generateSessionId())+" "+i+" IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n"},n.writeMediaSection=function(e,t,r,i){var o=n.writeRtpDescription(e.kind,t);if(o+=n.writeIceParameters(e.iceGatherer.getLocalParameters()),o+=n.writeDtlsParameters(e.dtlsTransport.getLocalParameters(),"offer"===r?"actpass":"active"),o+="a=mid:"+e.mid+"\r\n",e.direction?o+="a="+e.direction+"\r\n":e.rtpSender&&e.rtpReceiver?o+="a=sendrecv\r\n":e.rtpSender?o+="a=sendonly\r\n":e.rtpReceiver?o+="a=recvonly\r\n":o+="a=inactive\r\n",e.rtpSender){var a="msid:"+i.id+" "+e.rtpSender.track.id+"\r\n";o+="a="+a,o+="a=ssrc:"+e.sendEncodingParameters[0].ssrc+" "+a,e.sendEncodingParameters[0].rtx&&(o+="a=ssrc:"+e.sendEncodingParameters[0].rtx.ssrc+" "+a,o+="a=ssrc-group:FID "+e.sendEncodingParameters[0].ssrc+" "+e.sendEncodingParameters[0].rtx.ssrc+"\r\n")}return o+="a=ssrc:"+e.sendEncodingParameters[0].ssrc+" cname:"+n.localCName+"\r\n",e.rtpSender&&e.sendEncodingParameters[0].rtx&&(o+="a=ssrc:"+e.sendEncodingParameters[0].rtx.ssrc+" cname:"+n.localCName+"\r\n"),o},n.getDirection=function(e,t){for(var r=n.splitLines(e),i=0;i<r.length;i++)switch(r[i]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return r[i].substr(2)}return t?n.getDirection(t):"sendrecv"},n.getKind=function(e){return n.splitLines(e)[0].split(" ")[0].substr(2)},n.isRejected=function(e){return"0"===e.split(" ",2)[1]},n.parseMLine=function(e){var t=n.splitLines(e)[0].substr(2).split(" ");return{kind:t[0],port:parseInt(t[1],10),protocol:t[2],fmt:t.slice(3).join(" ")}},n.parseOLine=function(e){var t=n.matchPrefix(e,"o=")[0].substr(2).split(" ");return{username:t[0],sessionId:t[1],sessionVersion:parseInt(t[2],10),netType:t[3],addressType:t[4],address:t[5]}},n.isValidSDP=function(e){if("string"!=typeof e||0===e.length)return!1;for(var t=n.splitLines(e),r=0;r<t.length;r++)if(t[r].length<2||"="!==t[r].charAt(1))return!1;return!0},e.exports=n},function(e,t){function r(t){return e.exports=r=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},r(t)}e.exports=r},function(e,t,r){var n=r(32),i=r(33),o=r(34),a=r(35);e.exports=function(e){return n(e)||i(e)||o(e)||a()}},function(e,t,r){"use strict";(function(t){var n=r(3),i=r(39),o={"Content-Type":"application/x-www-form-urlencoded"};function a(e,t){!n.isUndefined(e)&&n.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var s,c={adapter:(("undefined"!=typeof XMLHttpRequest||void 0!==t)&&(s=r(20)),s),transformRequest:[function(e,t){return i(t,"Content-Type"),n.isFormData(e)||n.isArrayBuffer(e)||n.isBuffer(e)||n.isStream(e)||n.isFile(e)||n.isBlob(e)?e:n.isArrayBufferView(e)?e.buffer:n.isURLSearchParams(e)?(a(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):n.isObject(e)?(a(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}};c.headers={common:{Accept:"application/json, text/plain, */*"}},n.forEach(["delete","get","head"],(function(e){c.headers[e]={}})),n.forEach(["post","put","patch"],(function(e){c.headers[e]=n.merge(o)})),e.exports=c}).call(this,r(16))},function(e,t){function r(t){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?e.exports=r=function(e){return typeof e}:e.exports=r=function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r(t)}e.exports=r},function(e,t){function r(t,n){return e.exports=r=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},r(t,n)}e.exports=r},function(e,t){e.exports=function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}},function(e,t,r){e.exports=r(36)},function(e,t,r){var n=r(11);e.exports=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&n(e,t)}},function(e,t,r){var n=r(10),i=r(12);e.exports=function(e,t){return!t||"object"!==n(t)&&"function"!=typeof t?i(e):t}},function(e,t){var r,n,i=e.exports={};function o(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function s(e){if(r===setTimeout)return setTimeout(e,0);if((r===o||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0);try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:o}catch(e){r=o}try{n="function"==typeof clearTimeout?clearTimeout:a}catch(e){n=a}}();var c,u=[],d=!1,p=-1;function f(){d&&c&&(d=!1,c.length?u=c.concat(u):p=-1,u.length&&l())}function l(){if(!d){var e=s(f);d=!0;for(var t=u.length;t;){for(c=u,u=[];++p<t;)c&&c[p].run();p=-1,t=u.length}c=null,d=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===a||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function h(e,t){this.fun=e,this.array=t}function m(){}i.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];u.push(new h(e,t)),1!==u.length||d||s(l)},h.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=m,i.addListener=m,i.once=m,i.off=m,i.removeListener=m,i.removeAllListeners=m,i.emit=m,i.prependListener=m,i.prependOnceListener=m,i.listeners=function(e){return[]},i.binding=function(e){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(e){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},function(e,t){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}},function(e,t){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}},function(e,t,r){"use strict";e.exports=function(e,t){return function(){for(var r=new Array(arguments.length),n=0;n<r.length;n++)r[n]=arguments[n];return e.apply(t,r)}}},function(e,t,r){"use strict";var n=r(3),i=r(40),o=r(42),a=r(43),s=r(44),c=r(21);e.exports=function(e){return new Promise((function(t,u){var d=e.data,p=e.headers;n.isFormData(d)&&delete p["Content-Type"];var f=new XMLHttpRequest;if(e.auth){var l=e.auth.username||"",h=e.auth.password||"";p.Authorization="Basic "+btoa(l+":"+h)}if(f.open(e.method.toUpperCase(),o(e.url,e.params,e.paramsSerializer),!0),f.timeout=e.timeout,f.onreadystatechange=function(){if(f&&4===f.readyState&&(0!==f.status||f.responseURL&&0===f.responseURL.indexOf("file:"))){var r="getAllResponseHeaders"in f?a(f.getAllResponseHeaders()):null,n={data:e.responseType&&"text"!==e.responseType?f.response:f.responseText,status:f.status,statusText:f.statusText,headers:r,config:e,request:f};i(t,u,n),f=null}},f.onerror=function(){u(c("Network Error",e,null,f)),f=null},f.ontimeout=function(){u(c("timeout of "+e.timeout+"ms exceeded",e,"ECONNABORTED",f)),f=null},n.isStandardBrowserEnv()){var m=r(45),v=(e.withCredentials||s(e.url))&&e.xsrfCookieName?m.read(e.xsrfCookieName):void 0;v&&(p[e.xsrfHeaderName]=v)}if("setRequestHeader"in f&&n.forEach(p,(function(e,t){void 0===d&&"content-type"===t.toLowerCase()?delete p[t]:f.setRequestHeader(t,e)})),e.withCredentials&&(f.withCredentials=!0),e.responseType)try{f.responseType=e.responseType}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&f.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&f.upload&&f.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then((function(e){f&&(f.abort(),u(e),f=null)})),void 0===d&&(d=null),f.send(d)}))}},function(e,t,r){"use strict";var n=r(41);e.exports=function(e,t,r,i,o){var a=new Error(e);return n(a,t,r,i,o)}},function(e,t,r){"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},function(e,t,r){"use strict";function n(e){this.message=e}n.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},n.prototype.__CANCEL__=!0,e.exports=n},function(e,t,r){"use strict";r.d(t,"a",(function(){return s}));var n=r(0),i=r.n(n),o=r(1),a=r.n(o),s=(r(55),function(){function e(t){i()(this,e),this._eventPrefix=t}return a()(e,[{key:"dispatch",value:function(e,t){window.dispatchEvent(this._createEvent(e,t))}},{key:"_createEvent",value:function(e,t){return new CustomEvent(this._eventPrefix+e,{detail:t,bubbles:!1,cancelable:!1})}}]),e}())},function(e,t,r){"use strict";r.d(t,"a",(function(){return s}));var n=r(0),i=r.n(n),o=r(1),a=r.n(o),s=function(){function e(t){i()(this,e),this._maxSize=t}return a()(e,[{key:"resizedDimensions",value:function(e){var t,r,n=e.width,i=e.height;return n>=i?r=(t=Math.min(this._maxSize,n))/n*i:t=(r=Math.min(this._maxSize,i))/i*n,{width:t,height:r}}}]),e}()},function(e,t,r){var n;!function(i){"use strict";function o(e,t){var r=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(r>>16)<<16|65535&r}function a(e,t,r,n,i,a){return o((s=o(o(t,e),o(n,a)))<<(c=i)|s>>>32-c,r);var s,c}function s(e,t,r,n,i,o,s){return a(t&r|~t&n,e,t,i,o,s)}function c(e,t,r,n,i,o,s){return a(t&n|r&~n,e,t,i,o,s)}function u(e,t,r,n,i,o,s){return a(t^r^n,e,t,i,o,s)}function d(e,t,r,n,i,o,s){return a(r^(t|~n),e,t,i,o,s)}function p(e,t){var r,n,i,a,p;e[t>>5]|=128<<t%32,e[14+(t+64>>>9<<4)]=t;var f=1732584193,l=-271733879,h=-1732584194,m=271733878;for(r=0;r<e.length;r+=16)n=f,i=l,a=h,p=m,f=s(f,l,h,m,e[r],7,-680876936),m=s(m,f,l,h,e[r+1],12,-389564586),h=s(h,m,f,l,e[r+2],17,606105819),l=s(l,h,m,f,e[r+3],22,-1044525330),f=s(f,l,h,m,e[r+4],7,-176418897),m=s(m,f,l,h,e[r+5],12,1200080426),h=s(h,m,f,l,e[r+6],17,-1473231341),l=s(l,h,m,f,e[r+7],22,-45705983),f=s(f,l,h,m,e[r+8],7,1770035416),m=s(m,f,l,h,e[r+9],12,-1958414417),h=s(h,m,f,l,e[r+10],17,-42063),l=s(l,h,m,f,e[r+11],22,-1990404162),f=s(f,l,h,m,e[r+12],7,1804603682),m=s(m,f,l,h,e[r+13],12,-40341101),h=s(h,m,f,l,e[r+14],17,-1502002290),f=c(f,l=s(l,h,m,f,e[r+15],22,1236535329),h,m,e[r+1],5,-165796510),m=c(m,f,l,h,e[r+6],9,-1069501632),h=c(h,m,f,l,e[r+11],14,643717713),l=c(l,h,m,f,e[r],20,-373897302),f=c(f,l,h,m,e[r+5],5,-701558691),m=c(m,f,l,h,e[r+10],9,38016083),h=c(h,m,f,l,e[r+15],14,-660478335),l=c(l,h,m,f,e[r+4],20,-405537848),f=c(f,l,h,m,e[r+9],5,568446438),m=c(m,f,l,h,e[r+14],9,-1019803690),h=c(h,m,f,l,e[r+3],14,-187363961),l=c(l,h,m,f,e[r+8],20,1163531501),f=c(f,l,h,m,e[r+13],5,-1444681467),m=c(m,f,l,h,e[r+2],9,-51403784),h=c(h,m,f,l,e[r+7],14,1735328473),f=u(f,l=c(l,h,m,f,e[r+12],20,-1926607734),h,m,e[r+5],4,-378558),m=u(m,f,l,h,e[r+8],11,-2022574463),h=u(h,m,f,l,e[r+11],16,1839030562),l=u(l,h,m,f,e[r+14],23,-35309556),f=u(f,l,h,m,e[r+1],4,-1530992060),m=u(m,f,l,h,e[r+4],11,1272893353),h=u(h,m,f,l,e[r+7],16,-155497632),l=u(l,h,m,f,e[r+10],23,-1094730640),f=u(f,l,h,m,e[r+13],4,681279174),m=u(m,f,l,h,e[r],11,-358537222),h=u(h,m,f,l,e[r+3],16,-722521979),l=u(l,h,m,f,e[r+6],23,76029189),f=u(f,l,h,m,e[r+9],4,-640364487),m=u(m,f,l,h,e[r+12],11,-421815835),h=u(h,m,f,l,e[r+15],16,530742520),f=d(f,l=u(l,h,m,f,e[r+2],23,-995338651),h,m,e[r],6,-198630844),m=d(m,f,l,h,e[r+7],10,1126891415),h=d(h,m,f,l,e[r+14],15,-1416354905),l=d(l,h,m,f,e[r+5],21,-57434055),f=d(f,l,h,m,e[r+12],6,1700485571),m=d(m,f,l,h,e[r+3],10,-1894986606),h=d(h,m,f,l,e[r+10],15,-1051523),l=d(l,h,m,f,e[r+1],21,-2054922799),f=d(f,l,h,m,e[r+8],6,1873313359),m=d(m,f,l,h,e[r+15],10,-30611744),h=d(h,m,f,l,e[r+6],15,-1560198380),l=d(l,h,m,f,e[r+13],21,1309151649),f=d(f,l,h,m,e[r+4],6,-145523070),m=d(m,f,l,h,e[r+11],10,-1120210379),h=d(h,m,f,l,e[r+2],15,718787259),l=d(l,h,m,f,e[r+9],21,-343485551),f=o(f,n),l=o(l,i),h=o(h,a),m=o(m,p);return[f,l,h,m]}function f(e){var t,r="",n=32*e.length;for(t=0;t<n;t+=8)r+=String.fromCharCode(e[t>>5]>>>t%32&255);return r}function l(e){var t,r=[];for(r[(e.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;var n=8*e.length;for(t=0;t<n;t+=8)r[t>>5]|=(255&e.charCodeAt(t/8))<<t%32;return r}function h(e){var t,r,n="";for(r=0;r<e.length;r+=1)t=e.charCodeAt(r),n+="0123456789abcdef".charAt(t>>>4&15)+"0123456789abcdef".charAt(15&t);return n}function m(e){return unescape(encodeURIComponent(e))}function v(e){return function(e){return f(p(l(e),8*e.length))}(m(e))}function y(e,t){return function(e,t){var r,n,i=l(e),o=[],a=[];for(o[15]=a[15]=void 0,i.length>16&&(i=p(i,8*e.length)),r=0;r<16;r+=1)o[r]=909522486^i[r],a[r]=1549556828^i[r];return n=p(o.concat(l(t)),512+8*t.length),f(p(a.concat(n),640))}(m(e),m(t))}function g(e,t,r){return t?r?y(t,e):h(y(t,e)):r?v(e):h(v(e))}void 0===(n=function(){return g}.call(t,r,t,e))||(e.exports=n)}()},function(e,t,r){(function(n,i){var o;
/**
 * [js-sha3]{@link https://github.com/emn178/js-sha3}
 *
 * @version 0.8.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2018
 * @license MIT
 */!function(){"use strict";var a="input is invalid type",s="object"==typeof window,c=s?window:{};c.JS_SHA3_NO_WINDOW&&(s=!1);var u=!s&&"object"==typeof self;!c.JS_SHA3_NO_NODE_JS&&"object"==typeof n&&n.versions&&n.versions.node?c=i:u&&(c=self);var d=!c.JS_SHA3_NO_COMMON_JS&&"object"==typeof e&&e.exports,p=r(54),f=!c.JS_SHA3_NO_ARRAY_BUFFER&&"undefined"!=typeof ArrayBuffer,l="0123456789abcdef".split(""),h=[4,1024,262144,67108864],m=[0,8,16,24],v=[1,0,32898,0,32906,2147483648,2147516416,2147483648,32907,0,2147483649,0,2147516545,2147483648,32777,2147483648,138,0,136,0,2147516425,0,2147483658,0,2147516555,0,139,2147483648,32905,2147483648,32771,2147483648,32770,2147483648,128,2147483648,32778,0,2147483658,2147483648,2147516545,2147483648,32896,2147483648,2147483649,0,2147516424,2147483648],y=[224,256,384,512],g=[128,256],C=["hex","buffer","arrayBuffer","array","digest"],_={128:168,256:136};!c.JS_SHA3_NO_NODE_JS&&Array.isArray||(Array.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e)}),!f||!c.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW&&ArrayBuffer.isView||(ArrayBuffer.isView=function(e){return"object"==typeof e&&e.buffer&&e.buffer.constructor===ArrayBuffer});for(var S=function(e,t,r){return function(n){return new j(e,t,e).update(n)[r]()}},T=function(e,t,r){return function(n,i){return new j(e,t,i).update(n)[r]()}},E=function(e,t,r){return function(t,n,i,o){return k["cshake"+e].update(t,n,i,o)[r]()}},w=function(e,t,r){return function(t,n,i,o){return k["kmac"+e].update(t,n,i,o)[r]()}},R=function(e,t,r,n){for(var i=0;i<C.length;++i){var o=C[i];e[o]=t(r,n,o)}return e},b=function(e,t){var r=S(e,t,"hex");return r.create=function(){return new j(e,t,e)},r.update=function(e){return r.create().update(e)},R(r,S,e,t)},P=[{name:"keccak",padding:[1,256,65536,16777216],bits:y,createMethod:b},{name:"sha3",padding:[6,1536,393216,100663296],bits:y,createMethod:b},{name:"shake",padding:[31,7936,2031616,520093696],bits:g,createMethod:function(e,t){var r=T(e,t,"hex");return r.create=function(r){return new j(e,t,r)},r.update=function(e,t){return r.create(t).update(e)},R(r,T,e,t)}},{name:"cshake",padding:h,bits:g,createMethod:function(e,t){var r=_[e],n=E(e,0,"hex");return n.create=function(n,i,o){return i||o?new j(e,t,n).bytepad([i,o],r):k["shake"+e].create(n)},n.update=function(e,t,r,i){return n.create(t,r,i).update(e)},R(n,E,e,t)}},{name:"kmac",padding:h,bits:g,createMethod:function(e,t){var r=_[e],n=w(e,0,"hex");return n.create=function(n,i,o){return new N(e,t,i).bytepad(["KMAC",o],r).bytepad([n],r)},n.update=function(e,t,r,i){return n.create(e,r,i).update(t)},R(n,w,e,t)}}],k={},x=[],A=0;A<P.length;++A)for(var O=P[A],D=O.bits,M=0;M<D.length;++M){var I=O.name+"_"+D[M];if(x.push(I),k[I]=O.createMethod(D[M],O.padding),"sha3"!==O.name){var L=O.name+D[M];x.push(L),k[L]=k[I]}}function j(e,t,r){this.blocks=[],this.s=[],this.padding=t,this.outputBits=r,this.reset=!0,this.finalized=!1,this.block=0,this.start=0,this.blockCount=1600-(e<<1)>>5,this.byteCount=this.blockCount<<2,this.outputBlocks=r>>5,this.extraBytes=(31&r)>>3;for(var n=0;n<50;++n)this.s[n]=0}function N(e,t,r){j.call(this,e,t,r)}j.prototype.update=function(e){if(this.finalized)throw new Error("finalize already called");var t,r=typeof e;if("string"!==r){if("object"!==r)throw new Error(a);if(null===e)throw new Error(a);if(f&&e.constructor===ArrayBuffer)e=new Uint8Array(e);else if(!(Array.isArray(e)||f&&ArrayBuffer.isView(e)))throw new Error(a);t=!0}for(var n,i,o=this.blocks,s=this.byteCount,c=e.length,u=this.blockCount,d=0,p=this.s;d<c;){if(this.reset)for(this.reset=!1,o[0]=this.block,n=1;n<u+1;++n)o[n]=0;if(t)for(n=this.start;d<c&&n<s;++d)o[n>>2]|=e[d]<<m[3&n++];else for(n=this.start;d<c&&n<s;++d)(i=e.charCodeAt(d))<128?o[n>>2]|=i<<m[3&n++]:i<2048?(o[n>>2]|=(192|i>>6)<<m[3&n++],o[n>>2]|=(128|63&i)<<m[3&n++]):i<55296||i>=57344?(o[n>>2]|=(224|i>>12)<<m[3&n++],o[n>>2]|=(128|i>>6&63)<<m[3&n++],o[n>>2]|=(128|63&i)<<m[3&n++]):(i=65536+((1023&i)<<10|1023&e.charCodeAt(++d)),o[n>>2]|=(240|i>>18)<<m[3&n++],o[n>>2]|=(128|i>>12&63)<<m[3&n++],o[n>>2]|=(128|i>>6&63)<<m[3&n++],o[n>>2]|=(128|63&i)<<m[3&n++]);if(this.lastByteIndex=n,n>=s){for(this.start=n-s,this.block=o[u],n=0;n<u;++n)p[n]^=o[n];F(p),this.reset=!0}else this.start=n}return this},j.prototype.encode=function(e,t){var r=255&e,n=1,i=[r];for(r=255&(e>>=8);r>0;)i.unshift(r),r=255&(e>>=8),++n;return t?i.push(n):i.unshift(n),this.update(i),i.length},j.prototype.encodeString=function(e){var t,r=typeof e;if("string"!==r){if("object"!==r)throw new Error(a);if(null===e)throw new Error(a);if(f&&e.constructor===ArrayBuffer)e=new Uint8Array(e);else if(!(Array.isArray(e)||f&&ArrayBuffer.isView(e)))throw new Error(a);t=!0}var n=0,i=e.length;if(t)n=i;else for(var o=0;o<e.length;++o){var s=e.charCodeAt(o);s<128?n+=1:s<2048?n+=2:s<55296||s>=57344?n+=3:(s=65536+((1023&s)<<10|1023&e.charCodeAt(++o)),n+=4)}return n+=this.encode(8*n),this.update(e),n},j.prototype.bytepad=function(e,t){for(var r=this.encode(t),n=0;n<e.length;++n)r+=this.encodeString(e[n]);var i=t-r%t,o=[];return o.length=i,this.update(o),this},j.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var e=this.blocks,t=this.lastByteIndex,r=this.blockCount,n=this.s;if(e[t>>2]|=this.padding[3&t],this.lastByteIndex===this.byteCount)for(e[0]=e[r],t=1;t<r+1;++t)e[t]=0;for(e[r-1]|=2147483648,t=0;t<r;++t)n[t]^=e[t];F(n)}},j.prototype.toString=j.prototype.hex=function(){this.finalize();for(var e,t=this.blockCount,r=this.s,n=this.outputBlocks,i=this.extraBytes,o=0,a=0,s="";a<n;){for(o=0;o<t&&a<n;++o,++a)e=r[o],s+=l[e>>4&15]+l[15&e]+l[e>>12&15]+l[e>>8&15]+l[e>>20&15]+l[e>>16&15]+l[e>>28&15]+l[e>>24&15];a%t==0&&(F(r),o=0)}return i&&(e=r[o],s+=l[e>>4&15]+l[15&e],i>1&&(s+=l[e>>12&15]+l[e>>8&15]),i>2&&(s+=l[e>>20&15]+l[e>>16&15])),s},j.prototype.arrayBuffer=function(){this.finalize();var e,t=this.blockCount,r=this.s,n=this.outputBlocks,i=this.extraBytes,o=0,a=0,s=this.outputBits>>3;e=i?new ArrayBuffer(n+1<<2):new ArrayBuffer(s);for(var c=new Uint32Array(e);a<n;){for(o=0;o<t&&a<n;++o,++a)c[a]=r[o];a%t==0&&F(r)}return i&&(c[o]=r[o],e=e.slice(0,s)),e},j.prototype.buffer=j.prototype.arrayBuffer,j.prototype.digest=j.prototype.array=function(){this.finalize();for(var e,t,r=this.blockCount,n=this.s,i=this.outputBlocks,o=this.extraBytes,a=0,s=0,c=[];s<i;){for(a=0;a<r&&s<i;++a,++s)e=s<<2,t=n[a],c[e]=255&t,c[e+1]=t>>8&255,c[e+2]=t>>16&255,c[e+3]=t>>24&255;s%r==0&&F(n)}return o&&(e=s<<2,t=n[a],c[e]=255&t,o>1&&(c[e+1]=t>>8&255),o>2&&(c[e+2]=t>>16&255)),c},N.prototype=new j,N.prototype.finalize=function(){return this.encode(this.outputBits,!0),j.prototype.finalize.call(this)};var F=function(e){var t,r,n,i,o,a,s,c,u,d,p,f,l,h,m,y,g,C,_,S,T,E,w,R,b,P,k,x,A,O,D,M,I,L,j,N,F,U,G,B,H,z,V,J,Y,K,q,W,$,X,Q,Z,ee,te,re,ne,ie,oe,ae,se,ce,ue,de;for(n=0;n<48;n+=2)i=e[0]^e[10]^e[20]^e[30]^e[40],o=e[1]^e[11]^e[21]^e[31]^e[41],a=e[2]^e[12]^e[22]^e[32]^e[42],s=e[3]^e[13]^e[23]^e[33]^e[43],c=e[4]^e[14]^e[24]^e[34]^e[44],u=e[5]^e[15]^e[25]^e[35]^e[45],d=e[6]^e[16]^e[26]^e[36]^e[46],p=e[7]^e[17]^e[27]^e[37]^e[47],t=(f=e[8]^e[18]^e[28]^e[38]^e[48])^(a<<1|s>>>31),r=(l=e[9]^e[19]^e[29]^e[39]^e[49])^(s<<1|a>>>31),e[0]^=t,e[1]^=r,e[10]^=t,e[11]^=r,e[20]^=t,e[21]^=r,e[30]^=t,e[31]^=r,e[40]^=t,e[41]^=r,t=i^(c<<1|u>>>31),r=o^(u<<1|c>>>31),e[2]^=t,e[3]^=r,e[12]^=t,e[13]^=r,e[22]^=t,e[23]^=r,e[32]^=t,e[33]^=r,e[42]^=t,e[43]^=r,t=a^(d<<1|p>>>31),r=s^(p<<1|d>>>31),e[4]^=t,e[5]^=r,e[14]^=t,e[15]^=r,e[24]^=t,e[25]^=r,e[34]^=t,e[35]^=r,e[44]^=t,e[45]^=r,t=c^(f<<1|l>>>31),r=u^(l<<1|f>>>31),e[6]^=t,e[7]^=r,e[16]^=t,e[17]^=r,e[26]^=t,e[27]^=r,e[36]^=t,e[37]^=r,e[46]^=t,e[47]^=r,t=d^(i<<1|o>>>31),r=p^(o<<1|i>>>31),e[8]^=t,e[9]^=r,e[18]^=t,e[19]^=r,e[28]^=t,e[29]^=r,e[38]^=t,e[39]^=r,e[48]^=t,e[49]^=r,h=e[0],m=e[1],K=e[11]<<4|e[10]>>>28,q=e[10]<<4|e[11]>>>28,x=e[20]<<3|e[21]>>>29,A=e[21]<<3|e[20]>>>29,se=e[31]<<9|e[30]>>>23,ce=e[30]<<9|e[31]>>>23,z=e[40]<<18|e[41]>>>14,V=e[41]<<18|e[40]>>>14,L=e[2]<<1|e[3]>>>31,j=e[3]<<1|e[2]>>>31,y=e[13]<<12|e[12]>>>20,g=e[12]<<12|e[13]>>>20,W=e[22]<<10|e[23]>>>22,$=e[23]<<10|e[22]>>>22,O=e[33]<<13|e[32]>>>19,D=e[32]<<13|e[33]>>>19,ue=e[42]<<2|e[43]>>>30,de=e[43]<<2|e[42]>>>30,te=e[5]<<30|e[4]>>>2,re=e[4]<<30|e[5]>>>2,N=e[14]<<6|e[15]>>>26,F=e[15]<<6|e[14]>>>26,C=e[25]<<11|e[24]>>>21,_=e[24]<<11|e[25]>>>21,X=e[34]<<15|e[35]>>>17,Q=e[35]<<15|e[34]>>>17,M=e[45]<<29|e[44]>>>3,I=e[44]<<29|e[45]>>>3,R=e[6]<<28|e[7]>>>4,b=e[7]<<28|e[6]>>>4,ne=e[17]<<23|e[16]>>>9,ie=e[16]<<23|e[17]>>>9,U=e[26]<<25|e[27]>>>7,G=e[27]<<25|e[26]>>>7,S=e[36]<<21|e[37]>>>11,T=e[37]<<21|e[36]>>>11,Z=e[47]<<24|e[46]>>>8,ee=e[46]<<24|e[47]>>>8,J=e[8]<<27|e[9]>>>5,Y=e[9]<<27|e[8]>>>5,P=e[18]<<20|e[19]>>>12,k=e[19]<<20|e[18]>>>12,oe=e[29]<<7|e[28]>>>25,ae=e[28]<<7|e[29]>>>25,B=e[38]<<8|e[39]>>>24,H=e[39]<<8|e[38]>>>24,E=e[48]<<14|e[49]>>>18,w=e[49]<<14|e[48]>>>18,e[0]=h^~y&C,e[1]=m^~g&_,e[10]=R^~P&x,e[11]=b^~k&A,e[20]=L^~N&U,e[21]=j^~F&G,e[30]=J^~K&W,e[31]=Y^~q&$,e[40]=te^~ne&oe,e[41]=re^~ie&ae,e[2]=y^~C&S,e[3]=g^~_&T,e[12]=P^~x&O,e[13]=k^~A&D,e[22]=N^~U&B,e[23]=F^~G&H,e[32]=K^~W&X,e[33]=q^~$&Q,e[42]=ne^~oe&se,e[43]=ie^~ae&ce,e[4]=C^~S&E,e[5]=_^~T&w,e[14]=x^~O&M,e[15]=A^~D&I,e[24]=U^~B&z,e[25]=G^~H&V,e[34]=W^~X&Z,e[35]=$^~Q&ee,e[44]=oe^~se&ue,e[45]=ae^~ce&de,e[6]=S^~E&h,e[7]=T^~w&m,e[16]=O^~M&R,e[17]=D^~I&b,e[26]=B^~z&L,e[27]=H^~V&j,e[36]=X^~Z&J,e[37]=Q^~ee&Y,e[46]=se^~ue&te,e[47]=ce^~de&re,e[8]=E^~h&y,e[9]=w^~m&g,e[18]=M^~R&P,e[19]=I^~b&k,e[28]=z^~L&N,e[29]=V^~j&F,e[38]=Z^~J&K,e[39]=ee^~Y&q,e[48]=ue^~te&ne,e[49]=de^~re&ie,e[0]^=v[n],e[1]^=v[n+1]};if(d)e.exports=k;else{for(A=0;A<x.length;++A)c[x[A]]=k[x[A]];p&&(void 0===(o=function(){return k}.call(t,r,t,e))||(e.exports=o))}}()}).call(this,r(16),r(53))},function(e,t,r){var n=r(7),i=r(11),o=r(56),a=r(57);function s(t){var r="function"==typeof Map?new Map:void 0;return e.exports=s=function(e){if(null===e||!o(e))return e;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==r){if(r.has(e))return r.get(e);r.set(e,t)}function t(){return a(e,arguments,n(this).constructor)}return t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),i(t,e)},s(t)}e.exports=s},function(e,t,r){"use strict";var n=r(6);function i(e,t,r,i,o){var a=n.writeRtpDescription(e.kind,t);if(a+=n.writeIceParameters(e.iceGatherer.getLocalParameters()),a+=n.writeDtlsParameters(e.dtlsTransport.getLocalParameters(),"offer"===r?"actpass":o||"active"),a+="a=mid:"+e.mid+"\r\n",e.rtpSender&&e.rtpReceiver?a+="a=sendrecv\r\n":e.rtpSender?a+="a=sendonly\r\n":e.rtpReceiver?a+="a=recvonly\r\n":a+="a=inactive\r\n",e.rtpSender){var s=e.rtpSender._initialTrackId||e.rtpSender.track.id;e.rtpSender._initialTrackId=s;var c="msid:"+(i?i.id:"-")+" "+s+"\r\n";a+="a="+c,a+="a=ssrc:"+e.sendEncodingParameters[0].ssrc+" "+c,e.sendEncodingParameters[0].rtx&&(a+="a=ssrc:"+e.sendEncodingParameters[0].rtx.ssrc+" "+c,a+="a=ssrc-group:FID "+e.sendEncodingParameters[0].ssrc+" "+e.sendEncodingParameters[0].rtx.ssrc+"\r\n")}return a+="a=ssrc:"+e.sendEncodingParameters[0].ssrc+" cname:"+n.localCName+"\r\n",e.rtpSender&&e.sendEncodingParameters[0].rtx&&(a+="a=ssrc:"+e.sendEncodingParameters[0].rtx.ssrc+" cname:"+n.localCName+"\r\n"),a}function o(e,t){var r={codecs:[],headerExtensions:[],fecMechanisms:[]},n=function(e,t){e=parseInt(e,10);for(var r=0;r<t.length;r++)if(t[r].payloadType===e||t[r].preferredPayloadType===e)return t[r]},i=function(e,t,r,i){var o=n(e.parameters.apt,r),a=n(t.parameters.apt,i);return o&&a&&o.name.toLowerCase()===a.name.toLowerCase()};return e.codecs.forEach((function(n){for(var o=0;o<t.codecs.length;o++){var a=t.codecs[o];if(n.name.toLowerCase()===a.name.toLowerCase()&&n.clockRate===a.clockRate){if("rtx"===n.name.toLowerCase()&&n.parameters&&a.parameters.apt&&!i(n,a,e.codecs,t.codecs))continue;(a=JSON.parse(JSON.stringify(a))).numChannels=Math.min(n.numChannels,a.numChannels),r.codecs.push(a),a.rtcpFeedback=a.rtcpFeedback.filter((function(e){for(var t=0;t<n.rtcpFeedback.length;t++)if(n.rtcpFeedback[t].type===e.type&&n.rtcpFeedback[t].parameter===e.parameter)return!0;return!1}));break}}})),e.headerExtensions.forEach((function(e){for(var n=0;n<t.headerExtensions.length;n++){var i=t.headerExtensions[n];if(e.uri===i.uri){r.headerExtensions.push(i);break}}})),r}function a(e,t,r){return-1!=={offer:{setLocalDescription:["stable","have-local-offer"],setRemoteDescription:["stable","have-remote-offer"]},answer:{setLocalDescription:["have-remote-offer","have-local-pranswer"],setRemoteDescription:["have-local-offer","have-remote-pranswer"]}}[t][e].indexOf(r)}function s(e,t){var r=e.getRemoteCandidates().find((function(e){return t.foundation===e.foundation&&t.ip===e.ip&&t.port===e.port&&t.priority===e.priority&&t.protocol===e.protocol&&t.type===e.type}));return r||e.addRemoteCandidate(t),!r}function c(e,t){var r=new Error(t);return r.name=e,r.code={NotSupportedError:9,InvalidStateError:11,InvalidAccessError:15,TypeError:void 0,OperationError:void 0}[e],r}e.exports=function(e,t){function r(t,r){r.addTrack(t),r.dispatchEvent(new e.MediaStreamTrackEvent("addtrack",{track:t}))}function u(t,r,n,i){var o=new Event("track");o.track=r,o.receiver=n,o.transceiver={receiver:n},o.streams=i,e.setTimeout((function(){t._dispatchEvent("track",o)}))}var d=function(r){var i=this,o=document.createDocumentFragment();if(["addEventListener","removeEventListener","dispatchEvent"].forEach((function(e){i[e]=o[e].bind(o)})),this.canTrickleIceCandidates=null,this.needNegotiation=!1,this.localStreams=[],this.remoteStreams=[],this._localDescription=null,this._remoteDescription=null,this.signalingState="stable",this.iceConnectionState="new",this.connectionState="new",this.iceGatheringState="new",r=JSON.parse(JSON.stringify(r||{})),this.usingBundle="max-bundle"===r.bundlePolicy,"negotiate"===r.rtcpMuxPolicy)throw c("NotSupportedError","rtcpMuxPolicy 'negotiate' is not supported");switch(r.rtcpMuxPolicy||(r.rtcpMuxPolicy="require"),r.iceTransportPolicy){case"all":case"relay":break;default:r.iceTransportPolicy="all"}switch(r.bundlePolicy){case"balanced":case"max-compat":case"max-bundle":break;default:r.bundlePolicy="balanced"}if(r.iceServers=function(e,t){var r=!1;return(e=JSON.parse(JSON.stringify(e))).filter((function(e){if(e&&(e.urls||e.url)){var n=e.urls||e.url;e.url&&!e.urls&&console.warn("RTCIceServer.url is deprecated! Use urls instead.");var i="string"==typeof n;return i&&(n=[n]),n=n.filter((function(e){return 0===e.indexOf("turn:")&&-1!==e.indexOf("transport=udp")&&-1===e.indexOf("turn:[")&&!r?(r=!0,!0):0===e.indexOf("stun:")&&t>=14393&&-1===e.indexOf("?transport=udp")})),delete e.url,e.urls=i?n[0]:n,!!n.length}}))}(r.iceServers||[],t),this._iceGatherers=[],r.iceCandidatePoolSize)for(var a=r.iceCandidatePoolSize;a>0;a--)this._iceGatherers.push(new e.RTCIceGatherer({iceServers:r.iceServers,gatherPolicy:r.iceTransportPolicy}));else r.iceCandidatePoolSize=0;this._config=r,this.transceivers=[],this._sdpSessionId=n.generateSessionId(),this._sdpSessionVersion=0,this._dtlsRole=void 0,this._isClosed=!1};Object.defineProperty(d.prototype,"localDescription",{configurable:!0,get:function(){return this._localDescription}}),Object.defineProperty(d.prototype,"remoteDescription",{configurable:!0,get:function(){return this._remoteDescription}}),d.prototype.onicecandidate=null,d.prototype.onaddstream=null,d.prototype.ontrack=null,d.prototype.onremovestream=null,d.prototype.onsignalingstatechange=null,d.prototype.oniceconnectionstatechange=null,d.prototype.onconnectionstatechange=null,d.prototype.onicegatheringstatechange=null,d.prototype.onnegotiationneeded=null,d.prototype.ondatachannel=null,d.prototype._dispatchEvent=function(e,t){this._isClosed||(this.dispatchEvent(t),"function"==typeof this["on"+e]&&this["on"+e](t))},d.prototype._emitGatheringStateChange=function(){var e=new Event("icegatheringstatechange");this._dispatchEvent("icegatheringstatechange",e)},d.prototype.getConfiguration=function(){return this._config},d.prototype.getLocalStreams=function(){return this.localStreams},d.prototype.getRemoteStreams=function(){return this.remoteStreams},d.prototype._createTransceiver=function(e,t){var r=this.transceivers.length>0,n={track:null,iceGatherer:null,iceTransport:null,dtlsTransport:null,localCapabilities:null,remoteCapabilities:null,rtpSender:null,rtpReceiver:null,kind:e,mid:null,sendEncodingParameters:null,recvEncodingParameters:null,stream:null,associatedRemoteMediaStreams:[],wantReceive:!0};if(this.usingBundle&&r)n.iceTransport=this.transceivers[0].iceTransport,n.dtlsTransport=this.transceivers[0].dtlsTransport;else{var i=this._createIceAndDtlsTransports();n.iceTransport=i.iceTransport,n.dtlsTransport=i.dtlsTransport}return t||this.transceivers.push(n),n},d.prototype.addTrack=function(t,r){if(this._isClosed)throw c("InvalidStateError","Attempted to call addTrack on a closed peerconnection.");var n;if(this.transceivers.find((function(e){return e.track===t})))throw c("InvalidAccessError","Track already exists.");for(var i=0;i<this.transceivers.length;i++)this.transceivers[i].track||this.transceivers[i].kind!==t.kind||(n=this.transceivers[i]);return n||(n=this._createTransceiver(t.kind)),this._maybeFireNegotiationNeeded(),-1===this.localStreams.indexOf(r)&&this.localStreams.push(r),n.track=t,n.stream=r,n.rtpSender=new e.RTCRtpSender(t,n.dtlsTransport),n.rtpSender},d.prototype.addStream=function(e){var r=this;if(t>=15025)e.getTracks().forEach((function(t){r.addTrack(t,e)}));else{var n=e.clone();e.getTracks().forEach((function(e,t){var r=n.getTracks()[t];e.addEventListener("enabled",(function(e){r.enabled=e.enabled}))})),n.getTracks().forEach((function(e){r.addTrack(e,n)}))}},d.prototype.removeTrack=function(t){if(this._isClosed)throw c("InvalidStateError","Attempted to call removeTrack on a closed peerconnection.");if(!(t instanceof e.RTCRtpSender))throw new TypeError("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.");var r=this.transceivers.find((function(e){return e.rtpSender===t}));if(!r)throw c("InvalidAccessError","Sender was not created by this connection.");var n=r.stream;r.rtpSender.stop(),r.rtpSender=null,r.track=null,r.stream=null,-1===this.transceivers.map((function(e){return e.stream})).indexOf(n)&&this.localStreams.indexOf(n)>-1&&this.localStreams.splice(this.localStreams.indexOf(n),1),this._maybeFireNegotiationNeeded()},d.prototype.removeStream=function(e){var t=this;e.getTracks().forEach((function(e){var r=t.getSenders().find((function(t){return t.track===e}));r&&t.removeTrack(r)}))},d.prototype.getSenders=function(){return this.transceivers.filter((function(e){return!!e.rtpSender})).map((function(e){return e.rtpSender}))},d.prototype.getReceivers=function(){return this.transceivers.filter((function(e){return!!e.rtpReceiver})).map((function(e){return e.rtpReceiver}))},d.prototype._createIceGatherer=function(t,r){var n=this;if(r&&t>0)return this.transceivers[0].iceGatherer;if(this._iceGatherers.length)return this._iceGatherers.shift();var i=new e.RTCIceGatherer({iceServers:this._config.iceServers,gatherPolicy:this._config.iceTransportPolicy});return Object.defineProperty(i,"state",{value:"new",writable:!0}),this.transceivers[t].bufferedCandidateEvents=[],this.transceivers[t].bufferCandidates=function(e){var r=!e.candidate||0===Object.keys(e.candidate).length;i.state=r?"completed":"gathering",null!==n.transceivers[t].bufferedCandidateEvents&&n.transceivers[t].bufferedCandidateEvents.push(e)},i.addEventListener("localcandidate",this.transceivers[t].bufferCandidates),i},d.prototype._gather=function(t,r){var i=this,o=this.transceivers[r].iceGatherer;if(!o.onlocalcandidate){var a=this.transceivers[r].bufferedCandidateEvents;this.transceivers[r].bufferedCandidateEvents=null,o.removeEventListener("localcandidate",this.transceivers[r].bufferCandidates),o.onlocalcandidate=function(e){if(!(i.usingBundle&&r>0)){var a=new Event("icecandidate");a.candidate={sdpMid:t,sdpMLineIndex:r};var s=e.candidate,c=!s||0===Object.keys(s).length;if(c)"new"!==o.state&&"gathering"!==o.state||(o.state="completed");else{"new"===o.state&&(o.state="gathering"),s.component=1,s.ufrag=o.getLocalParameters().usernameFragment;var u=n.writeCandidate(s);a.candidate=Object.assign(a.candidate,n.parseCandidate(u)),a.candidate.candidate=u,a.candidate.toJSON=function(){return{candidate:a.candidate.candidate,sdpMid:a.candidate.sdpMid,sdpMLineIndex:a.candidate.sdpMLineIndex,usernameFragment:a.candidate.usernameFragment}}}var d=n.getMediaSections(i._localDescription.sdp);d[a.candidate.sdpMLineIndex]+=c?"a=end-of-candidates\r\n":"a="+a.candidate.candidate+"\r\n",i._localDescription.sdp=n.getDescription(i._localDescription.sdp)+d.join("");var p=i.transceivers.every((function(e){return e.iceGatherer&&"completed"===e.iceGatherer.state}));"gathering"!==i.iceGatheringState&&(i.iceGatheringState="gathering",i._emitGatheringStateChange()),c||i._dispatchEvent("icecandidate",a),p&&(i._dispatchEvent("icecandidate",new Event("icecandidate")),i.iceGatheringState="complete",i._emitGatheringStateChange())}},e.setTimeout((function(){a.forEach((function(e){o.onlocalcandidate(e)}))}),0)}},d.prototype._createIceAndDtlsTransports=function(){var t=this,r=new e.RTCIceTransport(null);r.onicestatechange=function(){t._updateIceConnectionState(),t._updateConnectionState()};var n=new e.RTCDtlsTransport(r);return n.ondtlsstatechange=function(){t._updateConnectionState()},n.onerror=function(){Object.defineProperty(n,"state",{value:"failed",writable:!0}),t._updateConnectionState()},{iceTransport:r,dtlsTransport:n}},d.prototype._disposeIceAndDtlsTransports=function(e){var t=this.transceivers[e].iceGatherer;t&&(delete t.onlocalcandidate,delete this.transceivers[e].iceGatherer);var r=this.transceivers[e].iceTransport;r&&(delete r.onicestatechange,delete this.transceivers[e].iceTransport);var n=this.transceivers[e].dtlsTransport;n&&(delete n.ondtlsstatechange,delete n.onerror,delete this.transceivers[e].dtlsTransport)},d.prototype._transceive=function(e,r,i){var a=o(e.localCapabilities,e.remoteCapabilities);r&&e.rtpSender&&(a.encodings=e.sendEncodingParameters,a.rtcp={cname:n.localCName,compound:e.rtcpParameters.compound},e.recvEncodingParameters.length&&(a.rtcp.ssrc=e.recvEncodingParameters[0].ssrc),e.rtpSender.send(a)),i&&e.rtpReceiver&&a.codecs.length>0&&("video"===e.kind&&e.recvEncodingParameters&&t<15019&&e.recvEncodingParameters.forEach((function(e){delete e.rtx})),e.recvEncodingParameters.length?a.encodings=e.recvEncodingParameters:a.encodings=[{}],a.rtcp={compound:e.rtcpParameters.compound},e.rtcpParameters.cname&&(a.rtcp.cname=e.rtcpParameters.cname),e.sendEncodingParameters.length&&(a.rtcp.ssrc=e.sendEncodingParameters[0].ssrc),e.rtpReceiver.receive(a))},d.prototype.setLocalDescription=function(e){var t,r,i=this;if(-1===["offer","answer"].indexOf(e.type))return Promise.reject(c("TypeError",'Unsupported type "'+e.type+'"'));if(!a("setLocalDescription",e.type,i.signalingState)||i._isClosed)return Promise.reject(c("InvalidStateError","Can not set local "+e.type+" in state "+i.signalingState));if("offer"===e.type)t=n.splitSections(e.sdp),r=t.shift(),t.forEach((function(e,t){var r=n.parseRtpParameters(e);i.transceivers[t].localCapabilities=r})),i.transceivers.forEach((function(e,t){i._gather(e.mid,t)}));else if("answer"===e.type){t=n.splitSections(i._remoteDescription.sdp),r=t.shift();var s=n.matchPrefix(r,"a=ice-lite").length>0;t.forEach((function(e,t){var a=i.transceivers[t],c=a.iceGatherer,u=a.iceTransport,d=a.dtlsTransport,p=a.localCapabilities,f=a.remoteCapabilities;if(!(n.isRejected(e)&&0===n.matchPrefix(e,"a=bundle-only").length)&&!a.rejected){var l=n.getIceParameters(e,r),h=n.getDtlsParameters(e,r);s&&(h.role="server"),i.usingBundle&&0!==t||(i._gather(a.mid,t),"new"===u.state&&u.start(c,l,s?"controlling":"controlled"),"new"===d.state&&d.start(h));var m=o(p,f);i._transceive(a,m.codecs.length>0,!1)}}))}return i._localDescription={type:e.type,sdp:e.sdp},"offer"===e.type?i._updateSignalingState("have-local-offer"):i._updateSignalingState("stable"),Promise.resolve()},d.prototype.setRemoteDescription=function(i){var d=this;if(-1===["offer","answer"].indexOf(i.type))return Promise.reject(c("TypeError",'Unsupported type "'+i.type+'"'));if(!a("setRemoteDescription",i.type,d.signalingState)||d._isClosed)return Promise.reject(c("InvalidStateError","Can not set remote "+i.type+" in state "+d.signalingState));var p={};d.remoteStreams.forEach((function(e){p[e.id]=e}));var f=[],l=n.splitSections(i.sdp),h=l.shift(),m=n.matchPrefix(h,"a=ice-lite").length>0,v=n.matchPrefix(h,"a=group:BUNDLE ").length>0;d.usingBundle=v;var y=n.matchPrefix(h,"a=ice-options:")[0];return d.canTrickleIceCandidates=!!y&&y.substr(14).split(" ").indexOf("trickle")>=0,l.forEach((function(a,c){var u=n.splitLines(a),l=n.getKind(a),y=n.isRejected(a)&&0===n.matchPrefix(a,"a=bundle-only").length,g=u[0].substr(2).split(" ")[2],C=n.getDirection(a,h),_=n.parseMsid(a),S=n.getMid(a)||n.generateIdentifier();if(y||"application"===l&&("DTLS/SCTP"===g||"UDP/DTLS/SCTP"===g))d.transceivers[c]={mid:S,kind:l,protocol:g,rejected:!0};else{var T,E,w,R,b,P,k,x,A;!y&&d.transceivers[c]&&d.transceivers[c].rejected&&(d.transceivers[c]=d._createTransceiver(l,!0));var O,D,M=n.parseRtpParameters(a);y||(O=n.getIceParameters(a,h),(D=n.getDtlsParameters(a,h)).role="client"),k=n.parseRtpEncodingParameters(a);var I=n.parseRtcpParameters(a),L=n.matchPrefix(a,"a=end-of-candidates",h).length>0,j=n.matchPrefix(a,"a=candidate:").map((function(e){return n.parseCandidate(e)})).filter((function(e){return 1===e.component}));if(("offer"===i.type||"answer"===i.type)&&!y&&v&&c>0&&d.transceivers[c]&&(d._disposeIceAndDtlsTransports(c),d.transceivers[c].iceGatherer=d.transceivers[0].iceGatherer,d.transceivers[c].iceTransport=d.transceivers[0].iceTransport,d.transceivers[c].dtlsTransport=d.transceivers[0].dtlsTransport,d.transceivers[c].rtpSender&&d.transceivers[c].rtpSender.setTransport(d.transceivers[0].dtlsTransport),d.transceivers[c].rtpReceiver&&d.transceivers[c].rtpReceiver.setTransport(d.transceivers[0].dtlsTransport)),"offer"!==i.type||y){if("answer"===i.type&&!y){E=(T=d.transceivers[c]).iceGatherer,w=T.iceTransport,R=T.dtlsTransport,b=T.rtpReceiver,P=T.sendEncodingParameters,x=T.localCapabilities,d.transceivers[c].recvEncodingParameters=k,d.transceivers[c].remoteCapabilities=M,d.transceivers[c].rtcpParameters=I,j.length&&"new"===w.state&&(!m&&!L||v&&0!==c?j.forEach((function(e){s(T.iceTransport,e)})):w.setRemoteCandidates(j)),v&&0!==c||("new"===w.state&&w.start(E,O,"controlling"),"new"===R.state&&R.start(D)),!o(T.localCapabilities,T.remoteCapabilities).codecs.filter((function(e){return"rtx"===e.name.toLowerCase()})).length&&T.sendEncodingParameters[0].rtx&&delete T.sendEncodingParameters[0].rtx,d._transceive(T,"sendrecv"===C||"recvonly"===C,"sendrecv"===C||"sendonly"===C),!b||"sendrecv"!==C&&"sendonly"!==C?delete T.rtpReceiver:(A=b.track,_?(p[_.stream]||(p[_.stream]=new e.MediaStream),r(A,p[_.stream]),f.push([A,b,p[_.stream]])):(p.default||(p.default=new e.MediaStream),r(A,p.default),f.push([A,b,p.default])))}}else{(T=d.transceivers[c]||d._createTransceiver(l)).mid=S,T.iceGatherer||(T.iceGatherer=d._createIceGatherer(c,v)),j.length&&"new"===T.iceTransport.state&&(!L||v&&0!==c?j.forEach((function(e){s(T.iceTransport,e)})):T.iceTransport.setRemoteCandidates(j)),x=e.RTCRtpReceiver.getCapabilities(l),t<15019&&(x.codecs=x.codecs.filter((function(e){return"rtx"!==e.name}))),P=T.sendEncodingParameters||[{ssrc:1001*(2*c+2)}];var N,F=!1;if("sendrecv"===C||"sendonly"===C){if(F=!T.rtpReceiver,b=T.rtpReceiver||new e.RTCRtpReceiver(T.dtlsTransport,l),F)A=b.track,_&&"-"===_.stream||(_?(p[_.stream]||(p[_.stream]=new e.MediaStream,Object.defineProperty(p[_.stream],"id",{get:function(){return _.stream}})),Object.defineProperty(A,"id",{get:function(){return _.track}}),N=p[_.stream]):(p.default||(p.default=new e.MediaStream),N=p.default)),N&&(r(A,N),T.associatedRemoteMediaStreams.push(N)),f.push([A,b,N])}else T.rtpReceiver&&T.rtpReceiver.track&&(T.associatedRemoteMediaStreams.forEach((function(t){var r=t.getTracks().find((function(e){return e.id===T.rtpReceiver.track.id}));r&&function(t,r){r.removeTrack(t),r.dispatchEvent(new e.MediaStreamTrackEvent("removetrack",{track:t}))}(r,t)})),T.associatedRemoteMediaStreams=[]);T.localCapabilities=x,T.remoteCapabilities=M,T.rtpReceiver=b,T.rtcpParameters=I,T.sendEncodingParameters=P,T.recvEncodingParameters=k,d._transceive(d.transceivers[c],!1,F)}}})),void 0===d._dtlsRole&&(d._dtlsRole="offer"===i.type?"active":"passive"),d._remoteDescription={type:i.type,sdp:i.sdp},"offer"===i.type?d._updateSignalingState("have-remote-offer"):d._updateSignalingState("stable"),Object.keys(p).forEach((function(t){var r=p[t];if(r.getTracks().length){if(-1===d.remoteStreams.indexOf(r)){d.remoteStreams.push(r);var n=new Event("addstream");n.stream=r,e.setTimeout((function(){d._dispatchEvent("addstream",n)}))}f.forEach((function(e){var t=e[0],n=e[1];r.id===e[2].id&&u(d,t,n,[r])}))}})),f.forEach((function(e){e[2]||u(d,e[0],e[1],[])})),e.setTimeout((function(){d&&d.transceivers&&d.transceivers.forEach((function(e){e.iceTransport&&"new"===e.iceTransport.state&&e.iceTransport.getRemoteCandidates().length>0&&(console.warn("Timeout for addRemoteCandidate. Consider sending an end-of-candidates notification"),e.iceTransport.addRemoteCandidate({}))}))}),4e3),Promise.resolve()},d.prototype.close=function(){this.transceivers.forEach((function(e){e.iceTransport&&e.iceTransport.stop(),e.dtlsTransport&&e.dtlsTransport.stop(),e.rtpSender&&e.rtpSender.stop(),e.rtpReceiver&&e.rtpReceiver.stop()})),this._isClosed=!0,this._updateSignalingState("closed")},d.prototype._updateSignalingState=function(e){this.signalingState=e;var t=new Event("signalingstatechange");this._dispatchEvent("signalingstatechange",t)},d.prototype._maybeFireNegotiationNeeded=function(){var t=this;"stable"===this.signalingState&&!0!==this.needNegotiation&&(this.needNegotiation=!0,e.setTimeout((function(){if(t.needNegotiation){t.needNegotiation=!1;var e=new Event("negotiationneeded");t._dispatchEvent("negotiationneeded",e)}}),0))},d.prototype._updateIceConnectionState=function(){var e,t={new:0,closed:0,checking:0,connected:0,completed:0,disconnected:0,failed:0};if(this.transceivers.forEach((function(e){e.iceTransport&&!e.rejected&&t[e.iceTransport.state]++})),e="new",t.failed>0?e="failed":t.checking>0?e="checking":t.disconnected>0?e="disconnected":t.new>0?e="new":t.connected>0?e="connected":t.completed>0&&(e="completed"),e!==this.iceConnectionState){this.iceConnectionState=e;var r=new Event("iceconnectionstatechange");this._dispatchEvent("iceconnectionstatechange",r)}},d.prototype._updateConnectionState=function(){var e,t={new:0,closed:0,connecting:0,connected:0,completed:0,disconnected:0,failed:0};if(this.transceivers.forEach((function(e){e.iceTransport&&e.dtlsTransport&&!e.rejected&&(t[e.iceTransport.state]++,t[e.dtlsTransport.state]++)})),t.connected+=t.completed,e="new",t.failed>0?e="failed":t.connecting>0?e="connecting":t.disconnected>0?e="disconnected":t.new>0?e="new":t.connected>0&&(e="connected"),e!==this.connectionState){this.connectionState=e;var r=new Event("connectionstatechange");this._dispatchEvent("connectionstatechange",r)}},d.prototype.createOffer=function(){var r=this;if(r._isClosed)return Promise.reject(c("InvalidStateError","Can not call createOffer after close"));var o=r.transceivers.filter((function(e){return"audio"===e.kind})).length,a=r.transceivers.filter((function(e){return"video"===e.kind})).length,s=arguments[0];if(s){if(s.mandatory||s.optional)throw new TypeError("Legacy mandatory/optional constraints not supported.");void 0!==s.offerToReceiveAudio&&(o=!0===s.offerToReceiveAudio?1:!1===s.offerToReceiveAudio?0:s.offerToReceiveAudio),void 0!==s.offerToReceiveVideo&&(a=!0===s.offerToReceiveVideo?1:!1===s.offerToReceiveVideo?0:s.offerToReceiveVideo)}for(r.transceivers.forEach((function(e){"audio"===e.kind?--o<0&&(e.wantReceive=!1):"video"===e.kind&&--a<0&&(e.wantReceive=!1)}));o>0||a>0;)o>0&&(r._createTransceiver("audio"),o--),a>0&&(r._createTransceiver("video"),a--);var u=n.writeSessionBoilerplate(r._sdpSessionId,r._sdpSessionVersion++);r.transceivers.forEach((function(i,o){var a=i.track,s=i.kind,c=i.mid||n.generateIdentifier();i.mid=c,i.iceGatherer||(i.iceGatherer=r._createIceGatherer(o,r.usingBundle));var u=e.RTCRtpSender.getCapabilities(s);t<15019&&(u.codecs=u.codecs.filter((function(e){return"rtx"!==e.name}))),u.codecs.forEach((function(e){"H264"===e.name&&void 0===e.parameters["level-asymmetry-allowed"]&&(e.parameters["level-asymmetry-allowed"]="1"),i.remoteCapabilities&&i.remoteCapabilities.codecs&&i.remoteCapabilities.codecs.forEach((function(t){e.name.toLowerCase()===t.name.toLowerCase()&&e.clockRate===t.clockRate&&(e.preferredPayloadType=t.payloadType)}))})),u.headerExtensions.forEach((function(e){(i.remoteCapabilities&&i.remoteCapabilities.headerExtensions||[]).forEach((function(t){e.uri===t.uri&&(e.id=t.id)}))}));var d=i.sendEncodingParameters||[{ssrc:1001*(2*o+1)}];a&&t>=15019&&"video"===s&&!d[0].rtx&&(d[0].rtx={ssrc:d[0].ssrc+1}),i.wantReceive&&(i.rtpReceiver=new e.RTCRtpReceiver(i.dtlsTransport,s)),i.localCapabilities=u,i.sendEncodingParameters=d})),"max-compat"!==r._config.bundlePolicy&&(u+="a=group:BUNDLE "+r.transceivers.map((function(e){return e.mid})).join(" ")+"\r\n"),u+="a=ice-options:trickle\r\n",r.transceivers.forEach((function(e,t){u+=i(e,e.localCapabilities,"offer",e.stream,r._dtlsRole),u+="a=rtcp-rsize\r\n",!e.iceGatherer||"new"===r.iceGatheringState||0!==t&&r.usingBundle||(e.iceGatherer.getLocalCandidates().forEach((function(e){e.component=1,u+="a="+n.writeCandidate(e)+"\r\n"})),"completed"===e.iceGatherer.state&&(u+="a=end-of-candidates\r\n"))}));var d=new e.RTCSessionDescription({type:"offer",sdp:u});return Promise.resolve(d)},d.prototype.createAnswer=function(){var r=this;if(r._isClosed)return Promise.reject(c("InvalidStateError","Can not call createAnswer after close"));if("have-remote-offer"!==r.signalingState&&"have-local-pranswer"!==r.signalingState)return Promise.reject(c("InvalidStateError","Can not call createAnswer in signalingState "+r.signalingState));var a=n.writeSessionBoilerplate(r._sdpSessionId,r._sdpSessionVersion++);r.usingBundle&&(a+="a=group:BUNDLE "+r.transceivers.map((function(e){return e.mid})).join(" ")+"\r\n"),a+="a=ice-options:trickle\r\n";var s=n.getMediaSections(r._remoteDescription.sdp).length;r.transceivers.forEach((function(e,n){if(!(n+1>s)){if(e.rejected)return"application"===e.kind?"DTLS/SCTP"===e.protocol?a+="m=application 0 DTLS/SCTP 5000\r\n":a+="m=application 0 "+e.protocol+" webrtc-datachannel\r\n":"audio"===e.kind?a+="m=audio 0 UDP/TLS/RTP/SAVPF 0\r\na=rtpmap:0 PCMU/8000\r\n":"video"===e.kind&&(a+="m=video 0 UDP/TLS/RTP/SAVPF 120\r\na=rtpmap:120 VP8/90000\r\n"),void(a+="c=IN IP4 0.0.0.0\r\na=inactive\r\na=mid:"+e.mid+"\r\n");var c;if(e.stream)"audio"===e.kind?c=e.stream.getAudioTracks()[0]:"video"===e.kind&&(c=e.stream.getVideoTracks()[0]),c&&t>=15019&&"video"===e.kind&&!e.sendEncodingParameters[0].rtx&&(e.sendEncodingParameters[0].rtx={ssrc:e.sendEncodingParameters[0].ssrc+1});var u=o(e.localCapabilities,e.remoteCapabilities);!u.codecs.filter((function(e){return"rtx"===e.name.toLowerCase()})).length&&e.sendEncodingParameters[0].rtx&&delete e.sendEncodingParameters[0].rtx,a+=i(e,u,"answer",e.stream,r._dtlsRole),e.rtcpParameters&&e.rtcpParameters.reducedSize&&(a+="a=rtcp-rsize\r\n")}}));var u=new e.RTCSessionDescription({type:"answer",sdp:a});return Promise.resolve(u)},d.prototype.addIceCandidate=function(e){var t,r=this;return e&&void 0===e.sdpMLineIndex&&!e.sdpMid?Promise.reject(new TypeError("sdpMLineIndex or sdpMid required")):new Promise((function(i,o){if(!r._remoteDescription)return o(c("InvalidStateError","Can not add ICE candidate without a remote description"));if(e&&""!==e.candidate){var a=e.sdpMLineIndex;if(e.sdpMid)for(var u=0;u<r.transceivers.length;u++)if(r.transceivers[u].mid===e.sdpMid){a=u;break}var d=r.transceivers[a];if(!d)return o(c("OperationError","Can not add ICE candidate"));if(d.rejected)return i();var p=Object.keys(e.candidate).length>0?n.parseCandidate(e.candidate):{};if("tcp"===p.protocol&&(0===p.port||9===p.port))return i();if(p.component&&1!==p.component)return i();if((0===a||a>0&&d.iceTransport!==r.transceivers[0].iceTransport)&&!s(d.iceTransport,p))return o(c("OperationError","Can not add ICE candidate"));var f=e.candidate.trim();0===f.indexOf("a=")&&(f=f.substr(2)),(t=n.getMediaSections(r._remoteDescription.sdp))[a]+="a="+(p.type?f:"end-of-candidates")+"\r\n",r._remoteDescription.sdp=n.getDescription(r._remoteDescription.sdp)+t.join("")}else for(var l=0;l<r.transceivers.length&&(r.transceivers[l].rejected||(r.transceivers[l].iceTransport.addRemoteCandidate({}),(t=n.getMediaSections(r._remoteDescription.sdp))[l]+="a=end-of-candidates\r\n",r._remoteDescription.sdp=n.getDescription(r._remoteDescription.sdp)+t.join(""),!r.usingBundle));l++);i()}))},d.prototype.getStats=function(t){if(t&&t instanceof e.MediaStreamTrack){var r=null;if(this.transceivers.forEach((function(e){e.rtpSender&&e.rtpSender.track===t?r=e.rtpSender:e.rtpReceiver&&e.rtpReceiver.track===t&&(r=e.rtpReceiver)})),!r)throw c("InvalidAccessError","Invalid selector.");return r.getStats()}var n=[];return this.transceivers.forEach((function(e){["rtpSender","rtpReceiver","iceGatherer","iceTransport","dtlsTransport"].forEach((function(t){e[t]&&n.push(e[t].getStats())}))})),Promise.all(n).then((function(e){var t=new Map;return e.forEach((function(e){e.forEach((function(e){t.set(e.id,e)}))})),t}))};["RTCRtpSender","RTCRtpReceiver","RTCIceGatherer","RTCIceTransport","RTCDtlsTransport"].forEach((function(t){var r=e[t];if(r&&r.prototype&&r.prototype.getStats){var n=r.prototype.getStats;r.prototype.getStats=function(){return n.apply(this).then((function(e){var t=new Map;return Object.keys(e).forEach((function(r){var n;e[r].type={inboundrtp:"inbound-rtp",outboundrtp:"outbound-rtp",candidatepair:"candidate-pair",localcandidate:"local-candidate",remotecandidate:"remote-candidate"}[(n=e[r]).type]||n.type,t.set(r,e[r])})),t}))}}}));var p=["createOffer","createAnswer"];return p.forEach((function(e){var t=d.prototype[e];d.prototype[e]=function(){var e=arguments;return"function"==typeof e[0]||"function"==typeof e[1]?t.apply(this,[arguments[2]]).then((function(t){"function"==typeof e[0]&&e[0].apply(null,[t])}),(function(t){"function"==typeof e[1]&&e[1].apply(null,[t])})):t.apply(this,arguments)}})),(p=["setLocalDescription","setRemoteDescription","addIceCandidate"]).forEach((function(e){var t=d.prototype[e];d.prototype[e]=function(){var e=arguments;return"function"==typeof e[1]||"function"==typeof e[2]?t.apply(this,arguments).then((function(){"function"==typeof e[1]&&e[1].apply(null)}),(function(t){"function"==typeof e[2]&&e[2].apply(null,[t])})):t.apply(this,arguments)}})),["getStats"].forEach((function(e){var t=d.prototype[e];d.prototype[e]=function(){var e=arguments;return"function"==typeof e[1]?t.apply(this,arguments).then((function(){"function"==typeof e[1]&&e[1].apply(null)})):t.apply(this,arguments)}})),d}},function(e,t,r){e.exports=r(60)},function(e,t,r){var n=function(e){"use strict";var t=Object.prototype,r=t.hasOwnProperty,n="function"==typeof Symbol?Symbol:{},i=n.iterator||"@@iterator",o=n.asyncIterator||"@@asyncIterator",a=n.toStringTag||"@@toStringTag";function s(e,t,r,n){var i=t&&t.prototype instanceof d?t:d,o=Object.create(i.prototype),a=new T(n||[]);return o._invoke=function(e,t,r){var n="suspendedStart";return function(i,o){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===i)throw o;return w()}for(r.method=i,r.arg=o;;){var a=r.delegate;if(a){var s=C(a,r);if(s){if(s===u)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var d=c(e,t,r);if("normal"===d.type){if(n=r.done?"completed":"suspendedYield",d.arg===u)continue;return{value:d.arg,done:r.done}}"throw"===d.type&&(n="completed",r.method="throw",r.arg=d.arg)}}}(e,r,a),o}function c(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=s;var u={};function d(){}function p(){}function f(){}var l={};l[i]=function(){return this};var h=Object.getPrototypeOf,m=h&&h(h(E([])));m&&m!==t&&r.call(m,i)&&(l=m);var v=f.prototype=d.prototype=Object.create(l);function y(e){["next","throw","return"].forEach((function(t){e[t]=function(e){return this._invoke(t,e)}}))}function g(e,t){var n;this._invoke=function(i,o){function a(){return new t((function(n,a){!function n(i,o,a,s){var u=c(e[i],e,o);if("throw"!==u.type){var d=u.arg,p=d.value;return p&&"object"==typeof p&&r.call(p,"__await")?t.resolve(p.__await).then((function(e){n("next",e,a,s)}),(function(e){n("throw",e,a,s)})):t.resolve(p).then((function(e){d.value=e,a(d)}),(function(e){return n("throw",e,a,s)}))}s(u.arg)}(i,o,n,a)}))}return n=n?n.then(a,a):a()}}function C(e,t){var r=e.iterator[t.method];if(void 0===r){if(t.delegate=null,"throw"===t.method){if(e.iterator.return&&(t.method="return",t.arg=void 0,C(e,t),"throw"===t.method))return u;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return u}var n=c(r,e.iterator,t.arg);if("throw"===n.type)return t.method="throw",t.arg=n.arg,t.delegate=null,u;var i=n.arg;return i?i.done?(t[e.resultName]=i.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,u):i:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,u)}function _(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function S(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function T(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(_,this),this.reset(!0)}function E(e){if(e){var t=e[i];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var n=-1,o=function t(){for(;++n<e.length;)if(r.call(e,n))return t.value=e[n],t.done=!1,t;return t.value=void 0,t.done=!0,t};return o.next=o}}return{next:w}}function w(){return{value:void 0,done:!0}}return p.prototype=v.constructor=f,f.constructor=p,f[a]=p.displayName="GeneratorFunction",e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===p||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,f):(e.__proto__=f,a in e||(e[a]="GeneratorFunction")),e.prototype=Object.create(v),e},e.awrap=function(e){return{__await:e}},y(g.prototype),g.prototype[o]=function(){return this},e.AsyncIterator=g,e.async=function(t,r,n,i,o){void 0===o&&(o=Promise);var a=new g(s(t,r,n,i),o);return e.isGeneratorFunction(r)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},y(v),v[a]="Generator",v[i]=function(){return this},v.toString=function(){return"[object Generator]"},e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=E,T.prototype={constructor:T,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(S),!e)for(var t in this)"t"===t.charAt(0)&&r.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function n(r,n){return a.type="throw",a.arg=e,t.next=r,n&&(t.method="next",t.arg=void 0),!!n}for(var i=this.tryEntries.length-1;i>=0;--i){var o=this.tryEntries[i],a=o.completion;if("root"===o.tryLoc)return n("end");if(o.tryLoc<=this.prev){var s=r.call(o,"catchLoc"),c=r.call(o,"finallyLoc");if(s&&c){if(this.prev<o.catchLoc)return n(o.catchLoc,!0);if(this.prev<o.finallyLoc)return n(o.finallyLoc)}else if(s){if(this.prev<o.catchLoc)return n(o.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return n(o.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var i=this.tryEntries[n];if(i.tryLoc<=this.prev&&r.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var o=i;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=e,a.arg=t,o?(this.method="next",this.next=o.finallyLoc,u):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),u},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),S(r),u}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var i=n.arg;S(r)}return i}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,r){return this.delegate={iterator:E(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=void 0),u}},e}(e.exports);try{regeneratorRuntime=n}catch(e){Function("r","regeneratorRuntime = r")(n)}},function(e,t,r){var n=r(18);e.exports=function(e){if(Array.isArray(e))return n(e)}},function(e,t){e.exports=function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}},function(e,t,r){var n=r(18);e.exports=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}},function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},function(e,t,r){"use strict";var n=r(3),i=r(19),o=r(38),a=r(9);function s(e){var t=new o(e),r=i(o.prototype.request,t);return n.extend(r,o.prototype,t),n.extend(r,t),r}var c=s(a);c.Axios=o,c.create=function(e){return s(n.merge(a,e))},c.Cancel=r(23),c.CancelToken=r(51),c.isCancel=r(22),c.all=function(e){return Promise.all(e)},c.spread=r(52),e.exports=c,e.exports.default=c},function(e,t){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
e.exports=function(e){return null!=e&&null!=e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}},function(e,t,r){"use strict";var n=r(9),i=r(3),o=r(46),a=r(47);function s(e){this.defaults=e,this.interceptors={request:new o,response:new o}}s.prototype.request=function(e){"string"==typeof e&&(e=i.merge({url:arguments[0]},arguments[1])),(e=i.merge(n,{method:"get"},this.defaults,e)).method=e.method.toLowerCase();var t=[a,void 0],r=Promise.resolve(e);for(this.interceptors.request.forEach((function(e){t.unshift(e.fulfilled,e.rejected)})),this.interceptors.response.forEach((function(e){t.push(e.fulfilled,e.rejected)}));t.length;)r=r.then(t.shift(),t.shift());return r},i.forEach(["delete","get","head","options"],(function(e){s.prototype[e]=function(t,r){return this.request(i.merge(r||{},{method:e,url:t}))}})),i.forEach(["post","put","patch"],(function(e){s.prototype[e]=function(t,r,n){return this.request(i.merge(n||{},{method:e,url:t,data:r}))}})),e.exports=s},function(e,t,r){"use strict";var n=r(3);e.exports=function(e,t){n.forEach(e,(function(r,n){n!==t&&n.toUpperCase()===t.toUpperCase()&&(e[t]=r,delete e[n])}))}},function(e,t,r){"use strict";var n=r(21);e.exports=function(e,t,r){var i=r.config.validateStatus;r.status&&i&&!i(r.status)?t(n("Request failed with status code "+r.status,r.config,null,r.request,r)):e(r)}},function(e,t,r){"use strict";e.exports=function(e,t,r,n,i){return e.config=t,r&&(e.code=r),e.request=n,e.response=i,e}},function(e,t,r){"use strict";var n=r(3);function i(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}e.exports=function(e,t,r){if(!t)return e;var o;if(r)o=r(t);else if(n.isURLSearchParams(t))o=t.toString();else{var a=[];n.forEach(t,(function(e,t){null!=e&&(n.isArray(e)?t+="[]":e=[e],n.forEach(e,(function(e){n.isDate(e)?e=e.toISOString():n.isObject(e)&&(e=JSON.stringify(e)),a.push(i(t)+"="+i(e))})))})),o=a.join("&")}return o&&(e+=(-1===e.indexOf("?")?"?":"&")+o),e}},function(e,t,r){"use strict";var n=r(3),i=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var t,r,o,a={};return e?(n.forEach(e.split("\n"),(function(e){if(o=e.indexOf(":"),t=n.trim(e.substr(0,o)).toLowerCase(),r=n.trim(e.substr(o+1)),t){if(a[t]&&i.indexOf(t)>=0)return;a[t]="set-cookie"===t?(a[t]?a[t]:[]).concat([r]):a[t]?a[t]+", "+r:r}})),a):a}},function(e,t,r){"use strict";var n=r(3);e.exports=n.isStandardBrowserEnv()?function(){var e,t=/(msie|trident)/i.test(navigator.userAgent),r=document.createElement("a");function i(e){var n=e;return t&&(r.setAttribute("href",n),n=r.href),r.setAttribute("href",n),{href:r.href,protocol:r.protocol?r.protocol.replace(/:$/,""):"",host:r.host,search:r.search?r.search.replace(/^\?/,""):"",hash:r.hash?r.hash.replace(/^#/,""):"",hostname:r.hostname,port:r.port,pathname:"/"===r.pathname.charAt(0)?r.pathname:"/"+r.pathname}}return e=i(window.location.href),function(t){var r=n.isString(t)?i(t):t;return r.protocol===e.protocol&&r.host===e.host}}():function(){return!0}},function(e,t,r){"use strict";var n=r(3);e.exports=n.isStandardBrowserEnv()?{write:function(e,t,r,i,o,a){var s=[];s.push(e+"="+encodeURIComponent(t)),n.isNumber(r)&&s.push("expires="+new Date(r).toGMTString()),n.isString(i)&&s.push("path="+i),n.isString(o)&&s.push("domain="+o),!0===a&&s.push("secure"),document.cookie=s.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}}},function(e,t,r){"use strict";var n=r(3);function i(){this.handlers=[]}i.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},i.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},i.prototype.forEach=function(e){n.forEach(this.handlers,(function(t){null!==t&&e(t)}))},e.exports=i},function(e,t,r){"use strict";var n=r(3),i=r(48),o=r(22),a=r(9),s=r(49),c=r(50);function u(e){e.cancelToken&&e.cancelToken.throwIfRequested()}e.exports=function(e){return u(e),e.baseURL&&!s(e.url)&&(e.url=c(e.baseURL,e.url)),e.headers=e.headers||{},e.data=i(e.data,e.headers,e.transformRequest),e.headers=n.merge(e.headers.common||{},e.headers[e.method]||{},e.headers||{}),n.forEach(["delete","get","head","post","put","patch","common"],(function(t){delete e.headers[t]})),(e.adapter||a.adapter)(e).then((function(t){return u(e),t.data=i(t.data,t.headers,e.transformResponse),t}),(function(t){return o(t)||(u(e),t&&t.response&&(t.response.data=i(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)}))}},function(e,t,r){"use strict";var n=r(3);e.exports=function(e,t,r){return n.forEach(r,(function(r){e=r(e,t)})),e}},function(e,t,r){"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},function(e,t,r){"use strict";e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},function(e,t,r){"use strict";var n=r(23);function i(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise((function(e){t=e}));var r=this;e((function(e){r.reason||(r.reason=new n(e),t(r.reason))}))}i.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},i.source=function(){var e;return{token:new i((function(t){e=t})),cancel:e}},e.exports=i},function(e,t,r){"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}},function(e,t){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(e){"object"==typeof window&&(r=window)}e.exports=r},function(e,t){(function(t){e.exports=t}).call(this,{})},function(e,t){try{var r=new window.CustomEvent("test");if(r.preventDefault(),!0!==r.defaultPrevented)throw new Error("Could not prevent default")}catch(e){var n=function(e,t){var r,n;return t=t||{bubbles:!1,cancelable:!1,detail:void 0},(r=document.createEvent("CustomEvent")).initCustomEvent(e,t.bubbles,t.cancelable,t.detail),n=r.preventDefault,r.preventDefault=function(){n.call(this);try{Object.defineProperty(this,"defaultPrevented",{get:function(){return!0}})}catch(e){this.defaultPrevented=!0}},r};n.prototype=window.Event.prototype,window.CustomEvent=n}},function(e,t){e.exports=function(e){return-1!==Function.toString.call(e).indexOf("[native code]")}},function(e,t,r){var n=r(11),i=r(58);function o(t,r,a){return i()?e.exports=o=Reflect.construct:e.exports=o=function(e,t,r){var i=[null];i.push.apply(i,t);var o=new(Function.bind.apply(e,i));return r&&n(o,r.prototype),o},o.apply(null,arguments)}e.exports=o},function(e,t){e.exports=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}},function(e,t,r){var n={"./echo.js":[64,16],"./face_age.js":[62,0,5],"./face_arousal_valence.js":[65,0,6],"./face_attention.js":[66,14],"./face_base.js":[67,0,10],"./face_detector.js":[61,13],"./face_emotion.js":[68,0,1,11],"./face_emotion_hd.js":[69,0,1,12],"./face_features.js":[70,0,7],"./face_gender.js":[71,0,9],"./face_identity.js":[63,15],"./face_pose.js":[72,0,8],"./face_wish.js":[73,17],"./fruit.js":[74,0,3],"./smart.js":[75,0,4]};function i(e){if(!r.o(n,e))return Promise.resolve().then((function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=n[e],i=t[0];return Promise.all(t.slice(1).map(r.e)).then((function(){return r(i)}))}i.keys=function(){return Object.keys(n)},i.id=59,e.exports=i},function(e,t,r){"use strict";r.r(t),r.d(t,"loader",(function(){return vr})),r.d(t,"modules",(function(){return yr})),r.d(t,"getUserMediaCameraFactory",(function(){return gr})),r.d(t,"createSource",(function(){return Cr}));var n={};r.r(n),r.d(n,"supported",(function(){return Z})),r.d(n,"errorMsg",(function(){return ee}));var i={};r.r(i),r.d(i,"supported",(function(){return te})),r.d(i,"errorMsg",(function(){return re}));var o={};r.r(o),r.d(o,"supported",(function(){return ne})),r.d(o,"errorMsg",(function(){return ie}));var a={};r.r(a),r.d(a,"supported",(function(){return oe})),r.d(a,"errorMsg",(function(){return ae}));var s={};r.r(s),r.d(s,"supported",(function(){return se})),r.d(s,"errorMsg",(function(){return ce}));var c={};r.r(c),r.d(c,"supported",(function(){return ue})),r.d(c,"errorMsg",(function(){return de}));var u={};r.r(u),r.d(u,"supported",(function(){return pe})),r.d(u,"errorMsg",(function(){return fe}));var d={};r.r(d),r.d(d,"supported",(function(){return le})),r.d(d,"errorMsg",(function(){return he}));var p={};r.r(p),r.d(p,"supported",(function(){return me})),r.d(p,"errorMsg",(function(){return ve}));var f={};r.r(f),r.d(f,"supported",(function(){return Ce})),r.d(f,"errorMsg",(function(){return _e}));var l={};r.r(l),r.d(l,"supported",(function(){return Se})),r.d(l,"errorMsg",(function(){return Te}));var h={};r.r(h),r.d(h,"supported",(function(){return Ee})),r.d(h,"errorMsg",(function(){return we}));var m={};r.r(m),r.d(m,"supported",(function(){return Re})),r.d(m,"errorMsg",(function(){return be}));var v={};r.r(v),r.d(v,"supported",(function(){return Pe})),r.d(v,"errorMsg",(function(){return ke}));var y={};r.r(y),r.d(y,"supported",(function(){return xe})),r.d(y,"errorMsg",(function(){return Ae}));var g={};r.r(g),r.d(g,"shimGetUserMedia",(function(){return mt})),r.d(g,"shimGetDisplayMedia",(function(){return vt})),r.d(g,"shimMediaStream",(function(){return yt})),r.d(g,"shimOnTrack",(function(){return gt})),r.d(g,"shimGetSendersWithDtmf",(function(){return Ct})),r.d(g,"shimGetStats",(function(){return _t})),r.d(g,"shimSenderReceiverGetStats",(function(){return St})),r.d(g,"shimAddTrackRemoveTrackWithNative",(function(){return Tt})),r.d(g,"shimAddTrackRemoveTrack",(function(){return Et})),r.d(g,"shimPeerConnection",(function(){return wt})),r.d(g,"fixNegotiationNeeded",(function(){return Rt}));var C={};r.r(C),r.d(C,"shimGetUserMedia",(function(){return kt})),r.d(C,"shimGetDisplayMedia",(function(){return xt})),r.d(C,"shimPeerConnection",(function(){return At})),r.d(C,"shimReplaceTrack",(function(){return Ot}));var _={};r.r(_),r.d(_,"shimGetUserMedia",(function(){return Dt})),r.d(_,"shimGetDisplayMedia",(function(){return Mt})),r.d(_,"shimOnTrack",(function(){return It})),r.d(_,"shimPeerConnection",(function(){return Lt})),r.d(_,"shimSenderGetStats",(function(){return jt})),r.d(_,"shimReceiverGetStats",(function(){return Nt})),r.d(_,"shimRemoveStream",(function(){return Ft})),r.d(_,"shimRTCDataChannel",(function(){return Ut})),r.d(_,"shimAddTransceiver",(function(){return Gt})),r.d(_,"shimCreateOffer",(function(){return Bt})),r.d(_,"shimCreateAnswer",(function(){return Ht}));var S={};r.r(S),r.d(S,"shimLocalStreamsAPI",(function(){return zt})),r.d(S,"shimRemoteStreamsAPI",(function(){return Vt})),r.d(S,"shimCallbacksAPI",(function(){return Jt})),r.d(S,"shimGetUserMedia",(function(){return Yt})),r.d(S,"shimConstraints",(function(){return Kt})),r.d(S,"shimRTCIceServerUrls",(function(){return qt})),r.d(S,"shimTrackEventTransceiver",(function(){return Wt})),r.d(S,"shimCreateOfferLegacy",(function(){return $t})),r.d(S,"shimAudioContext",(function(){return Xt}));var T={};r.r(T),r.d(T,"shimRTCIceCandidate",(function(){return er})),r.d(T,"shimMaxMessageSize",(function(){return tr})),r.d(T,"shimSendThrowTypeError",(function(){return rr})),r.d(T,"shimConnectionState",(function(){return nr})),r.d(T,"removeAllowExtmapMixed",(function(){return ir}));var E=r(0),w=r.n(E),R=r(1),b=r.n(R),P=r(2),k=r.n(P),x=r(8),A=r.n(x),O=r(5),D=r.n(O),M=r(26),I=r.n(M),L=r(13),j=r.n(L),N=r(27),F=function(){function e(t,r,n){var i=arguments.length>3&&void 0!==arguments[3]&&arguments[3];w()(this,e),this.name=t,this.parents=r,this.children=n,this.visited=i,this.hasResult=i,this._fake=i}return b()(e,[{key:"reset",value:function(){this.visited=this._fake,this.hasResult=this._fake}}]),e}();function U(e){if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(e=function(e,t){if(!e)return;if("string"==typeof e)return G(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return G(e,t)}(e))){var t=0,r=function(){};return{s:r,n:function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}},e:function(e){throw e},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var n,i,o=!0,a=!1;return{s:function(){n=e[Symbol.iterator]()},n:function(){var e=n.next();return o=e.done,e},e:function(e){a=!0,i=e},f:function(){try{o||null==n.return||n.return()}finally{if(a)throw i}}}}function G(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var B=function(){function e(t){w()(this,e),this.root=t}var t;return b()(e,[{key:"dependencies",value:function(e){var t=this._getNode(e);return this._findAllAncestorsRecursive(t).filter((function(e){return!e._fake})).map((function(e){return e.name})).concat(e)}},{key:"visitSequentially",value:function(t,r,n){return e._callChildrenSequentially(this.root,t,r,n)}},{key:"_getNode",value:function(t){var r=void 0;return e._syncDepthFirstScan([],this.root,(function(e){if(e.name===t)return r=e,!0})),r}},{key:"_findAllAncestorsRecursive",value:function(e){if(e===this.root)return[];var t,r=[],n=e.parents,i=U(n);try{for(i.s();!(t=i.n()).done;){var o=t.value;r=r.concat(this._findAllAncestorsRecursive(o))}}catch(e){i.e(e)}finally{i.f()}return Array.from(new Set(r.concat(n)))}}],[{key:"buildGraph",value:function(t){var r=new F("ROOT",[],[],!0),n={};return t.forEach((function(e){return n[e.name]=new F(e.name,[],[])})),t.forEach((function(e){e.dependencies?e.dependencies.forEach((function(t){n[e.name].parents.push(n[t]),n[t].children.push(n[e.name])})):(n[e.name].parents.push(r),r.children.push(n[e.name]))})),new e(r)}},{key:"_syncDepthFirstScan",value:function(t,r,n){var i,o=U(r.children);try{for(o.s();!(i=o.n()).done;){var a=i.value,s=t.concat([a]);if(n(a,s)||e._syncDepthFirstScan(s,a,n))return!0}}catch(e){o.e(e)}finally{o.f()}return!1}},{key:"_callChildrenSequentially",value:(t=D()(k.a.mark((function t(r,n,i,o){var a,s,c,u,d;return k.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:a=[r];case 1:if(!(a.length>0)){t.next=34;break}s=a[0],c=U(s.children),t.prev=4,c.s();case 6:if((u=c.n()).done){t.next=23;break}if((d=u.value).visited||!d.parents.every((function(e){return e.hasResult}))){t.next=21;break}return t.prev=9,d.visited=!0,t.next=13,i(n,d.name);case 13:n=t.sent,d.hasResult=!0,a.push(d),t.next=21;break;case 18:t.prev=18,t.t0=t.catch(9),o(t.t0,d.name);case 21:t.next=6;break;case 23:t.next=28;break;case 25:t.prev=25,t.t1=t.catch(4),c.e(t.t1);case 28:return t.prev=28,c.f(),t.finish(28);case 31:a.shift(),t.next=1;break;case 34:e._syncDepthFirstScan([],r,(function(e){return e.reset()}));case 35:case"end":return t.stop()}}),t,null,[[4,25,28,31],[9,18]])}))),function(e,r,n,i){return t.apply(this,arguments)})}]),e}(),H=r(4),z=B.buildGraph([{name:"FACE_DETECTOR"},{name:"SMART"},{name:"FRUIT"},{name:"FACE_BASE",dependencies:["FACE_DETECTOR"]},{name:"FACE_AGE",dependencies:["FACE_BASE"]},{name:"FACE_EMOTION",dependencies:["FACE_BASE"]},{name:"FACE_EMOTION_HD",dependencies:["FACE_DETECTOR"]},{name:"FACE_GENDER",dependencies:["FACE_BASE"]},{name:"FACE_FEATURES",dependencies:["FACE_BASE"]},{name:"FACE_POSE",dependencies:["FACE_BASE"]},{name:"FACE_IDENTITY",dependencies:["FACE_POSE"]},{name:"FACE_AROUSAL_VALENCE",dependencies:["FACE_POSE"]},{name:"FACE_ATTENTION",dependencies:["FACE_AROUSAL_VALENCE"]},{name:"FACE_WISH",dependencies:["FACE_AROUSAL_VALENCE","FACE_EMOTION"]}]),V={dependencies:function(e){return z.dependencies(e)},visitSequentially:function(e,t,r,n){return z.visitSequentially(e,t,(function(e,t){e===H.a||e===H.c?n(t):e===H.d||e===H.e||e===H.b||r(e)}))}};Object.freeze(V);var J=function(){function e(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;w()(this,e),this._delay=t,this._minRestTime=r,this._restFactor=n}return b()(e,[{key:"scheduleNext",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Date.now(),r=Date.now()-t,n=Math.max(this._delay-r,this._minRestTime,r*this._restFactor);this._nextId=setTimeout(e,n)}},{key:"stop",value:function(){clearTimeout(this._nextId)}}]),e}(),Y=/^https?:\/\/(.*?)(?::\d*)?$/,K=/^chrome-extension:\/\/(.*)$/;function q(e){var t=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:location.origin,t=e.match(K);return t?t[1]:e.match(Y)[1]}(e).split("."),r=[];if(1===t.length)return t;for(var n=0;n<t.length-1;n++){var i=t.slice(n).join(".");r.push(i)}return r}var W=function(){function e(t,r,n){w()(this,e),this.major=t,this.minor=r,this.patch=n,Object.freeze(this)}return b()(e,[{key:"lesserEqualThan",value:function(e){return this.major<e.major||this.major===e.major&&this.minor<e.minor||this.major===e.major&&this.minor===e.minor&&this.patch<=e.patch}}],[{key:"parse",value:function(t){var r=t.split(".").map((function(e){return"*"===e?Number.POSITIVE_INFINITY:parseInt(e,10)}));return new e(r[0],r[1],r[2])}}]),e}(),$=r(24);function X(){var e,t=location.hostname;return t.startsWith("localhost")||("::"===(e=t)||"::1"===e||Q.some((function(t){return t.test(e)})))}var Q=[/^(::f{4}:)?10\.\d{1,3}\.\d{1,3}\.\d{1,3}/,/^(::f{4}:)?127\.\d{1,3}\.\d{1,3}\.\d{1,3}/,/^(::f{4}:)?169\.254\.([1-9]|1?\d\d|2[0-4]\d|25[0-4])\.\d{1,3}/,/^(::f{4}:)?(172\.1[6-9]|172\.2\d|172\.3[0-1])\.\d{1,3}\.\d{1,3}/,/^(::f{4}:)?192\.168\.\d{1,3}\.\d{1,3}/,/^f[c-d][0-9a-f]{2}(::1$|:[0-9a-f]{1,4}){1,7}/,/^fe[89ab][0-9a-f](::1$|:[0-9a-f]{1,4}){1,7}/];function Z(){return!0}var ee="";function te(){return!0}var re="";function ne(){return!0}var ie="";function oe(){return!0}var ae="";function se(){return"undefined"!=typeof Worker}var ce="Need WebWorker Support in order to run this module.";function ue(){return!0}var de="";function pe(){return!0}var fe="";function le(){return!0}var he="";function me(){return!0}var ve="",ye=r(10),ge=r.n(ye);function Ce(){return"undefined"!=typeof Worker&&"object"===("undefined"==typeof WebAssembly?"undefined":ge()(WebAssembly))}var _e="Need WebWorker and Wasm Support in order to run this module.";function Se(){return!0}var Te="";function Ee(){return!0}var we="";function Re(){return!0}var be="";function Pe(){return!0}var ke="";function xe(){return!0}var Ae="",Oe={echo:n,face_age:i,face_arousal_valence:o,face_base:a,face_detector:s,face_emotion:c,face_emotion_hd:u,face_features:d,face_gender:p,face_identity:f,face_pose:l,face_attention:h,face_wish:y,fruit:m,smart:v},De=r(17),Me=r.n(De);function Ie(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Le(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Ie(Object(r),!0).forEach((function(t){Me()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Ie(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var je,Ne=null;function Fe(e,t){Ne=setTimeout(Fe.bind(null,e,t),6e4);var r=e.processedImages,n=e.elapsed,i=Number((n/1e3).toFixed(0));return 0===r&&0===i?Promise.resolve():(e.reset(),fetch("https://api-sdk.morphcast.com/v1/stats/usage",Le(Le({},Ue.commonOptions()),{},{body:JSON.stringify({frames:r,time:i})})))}var Ue=function(){function e(){w()(this,e)}return b()(e,null,[{key:"commonOptions",value:function(){var e=new Headers;return e.append("Content-Type","application/json"),je&&e.append("X-VendorId",je),{method:"POST",headers:e,redirect:"follow",referrerPolicy:"no-referrer-when-downgrade"}}},{key:"postInit",value:function(){return fetch("https://api-sdk.morphcast.com/v1/stats/init",Le(Le({},e.commonOptions()),{},{body:JSON.stringify({version:"1.14.5"})}))}},{key:"scheduleUsage",value:function(e){Ne=setTimeout(Fe.bind(null,e,je),6e4)}},{key:"unscheduleKeepAlive",value:function(){clearTimeout(Ne)}},{key:"sendSdkStart",value:function(){return fetch("https://api-sdk.morphcast.com/v1/stats/start",e.commonOptions())}},{key:"sendStreamStart",value:function(){return fetch("https://api-sdk.morphcast.com/v1/stats/stream_started",e.commonOptions())}},{key:"sendCameraOk",value:function(){return fetch("https://api-sdk.morphcast.com/v1/stats/camera_ok",e.commonOptions())}},{key:"sendCameraDenied",value:function(){return fetch("https://api-sdk.morphcast.com/v1/stats/camera_denied",e.commonOptions())}},{key:"sendCameraError",value:function(t){return t=t||"Error",fetch("https://api-sdk.morphcast.com/v1/stats/camera_error",Le(Le({},e.commonOptions()),{},{body:JSON.stringify({message:t})}))}},{key:"setLicenseKey",value:function(e){je=e}}]),e}(),Ge=r(12),Be=r.n(Ge),He=r(14),ze=r.n(He),Ve=r(15),Je=r.n(Ve),Ye=r(7),Ke=r.n(Ye),qe=r(28);function We(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=Ke()(e);if(t){var i=Ke()(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return Je()(this,r)}}var $e=function(e){ze()(r,e);var t=We(r);function r(e,n){var i,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return w()(this,r),(i=t.call(this,e)).type=n,Object.assign(Be()(i),o),i}return b()(r,null,[{key:"clone",value:function(e,t,n){return new r(e.message,t,n)}},{key:"types",get:function(){return{LOAD:"AiSDK.LOAD.ERROR",RUN:"AiSDK.RUN.ERROR",CAMERA:"AiSDK.CAMERA.ERROR",GENERAL:"AiSDK.GENERAL.ERROR"}}}]),r}(r.n(qe)()(Error)),Xe=function(){function e(){w()(this,e),this._pauseTime=null,this._startTime=null,this._paused=!0,this._pauseLength=0,this._processed=0}return b()(e,[{key:"reset",value:function(){var e=this._paused;this._pauseTime=null,this._startTime=null,this._paused=!0,this._pauseLength=0,this._processed=0,e||this.start()}},{key:"start",value:function(){this._paused&&(null==this._startTime&&(this._startTime=Date.now()),this._pauseTime&&this._updatePauseTime(),delete this._pauseTime,this._paused=!1)}},{key:"pause",value:function(){this._paused||(this._paused=!0,this._pauseTime=Date.now())}},{key:"_updatePauseTime",value:function(){var e=Date.now();this._pauseLength+=e-this._pauseTime,this._pauseTime=e}},{key:"addImagesProcessed",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this._processed+=e}},{key:"processedImages",get:function(){return this._processed}},{key:"elapsed",get:function(){return null==this._startTime?0:(this._pauseTime&&this._updatePauseTime(),Date.now()-this._startTime-this._pauseLength)}}]),e}(),Qe=function(){function e(t){var r=t.source,n=t.modules,i=t.minRestTime,o=t.delay,a=t.powerSave,s=t.maxInputFrameSize,c=t.loadErrorHandler,u=t.runErrorHandler,d=t.busyHandler,p=t.licenseKey;w()(this,e),this._modulesToLoad=new Set,this._addedModules=new Set,this._addedModulesParams={},this._requestedModules=n,this._loadErrorHandler=c,this._runErrorHandler=u,this._busyHandler=d,this._minRestTime=i,this._delay=o,this._powerSave=a,this._maxInputFrameSize=s,this._source=r,this._eventDispatcher=new $.a("CY_CAMERA_"),this._licenseKey=p,this._usageMeter=new Xe}var t,r,n,i;return b()(e,[{key:"_addModule",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e.toUpperCase(),i=V.dependencies(n),o="";return 0===i.length?this._loadErrorHandler(new $e('Module "'.concat(n,'" is not a valid module.'),$e.types.LOAD,{moduleName:n})):i.concat(n).some((function(e){return o=Oe[e.toLowerCase()].errorMsg,!Oe[e.toLowerCase()].supported()}))?this._loadErrorHandler(new $e('Module "'.concat(n,'" is not supported by this environment and will not be added: ').concat(o),$e.types.LOAD,{moduleName:n})):(this._addedModules.add(n),this._addedModulesParams[n]=r,i.forEach((function(e){return t._modulesToLoad.add(e)}))),this}},{key:"_checkIsNotFileURI",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:location.origin,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:alert,r=/^file:\/\//;if(e.match(r)){t("You cannot load this SDK from your local file system. Please, serve this web page using a web server!");var n=new $e("Origin seems to be your local file system. Instead, you have to serve this web page using a web server.",$e.types.LOAD);throw this._loadErrorHandler(n),n}}},{key:"load",value:(i=D()(k.a.mark((function e(){var t,r,n,i,o,a,s,c,u,d,p,f,l,h=this;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this._checkIsNotFileURI(),this._requestedModules.forEach((function(e){var t=e.name,r=e.conf;return h._addModule(t,r)})),t=A()(this._modulesToLoad),r=t.map((function(e){return Ze(e).catch((function(t){h._loadErrorHandler($e.clone(t,$e.types.LOAD,{moduleName:e}))}))})),e.next=6,Promise.all(r);case 6:return n=e.sent,i=this._loadModules(A()(this._modulesToLoad),n),X()||(o=this._checkForLicense()),e.next=11,i;case 11:if(a=e.sent,Ue.setLicenseKey(this._licenseKey),Ue.postInit(),Ue.scheduleUsage(this._usageMeter),X()){e.next=27;break}return e.prev=16,e.next=19,o;case 19:for(s=e.sent,c=0,u=Object.keys(a);c<u.length;c++)d=u[c],s.includes(d)||delete a[d];e.next=27;break;case 23:for(e.prev=23,e.t0=e.catch(16),p=0,f=Object.keys(a);p<f.length;p++)l=f[p],delete a[l];throw e.t0;case 27:return e.abrupt("return",this._returnScheduler(a));case 28:case"end":return e.stop()}}),e,this,[[16,23]])}))),function(){return i.apply(this,arguments)})},{key:"_generateNewLicense",value:function(){var e;return this._licenseKey&&(e={headers:{"X-VendorId":this._licenseKey}}),j.a.put("https://api-mroll.morphcast.com/v1/ai-sdk/licenses",void 0,e)}},{key:"_checkForLicense",value:(n=D()(k.a.mark((function e(){var t,r=this;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this._findBucketUrl().catch((function(){return r._generateNewLicense().catch((function(e){throw e.message.includes("Network Error")?r._loadErrorHandler(new $e("Network error",$e.types.GENERAL)):r._loadErrorHandler(new $e("Error: (E05) - Canâ€™t initialize the SDK",$e.types.GENERAL)),e})).then((function(){return r._findBucketUrl().catch((function(e){throw e.message.includes("Network Error")?r._loadErrorHandler(new $e("Network error",$e.types.GENERAL)):r._loadErrorHandler(new $e("Error: (E02) - Canâ€™t initialize the SDK",$e.types.GENERAL)),e}))}))})).then(function(){var e=D()(k.a.mark((function e(n){var i,o;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=n.data.version,W.parse("1.14.5").lesserEqualThan(W.parse(a))){e.next=4;break}throw i=new $e("Error: (E04) - Canâ€™t initialize the SDK",$e.types.GENERAL,{name:"INVALID_VERSION"}),r._loadErrorHandler(i),i;case 4:if(et(n)){e.next=8;break}throw o=new $e("Error: (E03) - Canâ€™t initialize the SDK",$e.types.GENERAL,{name:"INVALID_KEY"}),r._loadErrorHandler(o),o;case 8:return t=n.modulesFromServer,r._bucketUrl=n.bucketUrl,0===r._requestedModules.length&&t.forEach((function(e){return r._addModule(e)})),e.abrupt("return",A()(r._modulesToLoad).filter((function(e){var n=t.includes(e);return n||r._loadErrorHandler(new $e("Error: (E01) - Canâ€™t initialize the SDK.",$e.types.GENERAL,{moduleName:e,name:"NOT_VALID"})),n})));case 12:case"end":return e.stop()}var a}),e)})));return function(t){return e.apply(this,arguments)}}()));case 1:case"end":return e.stop()}}),e,this)}))),function(){return n.apply(this,arguments)})},{key:"_findBucketUrl",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:location.origin,r=q(t),n=0,i=function(t){var r=e._licenseKey||"",n=I()(t+r),i="".concat("https://ai-sdk-licenses.morphcast.com/"+n);return j.a.get("".concat(i,"/modules.json")).then((function(e){return{domain:t,data:e.data,modulesFromServer:e.data.modules,bucketUrl:"".concat(i,"/")}}))},o=function e(t){return++n>=r.length?Promise.reject(t):i(r[n]).catch(e)};return i(r[n]).catch(o)}},{key:"_loadModules",value:(r=D()(k.a.mark((function e(t,r){var n,i,o=this;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={},i=[],r.forEach((function(e,r){var a=t[r];if(e)try{var s=new e.default({minRestTime:o._minRestTime,name:"CY_"+a,conf:o._addedModulesParams[a]||{},bucketUrl:o._bucketUrl,delay:o._delay});n[a]=s,s.load&&i.push(s.load())}catch(e){o._loadErrorHandler($e.clone(e,$e.types.LOAD,{moduleName:a})),delete n[a]}else o._loadErrorHandler(new $e('Module "'.concat(a,'" does not exist.'),$e.types.LOAD,{moduleName:a}))})),e.abrupt("return",Promise.all(i).then((function(){return n})));case 4:case"end":return e.stop()}}),e)}))),function(e,t){return r.apply(this,arguments)})},{key:"_initModules",value:(t=D()(k.a.mark((function e(t){var r,n,i,o=this;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(i in r=[],n=function(e){var n=t[e];if(n.init){var i=o._source.width,a=o._source.height;r.push(Promise.resolve(n.init({width:i,height:a})).catch((function(r){delete t[e],r.moduleName=e,o._loadErrorHandler($e.clone(r,$e.types.LOAD,e))})))}},t)n(i);return e.abrupt("return",Promise.all(r));case 4:case"end":return e.stop()}}),e)}))),function(e){return t.apply(this,arguments)})},{key:"_returnScheduler",value:function(e){var t=this,r=new J(this._delay,this._minRestTime,this._powerSave),n=!0,i=!1,o=void 0;return{get stopped(){return n},start:function(){if(!n)return o;n=!1,Ue.sendSdkStart(),t._usageMeter.start();return o=Promise.resolve(),t._source.stopped&&(o=Promise.resolve(t._source.start())),o.then((function(){if(!i)return i=!0,Ue.sendStreamStart(),t._initModules(e)})).then((function i(){var o=Date.now();t._source.getFrame(t._maxInputFrameSize).then((function(r){return t._eventDispatcher.dispatch("RESULT",r),V.visitSequentially({result:r,allData:[r],frameTimestamp:Date.now()},t._createModuleVisitor(e),t._runErrorHandler,t._busyHandler)})).then((function(){return t._usageMeter.addImagesProcessed()})).catch((function(){return t._runErrorHandler(new $e("Can't get frame from source",$e.types.RUN))})).then((function(){n||r.scheduleNext(i,o)}))})),o},stop:function(){t._usageMeter.pause(),n=!0,r.stop();for(var i=0,o=Object.values(e);i<o.length;i++){var a=o[i];a.stop&&a.stop()}return t._source.stop()},terminate:function(){for(var t=0,r=Object.values(e);t<r.length;t++){r[t].terminate()}},getModule:function(t){return e[t]}}}},{key:"_createModuleVisitor",value:function(e){var t=this._addedModules;return function(r,n){var i=e[n];return void 0===i?Promise.reject(H.e):i.disabled?Promise.reject(H.b):i.process(r).then((function(e){if(t.has(n)){var i=Object.assign({},e);delete i.private,window.dispatchEvent(new CustomEvent("".concat("CY_"+n,"_RESULT"),{detail:i,bubbles:!1,cancelable:!1}))}return{result:e,allData:r.allData.concat(e),frameTimestamp:r.frameTimestamp}}))}}}]),e}();function Ze(e){return r(59)("./".concat(e.toLowerCase(),".js"))}function et(e){var t=e.data,r=e.domain;if(void 0!==t["License Version"]){var n=Object.assign({},t),i=n["License Key"];return delete n["License Key"],i===Object(N.keccak256)(r+JSON.stringify(n))}return!1}var tt=function(){function e(){w()(this,e),this._canvas=document.createElement("canvas"),this._context=this._canvas.getContext("2d")}return b()(e,[{key:"toImageData",value:function(e){return this._draw(e),this._context.getImageData(0,0,e.width,e.height)}},{key:"toCanvas",value:function(e){return this._draw(e),{canvas:this._canvas,context:this._context}}},{key:"scaleImageData",value:function(e,t){return this._canvas.height=e.height,this._canvas.width=e.width,this._context.putImageData(e,0,0),this._context.drawImage(this._canvas,0,0,t.width,t.height),this._context.getImageData(0,0,t.width,t.height)}},{key:"_draw",value:function(e){this._canvas.height=e.height,this._canvas.width=e.width,this._context.drawImage(e.source,0,0,e.width,e.height)}}]),e}();let rt=!0,nt=!0;function it(e,t,r){const n=e.match(t);return n&&n.length>=r&&parseInt(n[r],10)}function ot(e,t,r){if(!e.RTCPeerConnection)return;const n=e.RTCPeerConnection.prototype,i=n.addEventListener;n.addEventListener=function(e,n){if(e!==t)return i.apply(this,arguments);const o=e=>{const t=r(e);t&&n(t)};return this._eventMap=this._eventMap||{},this._eventMap[n]=o,i.apply(this,[e,o])};const o=n.removeEventListener;n.removeEventListener=function(e,r){if(e!==t||!this._eventMap||!this._eventMap[r])return o.apply(this,arguments);const n=this._eventMap[r];return delete this._eventMap[r],o.apply(this,[e,n])},Object.defineProperty(n,"on"+t,{get(){return this["_on"+t]},set(e){this["_on"+t]&&(this.removeEventListener(t,this["_on"+t]),delete this["_on"+t]),e&&this.addEventListener(t,this["_on"+t]=e)},enumerable:!0,configurable:!0})}function at(e){return"boolean"!=typeof e?new Error("Argument type: "+typeof e+". Please use a boolean."):(rt=e,e?"adapter.js logging disabled":"adapter.js logging enabled")}function st(e){return"boolean"!=typeof e?new Error("Argument type: "+typeof e+". Please use a boolean."):(nt=!e,"adapter.js deprecation warnings "+(e?"disabled":"enabled"))}function ct(){if("object"==typeof window){if(rt)return;"undefined"!=typeof console&&"function"==typeof console.log&&console.log.apply(console,arguments)}}function ut(e,t){nt&&console.warn(e+" is deprecated, please use "+t+" instead.")}function dt(e){const{navigator:t}=e,r={browser:null,version:null};if(void 0===e||!e.navigator)return r.browser="Not a browser.",r;if(t.mozGetUserMedia)r.browser="firefox",r.version=it(t.userAgent,/Firefox\/(\d+)\./,1);else if(t.webkitGetUserMedia||!1===e.isSecureContext&&e.webkitRTCPeerConnection&&!e.RTCIceGatherer)r.browser="chrome",r.version=it(t.userAgent,/Chrom(e|ium)\/(\d+)\./,2);else if(t.mediaDevices&&t.userAgent.match(/Edge\/(\d+).(\d+)$/))r.browser="edge",r.version=it(t.userAgent,/Edge\/(\d+).(\d+)$/,2);else{if(!e.RTCPeerConnection||!t.userAgent.match(/AppleWebKit\/(\d+)\./))return r.browser="Not a supported browser.",r;r.browser="safari",r.version=it(t.userAgent,/AppleWebKit\/(\d+)\./,1),r.supportsUnifiedPlan=e.RTCRtpTransceiver&&"currentDirection"in e.RTCRtpTransceiver.prototype}return r}function pt(e){return"[object Object]"===Object.prototype.toString.call(e)}function ft(e){return pt(e)?Object.keys(e).reduce((function(t,r){const n=pt(e[r]),i=n?ft(e[r]):e[r],o=n&&!Object.keys(i).length;return void 0===i||o?t:Object.assign(t,{[r]:i})}),{}):e}function lt(e,t,r){const n=r?"outbound-rtp":"inbound-rtp",i=new Map;if(null===t)return i;const o=[];return e.forEach(e=>{"track"===e.type&&e.trackIdentifier===t.id&&o.push(e)}),o.forEach(t=>{e.forEach(r=>{r.type===n&&r.trackId===t.id&&function e(t,r,n){r&&!n.has(r.id)&&(n.set(r.id,r),Object.keys(r).forEach(i=>{i.endsWith("Id")?e(t,t.get(r[i]),n):i.endsWith("Ids")&&r[i].forEach(r=>{e(t,t.get(r),n)})}))}(e,r,i)})}),i}const ht=ct;function mt(e){const t=e&&e.navigator;if(!t.mediaDevices)return;const r=dt(e),n=function(e){if("object"!=typeof e||e.mandatory||e.optional)return e;const t={};return Object.keys(e).forEach(r=>{if("require"===r||"advanced"===r||"mediaSource"===r)return;const n="object"==typeof e[r]?e[r]:{ideal:e[r]};void 0!==n.exact&&"number"==typeof n.exact&&(n.min=n.max=n.exact);const i=function(e,t){return e?e+t.charAt(0).toUpperCase()+t.slice(1):"deviceId"===t?"sourceId":t};if(void 0!==n.ideal){t.optional=t.optional||[];let e={};"number"==typeof n.ideal?(e[i("min",r)]=n.ideal,t.optional.push(e),e={},e[i("max",r)]=n.ideal,t.optional.push(e)):(e[i("",r)]=n.ideal,t.optional.push(e))}void 0!==n.exact&&"number"!=typeof n.exact?(t.mandatory=t.mandatory||{},t.mandatory[i("",r)]=n.exact):["min","max"].forEach(e=>{void 0!==n[e]&&(t.mandatory=t.mandatory||{},t.mandatory[i(e,r)]=n[e])})}),e.advanced&&(t.optional=(t.optional||[]).concat(e.advanced)),t},i=function(e,i){if(r.version>=61)return i(e);if((e=JSON.parse(JSON.stringify(e)))&&"object"==typeof e.audio){const t=function(e,t,r){t in e&&!(r in e)&&(e[r]=e[t],delete e[t])};t((e=JSON.parse(JSON.stringify(e))).audio,"autoGainControl","googAutoGainControl"),t(e.audio,"noiseSuppression","googNoiseSuppression"),e.audio=n(e.audio)}if(e&&"object"==typeof e.video){let o=e.video.facingMode;o=o&&("object"==typeof o?o:{ideal:o});const a=r.version<66;if(o&&("user"===o.exact||"environment"===o.exact||"user"===o.ideal||"environment"===o.ideal)&&(!t.mediaDevices.getSupportedConstraints||!t.mediaDevices.getSupportedConstraints().facingMode||a)){let r;if(delete e.video.facingMode,"environment"===o.exact||"environment"===o.ideal?r=["back","rear"]:"user"!==o.exact&&"user"!==o.ideal||(r=["front"]),r)return t.mediaDevices.enumerateDevices().then(t=>{let a=(t=t.filter(e=>"videoinput"===e.kind)).find(e=>r.some(t=>e.label.toLowerCase().includes(t)));return!a&&t.length&&r.includes("back")&&(a=t[t.length-1]),a&&(e.video.deviceId=o.exact?{exact:a.deviceId}:{ideal:a.deviceId}),e.video=n(e.video),ht("chrome: "+JSON.stringify(e)),i(e)})}e.video=n(e.video)}return ht("chrome: "+JSON.stringify(e)),i(e)},o=function(e){return r.version>=64?e:{name:{PermissionDeniedError:"NotAllowedError",PermissionDismissedError:"NotAllowedError",InvalidStateError:"NotAllowedError",DevicesNotFoundError:"NotFoundError",ConstraintNotSatisfiedError:"OverconstrainedError",TrackStartError:"NotReadableError",MediaDeviceFailedDueToShutdown:"NotAllowedError",MediaDeviceKillSwitchOn:"NotAllowedError",TabCaptureError:"AbortError",ScreenCaptureError:"AbortError",DeviceCaptureError:"AbortError"}[e.name]||e.name,message:e.message,constraint:e.constraint||e.constraintName,toString(){return this.name+(this.message&&": ")+this.message}}};if(t.getUserMedia=function(e,r,n){i(e,e=>{t.webkitGetUserMedia(e,r,e=>{n&&n(o(e))})})}.bind(t),t.mediaDevices.getUserMedia){const e=t.mediaDevices.getUserMedia.bind(t.mediaDevices);t.mediaDevices.getUserMedia=function(t){return i(t,t=>e(t).then(e=>{if(t.audio&&!e.getAudioTracks().length||t.video&&!e.getVideoTracks().length)throw e.getTracks().forEach(e=>{e.stop()}),new DOMException("","NotFoundError");return e},e=>Promise.reject(o(e))))}}}function vt(e,t){e.navigator.mediaDevices&&"getDisplayMedia"in e.navigator.mediaDevices||e.navigator.mediaDevices&&("function"==typeof t?e.navigator.mediaDevices.getDisplayMedia=function(r){return t(r).then(t=>{const n=r.video&&r.video.width,i=r.video&&r.video.height,o=r.video&&r.video.frameRate;return r.video={mandatory:{chromeMediaSource:"desktop",chromeMediaSourceId:t,maxFrameRate:o||3}},n&&(r.video.mandatory.maxWidth=n),i&&(r.video.mandatory.maxHeight=i),e.navigator.mediaDevices.getUserMedia(r)})}:console.error("shimGetDisplayMedia: getSourceId argument is not a function"))}function yt(e){e.MediaStream=e.MediaStream||e.webkitMediaStream}function gt(e){if("object"==typeof e&&e.RTCPeerConnection&&!("ontrack"in e.RTCPeerConnection.prototype)){Object.defineProperty(e.RTCPeerConnection.prototype,"ontrack",{get(){return this._ontrack},set(e){this._ontrack&&this.removeEventListener("track",this._ontrack),this.addEventListener("track",this._ontrack=e)},enumerable:!0,configurable:!0});const t=e.RTCPeerConnection.prototype.setRemoteDescription;e.RTCPeerConnection.prototype.setRemoteDescription=function(){return this._ontrackpoly||(this._ontrackpoly=t=>{t.stream.addEventListener("addtrack",r=>{let n;n=e.RTCPeerConnection.prototype.getReceivers?this.getReceivers().find(e=>e.track&&e.track.id===r.track.id):{track:r.track};const i=new Event("track");i.track=r.track,i.receiver=n,i.transceiver={receiver:n},i.streams=[t.stream],this.dispatchEvent(i)}),t.stream.getTracks().forEach(r=>{let n;n=e.RTCPeerConnection.prototype.getReceivers?this.getReceivers().find(e=>e.track&&e.track.id===r.id):{track:r};const i=new Event("track");i.track=r,i.receiver=n,i.transceiver={receiver:n},i.streams=[t.stream],this.dispatchEvent(i)})},this.addEventListener("addstream",this._ontrackpoly)),t.apply(this,arguments)}}else ot(e,"track",e=>(e.transceiver||Object.defineProperty(e,"transceiver",{value:{receiver:e.receiver}}),e))}function Ct(e){if("object"==typeof e&&e.RTCPeerConnection&&!("getSenders"in e.RTCPeerConnection.prototype)&&"createDTMFSender"in e.RTCPeerConnection.prototype){const t=function(e,t){return{track:t,get dtmf(){return void 0===this._dtmf&&("audio"===t.kind?this._dtmf=e.createDTMFSender(t):this._dtmf=null),this._dtmf},_pc:e}};if(!e.RTCPeerConnection.prototype.getSenders){e.RTCPeerConnection.prototype.getSenders=function(){return this._senders=this._senders||[],this._senders.slice()};const r=e.RTCPeerConnection.prototype.addTrack;e.RTCPeerConnection.prototype.addTrack=function(e,n){let i=r.apply(this,arguments);return i||(i=t(this,e),this._senders.push(i)),i};const n=e.RTCPeerConnection.prototype.removeTrack;e.RTCPeerConnection.prototype.removeTrack=function(e){n.apply(this,arguments);const t=this._senders.indexOf(e);-1!==t&&this._senders.splice(t,1)}}const r=e.RTCPeerConnection.prototype.addStream;e.RTCPeerConnection.prototype.addStream=function(e){this._senders=this._senders||[],r.apply(this,[e]),e.getTracks().forEach(e=>{this._senders.push(t(this,e))})};const n=e.RTCPeerConnection.prototype.removeStream;e.RTCPeerConnection.prototype.removeStream=function(e){this._senders=this._senders||[],n.apply(this,[e]),e.getTracks().forEach(e=>{const t=this._senders.find(t=>t.track===e);t&&this._senders.splice(this._senders.indexOf(t),1)})}}else if("object"==typeof e&&e.RTCPeerConnection&&"getSenders"in e.RTCPeerConnection.prototype&&"createDTMFSender"in e.RTCPeerConnection.prototype&&e.RTCRtpSender&&!("dtmf"in e.RTCRtpSender.prototype)){const t=e.RTCPeerConnection.prototype.getSenders;e.RTCPeerConnection.prototype.getSenders=function(){const e=t.apply(this,[]);return e.forEach(e=>e._pc=this),e},Object.defineProperty(e.RTCRtpSender.prototype,"dtmf",{get(){return void 0===this._dtmf&&("audio"===this.track.kind?this._dtmf=this._pc.createDTMFSender(this.track):this._dtmf=null),this._dtmf}})}}function _t(e){if(!e.RTCPeerConnection)return;const t=e.RTCPeerConnection.prototype.getStats;e.RTCPeerConnection.prototype.getStats=function(){const[e,r,n]=arguments;if(arguments.length>0&&"function"==typeof e)return t.apply(this,arguments);if(0===t.length&&(0===arguments.length||"function"!=typeof e))return t.apply(this,[]);const i=function(e){const t={};return e.result().forEach(e=>{const r={id:e.id,timestamp:e.timestamp,type:{localcandidate:"local-candidate",remotecandidate:"remote-candidate"}[e.type]||e.type};e.names().forEach(t=>{r[t]=e.stat(t)}),t[r.id]=r}),t},o=function(e){return new Map(Object.keys(e).map(t=>[t,e[t]]))};if(arguments.length>=2){const n=function(e){r(o(i(e)))};return t.apply(this,[n,e])}return new Promise((e,r)=>{t.apply(this,[function(t){e(o(i(t)))},r])}).then(r,n)}}function St(e){if(!("object"==typeof e&&e.RTCPeerConnection&&e.RTCRtpSender&&e.RTCRtpReceiver))return;if(!("getStats"in e.RTCRtpSender.prototype)){const t=e.RTCPeerConnection.prototype.getSenders;t&&(e.RTCPeerConnection.prototype.getSenders=function(){const e=t.apply(this,[]);return e.forEach(e=>e._pc=this),e});const r=e.RTCPeerConnection.prototype.addTrack;r&&(e.RTCPeerConnection.prototype.addTrack=function(){const e=r.apply(this,arguments);return e._pc=this,e}),e.RTCRtpSender.prototype.getStats=function(){const e=this;return this._pc.getStats().then(t=>lt(t,e.track,!0))}}if(!("getStats"in e.RTCRtpReceiver.prototype)){const t=e.RTCPeerConnection.prototype.getReceivers;t&&(e.RTCPeerConnection.prototype.getReceivers=function(){const e=t.apply(this,[]);return e.forEach(e=>e._pc=this),e}),ot(e,"track",e=>(e.receiver._pc=e.srcElement,e)),e.RTCRtpReceiver.prototype.getStats=function(){const e=this;return this._pc.getStats().then(t=>lt(t,e.track,!1))}}if(!("getStats"in e.RTCRtpSender.prototype)||!("getStats"in e.RTCRtpReceiver.prototype))return;const t=e.RTCPeerConnection.prototype.getStats;e.RTCPeerConnection.prototype.getStats=function(){if(arguments.length>0&&arguments[0]instanceof e.MediaStreamTrack){const e=arguments[0];let t,r,n;return this.getSenders().forEach(r=>{r.track===e&&(t?n=!0:t=r)}),this.getReceivers().forEach(t=>(t.track===e&&(r?n=!0:r=t),t.track===e)),n||t&&r?Promise.reject(new DOMException("There are more than one sender or receiver for the track.","InvalidAccessError")):t?t.getStats():r?r.getStats():Promise.reject(new DOMException("There is no sender or receiver for the track.","InvalidAccessError"))}return t.apply(this,arguments)}}function Tt(e){e.RTCPeerConnection.prototype.getLocalStreams=function(){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},Object.keys(this._shimmedLocalStreams).map(e=>this._shimmedLocalStreams[e][0])};const t=e.RTCPeerConnection.prototype.addTrack;e.RTCPeerConnection.prototype.addTrack=function(e,r){if(!r)return t.apply(this,arguments);this._shimmedLocalStreams=this._shimmedLocalStreams||{};const n=t.apply(this,arguments);return this._shimmedLocalStreams[r.id]?-1===this._shimmedLocalStreams[r.id].indexOf(n)&&this._shimmedLocalStreams[r.id].push(n):this._shimmedLocalStreams[r.id]=[r,n],n};const r=e.RTCPeerConnection.prototype.addStream;e.RTCPeerConnection.prototype.addStream=function(e){this._shimmedLocalStreams=this._shimmedLocalStreams||{},e.getTracks().forEach(e=>{if(this.getSenders().find(t=>t.track===e))throw new DOMException("Track already exists.","InvalidAccessError")});const t=this.getSenders();r.apply(this,arguments);const n=this.getSenders().filter(e=>-1===t.indexOf(e));this._shimmedLocalStreams[e.id]=[e].concat(n)};const n=e.RTCPeerConnection.prototype.removeStream;e.RTCPeerConnection.prototype.removeStream=function(e){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},delete this._shimmedLocalStreams[e.id],n.apply(this,arguments)};const i=e.RTCPeerConnection.prototype.removeTrack;e.RTCPeerConnection.prototype.removeTrack=function(e){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},e&&Object.keys(this._shimmedLocalStreams).forEach(t=>{const r=this._shimmedLocalStreams[t].indexOf(e);-1!==r&&this._shimmedLocalStreams[t].splice(r,1),1===this._shimmedLocalStreams[t].length&&delete this._shimmedLocalStreams[t]}),i.apply(this,arguments)}}function Et(e){if(!e.RTCPeerConnection)return;const t=dt(e);if(e.RTCPeerConnection.prototype.addTrack&&t.version>=65)return Tt(e);const r=e.RTCPeerConnection.prototype.getLocalStreams;e.RTCPeerConnection.prototype.getLocalStreams=function(){const e=r.apply(this);return this._reverseStreams=this._reverseStreams||{},e.map(e=>this._reverseStreams[e.id])};const n=e.RTCPeerConnection.prototype.addStream;e.RTCPeerConnection.prototype.addStream=function(t){if(this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},t.getTracks().forEach(e=>{if(this.getSenders().find(t=>t.track===e))throw new DOMException("Track already exists.","InvalidAccessError")}),!this._reverseStreams[t.id]){const r=new e.MediaStream(t.getTracks());this._streams[t.id]=r,this._reverseStreams[r.id]=t,t=r}n.apply(this,[t])};const i=e.RTCPeerConnection.prototype.removeStream;function o(e,t){let r=t.sdp;return Object.keys(e._reverseStreams||[]).forEach(t=>{const n=e._reverseStreams[t],i=e._streams[n.id];r=r.replace(new RegExp(i.id,"g"),n.id)}),new RTCSessionDescription({type:t.type,sdp:r})}function a(e,t){let r=t.sdp;return Object.keys(e._reverseStreams||[]).forEach(t=>{const n=e._reverseStreams[t],i=e._streams[n.id];r=r.replace(new RegExp(n.id,"g"),i.id)}),new RTCSessionDescription({type:t.type,sdp:r})}e.RTCPeerConnection.prototype.removeStream=function(e){this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},i.apply(this,[this._streams[e.id]||e]),delete this._reverseStreams[this._streams[e.id]?this._streams[e.id].id:e.id],delete this._streams[e.id]},e.RTCPeerConnection.prototype.addTrack=function(t,r){if("closed"===this.signalingState)throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");const n=[].slice.call(arguments,1);if(1!==n.length||!n[0].getTracks().find(e=>e===t))throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.","NotSupportedError");const i=this.getSenders().find(e=>e.track===t);if(i)throw new DOMException("Track already exists.","InvalidAccessError");this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{};const o=this._streams[r.id];if(o)o.addTrack(t),Promise.resolve().then(()=>{this.dispatchEvent(new Event("negotiationneeded"))});else{const n=new e.MediaStream([t]);this._streams[r.id]=n,this._reverseStreams[n.id]=r,this.addStream(n)}return this.getSenders().find(e=>e.track===t)},["createOffer","createAnswer"].forEach((function(t){const r=e.RTCPeerConnection.prototype[t],n={[t](){const e=arguments;return arguments.length&&"function"==typeof arguments[0]?r.apply(this,[t=>{const r=o(this,t);e[0].apply(null,[r])},t=>{e[1]&&e[1].apply(null,t)},arguments[2]]):r.apply(this,arguments).then(e=>o(this,e))}};e.RTCPeerConnection.prototype[t]=n[t]}));const s=e.RTCPeerConnection.prototype.setLocalDescription;e.RTCPeerConnection.prototype.setLocalDescription=function(){return arguments.length&&arguments[0].type?(arguments[0]=a(this,arguments[0]),s.apply(this,arguments)):s.apply(this,arguments)};const c=Object.getOwnPropertyDescriptor(e.RTCPeerConnection.prototype,"localDescription");Object.defineProperty(e.RTCPeerConnection.prototype,"localDescription",{get(){const e=c.get.apply(this);return""===e.type?e:o(this,e)}}),e.RTCPeerConnection.prototype.removeTrack=function(e){if("closed"===this.signalingState)throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");if(!e._pc)throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.","TypeError");if(!(e._pc===this))throw new DOMException("Sender was not created by this connection.","InvalidAccessError");let t;this._streams=this._streams||{},Object.keys(this._streams).forEach(r=>{this._streams[r].getTracks().find(t=>e.track===t)&&(t=this._streams[r])}),t&&(1===t.getTracks().length?this.removeStream(this._reverseStreams[t.id]):t.removeTrack(e.track),this.dispatchEvent(new Event("negotiationneeded")))}}function wt(e){const t=dt(e);if(!e.RTCPeerConnection&&e.webkitRTCPeerConnection&&(e.RTCPeerConnection=e.webkitRTCPeerConnection),!e.RTCPeerConnection)return;const r=0===e.RTCPeerConnection.prototype.addIceCandidate.length;t.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach((function(t){const r=e.RTCPeerConnection.prototype[t],n={[t](){return arguments[0]=new("addIceCandidate"===t?e.RTCIceCandidate:e.RTCSessionDescription)(arguments[0]),r.apply(this,arguments)}};e.RTCPeerConnection.prototype[t]=n[t]}));const n=e.RTCPeerConnection.prototype.addIceCandidate;e.RTCPeerConnection.prototype.addIceCandidate=function(){return r||arguments[0]?t.version<78&&arguments[0]&&""===arguments[0].candidate?Promise.resolve():n.apply(this,arguments):(arguments[1]&&arguments[1].apply(null),Promise.resolve())}}function Rt(e){ot(e,"negotiationneeded",e=>{if("stable"===e.target.signalingState)return e})}var bt=r(29),Pt=r.n(bt);function kt(e){const t=e&&e.navigator,r=t.mediaDevices.getUserMedia.bind(t.mediaDevices);t.mediaDevices.getUserMedia=function(e){return r(e).catch(e=>Promise.reject(function(e){return{name:{PermissionDeniedError:"NotAllowedError"}[e.name]||e.name,message:e.message,constraint:e.constraint,toString(){return this.name}}}(e)))}}function xt(e){"getDisplayMedia"in e.navigator&&e.navigator.mediaDevices&&(e.navigator.mediaDevices&&"getDisplayMedia"in e.navigator.mediaDevices||(e.navigator.mediaDevices.getDisplayMedia=e.navigator.getDisplayMedia.bind(e.navigator)))}function At(e){const t=dt(e);if(e.RTCIceGatherer&&(e.RTCIceCandidate||(e.RTCIceCandidate=function(e){return e}),e.RTCSessionDescription||(e.RTCSessionDescription=function(e){return e}),t.version<15025)){const t=Object.getOwnPropertyDescriptor(e.MediaStreamTrack.prototype,"enabled");Object.defineProperty(e.MediaStreamTrack.prototype,"enabled",{set(e){t.set.call(this,e);const r=new Event("enabled");r.enabled=e,this.dispatchEvent(r)}})}e.RTCRtpSender&&!("dtmf"in e.RTCRtpSender.prototype)&&Object.defineProperty(e.RTCRtpSender.prototype,"dtmf",{get(){return void 0===this._dtmf&&("audio"===this.track.kind?this._dtmf=new e.RTCDtmfSender(this):"video"===this.track.kind&&(this._dtmf=null)),this._dtmf}}),e.RTCDtmfSender&&!e.RTCDTMFSender&&(e.RTCDTMFSender=e.RTCDtmfSender);const r=Pt()(e,t.version);e.RTCPeerConnection=function(e){return e&&e.iceServers&&(e.iceServers=function(e,t){let r=!1;return(e=JSON.parse(JSON.stringify(e))).filter(e=>{if(e&&(e.urls||e.url)){var t=e.urls||e.url;e.url&&!e.urls&&ut("RTCIceServer.url","RTCIceServer.urls");const n="string"==typeof t;return n&&(t=[t]),t=t.filter(e=>{if(0===e.indexOf("stun:"))return!1;const t=e.startsWith("turn")&&!e.startsWith("turn:[")&&e.includes("transport=udp");return t&&!r?(r=!0,!0):t&&!r}),delete e.url,e.urls=n?t[0]:t,!!t.length}})}(e.iceServers,t.version),ct("ICE servers after filtering:",e.iceServers)),new r(e)},e.RTCPeerConnection.prototype=r.prototype}function Ot(e){e.RTCRtpSender&&!("replaceTrack"in e.RTCRtpSender.prototype)&&(e.RTCRtpSender.prototype.replaceTrack=e.RTCRtpSender.prototype.setTrack)}function Dt(e){const t=dt(e),r=e&&e.navigator,n=e&&e.MediaStreamTrack;if(r.getUserMedia=function(e,t,n){ut("navigator.getUserMedia","navigator.mediaDevices.getUserMedia"),r.mediaDevices.getUserMedia(e).then(t,n)},!(t.version>55&&"autoGainControl"in r.mediaDevices.getSupportedConstraints())){const e=function(e,t,r){t in e&&!(r in e)&&(e[r]=e[t],delete e[t])},t=r.mediaDevices.getUserMedia.bind(r.mediaDevices);if(r.mediaDevices.getUserMedia=function(r){return"object"==typeof r&&"object"==typeof r.audio&&(r=JSON.parse(JSON.stringify(r)),e(r.audio,"autoGainControl","mozAutoGainControl"),e(r.audio,"noiseSuppression","mozNoiseSuppression")),t(r)},n&&n.prototype.getSettings){const t=n.prototype.getSettings;n.prototype.getSettings=function(){const r=t.apply(this,arguments);return e(r,"mozAutoGainControl","autoGainControl"),e(r,"mozNoiseSuppression","noiseSuppression"),r}}if(n&&n.prototype.applyConstraints){const t=n.prototype.applyConstraints;n.prototype.applyConstraints=function(r){return"audio"===this.kind&&"object"==typeof r&&(r=JSON.parse(JSON.stringify(r)),e(r,"autoGainControl","mozAutoGainControl"),e(r,"noiseSuppression","mozNoiseSuppression")),t.apply(this,[r])}}}}function Mt(e,t){e.navigator.mediaDevices&&"getDisplayMedia"in e.navigator.mediaDevices||e.navigator.mediaDevices&&(e.navigator.mediaDevices.getDisplayMedia=function(r){if(!r||!r.video){const e=new DOMException("getDisplayMedia without video constraints is undefined");return e.name="NotFoundError",e.code=8,Promise.reject(e)}return!0===r.video?r.video={mediaSource:t}:r.video.mediaSource=t,e.navigator.mediaDevices.getUserMedia(r)})}function It(e){"object"==typeof e&&e.RTCTrackEvent&&"receiver"in e.RTCTrackEvent.prototype&&!("transceiver"in e.RTCTrackEvent.prototype)&&Object.defineProperty(e.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function Lt(e){const t=dt(e);if("object"!=typeof e||!e.RTCPeerConnection&&!e.mozRTCPeerConnection)return;if(!e.RTCPeerConnection&&e.mozRTCPeerConnection&&(e.RTCPeerConnection=e.mozRTCPeerConnection),t.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach((function(t){const r=e.RTCPeerConnection.prototype[t],n={[t](){return arguments[0]=new("addIceCandidate"===t?e.RTCIceCandidate:e.RTCSessionDescription)(arguments[0]),r.apply(this,arguments)}};e.RTCPeerConnection.prototype[t]=n[t]})),t.version<68){const t=e.RTCPeerConnection.prototype.addIceCandidate;e.RTCPeerConnection.prototype.addIceCandidate=function(){return arguments[0]?arguments[0]&&""===arguments[0].candidate?Promise.resolve():t.apply(this,arguments):(arguments[1]&&arguments[1].apply(null),Promise.resolve())}}const r={inboundrtp:"inbound-rtp",outboundrtp:"outbound-rtp",candidatepair:"candidate-pair",localcandidate:"local-candidate",remotecandidate:"remote-candidate"},n=e.RTCPeerConnection.prototype.getStats;e.RTCPeerConnection.prototype.getStats=function(){const[e,i,o]=arguments;return n.apply(this,[e||null]).then(e=>{if(t.version<53&&!i)try{e.forEach(e=>{e.type=r[e.type]||e.type})}catch(t){if("TypeError"!==t.name)throw t;e.forEach((t,n)=>{e.set(n,Object.assign({},t,{type:r[t.type]||t.type}))})}return e}).then(i,o)}}function jt(e){if("object"!=typeof e||!e.RTCPeerConnection||!e.RTCRtpSender)return;if(e.RTCRtpSender&&"getStats"in e.RTCRtpSender.prototype)return;const t=e.RTCPeerConnection.prototype.getSenders;t&&(e.RTCPeerConnection.prototype.getSenders=function(){const e=t.apply(this,[]);return e.forEach(e=>e._pc=this),e});const r=e.RTCPeerConnection.prototype.addTrack;r&&(e.RTCPeerConnection.prototype.addTrack=function(){const e=r.apply(this,arguments);return e._pc=this,e}),e.RTCRtpSender.prototype.getStats=function(){return this.track?this._pc.getStats(this.track):Promise.resolve(new Map)}}function Nt(e){if("object"!=typeof e||!e.RTCPeerConnection||!e.RTCRtpSender)return;if(e.RTCRtpSender&&"getStats"in e.RTCRtpReceiver.prototype)return;const t=e.RTCPeerConnection.prototype.getReceivers;t&&(e.RTCPeerConnection.prototype.getReceivers=function(){const e=t.apply(this,[]);return e.forEach(e=>e._pc=this),e}),ot(e,"track",e=>(e.receiver._pc=e.srcElement,e)),e.RTCRtpReceiver.prototype.getStats=function(){return this._pc.getStats(this.track)}}function Ft(e){e.RTCPeerConnection&&!("removeStream"in e.RTCPeerConnection.prototype)&&(e.RTCPeerConnection.prototype.removeStream=function(e){ut("removeStream","removeTrack"),this.getSenders().forEach(t=>{t.track&&e.getTracks().includes(t.track)&&this.removeTrack(t)})})}function Ut(e){e.DataChannel&&!e.RTCDataChannel&&(e.RTCDataChannel=e.DataChannel)}function Gt(e){if("object"!=typeof e||!e.RTCPeerConnection)return;const t=e.RTCPeerConnection.prototype.addTransceiver;t&&(e.RTCPeerConnection.prototype.addTransceiver=function(){this.setParametersPromises=[];const e=arguments[1],r=e&&"sendEncodings"in e;r&&e.sendEncodings.forEach(e=>{if("rid"in e){if(!/^[a-z0-9]{0,16}$/i.test(e.rid))throw new TypeError("Invalid RID value provided.")}if("scaleResolutionDownBy"in e&&!(parseFloat(e.scaleResolutionDownBy)>=1))throw new RangeError("scale_resolution_down_by must be >= 1.0");if("maxFramerate"in e&&!(parseFloat(e.maxFramerate)>=0))throw new RangeError("max_framerate must be >= 0.0")});const n=t.apply(this,arguments);if(r){const{sender:t}=n,r=t.getParameters();"encodings"in r||(r.encodings=e.sendEncodings,this.setParametersPromises.push(t.setParameters(r).catch(()=>{})))}return n})}function Bt(e){if("object"!=typeof e||!e.RTCPeerConnection)return;const t=e.RTCPeerConnection.prototype.createOffer;e.RTCPeerConnection.prototype.createOffer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}function Ht(e){if("object"!=typeof e||!e.RTCPeerConnection)return;const t=e.RTCPeerConnection.prototype.createAnswer;e.RTCPeerConnection.prototype.createAnswer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}function zt(e){if("object"==typeof e&&e.RTCPeerConnection){if("getLocalStreams"in e.RTCPeerConnection.prototype||(e.RTCPeerConnection.prototype.getLocalStreams=function(){return this._localStreams||(this._localStreams=[]),this._localStreams}),!("addStream"in e.RTCPeerConnection.prototype)){const t=e.RTCPeerConnection.prototype.addTrack;e.RTCPeerConnection.prototype.addStream=function(e){this._localStreams||(this._localStreams=[]),this._localStreams.includes(e)||this._localStreams.push(e),e.getAudioTracks().forEach(r=>t.call(this,r,e)),e.getVideoTracks().forEach(r=>t.call(this,r,e))},e.RTCPeerConnection.prototype.addTrack=function(e,...r){return r&&r.forEach(e=>{this._localStreams?this._localStreams.includes(e)||this._localStreams.push(e):this._localStreams=[e]}),t.apply(this,arguments)}}"removeStream"in e.RTCPeerConnection.prototype||(e.RTCPeerConnection.prototype.removeStream=function(e){this._localStreams||(this._localStreams=[]);const t=this._localStreams.indexOf(e);if(-1===t)return;this._localStreams.splice(t,1);const r=e.getTracks();this.getSenders().forEach(e=>{r.includes(e.track)&&this.removeTrack(e)})})}}function Vt(e){if("object"==typeof e&&e.RTCPeerConnection&&("getRemoteStreams"in e.RTCPeerConnection.prototype||(e.RTCPeerConnection.prototype.getRemoteStreams=function(){return this._remoteStreams?this._remoteStreams:[]}),!("onaddstream"in e.RTCPeerConnection.prototype))){Object.defineProperty(e.RTCPeerConnection.prototype,"onaddstream",{get(){return this._onaddstream},set(e){this._onaddstream&&(this.removeEventListener("addstream",this._onaddstream),this.removeEventListener("track",this._onaddstreampoly)),this.addEventListener("addstream",this._onaddstream=e),this.addEventListener("track",this._onaddstreampoly=e=>{e.streams.forEach(e=>{if(this._remoteStreams||(this._remoteStreams=[]),this._remoteStreams.includes(e))return;this._remoteStreams.push(e);const t=new Event("addstream");t.stream=e,this.dispatchEvent(t)})})}});const t=e.RTCPeerConnection.prototype.setRemoteDescription;e.RTCPeerConnection.prototype.setRemoteDescription=function(){const e=this;return this._onaddstreampoly||this.addEventListener("track",this._onaddstreampoly=function(t){t.streams.forEach(t=>{if(e._remoteStreams||(e._remoteStreams=[]),e._remoteStreams.indexOf(t)>=0)return;e._remoteStreams.push(t);const r=new Event("addstream");r.stream=t,e.dispatchEvent(r)})}),t.apply(e,arguments)}}}function Jt(e){if("object"!=typeof e||!e.RTCPeerConnection)return;const t=e.RTCPeerConnection.prototype,r=t.createOffer,n=t.createAnswer,i=t.setLocalDescription,o=t.setRemoteDescription,a=t.addIceCandidate;t.createOffer=function(e,t){const n=arguments.length>=2?arguments[2]:arguments[0],i=r.apply(this,[n]);return t?(i.then(e,t),Promise.resolve()):i},t.createAnswer=function(e,t){const r=arguments.length>=2?arguments[2]:arguments[0],i=n.apply(this,[r]);return t?(i.then(e,t),Promise.resolve()):i};let s=function(e,t,r){const n=i.apply(this,[e]);return r?(n.then(t,r),Promise.resolve()):n};t.setLocalDescription=s,s=function(e,t,r){const n=o.apply(this,[e]);return r?(n.then(t,r),Promise.resolve()):n},t.setRemoteDescription=s,s=function(e,t,r){const n=a.apply(this,[e]);return r?(n.then(t,r),Promise.resolve()):n},t.addIceCandidate=s}function Yt(e){const t=e&&e.navigator;if(t.mediaDevices&&t.mediaDevices.getUserMedia){const e=t.mediaDevices,r=e.getUserMedia.bind(e);t.mediaDevices.getUserMedia=e=>r(Kt(e))}!t.getUserMedia&&t.mediaDevices&&t.mediaDevices.getUserMedia&&(t.getUserMedia=function(e,r,n){t.mediaDevices.getUserMedia(e).then(r,n)}.bind(t))}function Kt(e){return e&&void 0!==e.video?Object.assign({},e,{video:ft(e.video)}):e}function qt(e){const t=e.RTCPeerConnection;e.RTCPeerConnection=function(e,r){if(e&&e.iceServers){const t=[];for(let r=0;r<e.iceServers.length;r++){let n=e.iceServers[r];!n.hasOwnProperty("urls")&&n.hasOwnProperty("url")?(ut("RTCIceServer.url","RTCIceServer.urls"),n=JSON.parse(JSON.stringify(n)),n.urls=n.url,delete n.url,t.push(n)):t.push(e.iceServers[r])}e.iceServers=t}return new t(e,r)},e.RTCPeerConnection.prototype=t.prototype,"generateCertificate"in e.RTCPeerConnection&&Object.defineProperty(e.RTCPeerConnection,"generateCertificate",{get:()=>t.generateCertificate})}function Wt(e){"object"==typeof e&&e.RTCTrackEvent&&"receiver"in e.RTCTrackEvent.prototype&&!("transceiver"in e.RTCTrackEvent.prototype)&&Object.defineProperty(e.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function $t(e){const t=e.RTCPeerConnection.prototype.createOffer;e.RTCPeerConnection.prototype.createOffer=function(e){if(e){void 0!==e.offerToReceiveAudio&&(e.offerToReceiveAudio=!!e.offerToReceiveAudio);const t=this.getTransceivers().find(e=>"audio"===e.receiver.track.kind);!1===e.offerToReceiveAudio&&t?"sendrecv"===t.direction?t.setDirection?t.setDirection("sendonly"):t.direction="sendonly":"recvonly"===t.direction&&(t.setDirection?t.setDirection("inactive"):t.direction="inactive"):!0!==e.offerToReceiveAudio||t||this.addTransceiver("audio"),void 0!==e.offerToReceiveVideo&&(e.offerToReceiveVideo=!!e.offerToReceiveVideo);const r=this.getTransceivers().find(e=>"video"===e.receiver.track.kind);!1===e.offerToReceiveVideo&&r?"sendrecv"===r.direction?r.setDirection?r.setDirection("sendonly"):r.direction="sendonly":"recvonly"===r.direction&&(r.setDirection?r.setDirection("inactive"):r.direction="inactive"):!0!==e.offerToReceiveVideo||r||this.addTransceiver("video")}return t.apply(this,arguments)}}function Xt(e){"object"!=typeof e||e.AudioContext||(e.AudioContext=e.webkitAudioContext)}var Qt=r(6),Zt=r.n(Qt);function er(e){if(!e.RTCIceCandidate||e.RTCIceCandidate&&"foundation"in e.RTCIceCandidate.prototype)return;const t=e.RTCIceCandidate;e.RTCIceCandidate=function(e){if("object"==typeof e&&e.candidate&&0===e.candidate.indexOf("a=")&&((e=JSON.parse(JSON.stringify(e))).candidate=e.candidate.substr(2)),e.candidate&&e.candidate.length){const r=new t(e),n=Zt.a.parseCandidate(e.candidate),i=Object.assign(r,n);return i.toJSON=function(){return{candidate:i.candidate,sdpMid:i.sdpMid,sdpMLineIndex:i.sdpMLineIndex,usernameFragment:i.usernameFragment}},i}return new t(e)},e.RTCIceCandidate.prototype=t.prototype,ot(e,"icecandidate",t=>(t.candidate&&Object.defineProperty(t,"candidate",{value:new e.RTCIceCandidate(t.candidate),writable:"false"}),t))}function tr(e){if(!e.RTCPeerConnection)return;const t=dt(e);"sctp"in e.RTCPeerConnection.prototype||Object.defineProperty(e.RTCPeerConnection.prototype,"sctp",{get(){return void 0===this._sctp?null:this._sctp}});const r=function(e){if(!e||!e.sdp)return!1;const t=Zt.a.splitSections(e.sdp);return t.shift(),t.some(e=>{const t=Zt.a.parseMLine(e);return t&&"application"===t.kind&&-1!==t.protocol.indexOf("SCTP")})},n=function(e){const t=e.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);if(null===t||t.length<2)return-1;const r=parseInt(t[1],10);return r!=r?-1:r},i=function(e){let r=65536;return"firefox"===t.browser&&(r=t.version<57?-1===e?16384:2147483637:t.version<60?57===t.version?65535:65536:2147483637),r},o=function(e,r){let n=65536;"firefox"===t.browser&&57===t.version&&(n=65535);const i=Zt.a.matchPrefix(e.sdp,"a=max-message-size:");return i.length>0?n=parseInt(i[0].substr(19),10):"firefox"===t.browser&&-1!==r&&(n=2147483637),n},a=e.RTCPeerConnection.prototype.setRemoteDescription;e.RTCPeerConnection.prototype.setRemoteDescription=function(){if(this._sctp=null,"chrome"===t.browser&&t.version>=76){const{sdpSemantics:e}=this.getConfiguration();"plan-b"===e&&Object.defineProperty(this,"sctp",{get(){return void 0===this._sctp?null:this._sctp},enumerable:!0,configurable:!0})}if(r(arguments[0])){const e=n(arguments[0]),t=i(e),r=o(arguments[0],e);let a;a=0===t&&0===r?Number.POSITIVE_INFINITY:0===t||0===r?Math.max(t,r):Math.min(t,r);const s={};Object.defineProperty(s,"maxMessageSize",{get:()=>a}),this._sctp=s}return a.apply(this,arguments)}}function rr(e){if(!e.RTCPeerConnection||!("createDataChannel"in e.RTCPeerConnection.prototype))return;function t(e,t){const r=e.send;e.send=function(){const n=arguments[0],i=n.length||n.size||n.byteLength;if("open"===e.readyState&&t.sctp&&i>t.sctp.maxMessageSize)throw new TypeError("Message too large (can send a maximum of "+t.sctp.maxMessageSize+" bytes)");return r.apply(e,arguments)}}const r=e.RTCPeerConnection.prototype.createDataChannel;e.RTCPeerConnection.prototype.createDataChannel=function(){const e=r.apply(this,arguments);return t(e,this),e},ot(e,"datachannel",e=>(t(e.channel,e.target),e))}function nr(e){if(!e.RTCPeerConnection||"connectionState"in e.RTCPeerConnection.prototype)return;const t=e.RTCPeerConnection.prototype;Object.defineProperty(t,"connectionState",{get(){return{completed:"connected",checking:"connecting"}[this.iceConnectionState]||this.iceConnectionState},enumerable:!0,configurable:!0}),Object.defineProperty(t,"onconnectionstatechange",{get(){return this._onconnectionstatechange||null},set(e){this._onconnectionstatechange&&(this.removeEventListener("connectionstatechange",this._onconnectionstatechange),delete this._onconnectionstatechange),e&&this.addEventListener("connectionstatechange",this._onconnectionstatechange=e)},enumerable:!0,configurable:!0}),["setLocalDescription","setRemoteDescription"].forEach(e=>{const r=t[e];t[e]=function(){return this._connectionstatechangepoly||(this._connectionstatechangepoly=e=>{const t=e.target;if(t._lastConnectionState!==t.connectionState){t._lastConnectionState=t.connectionState;const r=new Event("connectionstatechange",e);t.dispatchEvent(r)}return e},this.addEventListener("iceconnectionstatechange",this._connectionstatechangepoly)),r.apply(this,arguments)}})}function ir(e){if(!e.RTCPeerConnection)return;const t=dt(e);if("chrome"===t.browser&&t.version>=71)return;const r=e.RTCPeerConnection.prototype.setRemoteDescription;e.RTCPeerConnection.prototype.setRemoteDescription=function(e){return e&&e.sdp&&-1!==e.sdp.indexOf("\na=extmap-allow-mixed")&&(e.sdp=e.sdp.split("\n").filter(e=>"a=extmap-allow-mixed"!==e.trim()).join("\n")),r.apply(this,arguments)}}!function({window:e}={},t={shimChrome:!0,shimFirefox:!0,shimEdge:!0,shimSafari:!0}){const r=ct,n=dt(e),i={browserDetails:n,commonShim:T,extractVersion:it,disableLog:at,disableWarnings:st};switch(n.browser){case"chrome":if(!g||!wt||!t.shimChrome)return r("Chrome shim is not included in this adapter release."),i;if(null===n.version)return r("Chrome shim can not determine version, not shimming."),i;r("adapter.js shimming chrome."),i.browserShim=g,mt(e),yt(e),wt(e),gt(e),Et(e),Ct(e),_t(e),St(e),Rt(e),er(e),nr(e),tr(e),rr(e),ir(e);break;case"firefox":if(!_||!Lt||!t.shimFirefox)return r("Firefox shim is not included in this adapter release."),i;r("adapter.js shimming firefox."),i.browserShim=_,Dt(e),Lt(e),It(e),Ft(e),jt(e),Nt(e),Ut(e),Gt(e),Bt(e),Ht(e),er(e),nr(e),tr(e),rr(e);break;case"edge":if(!C||!At||!t.shimEdge)return r("MS edge shim is not included in this adapter release."),i;r("adapter.js shimming edge."),i.browserShim=C,kt(e),xt(e),At(e),Ot(e),tr(e),rr(e);break;case"safari":if(!S||!t.shimSafari)return r("Safari shim is not included in this adapter release."),i;r("adapter.js shimming safari."),i.browserShim=S,qt(e),$t(e),Jt(e),zt(e),Vt(e),Wt(e),Yt(e),Xt(e),er(e),tr(e),rr(e),ir(e);break;default:r("Unsupported browser!")}}({window:window});var or=r(25),ar=function(){function e(){w()(this,e)}return b()(e,null,[{key:"create",value:function(e){var t,r,n,i,o=e.width,a=e.height,s=e.flip,c=document.createElement("canvas"),u=c.getContext("2d"),d=Math.floor(s)%4,p=Math.max(o,a),f=p-Math.min(o,a);return c.width=p,c.height=p,u.translate(p/2,p/2),u.rotate(d*Math.PI/2),u.translate(-p/2,-p/2),0===d?(t=0,r=0,n=o,i=a):-1===d||3===d?(t=0,r=0,n=a,i=o):-2===d||2===d?(t=0,r=f,n=o,i=a):1!==d&&-3!==d||(t=f,r=0,n=a,i=o),{rotate:function(e){return u.drawImage(function(e){return sr.width=e.width,sr.height=e.height,cr.putImageData(e,0,0),sr}(e),0,0),u.getImageData(t,r,n,i)}}}}]),e}(),sr=document.createElement("canvas"),cr=sr.getContext("2d");var ur=function(){function e(){w()(this,e)}return b()(e,null,[{key:"supported",value:function(){return dr.isCameraSupported()}},{key:"createCamera",value:function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t.constraints,n=t.video,i=t.flip;if(!dr.isCameraSupported()){null!=window.MphTools&&window.MphTools.Compatibility.check();var o=new Error("GetUserMedia not supported");throw o.name="CAMERA.NOT_SUPPORTED",o}return n?e=n:((e=document.createElement("video")).setAttribute("muted",""),e.setAttribute("playsinline",""),e.style.position="absolute",e.style.width="0",e.style.height="0",document.body.appendChild(e)),new pr(new dr(e,r||{audio:!1,video:!0}),{flip:i})}}]),e}(),dr=function(){function e(t,r){w()(this,e),this._video=t,this._constraints=r}return b()(e,[{key:"requestCameraAccess",value:function(){var e=this;return navigator.mediaDevices.getUserMedia(this._constraints).then((function(t){return e._stream=t,new Promise((function(r,n){var i=e._video;i.onloadedmetadata=function(){i.play()},i.onloadeddata=function(){if(null===e._stream){var t=new Error("The camera.start() request was interrupted by a call to stop()");t.name="CAMERA.INTERRUPTED_BY_STOP",n(t)}else r(i)},i.onerror=n,i.srcObject=t}))}))}},{key:"stopCamera",value:function(){this._stream&&this._stream.getTracks().forEach((function(e){e.stop()})),this._stream=null}},{key:"stream",get:function(){return this._stream}}],[{key:"isCameraSupported",value:function(){return null!=window.MphTools?window.MphTools.Compatibility.check(!0)===window.MphTools.Compatibility.status.COMPATIBLE:void 0!==navigator.mediaDevices&&void 0!==navigator.mediaDevices.getUserMedia}}]),e}(),pr=function(){function e(t,r){var n=r.flip,i=void 0===n?0:n;w()(this,e),this._cameraStream=t,this._video=null,this._imageDataHelper=new tt,this._flip=i,this._roationHelper=null,this._firstStart=!0}return b()(e,[{key:"start",value:function(){var e=this;return this.stopped?(null!=window.MphTools&&window.MphTools.CameraPrivacyPopup.show(),this._cameraStream.requestCameraAccess().then((function(t){null!=window.MphTools&&window.MphTools.CameraPrivacyPopup.hide(),e._video=t,0!==Math.floor(e.flip)%4*Math.PI/2&&null===e._roationHelper&&(e._roationHelper=ar.create({width:e.width,height:e.height,flip:e.flip}))})).then((function(t){return e._firstStart&&Ue.sendCameraOk(),e._firstStart=!1,t})).catch((function(t){if(null!=window.MphTools&&window.MphTools.CameraPrivacyPopup.hide(),e._firstStart)switch(t.name){case"PermissionDismissedError":case"NotAllowedError":Ue.sendCameraDenied(),null!=window.MphTools&&window.MphTools.CameraPrivacyPopup.deny();break;default:Ue.sendCameraError(t.name)}throw e._firstStart=!1,t}))):Promise.resolve()}},{key:"stop",value:function(){this._cameraStream.stopCamera(),this._video=null}},{key:"getFrame",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;return this._takeAPicture((function(){var r=e._imageDataHelper.toImageData(e._toDrawable());if(e._roationHelper&&(r=e._roationHelper.rotate(r)),void 0!==t){var n=new or.a(t).resizedDimensions(r);r=e._imageDataHelper.scaleImageData(r,n)}return r}))}},{key:"_takeAPicture",value:function(e){if(this.stopped){var t=new Error("Camera is currently stopped");return t.name=this.CAMERA_STOPPED,Promise.reject(t)}try{return Promise.resolve(e())}catch(e){return Promise.reject(e)}}},{key:"_toDrawable",value:function(){var e=this;return{get source(){return e._video},get width(){return e.width},get height(){return e.height}}}},{key:"stream",get:function(){return this._cameraStream.stream}},{key:"flip",get:function(){return this._flip}},{key:"PLAY_INTERRUPTED_BY_STOP",get:function(){return"CAMERA.INTERRUPTED_BY_STOP"}},{key:"CAMERA_STOPPED",get:function(){return"CAMERA.STOPPED"}},{key:"name",get:function(){return"getUserMedia"}},{key:"stopped",get:function(){return null===this._video}},{key:"width",get:function(){return this._video.videoWidth}},{key:"height",get:function(){return this._video.videoHeight}}]),e}(),fr=function(){function e(){w()(this,e),this._modules=[],this._minRestTime=10,this._delay=20,this._powerSave=.4,this._maxInputFrameSize=320,this._source=null,this._loadErrorHandler=function(e){return console.error(e)},this._runErrorHandler=function(e){return console.warn(e)},this._busyHandler=function(){}}return b()(e,[{key:"addModule",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this._modules.push({name:e.toString(),conf:Object.assign({},t)}),this}},{key:"delayMs",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return t?this._delay=e:this._loadErrorHandler(new $e("[WARNING] delayMs is deprecated and will be ignored. Use powerSave factor instead.",$e.types.LOAD)),this}},{key:"powerSave",value:function(e){return"number"!=typeof e||e<0?(this._loadErrorHandler(new $e("Specified powerSave factor is not valid, using default value.",$e.types.LOAD)),this):(this._powerSave=e,this)}},{key:"source",value:function(e){return this._source=e,this}},{key:"minRestTimeMs",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return t?this._minRestTime=e:this._loadErrorHandler(new $e("[WARNING] minRestTimeMs is deprecated and will be ignored. Use powerSave factor instead.",$e.types.LOAD)),this}},{key:"maxInputFrameSize",value:function(e){return this._maxInputFrameSize=e,this}},{key:"loadErrorHandler",value:function(e){return this._loadErrorHandler=e,this}},{key:"runErrorHandler",value:function(e){return this._runErrorHandler=e,this}},{key:"busyHandler",value:function(e){return this._busyHandler=e,this}},{key:"licenseKey",value:function(e){return this._licenseKey=e,this}},{key:"load",value:function(){var e={minRestTime:this._minRestTime,modules:this._modules,delay:this._delay,powerSave:this._powerSave,licenseKey:this._licenseKey,maxInputFrameSize:this._maxInputFrameSize,loadErrorHandler:this._loadErrorHandler,runErrorHandler:this._runErrorHandler,busyHandler:this._busyHandler};try{e.source=this._source||ur.createCamera()}catch(e){return this._loadErrorHandler($e.clone(e,$e.types.CAMERA)),Promise.reject(e)}return new Qe(e).load()}}]),e}(),lr=function(e){return new mr(e)},hr=function(e){var t=document.createElement("video");return t.setAttribute("muted",""),t.setAttribute("playsinline",""),t.setAttribute("crossorigin","anonymous"),t.style.position="absolute",t.style.width="0",t.style.height="0",t.src=e,document.body.appendChild(t),new mr(t)},mr=function(){function e(t){w()(this,e),this._video=t,this._canvas=document.createElement("canvas"),this._ctx=this._canvas.getContext("2d"),this._stopped=!0}return b()(e,[{key:"getFrame",value:function(){return this._canvas.height=this._video.videoHeight,this._canvas.width=this._video.videoWidth,this._ctx.drawImage(this._video,0,0,this._video.videoWidth,this._video.videoHeight),Promise.resolve(this._ctx.getImageData(0,0,this._canvas.width,this._canvas.height))}},{key:"start",value:function(){return this._stopped=!1,this._video.play()}},{key:"stop",value:function(){return this._video.pause(),this._stopped=!0,Promise.resolve()}},{key:"stopped",get:function(){return this._stopped}},{key:"width",get:function(){return this._video.videoWidth}},{key:"height",get:function(){return this._video.videoHeight}}]),e}();function vr(){return new fr}var yr=function(){return{CAMERA:{name:"CAMERA",eventName:"CY_CAMERA_RESULT",toString:function(){return this.name}},ECHO:{name:"ECHO",eventName:"CY_ECHO_RESULT",toString:function(){return this.name}},FACE_DETECTOR:{name:"FACE_DETECTOR",eventName:"CY_FACE_DETECTOR_RESULT",toString:function(){return this.name}},SMART:{name:"SMART",eventName:"CY_SMART_RESULT",toString:function(){return this.name}},FRUIT:{name:"FRUIT",eventName:"CY_FRUIT_RESULT",toString:function(){return this.name}},FACE_BASE:{name:"FACE_BASE",eventName:"CY_FACE_BASE_RESULT",toString:function(){return this.name}},FACE_AGE:{name:"FACE_AGE",eventName:"CY_FACE_AGE_RESULT",toString:function(){return this.name}},FACE_EMOTION:{name:"FACE_EMOTION",eventName:"CY_FACE_EMOTION_RESULT",toString:function(){return this.name}},FACE_EMOTION_HD:{name:"FACE_EMOTION_HD",eventName:"CY_FACE_EMOTION_HD_RESULT",toString:function(){return this.name}},FACE_FEATURES:{name:"FACE_FEATURES",eventName:"CY_FACE_FEATURES_RESULT",toString:function(){return this.name}},FACE_GENDER:{name:"FACE_GENDER",eventName:"CY_FACE_GENDER_RESULT",toString:function(){return this.name}},FACE_POSE:{name:"FACE_POSE",eventName:"CY_FACE_POSE_RESULT",toString:function(){return this.name}},FACE_AROUSAL_VALENCE:{name:"FACE_AROUSAL_VALENCE",eventName:"CY_FACE_AROUSAL_VALENCE_RESULT",toString:function(){return this.name}},FACE_WISH:{name:"FACE_WISH",eventName:"CY_FACE_WISH_RESULT",toString:function(){return this.name}},FACE_IDENTITY:{name:"FACE_IDENTITY",eventName:"CY_FACE_IDENTITY_RESULT",toString:function(){return this.name}},FACE_ATTENTION:{name:"FACE_ATTENTION",eventName:"CY_FACE_ATTENTION_RESULT",toString:function(){return this.name}}}};function gr(){return ur}var Cr={fromCamera:function(e){return ur.createCamera(e)},fromVideoElement:function(e){return lr(e)},fromVideoUrl:function(e){return hr(e)}}}]);

//////////////////////////////////////////////////////////////////////////

var log = op.inBool("log",true);

var FD = op.inBool("FACE_DETECTOR",false);
var FP = op.inBool("FACE_POSE",false);
var FA = op.inBool("FACE_AGE",false);
var FE = op.inBool("FACE_EMOTION",false);
var FF = op.inBool("FACE_FEATURES",false);
var FG = op.inBool("FACE_GENDER",false);
var FAV = op.inBool("FACE_AROUSAL_VALENCE",false);
var FAtt = op.inBool("FACE_ATTENTION",false);
var FW = op.inBool("FACE_WISH",false);

const FDobj = op.outObject("FACE_DETECTOR_obj");
const FPobj = op.outObject("FACE_POSE_obj");
const FAobj = op.outObject("FACE_AGE_obj");
const FEobj = op.outObject("FACE_EMOTION_obj");
const FFobj = op.outObject("FACE_FEATURES_obj");
const FGobj = op.outObject("FACE_GENDER_obj");
const FAVobj = op.outObject("FACE_AROUSAL_VALENCE_obj");
const FAttobj = op.outObject("FACE_ATTENTION_obj");
const FWobj = op.outObject("FACE_WISH_obj");


const pose = {smoothness: 0.65};
const emotion = {smoothness: 0.40, enableBalancer : false};
const gender = {smoothness: 0.95, threshold: 0.70};
const feat = {smoothness: 0.90};
const arousal = {smoothness: 0.70};
const attention = {smoothness: 0.83};
const wish = {smoothness: 0.8};

CY.loader()
.addModule(CY.modules().FACE_POSE.name, pose)
.addModule(CY.modules().FACE_DETECTOR.name, {})
.addModule(CY.modules().FACE_AGE.name, {})
.addModule(CY.modules().FACE_EMOTION.name, emotion)
.addModule(CY.modules().FACE_GENDER.name, gender)
.addModule(CY.modules().FACE_FEATURES.name, feat)
.addModule(CY.modules().FACE_AROUSAL_VALENCE.name, arousal)
.addModule(CY.modules().FACE_ATTENTION.name, attention)
.addModule(CY.modules().FACE_WISH.name, wish)
.load()
.then(({ start, stop }) => start());


window.addEventListener(CY.modules().FACE_DETECTOR.eventName, (evt) => {
    if(FD.get()==true){FDobj.set(evt.detail);if(log.get()==true){console.log(evt.detail);}}
});
window.addEventListener(CY.modules().FACE_POSE.eventName, (evt) => {
    if(FP.get()==true){FPobj.set(evt.detail);if(log.get()==true){console.log(evt.detail);}}
});
window.addEventListener(CY.modules().FACE_AGE.eventName, (evt) => {
  if(FA.get()==true){FAobj.set(evt.detail);if(log.get()==true){console.log(evt.detail);}}
});
window.addEventListener(CY.modules().FACE_EMOTION.eventName, (evt) => {
  if(FE.get()==true){FEobj.set(evt.detail);if(log.get()==true){console.log(evt.detail);}}
});
window.addEventListener(CY.modules().FACE_GENDER.eventName, (evt) => {
  if(FG.get()==true){FGobj.set(evt.detail);if(log.get()==true){console.log(evt.detail);}}
});
window.addEventListener(CY.modules().FACE_FEATURES.eventName, (evt) => {
  if(FF.get()==true){FFobj.set(evt.detail);if(log.get()==true){console.log(evt.detail);}}
});
window.addEventListener(CY.modules().FACE_AROUSAL_VALENCE.eventName, (evt) => {
  if(FAV.get()==true){FAVobj.set(evt.detail);if(log.get()==true){console.log(evt.detail);}}
});
window.addEventListener(CY.modules().FACE_ATTENTION.eventName, (evt) => {
  if(FAtt.get()==true){FAttobj.set(evt.detail);if(log.get()==true){console.log(evt.detail);}}
});
window.addEventListener(CY.modules().FACE_WISH.eventName, (evt) => {
  if(FW.get()==true){FWobj.set(evt.detail);if(log.get()==true){console.log(evt.detail);}}
});






};

Ops.User.alivemachine.Morphcast.prototype = new CABLES.Op();





// **************************************************************
// 
// Ops.Json.ObjectGetNumber_v2
// 
// **************************************************************

Ops.Json.ObjectGetNumber_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    data = op.inObject("Data"),
    key = op.inString("Key"),
    result = op.outValue("Result");

result.ignoreValueSerialize = true;
data.ignoreValueSerialize = true;

data.onChange = exec;

key.onChange = function ()
{
    op.setUiAttrib({ "extendTitle": key.get() });
    exec();
};

function exec()
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

Ops.Json.ObjectGetNumber_v2.prototype = new CABLES.Op();
CABLES.OPS["a7335e79-046e-40da-9e9c-db779b0a5e53"]={f:Ops.Json.ObjectGetNumber_v2,objName:"Ops.Json.ObjectGetNumber_v2"};




// **************************************************************
// 
// Ops.Value.Number
// 
// **************************************************************

Ops.Value.Number = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const v = op.inValueFloat("value");
const result = op.outValue("result");

v.onChange = exec;

function exec()
{
    result.set(v.get());
}


};

Ops.Value.Number.prototype = new CABLES.Op();
CABLES.OPS["8fb2bb5d-665a-4d0a-8079-12710ae453be"]={f:Ops.Value.Number,objName:"Ops.Value.Number"};




// **************************************************************
// 
// Ops.Trigger.TriggerNumber
// 
// **************************************************************

Ops.Trigger.TriggerNumber = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const exe0 = op.inTriggerButton("0");
const exe1 = op.inTriggerButton("1");
const exe2 = op.inTriggerButton("2");
const exe3 = op.inTriggerButton("3");
const exe4 = op.inTriggerButton("4");
const exe5 = op.inTriggerButton("5");
const exe6 = op.inTriggerButton("6");
const exe7 = op.inTriggerButton("7");
const number = op.outValue("number");
number.changeAlways = true;
const outTrig = op.outTrigger("Triggered");

exe0.onTriggered = function () { number.set(0); outTrig.trigger(); };
exe1.onTriggered = function () { number.set(1); outTrig.trigger(); };
exe2.onTriggered = function () { number.set(2); outTrig.trigger(); };
exe3.onTriggered = function () { number.set(3); outTrig.trigger(); };
exe4.onTriggered = function () { number.set(4); outTrig.trigger(); };
exe5.onTriggered = function () { number.set(5); outTrig.trigger(); };
exe6.onTriggered = function () { number.set(6); outTrig.trigger(); };
exe7.onTriggered = function () { number.set(7); outTrig.trigger(); };


};

Ops.Trigger.TriggerNumber.prototype = new CABLES.Op();
CABLES.OPS["43ed1123-1312-4383-b843-27b8ec540c09"]={f:Ops.Trigger.TriggerNumber,objName:"Ops.Trigger.TriggerNumber"};




// **************************************************************
// 
// Ops.Math.RandomNumbers_v2
// 
// **************************************************************

Ops.Math.RandomNumbers_v2 = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    index=op.inValueInt("index",0.0),
    seed=op.inValueFloat("random seed"),
    min=op.inValueFloat("Min",0),
    max=op.inValueFloat("Max",1),
    outX=op.outValue("X"),
    outY=op.outValue("Y"),
    outZ=op.outValue("Z"),
    inInteger=op.inValueBool("Integer",false);

var arr=[];
var numValues=100;
seed.set(Math.round(Math.random()*99999));

op.setPortGroup("Value Range",[min,max]);

index.onChange=update;

init();

op.init=inInteger.onChange=
max.onChange=min.onChange=
seed.onChange=inInteger.onChange=function()
{
    init();
    update();
}

function update()
{
    var idx=Math.floor(index.get())||0;
    if(idx*3>=arr.length)
    {
        numValues=idx+100;
        init();
    }

    idx*=3;

    outX.set(arr[idx+0]);
    outY.set(arr[idx+1]);
    outZ.set(arr[idx+2]);
};

function init()
{
    Math.randomSeed=seed.get();
    var isInteger = inInteger.get();
    var inMin = min.get();
    var inMax = max.get();
    arr.length=Math.floor(numValues*3) || 300;

    if(!isInteger)
    {
        for(var i=0;i<arr.length;i+=3)
        {
            arr[i+0]=Math.seededRandom() * ( inMax - inMin ) + inMin ;
            arr[i+1]=Math.seededRandom() * ( inMax - inMin ) + inMin ;
            arr[i+2]=Math.seededRandom() * ( inMax - inMin ) + inMin ;
        }
    }
    else
    {
        for(var i=0;i<arr.length;i+=3)
        {
            arr[i+0]=Math.floor(Math.seededRandom() * ((inMax - inMin )+1) + inMin) ;
            arr[i+1]=Math.floor(Math.seededRandom() * ((inMax - inMin )+1) + inMin) ;
            arr[i+2]=Math.floor(Math.seededRandom() * ((inMax - inMin )+1) + inMin) ;
        }
    }
};


};

Ops.Math.RandomNumbers_v2.prototype = new CABLES.Op();
CABLES.OPS["30979dbb-f4e7-4b1e-8e10-80c2ca4a3f88"]={f:Ops.Math.RandomNumbers_v2,objName:"Ops.Math.RandomNumbers_v2"};




// **************************************************************
// 
// Ops.Array.ArrayGetString
// 
// **************************************************************

Ops.Array.ArrayGetString = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
var array=op.inArray("array");
var index=op.inValueInt("index");

//when out is set to op.outString then index.onChange doesn't work
var result=op.outString("result");//original code

//setting it to a op.outValue does work on change
//var result=op.outValue("result");

array.ignoreValueSerialize=true;

index.onChange=update;
var arr=null;

array.onChange=function()
{
    arr=array.get();
    update();
};

function update()
{
    if(arr) result.set( arr[index.get()]);
}

};

Ops.Array.ArrayGetString.prototype = new CABLES.Op();
CABLES.OPS["be8f16c0-0c8a-48a2-a92b-45dbf88c76c1"]={f:Ops.Array.ArrayGetString,objName:"Ops.Array.ArrayGetString"};




// **************************************************************
// 
// Ops.Array.ArrayLength
// 
// **************************************************************

Ops.Array.ArrayLength = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const
    array=op.inArray("array"),
    outLength=op.outValue("length");

outLength.ignoreValueSerialize=true;

function update()
{
    var l=0;
    if(array.get()) l=array.get().length;
    else l=-1;
    outLength.set(l);
}

array.onChange=update;


};

Ops.Array.ArrayLength.prototype = new CABLES.Op();
CABLES.OPS["ea508405-833d-411a-86b4-1a012c135c8a"]={f:Ops.Array.ArrayLength,objName:"Ops.Array.ArrayLength"};




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
// Ops.User.alivemachine.MyColorRange
// 
// **************************************************************

Ops.User.alivemachine.MyColorRange = function()
{
CABLES.Op.apply(this,arguments);
const op=this;
const attachments={};
const inTrigger= op.inTriggerButton("Generate");
const colA  = op.inString("color A", "#000");
const colB  = op.inString("color B", "rgb(0, 207, 239)");
const outString = op.outString("Color");

inTrigger.onTriggered=function(){
    var generator = new RandomColor(colA.get(), colB.get());
    var color = generator.getColor();
    outString.set(color);
}


function RandomColor (color1, color2) {

    var _regs = {
        "hex3"  : /^#([a-f\d])([a-f\d])([a-f\d])$/i,
        "hex6"  : /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
        "rgb"   : /^rgb\s*\(\s*([\d\.]+%?)\s*\,\s*([\d\.]+%?)\s*\,\s*([\d\.]+%?)\s*\)$/
    };

    var _obj1 = getValues(color1);
    var _obj2 = getValues(color2);

    //---Get the colors
    function getValues (color) {

        var values = false;

        for (var prop in _regs) {

            if (_regs[prop].test(color)) {

                values = {};

                values.r = color.replace(_regs[prop], "$1");
                values.g = color.replace(_regs[prop], "$2");
                values.b = color.replace(_regs[prop], "$3");

                if (prop === "rgb") {

                    values.r = Number(values.r);
                    values.g = Number(values.g);
                    values.b = Number(values.b);

                } else {

                    values.r = parseInt(values.r, 16);
                    values.g = parseInt(values.g, 16);
                    values.b = parseInt(values.b, 16);

                }

                break;

            }

        }

        return values;

    }

    //---str_pad
    function str_pad (str, pad_length, pad_string, pad_type) {

        var len = pad_length - str.length;
        if (len < 0) { return str };
        var pad = new Array(len + 1).join(pad_string);
        if (pad_type === "STR_PAD_LEFT") { return pad + str };
        return str + pad;

    }

    //---Get a value
    function getRandom (c1, c2, pcent) {

        var color = c1 + Math.floor((c2 - c1) * pcent);

        if (color < 0) color = 0;

	    return str_pad(color.toString(16), 2, "0", "STR_PAD_LEFT");

    }

    //---Get a random color
    this.getColor = function () {

        if (_obj1 && _obj2) {

            var random = Math.random();

            var r = getRandom(_obj1.r, _obj2.r, random);
            var g = getRandom(_obj1.g, _obj2.g, random);
            var b = getRandom(_obj1.b, _obj2.b, random);

            return "#" + r + g + b;

        }

        return false;

    };

}

};

Ops.User.alivemachine.MyColorRange.prototype = new CABLES.Op();





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
var contentLength =op.outNumber("content Length");
order.onTriggered=reorder;
var page;
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
        page = pardiv.parentElement;
        iso = new Isotope(pardiv,{
        itemSelector: '.cell',
        //layoutMode: 'fitRows',
        getSortData: {
            weight: function( itemElem ) {
            var weight = itemElem.innerHTML.length;
            return parseFloat( weight );
            }
        },
        masonry: {
            columnWidth: 16
        }
        });
    }
    if(pardiv!=null && data!=null && data!='' && data!='null'){
        outContent.set(data);
        let element = document.createElement("div");
        addClass(element, 'cell');
        addClass(element, typ);

        var container = document.createElement("div");
        container.setAttribute("class","search");

        if(typ=='meta'){
            var generator = new RandomColor("rgb(200,64,0)", "rgb(200, 0, 128)");
            container.style.backgroundColor = generator.getColor();
             //var tmp = data.substring(0,9);
             //element.appendChild(tmp.length);
             var items=data.split("###111###");
            if(items.length==2){
                //console.log(items[1]);
                //addClass(element, 'imgsmall');
                addClass(element, 'emoji');
                //element.appendChild(container);
                element.innerHTML=items[1];
                //element.style.backgroundColor=generator.getColor();

            }else{
                var txtarea = document.createElement("textarea");
                txtarea.value=items[0];
                txtarea.id = getRandomInt();
                txtarea.style.fontSize='50px';
                element.appendChild(txtarea);
                element.appendChild(container);
                container.appendChild(txtarea);
            }
        }else if(typ=='text'){
            var generator = new RandomColor("rgb(0,128,200)", "rgb(0, 64, 200)");
            container.style.backgroundColor = generator.getColor();
            var items=data.split("###666###");
            //console.log(items);
            var txtarea = document.createElement("textarea");
                txtarea.value=data;
                txtarea.id = getRandomInt();
                txtarea.style.fontSize='50px';
            //alert(items.length);
            if(items.length==1){///////SOLO TEXT
                element.appendChild(txtarea);
                element.appendChild(container);
                container.appendChild(txtarea);
            }else if(items.length==3){///////////////LINK WITH TITLE
                //alert(items[2]);
                var a = document.createElement("a");
                a.href = items[2];
                a.innerHTML=items[1];
                element.appendChild(container);
                container.appendChild(a);
                container.appendChild(txtarea);
            }

            txtarea.value=items[0];

        }else if(typ=='img'){
            var im = document.createElement("img");
            //////POST LOAD IMAGE
            im.onload = function(){
                if(im.naturalHeight >=256){
                    im.setAttribute("class","imgclass");
                    addClass(container, 'imgbig');
                }else if(im.naturalHeight <256 && im.naturalHeight>=128){
                    im.setAttribute("class","imgclass");
                    addClass(container, 'imgmedium');
                }else if (im.naturalHeight<128){
                    im.setAttribute("class","imgclass");
                    addClass(container, 'imgsmall');
                }

            };
            im.src = data;
            container.style.backgroundImage = "url("+data+")";
            im.id = getRandomInt();
            element.appendChild(container);
            container.appendChild(im);

        }
        //////POST LOAD TXT
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
        contentLength.set(element.innerHTML.length);
        //alert(page.scrollTop+" "+page.scrollHeight+" "+page.offsetHeight);
        //console.log(page.scrollTop+" === "+page.scrollHeight+" - "+page.offsetHeight);
        if( page.scrollTop >= (page.scrollHeight - page.offsetHeight-300)){
            pardiv.parentElement.scrollBy(0, 300);
        }
        outTrig.trigger();
    }

}

function resize(el){
    let fontSize = parseInt(el.style.fontSize);
        for (let i = fontSize; i >= 6; i--) {
            if (isOverflown(el)) {
                if(fontSize<=7){}
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

function RandomColor (color1, color2) {

    var _regs = {
        "hex3"  : /^#([a-f\d])([a-f\d])([a-f\d])$/i,
        "hex6"  : /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
        "rgb"   : /^rgb\s*\(\s*([\d\.]+%?)\s*\,\s*([\d\.]+%?)\s*\,\s*([\d\.]+%?)\s*\)$/
    };

    var _obj1 = getValues(color1);
    var _obj2 = getValues(color2);

    //---Get the colors
    function getValues (color) {

        var values = false;

        for (var prop in _regs) {

            if (_regs[prop].test(color)) {

                values = {};

                values.r = color.replace(_regs[prop], "$1");
                values.g = color.replace(_regs[prop], "$2");
                values.b = color.replace(_regs[prop], "$3");

                if (prop === "rgb") {

                    values.r = Number(values.r);
                    values.g = Number(values.g);
                    values.b = Number(values.b);

                } else {

                    values.r = parseInt(values.r, 16);
                    values.g = parseInt(values.g, 16);
                    values.b = parseInt(values.b, 16);

                }

                break;

            }

        }

        return values;

    }

    //---str_pad
    function str_pad (str, pad_length, pad_string, pad_type) {

        var len = pad_length - str.length;
        if (len < 0) { return str };
        var pad = new Array(len + 1).join(pad_string);
        if (pad_type === "STR_PAD_LEFT") { return pad + str };
        return str + pad;

    }

    //---Get a value
    function getRandom (c1, c2, pcent) {

        var color = c1 + Math.floor((c2 - c1) * pcent);

        if (color < 0) color = 0;

	    return str_pad(color.toString(16), 2, "0", "STR_PAD_LEFT");

    }

    //---Get a random color
    this.getColor = function () {

        if (_obj1 && _obj2) {

            var random = Math.random();

            var r = getRandom(_obj1.r, _obj2.r, random);
            var g = getRandom(_obj1.g, _obj2.g, random);
            var b = getRandom(_obj1.b, _obj2.b, random);

            return "#" + r + g + b;

        }

        return false;

    };

}

};

Ops.User.alivemachine.Isotope.prototype = new CABLES.Op();



window.addEventListener('load', function(event) {
CABLES.jsLoaded=new Event('CABLES.jsLoaded');
document.dispatchEvent(CABLES.jsLoaded);
});
