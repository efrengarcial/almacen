'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the almacenApp
 */

angular.module('almacenApp')
    .controller('ProductosCtrl', ['$scope', '$log', '$rootScope', 'productoFactory', 'toaster', '$filter',
        'modalWindowFactory','Constants',
        function($scope, $log, $rootScope, productoFactory, toaster, $filter, 
        	modalWindowFactory,Constants) {
            $log.debug('Iniciando Productos...');

             /* Cargar información de listas */
            function cargarLineas() {
                productoFactory.getLineas().then(function(lineas) {
                    $scope.lineas = lineas;
                });
            }

            function cargarMedidas() {
                productoFactory.getMedidas().then(function(medidas) {
                    $scope.medidas = medidas;
                });
            }

            function seleccionarLinea(idLinea) {
               $scope.producto.IdSubLinea = '';
               buscarSubLineas(idLinea);
            }
            function buscarSubLineas(idLinea) {
                var found = $filter('filter')($scope.lineas, {
                    Id: idLinea
                }, true);
                if (found.length) {
                    
                    $scope.grupos = found[0].SubLineas;
                } else {
                    $scope.grupos = [];
                }
            }
            
            cargarLineas();
            cargarMedidas();
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
                // Broadcasts an event when a row is selected, to signal the form that it needs to load the row data.
                afterSelectionChange: function(rowItem) {
                    if (rowItem.selected) {
                        $rootScope.$broadcast('productoSelected', $scope.gridOptions.selectedItems[0]);
                    }
                }
            };


            $scope.clearForm = function() {
                $scope.producto = null;
                $scope.producto = {
                	Id:0,	
                	Activo: true
            	};
            	$scope.allData=null;
            	$scope.gridOptions.ngGrid.config.sortInfo = { fields:['Codigo'], 
            		directions: ['asc'], columns:[] };
                // Resets the form validation state.
                //https://github.com/angular/angular.js/issues/10006
                //https://docs.angularjs.org/api/ng/type/form.FormController
                 $scope.productoForm.$setPristine();
                // Broadcast the event to also clear the grid selection.
                //$rootScope.$broadcast('clear');
            };

            $scope.submitForm = function(isValid) {
                $log.debug(isValid);
                if (isValid) {
                    productoFactory.save($scope.producto).then(function() {
                    	if ($scope.producto.Id === 0){
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
                $log.debug('Buscando productos......');
                $scope.clearForm();
                productoFactory.query($scope.search).then(function(data) {
                    $scope.allData = data;
                    $scope.pagingOptions.currentPage = 1;
                    $scope.setPagingData(data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                });
            };

            $scope.$watch('pagingOptions', function(newVal, oldVal) {
                if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                    $scope.setPagingData($scope.allData, $scope.pagingOptions.currentPage,
                        $scope.pagingOptions.pageSize);
                }
            }, true);

            // Watch the sortInfo variable. If changes are detected than we need to refresh the grid.
            // This also works for the first page access, since we assign the initial sorting in the initialize section.
            // sort over all data, not only the data on current page
            $scope.$watch('sortInfo', function(newVal, oldVal) {
                sortData(newVal.fields[0], newVal.directions[0]);
                $scope.pagingOptions.currentPage = 1;
                $scope.setPagingData($scope.allData, $scope.pagingOptions.currentPage,
                    $scope.pagingOptions.pageSize);
            }, true);

            // Do something when the grid is sorted.
            // The grid throws the ngGridEventSorted that gets picked up here and assigns the sortInfo to the scope.
            // This will allow to watch the sortInfo in the scope for changed and refresh the grid.
            $scope.$on('ngGridEventSorted', function(event, sortInfo) {
                $scope.sortInfo = sortInfo;
            });

            // Picks up the event broadcasted when the person is selected from the grid and perform 
            // the producto load by calling the appropiate rest service.
            $scope.$on('productoSelected', function(event, producto) {
                buscarSubLineas(producto.IdLinea);
                $scope.producto = producto;
            });

            // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
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
                return $scope.submitted || field.$dirty;
            };

            $scope.showMessage = function() {
                $('.required-icon, .required-combo-icon').tooltip({
                    placement: 'left',
                    title: 'Campo requerido'
                });
            };
           
               // Picks the event broadcasted when the form is cleared to also clear the grid selection.
    		$scope.$on('clear', function () {
        		$scope.gridOptions.selectAll(false);
    		});          

        }
    ]);