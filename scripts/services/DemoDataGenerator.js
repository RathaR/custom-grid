angular.module('customApp')
  .service('DemoDataGenerator', function () {
    var getData = function (count) {
      var emailProviders = ['gmail.com', 'mail.ru', 'ukr.net', 'yandex.ru', 'rambler.ru']
      var data = [];
      _.times(count, function () {
        var firstName = 'Name-' + _.random(0, 100, false);
        var lastName = 'Surname-' + _.random(0, 100, false);
        data.push({
          Id: _.random(1e5, 10e6 - 1, false).toString(),
          FirstName: firstName,
          LastName: lastName,
          Age: _.random(18, 60, false),
          Email: firstName + '@'+  emailProviders[_.random(0, emailProviders.length-1, false)]
        })
      });
      return data;
    };
    return {
      get: getData
    }
  });
