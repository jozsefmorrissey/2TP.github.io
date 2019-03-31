exports.range = () => {
  function filter(input, start, end) {
    let s = parseInt(start, 10);
    let e = parseInt(end, 10);
    if (end === undefined) {
      e = s;
      s = 0;
    }

    for (let i = s; i < e; i += 1) {
      input.push(i);
    }

    return input;
  }
  return filter;
};
