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
		URI_MEDIDAS: 'producto/medidas'		
	})
	.constant('menu', {		
		step1 : 'PASO 1 - COTIZACIÓN',
		step2 : 'PASO 2 - DATOS ADICIONALES',
		step3 : 'PASO 3 - PAGAR'
	})
	.constant('general', {
		formatDate : 'YYYY-MM-DD',
		maxMonthsVigencia : 6,
		minYearsNacimiento : 16,		
		minDateNacimiento : '1910-01-01'
	});