'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:OrdenDetailsCtrl
 * @description
 * # OrdenDetailsCtrl
 * Controller of the almacenApp
 */
angular.module('almacenApp')
    .controller('OrdenDetailsCtrl', ['$scope', '$log', '$rootScope', 'proveedorFactory', 'productoFactory',
        'ordenFactory', 'modalWindowFactory', 'toaster', '$location', 'Constants', 'accountFactory', '$routeParams',
        function($scope, $log, $rootScope, proveedorFactory, productoFactory, ordenFactory, modalWindowFactory,
            toaster, $location, Constants, accountFactory, $routeParams) {

            $log.debug('Iniciando ordenDetails: ' + $location.$$url);
            var tipoPantalla = null;

            var idOrden = $routeParams.idOrden;

            if ($location.path() === '/ordenDetails') {
                $scope.tituloPantalla = 'Detalles del Producto';
            }

            if (idOrden !== undefined) {
                ordenFactory.getById(idOrden).then(function(orden) {

                    $scope.orden = orden;
                    var data = orden.OrdenItems;
                    $log.debug($scope.orden);

                    $scope.allData = data;
                    if ($scope.allData[0] === undefined) {
                        toaster.pop('warning', 'Advertencia', 'No hay artículos para esta Orden.');
                    } else {
                        $scope.pagingOptions.currentPage = 1;
                        $scope.setPagingData(data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                    };
                });
            }

            //Table data
            $scope.sortInfo = {
                fields: ['Id'],
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
                    field: 'Id',
                    displayName: 'Id'
                }, {
                    field: 'Producto.Nombre',
                    displayName: 'Producto'
                }, {
                    field: 'Cantidad',
                    displayName: 'Cantidad'
                }, {
                    field: 'Producto.Precio',
                    displayName: 'Precio'
                }, {
                    field: 'Producto.Iva',
                    displayName: 'Iva'
                }],
                multiSelect: false,
                selectedItems: [],
                // Broadcasts an event when a row is selected, to signal the form that it needs to load the row data.
                afterSelectionChange: function(rowItem) {
                    if (rowItem.selected) {
                        $rootScope.$broadcast('ordenDetailsSelected', $scope.gridOptions.selectedItems[0]);
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

            // Picks the event broadcasted when the form is cleared to also clear the grid selection.
            $scope.$on('clear', function() {
                $scope.gridOptions.selectAll(false);
            });

        }
    ]);