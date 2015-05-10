'use strict';

angular.module('customApp')
  .constant('DefaultOptions', {
    pageSize: 10,
    virtualization: false,
    sortable: true,
    filterable: true,
    editable: true,
    data: [{
      Id: '1',
      FirstName: 'FirstName',
      LastName: 'LastName',
      Age: 12,
      Email: 'Email'
    }]
  });
