'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:ConsultarOrdenCtrl
 * @description
 * # ConsultarOrdenCtrl
 * Controller of the almacenApp
 */

angular.module('almacenApp')
    .controller('ConsultarOrdenCtrl', ['$scope', '$log', '$rootScope', 'userFactory', 'proveedorFactory', 'ordenFactory', 'toaster', '$filter', 'modalWindowFactory', 'moment', 'Constants', 'Permissions', 'accountFactory', '$location', '$routeParams',
        function($scope, $log, $rootScope, userFactory, proveedorFactory, ordenFactory, toaster, $filter, modalWindowFactory, moment, Constants, Permissions, accountFactory, $location, $routeParams) {
            $log.debug('Iniciando consultar orden');

            var params = $routeParams;
            $scope.proveedores = [];
            $scope.users = [];
            $scope.permissions = [];
            $scope.userId = null;

            $scope.toggleMin = function() {
                $scope.minDate = moment(Constants.minDate).format(Constants.formatDate);
            };

            if (params.idOrden) {
                $scope.consultaOrden = ordenFactory.getConsultaOrdenObject();
                $log.debug('back: ' + JSON.stringify(params));

                if (params.SearchType === 1) {
                    $scope.consultaOrden.ReadOnly = true;
                    $scope.consultaOrden.Numero = params.Numero;
                    $scope.consultaOrden.UserName = accountFactory.getAuthenticationData().userName;
                    $scope.consultaOrden.NotSearchPermission = params.NotSearchPermission;
                    $scope.permissions = accountFactory.getAuthenticationData().permissions;
                } else {
                    //$scope.consultaOrden = params;
                    $scope.consultaOrden.StartDate = moment(params.StartDate, Constants.formatDate).toDate().getTime();
                    $scope.consultaOrden.EndDate = moment(params.EndDate, Constants.formatDate).toDate().getTime();
                    $scope.consultaOrden.Proveedor = params.Proveedor;
                    $scope.consultaOrden.IdProveedor = params.IdProveedor;
                    $scope.consultaOrden.UserName = params.UserName;
                    $scope.consultaOrden.UserId = params.UserId;
                    $scope.consultaOrden.NotSearchPermission = params.NotSearchPermission;
                    $scope.permissions = accountFactory.getAuthenticationData().permissions;
                }

                $scope.toggleMin();
                $scope.dateOptions = {
                    formatYear: 'yyyy',
                    formatMonth: 'MM',
                    formatDay: 'dd',
                    startingDay: 1
                };
                $scope.format = Constants.datepickerFormatDate;
                cargarProveedores();
                getUsers();

                $scope.saveProveedor = saveProveedor;
                $scope.saveUser = saveUser;

                //Asigna permisos a usuario
                $scope.permissions = accountFactory.getAuthenticationData().permissions;
                $scope.userId = accountFactory.getAuthenticationData().userId;
                setSearchPermissions();

                //Realiza la consulta regresando de detalles ordenes.
                getOrdenByParams(params);
            } else {
                //Setting user data for default
                $scope.consultaOrden = ordenFactory.getConsultaOrdenObject();

                $scope.toggleMin();
                $scope.dateOptions = {
                    formatYear: 'yyyy',
                    formatMonth: 'MM',
                    formatDay: 'dd',
                    startingDay: 1
                };
                $scope.format = Constants.datepickerFormatDate;
                cargarProveedores();
                getUsers();

                $scope.saveProveedor = saveProveedor;
                $scope.saveUser = saveUser;

                //Asigna permisos a usuario
                $scope.permissions = accountFactory.getAuthenticationData().permissions;
                $scope.userId = accountFactory.getAuthenticationData().userId;
                setSearchPermissions();
            }

            /* Cargar información de listas */
            function cargarProveedores() {
                proveedorFactory.getAll().then(function(proveedores) {
                    $scope.proveedores = proveedores;
                });
            }

            function getUsers() {
                userFactory.getUsers().then(function(users) {
                    $scope.users = users;
                });
            }

            function saveProveedor(proveedorObj, model, label) {
                $scope.consultaOrden.IdProveedor = proveedorObj.Id;
                $scope.consultaOrden.Proveedor = proveedorObj.Nombre;
            }

            function saveUser(usersObj, model, label) {
                $scope.consultaOrden.UserName = usersObj.FullName;
                $scope.consultaOrden.UserId = usersObj.Id;
            }

            function setSearchPermissions() {
                var permission = checkIfUserHasQueryPermission();
                if (permission) {
                    $scope.consultaOrden.NotSearchPermission = false;
                } else {
                    $scope.consultaOrden.UserName = accountFactory.getAuthenticationData().userName;
                    $scope.consultaOrden.UserId = accountFactory.getAuthenticationData().userId;
                    $scope.consultaOrden.NotSearchPermission = true;
                }
            }

            //Cheque si usurario tiene permiso para consultar orden
            function checkIfUserHasQueryPermission() {
                var permission = Permissions.CONSULTAR_TODAS_LAS_ORDENES;
                var index = $scope.permissions.indexOf(permission);
                if (index > -1) {
                    return true;
                } else {
                    return false;
                }
            }

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
                $scope.consultaOrden = ordenFactory.getConsultaOrdenObject();

                $scope.allData = null;
                $scope.gridOptions.ngGrid.config.sortInfo = {
                    fields: ['Numero'],
                    directions: ['asc'],
                    columns: []
                };

                // Resets the form validation state.
                $scope.consultarOrdenForm.$setPristine();
                //$rootScope.$broadcast('clear');
                $scope.consultaOrden.ReadOnly = false;
                setSearchPermissions();
            };

            $scope.sortInfo = {
                fields: ['Numero'],
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
                    field: 'Numero',
                    displayName: 'Numero'
                }, {
                    field: 'Tipo',
                    displayName: 'Tipo Orden'
                }, {
                    field: 'Proveedor.Nombre',
                    displayName: 'Proveedor'
                }, {
                    field: 'UserName',
                    displayName: 'Usuario'
                }, {
                    field: 'FechaCreacion',
                    displayName: 'Fecha Creacion',
                    cellFilter: 'date:\'dd/MM/yyyy HH:mm:ss\''
                }, {
                    field: '',
                    displayName: 'Detalles Orden',
                    cellTemplate: '<span class=\'glyphicon glyphicon-open glyphicon-center\' ng-click=\'showDetails(row)\'></span>'
                }],

                multiSelect: false,
                selectedItems: [],
                // Broadcasts an event when a row is selected, to signal the form that it needs to load the row data.
                afterSelectionChange: function(rowItem) {
                    if (rowItem.selected) {
                        $rootScope.$broadcast('ordenSelected', $scope.gridOptions.selectedItems[0]);
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

            // Picks the event broadcasted when the form is cleared to also clear the grid selection.
            $scope.$on('clear', function() {
                $scope.gridOptions.selectAll(false);
            });

            //From here you can go to details orden
            $scope.showDetails = function(row) {
                params.idOrden = row.entity.Id;
                $location.path('/ordenDetails').search(params);
            };

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

            $scope.changeFields = function() {
                if ($scope.consultaOrden.Numero) {
                    $scope.consultaOrden.ReadOnly = true;
                    $scope.consultaOrden.StartDate = new Date().getTime();
                    $scope.consultaOrden.EndDate = new Date().getTime();

                } else {
                    $scope.consultaOrden.ReadOnly = false;
                }
            };

            $scope.buscarOrden = function(isValid) {
                if (isValid) {
                    var permission = checkIfUserHasQueryPermission();
                    if (permission) {
                        if ($scope.consultaOrden.Numero) {
                            params = {
                                Numero: $scope.consultaOrden.Numero,
                                NotSearchPermission: $scope.consultaOrden.NotSearchPermission,
                                SearchType: 1
                            };
                        } else {
                            params = setQueryParams();
                        }
                        getOrdenByParams(params);
                    } else {
                        if ($scope.consultaOrden.Numero) {
                            params = {
                                Numero: $scope.consultaOrden.Numero,
                                NotSearchPermission: $scope.consultaOrden.NotSearchPermission,
                                UserId: $scope.userId,
                                SearchType: 1
                            };
                        } else {
                            params = setQueryParams();
                        }
                        getOrdenByParams(params);
                    }
                }
            };

            function getOrdenByParams(params) {
                ordenFactory.query(params).then(function(data) {
                    $scope.allData = data;
                    if ($scope.allData.length > 0) {
                        $scope.pagingOptions.currentPage = 1;
                        $scope.setPagingData(data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                    } else {
                        if (params.SearchType === 1) {
                            toaster.pop('warning', 'Advertencia', 'No existen Ordenes con el parámetro de búsqueda.');
                        } else {
                            toaster.pop('warning', 'Advertencia', 'No existen Ordenes con el rango de fecha, proveedor o usuario descrito.');
                        }
                    };
                });
            }

            function setQueryParams() {
                var params = {
                    StartDate: moment($scope.consultaOrden.StartDate).format(Constants.formatDate),
                    EndDate: moment($scope.consultaOrden.EndDate).format(Constants.formatDate),
                    IdProveedor: $scope.consultaOrden.IdProveedor,
                    Proveedor: $scope.consultaOrden.Proveedor,
                    UserName: $scope.consultaOrden.UserName,
                    UserId: $scope.consultaOrden.UserId,
                    NotSearchPermission: $scope.consultaOrden.NotSearchPermission,
                    SearchType: 2
                };
                return params;
            }

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

        }
    ]);
