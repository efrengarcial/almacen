'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:ProveedorCtrl
 * @description
 * # ProveedorCtrl
 * Controller of the almacenApp
 */

angular.module('almacenApp')
    .controller('ProveedorCtrl', ['$scope', '$log', '$rootScope', 'proveedorFactory', 'toaster', '$filter',
        'modalWindowFactory', 'Constants',
        function($scope, $log, $rootScope, proveedorFactory, toaster, $filter, modalWindowFactory, Constants) {
            $log.debug('Iniciando orden proveedores...');

            $scope.max = Constants.plazoMax;
            $scope.min = Constants.plazoMin;
            $scope.search = '';
            
            $scope.sortInfo = {
                fields: ['Nit'],
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
                    field: 'Nit',
                    displayName: 'Nit'
                }, {
                    field: 'Nombre',
                    displayName: 'Nombre'
                }, {
                    field: 'Telefono',
                    displayName: 'Telefono'
                }, {
                    field: 'Direccion',
                    displayName: 'Direccion'
                }, {
                    field: 'EMail',
                    displayName: 'E-mail'
                }, {
                    field: 'Ciudad',
                    displayName: 'Ciudad'
                }, {
                    field: 'FormaPago',
                    displayName: 'Forma Pago'
                }, {
                    field: '',
                    displayName: 'Inhabilitar',
                    width: 100,
                    cellTemplate: '<span class="glyphicon glyphicon-remove" ng-click="deleteRow(row)"></span>'
                }],

                multiSelect: false,
                selectedItems: [],
                // Broadcasts an event when a row is selected, to signal the form that it needs to load the row data.
                afterSelectionChange: function(rowItem) {
                    if (rowItem.selected) {
                        $rootScope.$broadcast('proveedorSelected', $scope.gridOptions.selectedItems[0]);
                    }
                }
            };

            $scope.clearForm = function() {
                $scope.proveedor = null;
                $scope.proveedor = {
                    Id: 0
                };
                $scope.allData = null;
                $scope.gridOptions.ngGrid.config.sortInfo = {
                    fields: ['Nit'],
                    directions: ['asc'],
                    columns: []
                };

                // Resets the form validation state.
                $scope.proveedorForm.$setPristine();
                // Broadcast the event to also clear the grid selection.
                //$rootScope.$broadcast('clear');
            };

            $scope.settingProveedor = function(){
                $scope.proveedor = null;
                $scope.proveedor = {
                    Id: 0
                };
            };

            $scope.settingProveedor();

            $scope.submitForm = function(isValid) {
                $log.debug(isValid);
                if (isValid) {
                    proveedorFactory.save($scope.proveedor).then(function(mensaje) {
                        if ($scope.proveedor.Id === 0) {
                            toaster.pop('success', 'mensaje', 'El proveedor fue creado exitosamente.');
                        } else {
                            toaster.pop('success', 'mensaje', 'El proveedor fue actualizado exitosamente.');
                        }
                        $scope.clearForm();
                    }, function error(response) {
                        // An error has occurred
                        $rootScope.$emit('evento', {
                            descripcion: response.statusText
                        });
                    });
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

            $scope.buscar = function() {
                $log.debug("Buscando proveedores......" + $scope.search);
                $scope.clearForm();

                if ($scope.search === "") {
                    toaster.pop('warning', 'Advertencia', 'Debe ingresar un Nit o Nombre de proveedor.');
                } else {
                    proveedorFactory.query($scope.search).then(function(data) {
                        $scope.allData = data;

                        if ($scope.allData.length > 0) {
                            $scope.pagingOptions.currentPage = 1;
                            $scope.setPagingData(data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                        } else {
                            toaster.pop('warning', 'Advertencia', 'No existe proveedor con el parametro de búsqueda.');
                        };
                    });
                }
            };

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
            $scope.$on('proveedorSelected', function(event, proveedor) {
                $scope.proveedor = proveedor;
            });


            // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
            $scope.deleteRow = function(row) {
                var title = 'Inhabilitar \'' + row.entity.Nombre + '\'';
                var msg = "Seguro que deseas desactivar este elemento?";
                var confirmCallback = function() {
                    proveedorFactory.inactivate($scope.proveedor.Id).then(function() {
                        toaster.pop('success', 'mensaje', 'El proveedor fue Inhabilitado exitosamente.');
                        $scope.clearForm();
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

            $scope.interacted = function(field) {
                return $scope.submitted || field.$dirty;
            };

            // Picks the event broadcasted when the form is cleared to also clear the grid selection.
            $scope.$on('clear', function() {
                $scope.gridOptions.selectAll(false);
            });

        }
    ]);