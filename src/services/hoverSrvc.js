const KEYWORD = 'keyword';

exports.hoverSrvc = ($timeout, $compile, $state, $location, configSrvc, logger) => {
  const obj = {};
  const loadedContent = {};

  function getKey($element) {
    return $($element).text().trim();
  }

  function getContent($element, id, contentId) {
    switch (contentId) {
      case KEYWORD: {
        const key = getKey($element);
        if (key) {
          if (!loadedContent[key]) {
            loadedContent[key] = {};
          }
          loadedContent[key].data = configSrvc.getKeywordHtml(key);
          logger.debug({ key, content: loadedContent[key] });
          if (loadedContent[key].data) {
            return key;
          }
        }

        throw new Error(`${$($element).text()} is an undefined keyword for topic ${configSrvc.getState()}.`);
      }
      default: {
        throw new Error(`Content type '${contentId}' is not defined.`);
      }
    }
  }

  function getContainer($element, id, scope, name) {
    const key = getKey($element);
    if (!loadedContent[key][name]) {
      let content;
      switch (name) {
        default:
          content = $(`<div attrs='{"key": "${key}"}' key='${key}' class="hover-outer" id='${id}' ng-click='$event.stopPropagation()'>
                        <button class='hover-close-btn' ng-click='close("${id}")'>X</button>
                        <div class='hover-inner' key='${key}'>
                          ${loadedContent[key].data}
                        </div>
                      </div>`);
      }
      loadedContent[key][name] = id;
      $('body').append(content);
      $(`#${id}`).hide();
    }

    loadedContent[key].data = configSrvc.getTopicHtml('keywords', key);
    $(`#${id}`).find('.hover-inner').html(loadedContent[key].data);
    function compile() {
      $compile($(`#${id}`))(scope);
    }

    $timeout(compile, 10);
    return loadedContent[key][name];
  }

  obj.getContainer = getContainer;
  obj.getContent = getContent;
  obj.getKey = getKey;
  return obj;
};
