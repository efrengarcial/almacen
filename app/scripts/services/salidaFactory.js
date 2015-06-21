'use strict';

/**
 * @ngdoc service
 * @name almacenApp.salidaFactory
 * @description
 * # salidaFactory
 * Factory in the almacenApp.
 */
angular
    .module('almacenApp')
    .factory('salidaFactory', ['Restangular', 'apiFactory', 'WS', 'moment', 'Constants', '$log',
        function(Restangular, apiFactory, WS, moment, Constants, $log) {
            return {
                getSalidaObject: function() {

                    var salida = {
                        Codigo: '000000',
                        FechaEntrega: moment().format(Constants.formatDate),
                        Solicitador: null,
                        Recibidor: null,
                        IdSolicitador: null,
                        IdRecibidor: null,
                        SalidaItems: []
                    }

                    salida.AddItem = function() {
                        var salidaItem = {
                            Id: '00000000',
                            IdProducto: null,
                            IdCentroCostos: null,
                            Cantidad: null,
                            EquipoObra: null,
                            IdOrden: null,
                            IdSalida: null,
                            Orden: {
                                Numero: null
                            }
                        };

                        this.SalidaItems.push(salidaItem);
                        return salidaItem;
                    }

                    salida.removeItem = function(index) {
                        this.SalidaItems.splice(index, 1);
                    }

                    return salida;
                }
            }
        }
    ]);
