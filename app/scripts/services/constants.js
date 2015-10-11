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
	.constant('authorDataKey', 'authorizationData')
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
		URI_GET_INBOX_ORDEN: 'orden/getInboxOrden',
		URI_GET_ORDEN: 'orden/getById',	
		URI_ORDENES_ORDENES_ABIERTAS: 'orden/getOrdenesCompraAbiertas',
		URI_USERS: 'account/users',
		URI_SAVE_SALIDA: 'salida/save',
		URI_CENTRO_COSTOS: 'producto/centroCostos',
		URI_ORDEN_BY_NUM: 'orden/getOrdenByNum',
		URI_TOKEN: 'token',
		URI_SAVE_ENTRADA: 'orden/saveEntrada',
		URI_REPORTES: 'SSRSReporting/saveReport'	
	})
	.constant('Roles', {		
		Almacenista : 'Almacenista',
		Operario : 'Operario'
	})
	.constant('Permissions', {		
		ADMIN_PRODUCTOS : 'ADMIN_PRODUCTOS',
		ADMIN_PROVEEDORES : 'ADMIN_PROVEEDORES',
		ENTRADAS : 'ENTRADAS',
		SALIDAS : 'SALIDAS',
		REQUISICIONES_POR_PROCESAR : 'REQUISICIONES_POR_PROCESAR',
		ORDEN_COMPRA : 'ORDEN_COMPRA',
		REQUISICION : 'REQUISICION',
		ORDEN_SERVICIO : 'ORDEN_SERVICIO',
		REQUISICION_SERVICIO : 'REQUISICION_SERVICIO',
		CONSULTAR_ORDENES : 'CONSULTAR_ORDENES'
	})
	.constant('Constants', {
		formatDate : 'DD/MM/YYYY',
		minDate : 1420149727,
		datepickerFormatDate : 'dd/MM/yyyy',
		pageSizes: [5, 10, 15],
        pageSize: 10,
        ORDEN_COMPRA: 'ORDEN_COMPRA',
        ORDEN_SERVICIO: 'ORDEN_SERVICIO',
        REQUISICION: 'REQUISICION',
        REQUISICION_SERVICIO: 'REQUISICION_SERVICIO',
        MIS_PENDIENTES: 'MIS_PENDIENTES',
        ENTRADAS: 'ENTRADAS',
        plazoMin: 1,
        plazoMax: 90
    });