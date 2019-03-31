exports.descript = ($sce) => {
  function filter(input, start, end) {
    let clean = $("<textarea/>").html(input).text().replace(/<script|<\/script/g, '');
    return $sce.trustAsHtml(clean);
  }
  return filter;
};
