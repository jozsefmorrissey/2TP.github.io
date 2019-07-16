
var modal = document.createElement('div');
var exceptionLookup = {};
var exceptionId = 0;
var TAG_NAME = 'debug-gui-data';

var getScriptURL = (function() {
    var scripts = document.getElementsByTagName('script');
    var index = scripts.length - 1;
    var myScript = scripts[index];
    return function() { return myScript.src; };
})();

var scriptUrl = getScriptURL();

var haze = document.createElement('div');
haze.style.cssText = `position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        text-align: left;
        background:rgba(0,0,0,0.6);
        z-index: 1;
        padding: 20pt;`;
modal.appendChild(haze);

var popup = document.createElement('div');
popup.style.cssText = `background-color: white;
        padding: 10pt 20pt;
        display: inline-block;
        max-width: 80%;
        max-height: 80%;
        overflow: scroll;
        border-radius: 2pt;`;
popup.setAttribute('onclick', 'event.stopPropagation()');
haze.appendChild(popup);

modal.id = 'debug-gui-modal';
function displayModal(id) {
  popup.innerHTML = exceptionLookup[id];
  modal.style.display = 'block';
}

function hideModal() {
  popup.innerHTML = '';
  modal.style.display = 'none';
}
haze.onclick = hideModal;
hideModal();

var reportInfo = 'reportInfo';
var reportInfoTitleId = 'debug-gui-report-info-title';
var reportInfoDescId = 'debug-gui-report-info-desc';
var copyText = document.createElement("textarea");
// copyText.style.display = 'none';
function copyModal() {
  document.body.appendChild(copyText);
  exceptionLookup[reportInfo] = '<input id="' + reportInfoTitleId + '" value="title" placeholder="title">' +
      '<input type="button" value="Copy" onclick="copyReport()">' +
      "<textarea cols=150 rows=20 id='" + reportInfoDescId + "' placeholder='Description'>descrepticion</textarea><br>";
  displayModal(reportInfo);
}

function copyReport() {

  var title = document.getElementById(reportInfoTitleId).value;
  var desc = document.getElementById(reportInfoDescId).value;

  copyText.value = '<html><head><title>' + title + '</title>' +
    '<script type=\'text/javascript\' src="' + scriptUrl + '"></script>' +
    '</head><body><h1>' + title + '</h1><p>' + desc + '</p>' +
    '<' + TAG_NAME + ">" + JSON.stringify(buildData(), null, 2) + "</" + TAG_NAME + ">" +
    '</body></html>';
  copyText.select();


  document.execCommand("copy");
  console.log('copied')
}

function buildData() {
   var tags = document.getElementsByTagName(TAG_NAME);
   var data = {};
   for (let index = 0; index < tags.length; index += 1) {
     tags[index].style.display = 'none';
     try {
       var json = JSON.parse(tags[index].innerHTML);
       var keys = Object.keys(json);
       for (let oIndex = 0; oIndex < keys.length; oIndex += 1) {
         var id = keys[oIndex];
         if (data[id]) {
           id += "(" + index + ")";
         }
         data[id] = json[keys[oIndex]];
       }
     } catch (e) {
       console.log(e.stack)
     }
   }
   return data;
}

function buildValueList(values) {
  var valueKeys = Object.keys(values);
  var valueList = '<div><label>Values</label><ul>';
  for (let vIndex = 0; vIndex < valueKeys.length; vIndex += 1) {
    var key = valueKeys[vIndex];
    valueList += "<li>'" + key + "' => '" + values[key] + "'</li>";
  }
  return valueList + '</ul></div>';
}

function buildLinkList(links) {
  var linkKeys = Object.keys(links);
  var linkList = "<span><label>Links: </label>&nbsp;&nbsp;&nbsp;";
  for (let lIndex = 0; lIndex < linkKeys.length; lIndex += 1) {
    var key = linkKeys[lIndex];
    linkList += "<a href='" + links[key] + "' target='_blank'>" + key + "</a> | ";
  }
  return linkList.substr(0, linkList.length - 3) + '</span>';
}

function buildExceptions(exceptions) {
  var acorn = '<div><label>Exceptions</label><ul>';
  for (let index = 0; index < exceptions.length; index += 1) {
    var except = exceptions[index];
    acorn += `<li><a href='#' onclick='displayModal(${exceptionId})'>
                ${except.id} - ${except.msg}
              </a></li>`;
    exceptionLookup[exceptionId++] = except.stacktrace;
  }
  return acorn + '</ul></div>';
}

function buildGui() {
  var acorn = '<div><input type="button" value="Copy" onclick="copyModal()"><div class="accordion" id="accordionExample">';
  var data = buildData();

  var keys = Object.keys(data);
  keys = keys.sort();
  for (let index = 0; index < keys.length; index += 1) {
    var id = keys[index];
    acorn += `  <div class="card">
        <div class="card-header" id="heading-${index}">
          <h2 class="mb-${index}">
            <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse-${index}" aria-expanded="true" aria-controls="collapse-${index}">
              ${id}
            </button>
          </h2>
        </div>

        <div id="collapse-${index}" class="collapse" aria-labelledby="heading-${index}" data-parent="#accordionExample">
          <div class="card-body">
            ${buildLinkList(data[id].links)}
            ${buildValueList(data[id].values)}
            ${buildExceptions(data[id].exceptions)}
          </div>
        </div>`;
  }

  return acorn += '</div></div></div></div>';
}


function onLoad() {
  var script = document.createElement("script");
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js';
  script.integrity = "sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1";
  script.setAttribute('crossorigin', 'anonymous');
  document.head.appendChild(script);

  script = document.createElement("script");
  script.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js';
  script.integrity = "sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM";
  script.setAttribute('crossorigin', 'anonymous');
  document.head.appendChild(script);

  document.body.appendChild(modal);
  ShortCutCointainer("debug-gui-scc", ['d', 'g'], buildGui());
}


var script = document.createElement("script");
script.src = 'https://code.jquery.com/jquery-3.3.1.slim.min.js';
script.integrity = "sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo";
script.setAttribute('crossorigin', 'anonymous');
document.head.appendChild(script);

script = document.createElement("script");
script.src = 'https://jozsefmorrissey.github.io/not-related/js/short-cut-container.js';
document.head.appendChild(script);

var style = document.createElement("link");
style.rel = 'stylesheet';
style.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css';
style.integrity = "sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T";
style.setAttribute('crossorigin', 'anonymous');
document.head.appendChild(style);

window.addEventListener('load', onLoad);
