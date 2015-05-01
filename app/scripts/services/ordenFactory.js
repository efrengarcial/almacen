'use strict';

/**
 * @ngdoc service
 * @name almacenApp.listasFactory
 * @description
 * # listasFactory
 * Factory in the almacenApp.
 */
angular
    .module('almacenApp')
    .factory('ordenFactory', ['Restangular', 'apiFactory', 'WS', 'moment', 'Constants', '$log',
        function(Restangular, apiFactory, WS, moment, Constants, $log) {
            return {
                getOrdenObject: function() {
                    var orden = {
                        Id: '00000000',
                        Tipo: null,
                        Numero: null,
                        IdProveedor: null,
                        Proveedor: null,
                        FechaOrden: moment().format(Constants.formatDate),
                        Solicitante: null,
                        CentroCostos: null,
                        Notas: '',
                        NombreProveedor: '',
                        OrdenItems: []
                    };
                    orden.PrecioTotal = function() {
                        var total = 0;
                        for (var i = 0; i < orden.OrdenItems.length; i += 1) {
                            var key = orden.OrdenItems[i];
                            if (key.PrecioTotal() !== null) {
                                total += key.PrecioTotal();
                            }
                        }

                        return total;
                    };
                    orden.AddItem = function() {
                        var ordenItem = {
                            Id: '00000000',
                            Cantidad: null,
                            Producto: {
                                Precio: null
                            },
                            Entradas: []
                        };

                    ordenItem.PrecioTotal = function() {
                        if (ordenItem.Cantidad === null || ordenItem.Producto.Precio === null) {
                            return null;
                        }
                        return ordenItem.Cantidad * ordenItem.Producto.Precio;
                    };

                    this.OrdenItems.push(ordenItem);

                    return ordenItem;
                    };

                    orden.removeItem = function(index) {
                        this.OrdenItems.splice(index, 1);                                         
                    };

                    return orden;
                },

                getConsultaOrdenObject: function() {
                    var consultaOrden = {
                        Numero: null,
                        StartDate: new Date().getTime(),
                        EndDate: new Date().getTime(),
                        Proveedor: null,
                        IdProveedor: null,
                        IdUsuario: null
                    };

                    return consultaOrden;
                },

                save: function(orden) {
                    var ordenWS = {
                        Id: orden.Id,
                        Tipo: orden.Tipo,
                        IdProveedor: orden.Proveedor.Id,
                        CentroCostos: orden.CentroCostos,
                        Notas: orden.Notas,
                        OrdenItems: []
                    };
                    for (var i = 0; i < orden.OrdenItems.length; i += 1) {
                        var ordenItem = orden.OrdenItems[i];
                        var ordenItemWS = {
                            Id: ordenItem.Id,
                            IdOrden: orden.Id,
                            IdProducto: ordenItem.Producto.Id,
                            Cantidad: ordenItem.Cantidad,
                            Precio: ordenItem.Producto.Precio,
                            Iva: ordenItem.Producto.Iva
                        };
                        ordenWS.OrdenItems.push(ordenItemWS);
                    }
                    $log.debug(ordenWS);
                    return apiFactory.all(WS.URI_SAVE_ORDEN).post(ordenWS);
                },

                getById: function(idOrden) {
                    var orden = this.getOrdenObject();
                    return apiFactory.one(WS.URI_GET_ORDEN, idOrden).get().then(function(ordenWS) {
                        orden.Id = ordenWS.Id;
                        orden.Numero = ordenWS.Numero;
                        orden.Tipo = ordenWS.Tipo;
                        orden.Proveedor = ordenWS.Proveedor;
                        orden.NombreProveedor = ordenWS.Proveedor.Nombre;
                        orden.FechaOrden = moment(ordenWS.FechaCreacion).format(Constants.formatDate);
                        orden.CentroCostos = ordenWS.CentroCostos;

                        for (var i = 0; i < ordenWS.OrdenItems.length; i += 1) {
                            var ordenItemWS = ordenWS.OrdenItems[i];
                            var ordenItem = orden.AddItem();
                            ordenItem.Id = ordenItemWS.Id;
                            ordenItem.Producto = ordenItemWS.Producto;
                            ordenItem.Cantidad = ordenItemWS.Cantidad;

                            if (ordenItemWS.Entradas !== null) {
                                
                            }
                        }

                        return orden;
                    });
                },

                inactivate: function(idOrden) {
                    return apiFactory.all(WS.URI_INACTIVATE_ORDEN).post(idOrden);
                },

                query: function(params) {
                    return apiFactory.all(WS.URI_QUERY_ORDEN).getList(params);
                },

                getInboxOrden: function() {
                    return apiFactory.all(WS.URI_GET_INBOX_ORDEN).getList().then(function(ordenes) {
                        return ordenes;
                    });
                },
                getOrdenesCompraAbiertas: function() {
                    return apiFactory.all(WS.URI_ORDENES_ORDENES_ABIERTAS).getList().then(function(ordenes) {
                        return ordenes;
                    });
                }
            };
        }
    ]);