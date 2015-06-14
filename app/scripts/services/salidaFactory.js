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
                        Fecha: moment().format(Constants.formatDate),
                        Recibe: null,
                        SalidaItems: []
                    }

                    salida.AddItem = function() {
                        var salidaItem = {
                            Id: '00000000',
                            Cantidad: null,
                            Aprovisionado: null,
                            CantidadEntrada: null,
                            Orden: {
                                CentroCostos: null
                            },
                            Producto: {
                                Precio: null
                            },
                            Entradas: []
                        };

                        salidaItem.PrecioTotal = function() {
                            if (salidaItem.Cantidad === null || salidaItem.Producto.Precio === null) {
                                return null;
                            }
                            return salidaItem.Cantidad * salidaItem.Producto.Precio;
                        }

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
