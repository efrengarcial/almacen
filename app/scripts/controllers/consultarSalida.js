'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:ConsultarSalidaCtrl
 * @description
 * # ConsultarSalidaCtrl
 * Controller of the almacenApp
 */

angular.module('almacenApp')
    .controller('ConsultarSalidaCtrl', ['$scope', '$log', '$rootScope', 'userFactory', 'proveedorFactory', 'salidaFactory', 'toaster', '$filter', 'modalWindowFactory', 'moment', 'Constants', 'Permissions', 'accountFactory', '$location', '$routeParams',
        function($scope, $log, $rootScope, userFactory, proveedorFactory, salidaFactory, toaster, $filter, modalWindowFactory, moment, Constants, Permissions, accountFactory, $location, $routeParams) {
            $log.debug('Iniciando consultar salidas');

            $scope.consultaSalida = salidaFactory.getConsultaSalidaObject();
            $scope.users = [];
            $scope.permissions = [];
            $scope.userId = null;

            $scope.toggleMin = function() {
                $scope.minDate = moment(Constants.minDate).format(Constants.formatDate);
            };

            function getUsers() {
                userFactory.getUsers().then(function(users) {
                    $scope.users = users;
                    console.log('users', $scope.users);
                });
            }

            function saveUsers(usersObj, model, label) {
                if ($scope.consultaSalida.esSolicitador) {
                    $scope.consultaSalida.IdSolicitador = usersObj.Id;
                } else {
                    $scope.consultaSalida.IdRecibidor = usersObj.Id;
                }
            }

            //Cheque si usurario tiene permiso para consultar orden
            function checkIfUserHasQueryPermission() {
                var index = $scope.permissions.indexOf(Permissions.CONSULTAR_SALIDAS);
                if (index > -1) {
                    return true;
                } else {
                    return false;
                }
            }

            function setSearchPermissions() {
                var permission = checkIfUserHasQueryPermission();
                if (permission) {
                    $scope.consultaSalida.NotSearchPermission = false;
                    $scope.consultaSalida.UserName = accountFactory.getAuthenticationData().userName;
                    $scope.consultaSalida.UserId = accountFactory.getAuthenticationData().userId;
                } else {
                    $scope.consultaSalida.NotSearchPermission = true;
                }
            }

            $scope.toggleMin();
            $scope.dateOptions = {
                formatYear: 'yyyy',
                formatMonth: 'MM',
                formatDay: 'dd',
                startingDay: 1
            };

            $scope.format = Constants.datepickerFormatDate;

            getUsers();
            $scope.saveUsers = saveUsers;

            //Asigna permisos a usuario
            $scope.permissions = accountFactory.getAuthenticationData().permissions;
            $scope.userId = accountFactory.getAuthenticationData().userId;
            setSearchPermissions();

            //Interacted and show message about required
            $scope.interacted = function(field) {
                return $scope.submitted || field.$dirty;
            };

            $scope.open = function($event, fecha) {
                $event.preventDefault();
                $event.stopPropagation();
                if ('openedStartDate' === fecha) {
                    $scope.openedStartDate = true;
                } else {
                    $scope.openedEndDate = true;
                }
            };

            $scope.clearForm = function() {
                $scope.consultaSalida = salidaFactory.getConsultaSalidaObject();

                $scope.allData = null;
                $scope.gridOptions.ngGrid.config.sortInfo = {
                    fields: ['Id'],
                    directions: ['asc'],
                    columns: []
                };

                // Resets the form validation state.
                $scope.consultarSalidaForm.$setPristine();
                //$rootScope.$broadcast('clear');
                $scope.consultaSalida.ReadOnly = false;
                setSearchPermissions();
            };

            $scope.sortInfo = {
                fields: ['Id'],
                directions: ['asc']
            };

            $scope.pagingOptions = {
                pageSizes: Constants.pageSizes,
                pageSize: Constants.pageSize,
                currentPage: 1,
                totalServerItems: 0
            };

            $scope.gridOptions = {
                data: 'dataGrid',
                useExternalSorting: true,
                sortInfo: $scope.sortInfo,
                enablePaging: true,
                showFooter: true,
                totalServerItems: 'totalServerItems',
                pagingOptions: $scope.pagingOptions,

                columnDefs: [{
                    field: 'Id',
                    displayName: 'Id'
                }, {
                    field: 'showSolicitadorFullName()',
                    displayName: 'Solicitador'
                }, {
                    field: 'showRecibidorFullName()',
                    displayName: 'Recibidor'
                }, {
                    field: 'FechaEntrega',
                    displayName: 'Fecha de Entrega',
                    cellFilter: 'date:\'dd/MM/yyyy HH:mm:ss\''
                }, {
                    field: '',
                    displayName: 'Detalles Salida',
                    cellTemplate: '<span class=\'glyphicon glyphicon-open glyphicon-center\' ng-click=\'showDetails(row)\'></span>'
                }],

                multiSelect: false,
                selectedItems: [],
                afterSelectionChange: function(rowItem) {
                    if (rowItem.selected) {
                        $rootScope.$broadcast('salidaSelected', $scope.gridOptions.selectedItems[0]);
                    }
                }
            };

            $scope.$watch('pagingOptions', function(newVal, oldVal) {
                if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                    $scope.setPagingData($scope.allData, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                }
            }, true);

            $scope.$watch('sortInfo', function(newVal, oldVal) {
                sortData(newVal.fields[0], newVal.directions[0]);
                $scope.pagingOptions.currentPage = 1;
                $scope.setPagingData($scope.allData, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
            }, true);


            $scope.$on('ngGridEventSorted', function(event, sortInfo) {
                $scope.sortInfo = sortInfo;
            });

            $scope.$on('ordenSelected', function(event, orden) {
                $scope.orden = orden;
            });

            $scope.$on('clear', function() {
                $scope.gridOptions.selectAll(false);
            });

            $scope.setPagingData = function(data, page, pageSize) {
                if (!data) {
                    return;
                }
                var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
                $scope.dataGrid = pagedData;
                $scope.pagingOptions.totalServerItems = data.length;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

            // sort over all data
            function sortData(field, direction) {
                if (!$scope.allData) {
                    return;
                }
                $scope.allData.sort(function(a, b) {
                    if (direction === 'asc') {
                        return a[field] > b[field] ? 1 : -1;
                    } else {
                        return a[field] > b[field] ? -1 : 1;
                    }
                })
            }

            function setQueryParams() {
                var params = {
                    StartDate: moment($scope.consultaSalida.StartDate).format(Constants.formatDate),
                    EndDate: moment($scope.consultaSalida.EndDate).format(Constants.formatDate),
                    IdSolicitador: $scope.consultaSalida.IdSolicitador,
                    IdRecibidor: $scope.consultaSalida.IdRecibidor,
                    UserName: $scope.consultaSalida.UserName,
                    UserId: $scope.consultaSalida.UserId,
                    NotSearchPermission: $scope.consultaSalida.NotSearchPermission,
                };
                return params;
            }

            function getUserById(Id) {
                for (var i = 0; i < $scope.users.length; i++) {
                    if ($scope.users[i].Id === Id) {
                        return $scope.users[i].FullName;
                    }
                }
            }

            function setUsersFullName() {
                angular.forEach($scope.allData, function(row) {
                    row.showRecibidorFullName = function() {
                        return getUserById(row.IdRecibidor);
                    };

                    row.showSolicitadorFullName = function() {
                        return getUserById(row.IdSolicitador);
                    };
                });
            }

            $scope.buscarSalida = function(isValid) {
                if (isValid) {
                    var params = setQueryParams();
                    salidaFactory.query(params).then(function(data) {
                        $scope.allData = data;
                        if ($scope.allData.length > 0) {
                            setUsersFullName();
                            $scope.pagingOptions.currentPage = 1;
                            $scope.setPagingData(data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                        } else {
                            toaster.pop('warning', 'Advertencia', 'No existen Salidas con el rango de fecha, Solicitador, Recibidor o Usuario descrito.');
                        }
                    });
                }
            };
        }
    ]);
