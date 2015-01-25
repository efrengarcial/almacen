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
    .factory('ordenFactory', ['Restangular', 'apiFactory', 'WS','moment','Constants',
        function(Restangular, apiFactory, WS,moment,Constants) {
            return {
                getOrdenObject: function() {
                    var orden = {
                        Id: 0,
                        FechaOrden : moment().format(Constants.formatDate),
                        Notas: '',
                        OrdenItems: []
                    };
 					this.addOrdenItemObject(orden);
                    orden.PrecioTotal = function() {
                    	var total= 0;
                    	for(var i = 0; i < orden.OrdenItems.length; i += 1){
                    		var key =  orden.OrdenItems[i];
                    		if (key.PrecioTotal()!==null ){
                    			 total += key.PrecioTotal();
                    		}
                    	}
                        
                        return total;
                    };
                   
                    return orden;
                },
                addOrdenItemObject: function(orden) {
                    var ordenItem = {
                        Cantidad: null,
                        Producto: {
                            Precio: null
                        }
                    };
                    ordenItem.PrecioTotal = function() {
                        if (ordenItem.Cantidad === null ||
                            ordenItem.Producto.Precio === null) {
                            return null;
                        }
                        return ordenItem.Cantidad * ordenItem.Producto.Precio;
                    };
                    orden.OrdenItems.push(ordenItem);
                    return ordenItem;
                },
                save: function(orden) {
                    var ordenWS = {
                        Numero : 1,
                        Tipo: Constants.ORDEN_COMPRA,                       
                        IdProveedor : orden.IdProveedor,
                        CentroCostos: orden.CentroCostos ,
                        Notas : orden.Notas,
                        OrdenItems : [] 
                    };
                    for(var i = 0; i < orden.OrdenItems.length; i += 1){
                        var ordenItem =  orden.OrdenItems[i];
                        var ordenItemWS = {
                            IdProducto: ordenItem.Producto.Id,
                            Cantidad : ordenItem.Cantidad,
                            Precio : ordenItem.Producto.Precio,
                            Iva : ordenItem.Producto.Iva
                        };
                        ordenWS.OrdenItems.push(ordenItemWS);
                    }
                    return apiFactory.all(WS.URI_SAVE_ORDEN).post(ordenWS);
                }
            };
        }
    ]);