'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:inboxOrdenCtrl
 * @description
 * # inboxOrdenCtrl
 * Controller of the almacenApp
 */

angular.module('almacenApp')
    .controller('InboxOrdenCtrl', ['$scope', '$log', '$rootScope', 'proveedorFactory', 'ordenFactory',
        'toaster', '$filter', 'modalWindowFactory', 'moment', 'Constants', '$location',
        function($scope, $log, $rootScope, proveedorFactory, ordenFactory, toaster,
            $filter, modalWindowFactory, moment, Constants, $location) {
            $log.debug('Mostrando inboxOrden...' + $location.$$url);
            var tipoPantalla = null;

            if ($location.$$url === '/inboxOrden') {
                $scope.tituloPantalla = 'Mis pendientes';
                tipoPantalla = Constants.MIS_PENDIENTES;
            } else {
                $scope.tituloPantalla = 'Entradas';
                tipoPantalla = Constants.ENTRADAS;
            }

            $scope.sortInfo = {
                fields: ['FechaCreacion'],
                directions: ['des']
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
                    field: 'Numero',
                    displayName: 'Numero',
                    width: 100
                }, {
                    field: 'Tipo',
                    displayName: 'Tipo',
                    width: 220
                }, {
                    field: 'FechaCreacion',
                    displayName: 'Fecha',
                    cellFilter: 'date:\'dd/MM/yyyy HH:mm:ss\'',
                    width: 200
                }, {
                    field: 'Proveedor.Nombre',
                    displayName: 'Proveedor'
                }, {
                    field: 'CentroCostos',
                    displayName: 'CentroCostos'
                }, {
                    field: '',
                    displayName: 'Ir a',
                    width: 100,
                    cellTemplate: '<span class="glyphicon glyphicon-open glyphicon-center" ng-click="openOrden(row)"></span>'
                }, {
                    field: '',
                    displayName: 'Descartar',
                    width: 100,
                    cellTemplate: '<span class="glyphicon glyphicon-trash glyphicon-center" ng-click="deleteRow(row)"></span>'
                }],
                multiSelect: false,
                selectedItems: [],
                // Broadcasts an event when a row is selected, to signal the form that it needs to load the row data.
                afterSelectionChange: function(rowItem) {
                    if (rowItem.selected) {
                        $rootScope.$broadcast('inboxOrdenSelected', $scope.gridOptions.selectedItems[0]);
                    }
                }
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
            // the orden load by calling the appropiate rest service.
            $scope.$on('inboxOrdenSelected', function(event, orden) {
                $scope.orden = orden;
            });

            /* Cargar las requesiciones y requesiciones de servicios */
            function showMisPendientes() {
                ordenFactory.getInboxOrden().then(function(data) {
                    $scope.allData = data;

                    if ($scope.allData.length > 0) {
                        $scope.pagingOptions.currentPage = 1;
                        $scope.setPagingData($scope.allData, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                    } else {
                        toaster.pop('warning', 'Advertencia', 'No hay requesiciones ABIERTAS, para mostrar.');
                    }
                });
            }

            /* Cargar las ordenes de compra abiertas */
            function showOrdenesEntradas() {
                ordenFactory.getOrdenesCompraAbiertas().then(function(data) {
                    $scope.allData = data;

                    if ($scope.allData.length > 0) {
                        $scope.pagingOptions.currentPage = 1;
                        $scope.setPagingData($scope.allData, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                    } else {
                        toaster.pop('warning', 'Advertencia', 'No hay Ordenes de Compra ABIERTAS, para mostrar.');
                    }
                });
            }

            if (tipoPantalla === Constants.ENTRADAS) {
                showOrdenesEntradas();
            } else {
                showMisPendientes();
            }



            // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
            $scope.deleteRow = function(row) {
                var title = 'Inhabilitar \'' + row.entity.Numero + '\'';
                var msg = "Seguro que deseas desactivar este elemento?";
                var confirmCallback = function() {
                    ordenFactory.inactivate($scope.orden.Id).then(function() {
                        $log.debug("Id orden: " + $scope.orden.Id);
                        toaster.pop('success', 'mensaje', 'La orden ha sido Inhabilitada exitosamente.');
                        //$scope.clearForm();
                         showOrdenesEntradas();
                    }, function error(response) {
                        // An error has occurred
                        $rootScope.$emit('evento', {
                            descripcion: response.statusText
                        });
                    });
                }

                modalWindowFactory.show(title, msg, confirmCallback);
                //$rootScope.$broadcast('deletePerson', row.entity.id);
            };

            $scope.openOrden = function(row) {

                //Aqui se redirecciona a entradas o a la orden.
                if ($location.$$url === '/inboxOrden') {
                    if (row.entity.Tipo === Constants.REQUISICION_SERVICIO) {
                        $location.path("/ordenServicio").search({
                            idOrden: row.entity.Id
                        });

                    } else {
                        $location.path("/ordenCompra").search({
                            idOrden: row.entity.Id
                        });
                    };

                } else {
                    $location.path("/entrada").search({
                        idOrden: row.entity.Id
                    });
                }
            };


            // Picks the event broadcasted when the form is cleared to also clear the grid selection.
            $scope.$on('clear', function() {
                $scope.gridOptions.selectAll(false);
            });
        }
    ]);
