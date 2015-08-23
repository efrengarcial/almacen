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
                        Id: '000000',
                        FechaEntrega: moment().format(Constants.formatDate),
                        Solicitador: null,
                        Recibidor: null,
                        IdSolicitador: null,
                        IdRecibidor: null,
                        SalidaItems: []
                    };

                    salida.AddItem = function() {
                        var salidaItem = {
                            Id: '00000000',
                            IdProducto: null,
                            Codigo: null,
                            IdCentroCostos: null,
                            Cantidad: null,
                            EquipoObra: null,
                            IdOrden: null,
                            IdSalida: null,
                            NumeroOrden: null,
                            Producto: null
                        };

                        this.SalidaItems.push(salidaItem);
                        return salidaItem;
                    };

                    salida.removeItem = function(index) {
                        this.SalidaItems.splice(index, 1);
                    };

                    return salida;
                },

                save: function(salida) {
                    var salidaWS = {
                        Id: salida.Id,
                        IdSolicitador: salida.IdSolicitador,
                        IdRecibidor: salida.IdRecibidor,
                        SalidaItems: []
                    };

                    for (var i = 0; i < salida.SalidaItems.length; i++) {
                        var salidaItem = salida.SalidaItems[i];
                        var salidaItemWS = {
                            Id: salidaItem.Id,
                            IdProducto: salidaItem.Producto.Id,
                            IdCentroCostos: salidaItem.IdCentroCostos,
                            CentroCostos: salidaItem.CentroCostos,
                            Cantidad: salidaItem.Cantidad,
                            EquipoObra: salidaItem.EquipoObra,
                            IdOrden: salidaItem.IdOrden,
                            NumeroOrden: salidaItem.NumeroOrden,
                            IdSalida: salida.Id
                        };
                        salidaWS.SalidaItems.push(salidaItemWS);
                    }
                    $log.debug(JSON.stringify(salidaWS));
                    return apiFactory.all(WS.URI_SAVE_SALIDA).post(salidaWS);
                }
            }
        }
    ]);
