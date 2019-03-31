let hoverCount = 0;
let zIndex = 5;
function dummy($compile, hoverSrvc, logger, $timeout) {
  function ctrl($scope, $element) {
    let template = `<div>${$($element).html()}</div>`;
    try {
      const obj = JSON.parse($scope.attrs);
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        $scope[key] = obj[key];
      }
    } catch (e) {
      console.log(e);
    }

    const ogScope = $scope.$parent;
    const keys = Object.keys(ogScope);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (key[0] != '$' && keys[0] != '_') {
        $scope[key] = ogScope[key];
      }
    }

    function compile() {
      const compiled = $compile(template)($scope);
      $($element).html(compiled);
    }

    $timeout(compile, 200);
  }

  return {
    scope: {
      attrs: '@',
    },
    controller: ctrl,
  };
}

exports.dummy = dummy;
