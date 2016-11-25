'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the almacenApp
 */

angular.module('almacenApp')
    .controller('ProductosCtrl', ['$scope', '$log', '$rootScope', 'productoFactory', 'toaster', '$filter', 'modalWindowFactory', 'Constants', 'usSpinnerService',
        function($scope, $log, $rootScope, productoFactory, toaster, $filter, modalWindowFactory, Constants, usSpinnerService) {
            $log.debug('Iniciando Productos...');

            $scope.startSpin = function() {
                usSpinnerService.spin('spinner-1');
            }
            $scope.stopSpin = function() {
                usSpinnerService.stop('spinner-1');
            }

            /* Cargar información de listas */
            function cargarLineas() {
                $scope.startSpin();
                productoFactory.getLineas().then(function(lineas) {
                    $scope.lineas = lineas;
                    $scope.stopSpin();
                });
            }

            function cargarMedidas() {
                productoFactory.getMedidas().then(function(medidas) {
                    $scope.medidas = medidas;
                });
            }

            function cargarMonedas() {
                productoFactory.getMonedas().then(function(monedas) {
                    $scope.monedas = monedas;
                });
            }

            function seleccionarLinea(idLinea) {
                $scope.producto.IdSubLinea = '';
                buscarSubLineas(idLinea);
            }

            function buscarSubLineas(idLinea) {
                var found = $filter('filter')($scope.lineas, { Id: idLinea }, true);
                if (found.length) {
                    $scope.grupos = found[0].SubLineas;
                } else {
                    $scope.grupos = [];
                }
            }

            cargarLineas();
            cargarMedidas();
            cargarMonedas();
            $scope.seleccionarLinea = seleccionarLinea;

            $scope.search = '';
            $scope.sortInfo = {
                fields: ['Codigo'],
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
                    field: 'Codigo',
                    displayName: 'Codigo'
                }, {
                    field: 'Nombre',
                    displayName: 'Nombre'
                }, {
                    field: 'Referencia',
                    displayName: 'Referencia'
                }, {
                    field: '',
                    displayName: 'Inhabilitar',
                    width: 100,
                    cellTemplate: '<span class="glyphicon glyphicon-remove" ng-click="deleteRow(row)"></span>'
                }],

                multiSelect: false,
                selectedItems: [],
                afterSelectionChange: function(rowItem) {
                    if (rowItem.selected) {
                        $rootScope.$broadcast('productoSelected', $scope.gridOptions.selectedItems[0]);
                    }
                }
            };

            $scope.clearForm = function() {
                $scope.producto = null;
                $scope.producto = {
                    Id: 0,
                    CantidadInvetario: "000000"
                };
                $scope.allData = null;
                $scope.gridOptions.ngGrid.config.sortInfo = {
                    fields: ['Codigo'],
                    directions: ['asc'],
                    columns: []
                };
                $scope.productoForm.$setPristine();
                // Broadcast the event to also clear the grid selection.
                //$rootScope.$broadcast('clear');
            };

            $scope.settingProducto = function() {
                $scope.producto = null;
                $scope.producto = {
                    Id: 0,
                    CantidadInvetario: "000000"
                };
            };

            $scope.settingProducto();

            $scope.submitForm = function(isValid) {
                if (isValid) {
                    productoFactory.save($scope.producto).then(function() {
                        if ($scope.producto.Id === 0) {
                            toaster.pop('success', 'mensaje', 'El producto fue creado exitosamente.');
                        } else {
                            toaster.pop('success', 'mensaje', 'El producto fue actualizado exitosamente.');
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
                });
            }

            $scope.buscar = function() {
                $scope.clearForm();
                if ($scope.search) {
                    productoFactory.query($scope.search).then(function(data) {
                        $scope.allData = data;
                        if ($scope.allData.length > 0) {
                            $scope.pagingOptions.currentPage = 1;
                            $scope.setPagingData(data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                        } else {
                            toaster.pop('warning', 'Advertencia', 'No existe un producto con el parametro de búsqueda.');
                        };
                    });
                } else {
                    toaster.pop('warning', 'mensaje', 'Debe ingresar un Código o Nombre de Producto.');
                }
            };

            $scope.$watch('pagingOptions', function(newVal, oldVal) {
                if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                    $scope.setPagingData($scope.allData, $scope.pagingOptions.currentPage,
                        $scope.pagingOptions.pageSize);
                }
            }, true);

            $scope.$watch('sortInfo', function(newVal, oldVal) {
                sortData(newVal.fields[0], newVal.directions[0]);
                $scope.pagingOptions.currentPage = 1;
                $scope.setPagingData($scope.allData, $scope.pagingOptions.currentPage,
                    $scope.pagingOptions.pageSize);
            }, true);

            $scope.$on('ngGridEventSorted', function(event, sortInfo) {
                $scope.sortInfo = sortInfo;
            });

            $scope.$on('productoSelected', function(event, producto) {
                buscarSubLineas(producto.IdLinea);
                $scope.producto = producto;
            });

            $scope.deleteRow = function(row) {
                var title = 'Inhabilitar \'' + row.entity.Nombre + '\'';
                var msg = 'Seguro que deseas des activar este elemento?';
                var confirmCallback = function() {
                    productoFactory.inactivate($scope.producto.Id).then(function() {
                        toaster.pop('success', 'mensaje', 'El producto fue Inhabilitado exitosamente.');
                        $scope.clearForm();
                    }, function error(response) {
                        // An error has occurred
                        $rootScope.$emit('evento', {
                            descripcion: response.statusText
                        });
                    });
                };

                modalWindowFactory.show(title, msg, confirmCallback);
                //$rootScope.$broadcast('deletePerson', row.entity.id);
            };

            $scope.interacted = function(field) {
                return field.$dirty;
            };

            $scope.showMessage = function() {
                $('.required-icon, .required-combo-icon').tooltip({
                    placement: 'left',
                    title: 'Campo requerido'
                });
            };

            $scope.$on('clear', function() {
                $scope.gridOptions.selectAll(false);
            });

        }
    ]);
