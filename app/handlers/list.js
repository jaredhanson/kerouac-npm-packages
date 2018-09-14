

exports = module.exports = function() {
  
  function render(page, next) {
    console.log('$$ PKG LIST');
    page.end('TODO: LIST packages! ')
  }
  
  
  return [
    render
  ];
};
