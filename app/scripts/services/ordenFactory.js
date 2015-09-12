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
                        Estado: null,
                        Numero: null,
                        IdProveedor: null,
                        UserName: null,
                        UserId: null,
                        Proveedor: null,
                        FechaOrden: moment().format(Constants.formatDate),
                        Solicitante: null,
                        CentroCostos: null,
                        Notas: '',
                        IdOrdenBase: null,
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
                            Aprovisionado: null,
                            CantidadEntrada: null,
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
                        UserName: null,
                        UserId: null,
                        SearchNotPermission: false
                    };

                    return consultaOrden;
                },

                saveEntrada: function(orden) {
                    var entradaWS = {
                        IdOrden: orden.Id,
                        EntadaOrdenItems: []
                    }
                    for (var i = 0; i < orden.OrdenItems.length; i += 1) {
                        var ordenItem = orden.OrdenItems[i];
                        var ordenItemWS = {
                            IdOrdenItem: ordenItem.Id,
                            Aprovisionado: ordenItem.CantidadEntrada                            
                        };
                        entradaWS.EntadaOrdenItems.push(ordenItemWS);
                    }

                    $log.debug(JSON.stringify(entradaWS));
                    return apiFactory.all(WS.URI_SAVE_ENTRADA).post(entradaWS);
                },

                save: function(orden) {
                    var ordenWS = {
                        Id: orden.Id,
                        Numero: orden.Numero,
                        UserId: orden.UserId,
                        Tipo: orden.Tipo,
                        IdProveedor: (orden.Proveedor !== null ? orden.Proveedor.Id : null),
                        CentroCostos: orden.CentroCostos,
                        Notas: orden.Notas,
                        IdOrdenBase: orden.IdOrdenBase,
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
                    return apiFactory.all(WS.URI_SAVE_ORDEN).post(ordenWS);
                },

                getById: function(idOrden) {
                    var orden = this.getOrdenObject();
                    return apiFactory.one(WS.URI_GET_ORDEN, idOrden).get().then(function(ordenWS) {
                        orden.Id = ordenWS.Id;
                        orden.Numero = ordenWS.Numero;
                        orden.Tipo = ordenWS.Tipo;
                        orden.Estado = ordenWS.Estado;
                        orden.UserId = ordenWS.UserId;
                        orden.Proveedor = ordenWS.Proveedor;
                        orden.NombreProveedor = (ordenWS.Proveedor !== null ? ordenWS.Proveedor.Nombre : null);
                        orden.FechaOrden = moment(ordenWS.FechaCreacion).format(Constants.formatDate);
                        orden.CentroCostos = ordenWS.CentroCostos;
                        orden.UserName = ordenWS.UserName;

                        for (var i = 0; i < ordenWS.OrdenItems.length; i += 1) {
                            var ordenItemWS = ordenWS.OrdenItems[i];
                            var ordenItem = orden.AddItem();
                            ordenItem.Id = ordenItemWS.Id;
                            ordenItem.Producto = ordenItemWS.Producto;
                            ordenItem.Cantidad = ordenItemWS.Cantidad;
                            ordenItem.Aprovisionado = ordenItemWS.Aprovisionado;
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
                },
                getOrdenByNum: function(ordenNum) {
                    return apiFactory.all(WS.URI_ORDEN_BY_NUM).get(ordenNum);
                }
            }
        }
    ]);