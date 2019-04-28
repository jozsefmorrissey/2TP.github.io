exports.redirectCtrl = ($stateParams, $timeout) => {
    const url = $stateParams.url.replace(/\|/g, "/");
    alert(url);
    window.open(url,'_blank');

};
