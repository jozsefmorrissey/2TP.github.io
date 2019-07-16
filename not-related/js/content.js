const config = {
  regex: "\\$\\{([A-Z_]*)\\}",
  // attr: ""
}

const customization = {
  "VERSITILE_MSG": `        Mint is versatile enough to
          <br class="cgmt-visible-xs">
          help anyone’s money make sense without much effort.
          <br class="cgmt-visible-md">
          There’s no wrong way to use it,
          <br class="cgmt-visible-lg">
          and nothing to lose getting
          <br class="cgmt-visible-xl">
          started. You’ll be surprised how life-changing something so simple can be.`,
  "LEARN_MORE": "<a href=\"https://www.mint.com/how-mint-works\">Learn More</a>",
  "WHAT_IS": `            <a class=\"nav-dropdowns__1-0-2__drop-link beacon-this\" href=\"/how-mint-works\" role=\"menuitem\">
              What is Mint
              </a>`,
  "BILL_PAYMENT": `<a class="nav-dropdowns__1-0-2__drop-link beacon-this" href="/how-mint-works/bills" role="menuitem">
  Bill Payment Tracker
  </a>`,
  "QUESTIONS": `<a href="https://help.mint.com/" class="btn btn-tertiary beacon-this" data-com-id="com-cms-cg-mktg-component-button-link|c8KqfVRFn|1.0.0" data-template-id="button-link" data-com-type="component" data-com-version="1.0.3" data-instance-version="1.0.0" data-auto-sel="c8KqfVRFn" aria-label="Questions? We Can Help">

	Questions? We Can Help
</a>`

}

let count = 0;
function replace(html) {
  const reg = new RegExp(config.regex, "g");
  const matches = html.match(reg);
  for (let index in matches) {
    match = matches[index].replace(reg, "$1");
    contentElement = `<content-element id='ce-${count++}' identifier='${match}'>
                      ${customization[match]}</content-element>`
    html = html.replace(matches[index], contentElement);
  }
  return html;
}

currentKeys = {};
function keyUpListener(e) {
  delete currentKeys[e.keyCode];
}

let displayCount = 0;
let edit = false;
function toggleContentEditor() {
      displayCount++;
      const ce = document.getElementById('content-editor');
      const elements = document.getElementsByTagName('content-element');
      if (displayCount %2 == 1) {
        ce.style.display = 'block';
        edit = true;
        elements[currentIndex].classList.add('content-element-highlight');
      } else {
        ce.style.display = 'none';
        elements[currentIndex].classList.remove('content-element-highlight');
        edit = false;
      }
}

currentIndex = -1;
function nextElement() {
  const elements = document.getElementsByTagName('content-element');
  currentIndex = ++currentIndex % elements.length;
  highlightElement(elements, (elements.length + currentIndex - 1) % elements.length)
  console.log(elements[currentIndex])
  document.getElementById(elements[currentIndex].id).scrollIntoView({
  behavior: 'smooth'
});
}

function onUpdate() {
  const trixxy = document.getElementById('trixxy-89');
  const target = document.getElementById(trixxy.target);
  target.innerHTML = trixxy.value;
}

function highlightElement(elements, index) {
  elements[currentIndex].classList.add('content-element-highlight');
  elements[index].classList.remove('content-element-highlight');
  const trixxy = document.getElementById('trixxy-89');
  trixxy.value = elements[currentIndex].innerHTML;
  trixxy.target = elements[currentIndex].id;
}

function keyDownListener(e) {
    currentKeys[e.keyCode] = true;
    if (currentKeys[18] && currentKeys[67]){
      toggleContentEditor();
    }
    currentKeys[e.keyCode] = true;
    if (edit && currentKeys[78] && currentKeys[18]){
      nextElement();
    }
}

function onLoad() {
  document.body.innerHTML = replace(document.body.innerHTML);
  document.head.innerHTML = replace(document.head.innerHTML);
}

window.addEventListener('load', onLoad);
window.onkeyup = keyUpListener;
window.onkeydown = keyDownListener;
window.addEventListener('trix-change', onUpdate);
