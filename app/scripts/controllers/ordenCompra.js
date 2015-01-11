'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:OrdenCompraCtrl
 * @description
 * # OrdenCompraCtrl
 * Controller of the almacenApp
 */
angular.module('almacenApp')
    .controller('OrdenCompraCtrl',['$scope','$log' , 'proveedorFactory', function($scope, $log,proveedorFactory) {
        $log.debug('Iniciando orden compra...');

        $scope.orden = {
        	Id:0
        };

   		/* Cargar información de listas */
        function cargarProveedores() {
            proveedorFactory.getAll().then(function(proveedores) {
                $scope.proveedores = proveedores;
            });
        }

        function saveProveedor(proveedorObj, model, label){
			$log.debug('label ' + label);
			$log.debug('model ' + JSON.stringify(model));
			$scope.orden.IdProveedor = proveedorObj.Id; 
			$scope.proveedor = proveedorObj;
		}

		$scope.saveProveedor = saveProveedor;
		cargarProveedores();

        $scope.showMessage = function() {
            $('.required-icon, .required-combo-icon').tooltip({
                placement: 'left',
                title: 'Campo requerido'
            });
        };        

    }
]);