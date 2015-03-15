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
            $scope.search = '';

            //Setting starting Date
            $scope.dates = {
                startingDate: "aaaa/mm/dd",
                endDate: "aaaa/mm/dd"
            };

            $scope.today = function() {
                $scope.dates.startingDate = new Date().getTime();
                $scope.dates.endDate = new Date().getTime();
            };

            $scope.today();

            $scope.clear = function() {
                $scope.dates.startingDate = null;
                $scope.dates.endDate = null;
            };

            // Disable weekend selection
            $scope.disabled = function(date, mode) {
                return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
            };

            $scope.toggleMin = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function($event) {
                console.log($event);
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[1];
            //Settin end Date

            $scope.orden = ordenFactory.getOrdenObject();
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
                $scope.orden.IdProveedor = proveedorObj.Id;
                $scope.proveedor = proveedorObj;
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
                    field: 'IdProveedor',
                    displayName: 'Proveedor'
                }, {
                    field: 'FechaCreacion',
                    displayName: 'Fecha Creacion'
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
                $scope.orden = null;
                $scope.orden = {
                    Id: 0
                };
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

            //Setting change fields

            var requestType = 0;
            var params = {};
            $scope.changeFields = function() {

                if (typeof $scope.search !== undefined) {
                    $scope.truefalse = true;
                    requestType = 1;

                }
                if ((typeof $scope.search === undefined) && (typeof $scope.dates.startingDate !== undefined) && (typeof $scope.dates.endDate !== undefined) && (typeof $scope.orden.Proveedor === undefined)) {
                    $scope.truefalse = false;
                    requestType = 2;

                }

                if (($scope.search === undefined) && ($scope.dates.startingDate !== undefined) && ($scope.dates.endDate !== undefined) && ($scope.orden.Proveedor !== undefined)) {
                    $scope.truefalse = false;
                    requestType = 3;

                }

            };

            $scope.buscar = function() {

                console.log("orden: " + $scope.search);
                console.log("Inicial: " + $scope.dates.startingDate);
                console.log("Final: " + $scope.dates.endDate);
                console.log("Proveedor: " + $scope.orden.Proveedor);

                $scope.clearForm();
                console.log("type: " + requestType);

                switch (requestType) {
                    case 1:
                        if ($scope.search === "") {
                            toaster.pop('warning', 'Advertencia', 'Debe ingresar un Número de Orden.');
                        } else {

                            params = {
                                orden: $scope.search
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
                        }
                        break;
                    case 2:
                        //Rango Fecha
                        params = {
                            startingDate: moment($scope.dates.startingDate).format(Constants.formatDate),
                            endDate: moment($scope.dates.endDate).format(Constants.formatDate),
                        };

                        ordenFactory.query(params).then(function(data) {
                            $scope.allData = data;

                            if ($scope.allData[0] === undefined) {
                                toaster.pop('warning', 'Advertencia', 'No existe el rango de fecha descrito');
                            } else {
                                $scope.pagingOptions.currentPage = 1;
                                $scope.setPagingData(data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                            };
                        });

                        break;
                    case 3:
                        //Rango Fecha & proveedor

                        params = {
                            startingDate: moment($scope.dates.startingDate).format(Constants.formatDate),
                            endDate: moment($scope.dates.endDate).format(Constants.formatDate),
                            proveedor: $scope.orden.Proveedor
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

                        break;
                    default:
                        break;
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