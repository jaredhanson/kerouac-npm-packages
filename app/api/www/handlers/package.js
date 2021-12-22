exports = module.exports = function(registry, forge) {
  
  function fetchPackage(page, next) {
    console.log('FETCHING...');
    console.log(page.params)
  }
  
  
  return [
    fetchPackage
  ];
};

exports['@require'] = [
];
