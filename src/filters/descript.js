exports.descript = ($sce) => {
  function filter(input) {
    const clean = $('<textarea/>').html(input).text().replace(/<script|<\/script/g, '');
    return $sce.trustAsHtml(clean);
  }
  return filter;
};
