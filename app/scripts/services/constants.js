'use strict';

/**
 * @ngdoc service
 * @name almacenApp.constants
 * @description
 * # constants
 * Constant in the almacenApp.
 */
angular
	.module('almacenApp')
	.constant('appConfig', {		
		version : 0.1,
		apiDomain : 'http://localhost/FrigorificosBle.Almacen.SPA/', //document.location,
		apiPath : 'api',
		apiTimeout : 500000
	})
	.constant('WS', {
		URI_LINEAS : 'producto/lineas',
		URI_MEDIDAS: 'producto/medidas',
		URI_SAVE_PRODUCTO: 'producto/save',
		URI_INACTIVATE_PRODUCTO: 'producto/inactivate',
		URI_QUERY_PRODUCTO: 'producto/query',
		URI_SAVE_PROVEEDOR: 'proveedor/save',
		URI_QUERY_PROVEEDOR: 'proveedor/query',
		URI_INACTIVATE_PROVEEDOR: 'proveedor/inactivate',
		URI_PROVEEDORES: 'proveedor/getAll',
		URI_SAVE_ORDEN: 'orden/save',
		URI_QUERY_ORDEN: 'orden/query',
		URI_INACTIVATE_ORDEN: 'orden/inactivate',
		URI_ORDENES: 'orden/getInboxOrden',
		
		URI_TOKEN: 'token'

	})
	.constant('menu', {		
		step1 : 'PASO 1 - COTIZACIÓN',
		step2 : 'PASO 2 - DATOS ADICIONALES',
		step3 : 'PASO 3 - PAGAR'
	})
	.constant('Constants', {
		formatDate : 'DD/MM/YYYY',
		minDate : 1420149727,
		datepickerFormatDate : 'dd/MM/yyyy',
		pageSizes: [5, 10, 15],
        pageSize: 15,
        ORDEN_COMPRA: 'ORDEN_COMPRA',
        ORDEN_SERVICIO: 'ORDEN_SERVICIO',
        REQUISICION: 'REQUISICION',
        REQUISICION_SERVICIO: 'REQUISICION_SERVICIO',
        plazoMin: 1,
        plazoMax: 90
    });