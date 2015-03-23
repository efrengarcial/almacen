'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:ConsultarOrdenCtrl
 * @description
 * # ConsultarOrdenCtrl
 * Controller of the almacenApp
 */

angular.module('almacenApp')
    .controller('ConsultarOrdenCtrl', ['$scope', '$log', '$rootScope', 'proveedorFactory', 'ordenFactory', 'toaster', '$filter',
        'modalWindowFactory', 'moment', 'Constants',
        function($scope, $log, $rootScope, proveedorFactory, ordenFactory, toaster, $filter, modalWindowFactory, moment, Constants) {
            $log.debug('Iniciando consultar orden');

            //Setting starting Date
            $scope.consultaOrden = ordenFactory.getConsultaOrdenObject();

            $scope.toggleMin = function() {
                $scope.minDate = moment(Constants.minDate).format(Constants.formatDate);
            };
            $scope.toggleMin();

            $scope.open = function($event, fecha) {
                $event.preventDefault();
                $event.stopPropagation();
                if ('openedStartDate' === fecha) {
                    $scope.openedStartDate = true;
                } else {
                    $scope.openedEndDate = true;
                }

            };

            $scope.dateOptions = {
                formatYear: 'yyyy',
                startingDay: 1
            };

            $scope.format = Constants.datepickerFormatDate;


            //Setting end Date

            $scope.proveedores = [];

            /* Cargar información de listas */
            function cargarProveedores() {
                proveedorFactory.getAll().then(function(proveedores) {
                    $scope.proveedores = proveedores;
                });
            }

            function saveProveedor(proveedorObj, model, label) {
                $log.debug('label ' + label);
                $log.debug('model ' + JSON.stringify(model));
                $scope.consultaOrden.IdProveedor = proveedorObj.Id;
                $scope.consultaOrden.Proveedor = proveedorObj.Nombre;
            }

            $scope.saveProveedor = saveProveedor;
            cargarProveedores();

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
                    field: 'Numero',
                    displayName: 'Numero'
                }, {
                    field: 'Proveedor.Nombre',
                    displayName: 'Proveedor'
                }, {
                    field:'FechaCreacion',
                    displayName: 'Fecha Creacion',
                     cellFilter: 'date:\'dd/MM/yyyy HH:mm:ss\''
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
                        $rootScope.$broadcast('ordenSelected', $scope.gridOptions.selectedItems[0]);
                    }
                }
            };


            //Interacted and show message about required
            $scope.interacted = function(field) {
                return $scope.submitted || field.$dirty;
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

            $scope.changeFields = function() {

                if ($scope.consultaOrden.Numero !== undefined) {
                    $scope.truefalse = true;
                } else {
                    $scope.truefalse = false;
                    $scope.consultaOrden.Numero = null;
                }

            };

            $scope.buscar = function() {

                /*$log.debug("Orden: " + $scope.consultaOrden.Numero);
                $log.debug("StartinDate: " + moment($scope.consultaOrden.StartDate).format(Constants.formatDate));
                $log.debug("EndDate: " + moment($scope.consultaOrden.EndDate).format(Constants.formatDate));
                $log.debug("Proveedor: " + $scope.consultaOrden.Proveedor);
                $log.debug("IdProveedor: " + $scope.consultaOrden.IdProveedor);*/

                if ($scope.consultaOrden.Numero !== null) {
                    var params = {
                        Numero: $scope.consultaOrden.Numero
                    };

                    ordenFactory.query(params).then(function(data) {
                        $scope.allData = data;

                        if ($scope.allData[0] === undefined) {
                            toaster.pop('warning', 'Advertencia', 'No existe Orden con el parámetro de búsqueda.');
                        } else {
                            $scope.pagingOptions.currentPage = 1;
                            $scope.setPagingData(data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                        };
                    });
                } else {

                    var params = {
                        StartDate: moment($scope.consultaOrden.StartDate).format(Constants.formatDate),
                        EndDate: moment($scope.consultaOrden.EndDate).format(Constants.formatDate),
                        IdProveedor: $scope.consultaOrden.IdProveedor
                    };

                    ordenFactory.query(params).then(function(data) {
                        $scope.allData = data;

                        if ($scope.allData[0] === undefined) {
                            toaster.pop('warning', 'Advertencia', 'No existe el rango de fecha  o el proveedor descrito.');
                        } else {
                            $scope.pagingOptions.currentPage = 1;
                            $scope.setPagingData(data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
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
            $scope.$on('ordenSelected', function(event, orden) {
                $scope.orden = orden;
            });


            // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
            $scope.deleteRow = function(row) {
                var title = 'Inhabilitar \'' + row.entity.Numero + '\'';
                var msg = "Seguro que deseas desactivar este elemento?";
                var confirmCallback = function() {
                    ordenFactory.inactivate($scope.orden.Id).then(function() {
                        toaster.pop('success', 'mensaje', 'La Orden fue Inhabilitada exitosamente.');
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


            // Picks the event broadcasted when the form is cleared to also clear the grid selection.
            $scope.$on('clear', function() {
                $scope.gridOptions.selectAll(false);
            });

        }
    ]);