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
    .factory('ordenFactory', ['Restangular', 'apiFactory', 'WS',
        function(Restangular, apiFactory, WS) {
            return {
                getOrdenObject: function() {
                    var orden = {
                        Id: 0,
                        OrdenItems: []
                    };
 					this.addOrdenItemObject(orden);
                    orden.PrecioTotal = function() {
                    	var total= 0;
                    	for(var i = 0; i < orden.OrdenItems.length; i += 1){
                    		var key =  orden.OrdenItems[i];
                    		if (key.PrecioTotal()!=null ){
                    			 total += key.PrecioTotal();
                    		}
                    	}
                        
                        return total;
                    }
                   
                    return orden;
                },
                addOrdenItemObject: function(orden) {
                    var ordenItem = {
                        Cantidad: null,
                        Producto: {
                            Precio: null
                        }
                    }
                    ordenItem.PrecioTotal = function() {
                        if (ordenItem.Cantidad === null ||
                            ordenItem.Producto.Precio === null) {
                            return null;
                        }
                        return ordenItem.Cantidad * ordenItem.Producto.Precio;
                    }
                    orden.OrdenItems.push(ordenItem);
                    return ordenItem;
                },
                save: function(orden) {
                    return apiFactory.all(WS.URI_SAVE_ORDEN).post(orden);
                }
            };
        }
    ]);