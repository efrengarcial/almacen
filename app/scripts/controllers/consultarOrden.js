'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:ConsultarOrdenCtrl
 * @description
 * # ConsultarOrdenCtrl
 * Controller of the almacenApp
 */

angular.module('almacenApp')
    .controller('ConsultarOrdenCtrl', ['$scope', '$log', '$rootScope', 'userFactory', 'proveedorFactory', 'ordenFactory', 'toaster', '$filter',
        'modalWindowFactory', 'moment', 'Constants', 'accountFactory', '$location', '$routeParams',
        function($scope, $log, $rootScope, userFactory, proveedorFactory, ordenFactory, toaster, $filter, modalWindowFactory, moment, Constants, accountFactory, $location, $routeParams) {
            $log.debug('Iniciando consultar orden');

            var params = $routeParams,
                path = $location;
            $log.debug(path);
            $scope.proveedores = [];
            $scope.users = [];
            $scope.roles = [];

            $scope.toggleMin = function() {
                $scope.minDate = moment(Constants.minDate).format(Constants.formatDate);
            };

            //Check wether params object is empty when it is coming back from ordenes
            if (!isEmptyObject(params)) {
                $scope.consultaOrden = ordenFactory.getConsultaOrdenObject();
                //$log.debug("back: " + JSON.stringify(params));
                if (params.SearchType == 1) {
                    $scope.roles.push(accountFactory.getAuthenticationData().roles);
                    $scope.truefalse = true;
                    $scope.consultaOrden.Numero = params.Numero;
                    $scope.consultaOrden.UserName = accountFactory.getAuthenticationData().userName;
                    $scope.consultaOrden.SearchUserPermission = params.SearchUserPermission;
                } else {
                    $scope.consultaOrden = params;
                    $scope.roles.push(accountFactory.getAuthenticationData().roles);
                };

                $scope.toggleMin();
                $scope.dateOptions = {
                    formatYear: 'yyyy',
                    startingDay: 1
                };
                $scope.format = Constants.datepickerFormatDate;
                cargarProveedores();
                getUsers();

                $scope.saveProveedor = saveProveedor;
                $scope.saveUser = saveUser;

                ordenFactory.query(params).then(function(data) {
                    $scope.allData = data;
                    if ($scope.allData.length > 0) {
                        $scope.pagingOptions.currentPage = 1;
                        $scope.setPagingData(data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                    } else {
                        toaster.pop('warning', 'Advertencia', 'No existen Ordenes con el parámetro de búsqueda.');
                    }

                });
            } else {
                //Setting user data for default
                $scope.consultaOrden = ordenFactory.getConsultaOrdenObject();

                $scope.toggleMin();
                $scope.dateOptions = {
                    formatYear: 'yyyy',
                    startingDay: 1
                };

                $scope.format = Constants.datepickerFormatDate;
                cargarProveedores();
                getUsers();

                $scope.saveProveedor = saveProveedor;
                $scope.saveUser = saveUser;

                //Check if user has role
                $scope.roles.push(accountFactory.getAuthenticationData().roles);
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
                $log.debug('IdProveedor ' + $scope.consultaOrden.IdProveedor);
                $scope.consultaOrden.Proveedor = proveedorObj.Nombre;
            }

            function saveUser(usersObj, model, label) {
                $scope.consultaOrden.UserName = usersObj.FullName;
                $scope.consultaOrden.UserId = usersObj.Id;
            }


            function setSearchPermissions() {
                if ($scope.roles.indexOf("Almacenista") > -1) {
                    $scope.consultaOrden.SearchUserPermission = false;
                } else {
                    $scope.consultaOrden.UserName = accountFactory.getAuthenticationData().userName;
                    $scope.consultaOrden.UserId = accountFactory.getAuthenticationData().userId;
                    $scope.consultaOrden.SearchUserPermission = true;
                }
                $log.debug("roles: " + $scope.roles);
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

            $scope.showMessage = function() {
                $('.required-icon, .required-combo-icon').tooltip({
                    placement: 'left',
                    title: 'Campo requerido'
                });
            };

            $scope.clearForm = function() {
                $log.debug("clearForm");
                $scope.consultaOrden = ordenFactory.getConsultaOrdenObject();

                $scope.allData = null;
                $scope.gridOptions.ngGrid.config.sortInfo = {
                    fields: ['Numero'],
                    directions: ['asc'],
                    columns: []
                };

                // Resets the form validation state.
                $scope.consultarOrdenForm.$setPristine();
                // Broadcast the event to also clear the grid selection.
                //$rootScope.$broadcast('clear');
                $scope.truefalse = false;
                setSearchPermissions();
                $log.debug($location.path());
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
                //enablePaging : true,
                //showFooter : true,    
                //totalServerItems:'totalServerItems',               
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
                    cellTemplate: '<span class="glyphicon glyphicon-open glyphicon-center" ng-click="showDetails(row)"></span>'
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

            //Check whether a object is empty
            function isEmptyObject(obj) {
                for (var p in obj) {
                    return false;
                }
                return true;
            }

            $scope.$watch('pagingOptions', function(newVal, oldVal) {
                if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                    $scope.setPagingData($scope.allData, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                }
            }, true);

            // Watch the sortInfo variable. If changes are detected than we need to refresh the grid.
            // This also works for the first page access, since we assign the initial sorting in the initialize section.
            // sort over all data, not only the data on current page
            $scope.$watch('sortInfo', function(newVal, oldVal) {
                sortData(newVal.fields[0], newVal.directions[0]);
                $scope.pagingOptions.currentPage = 1;
                $scope.setPagingData($scope.allData, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
            }, true);


            // Do something when the grid is sorted.
            // The grid throws the ngGridEventSorted that gets picked up here and assigns the sortInfo to the scope.
            // This will allow to watch the sortInfo in the scope for changed and refresh the grid.
            $scope.$on('ngGridEventSorted', function(event, sortInfo) {
                $scope.sortInfo = sortInfo;
            });


            // Picks up the event broadcasted when the person is selected from the grid and perform 
            // the proveedor load by calling the appropiate rest service.
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
                //$log.debug("goTo: " + JSON.stringify(params));
                $location.path("/ordenDetails").search(params);
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

                if ($scope.consultaOrden.Numero !== undefined) {
                    $scope.truefalse = true;
                    $scope.consultaOrden.StartDate = new Date().getTime();
                    $scope.consultaOrden.EndDate = new Date().getTime();

                } else {
                    $scope.truefalse = false;
                }

            };

            $scope.buscar = function() {
                if ($scope.consultaOrden.Numero !== null && $scope.consultaOrden.Numero !== undefined) {
                    params = {
                        Numero: $scope.consultaOrden.Numero,
                        SearchUserPermission: $scope.consultaOrden.SearchUserPermission,
                        SearchType: 1
                    };

                    ordenFactory.query(params).then(function(data) {
                        $scope.allData = data;

                        if ($scope.allData.length > 0) {
                            $scope.pagingOptions.currentPage = 1;
                            $scope.setPagingData(data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                        } else {
                            toaster.pop('warning', 'Advertencia', 'No existen Ordenes con el parámetro de búsqueda.');
                        };
                    });
                } else {

                    params = {
                        StartDate: moment($scope.consultaOrden.StartDate).format(Constants.formatDate),
                        EndDate: moment($scope.consultaOrden.EndDate).format(Constants.formatDate),
                        IdProveedor: $scope.consultaOrden.IdProveedor,
                        Proveedor: $scope.consultaOrden.Proveedor,
                        UserName: $scope.consultaOrden.UserName,
                        UserId: $scope.consultaOrden.UserId,
                        SearchUserPermission: $scope.consultaOrden.SearchUserPermission,
                        SearchType: 2
                    };

                    ordenFactory.query(params).then(function(data) {
                        $log.debug(JSON.stringify(params));
                        $scope.allData = data;

                        if ($scope.allData.length > 0) {
                            $scope.pagingOptions.currentPage = 1;
                            $scope.setPagingData(data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                        } else {
                            toaster.pop('warning', 'Advertencia', 'No existen Ordenes con el rango de fecha, proveedor o usuario descrito.');
                        };
                    });
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

        }
    ]);
