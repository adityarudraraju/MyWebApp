var myApp = angular.module("myApp",["ngRoute"]);

myApp.config(function($routeProvider){
	$routeProvider
	.when("/",{templateUrl: "main.html"})
	.when("/second",{templateUrl: "Second.html"})
	.when("/third",{templateUrl: "C:/Users/ADI/Desktop/MyProject/Third.html"});
});

myApp.factory('myGrid', function(){
	var grid = {};
	var rootDiv = document.getElementById("myGridId");
	var preScrollTopPosition = 0;
	grid.tableHeader = function(gridObject){		
		grid.HeaderRow(gridObject);
	};
	
	grid.tableBody = function(gridObject){
		grid.bodyCreation(gridObject, 0, Math.floor(gridObject.gridBodyHeight/ gridObject.cellHeight));
	};
	
	grid.scrolling = function(gridObject){		
		var body = document.getElementById(gridObject.bodyDivId);		
		if(body != undefined && body != null){
			document.getElementById(gridObject.headerDivId).scrollLeft = body.scrollLeft;
			document.getElementById(gridObject.dataDisplayDiv).scrollLeft = body.scrollLeft;
		}
		if(body.scrollTop >= 0 && body.scrollTop != this.preScrollTopPosition){
			this.preScrollTopPosition = body.scrollTop;
			var index = Math.floor(body.scrollTop/gridObject.cellHeight);
			var maxRowLen = gridObject.gridBodyHeight/ gridObject.cellHeight;
			var bodySubDiv = document.getElementById(gridObject.dataDisplayDiv);
			grid.bodyCreation(gridObject, index, Math.floor(gridObject.gridBodyHeight/ gridObject.cellHeight));
		}
	};
	
	grid.divCreation = function(cls, id){
		var div = document.createElement("div");
		for(var i=0;i<arguments.length;i++){
			var elementAttr;
			if(arguments[i].class){
				elementAttr = document.createAttribute("class");
				elementAttr.value = arguments[i].class;
				div.setAttributeNode(elementAttr);
			}else if(arguments[i].id){
				elementAttr = document.createAttribute("id");
				elementAttr.value = arguments[i].id;
				div.setAttributeNode(elementAttr);
			}
		}
		return div;
	};
	
	grid.rowCreation = function(){
		var cellDiv = this.divCreation({class:"HeaderCell"});
	};
	
	grid.HeaderRow = function(gridObject){
		var rowLen, gridHeaderDiv, gridBodyDiv, subBodyDiv, dataDisplayDiv;
		gridHeaderDiv = this.divCreation({class:"tableHeader"}, {id:gridObject.headerDivId});		
		gridBodyDiv = this.divCreation({class:"tableBody"}, {id:gridObject.bodyDivId});
		gridBodyDiv.addEventListener("scroll",function(){
			grid.scrolling(gridObject);
		});
		subBodyDiv = this.divCreation({class:"childBodyDiv"}, {id:gridObject.bodySubDivId});
		dataDisplayDiv = this.divCreation({class:"displayDiv"},{id:gridObject.dataDisplayDiv});
		subBodyDiv.style.minWidth = (gridObject.colLen * 100) + "px";
		subBodyDiv.style.maxWidth = (gridObject.colLen * 100) + "px";
		gridBodyDiv.appendChild(subBodyDiv);		
		rootDiv.appendChild(grid.refreshGridData(0, gridObject, gridHeaderDiv));
		rootDiv.appendChild(gridBodyDiv);
		rootDiv.appendChild(dataDisplayDiv);
		return rootDiv;
	};
	
	grid.bodyCreation = function(gridObject, index, maxRows){
		var bodyDiv = document.getElementById(gridObject.dataDisplayDiv);		
		if(bodyDiv != undefined || bodyDiv != null)
			bodyDiv.innerHTML = "";
		document.getElementById("bodySubDiv").style.height = (gridObject.rowLen * gridObject.cellHeight) + "px";		
		if(!gridObject.gridData){
			document.getElementById("bodySubDiv").style.border = "0px solid black";
		}else{
			if(gridObject.gridData.length < maxRows)
				maxRows = gridObject.gridData.length;
			if((index + maxRows) >= gridObject.rowLen){
				maxRows = gridObject.rowLen
			}else{
				maxRows = index + maxRows;
			}
			for(var i = index;i < maxRows;i++){
				var rowDiv = this.divCreation({class:"Row"});
				var rowData = gridObject.gridData[i];
				for(var j = 1;j <= gridObject.colLen;j++){
					var cellDiv = this.divCreation({class:"Cell"});
					var t = document.createTextNode(rowData["H"+j]);
					cellDiv.appendChild(t);
					rowDiv.appendChild(cellDiv);
					if(j === gridObject.colLen){
						rowDiv.appendChild(this.divCreation({class:"emptyHeaderCell"}));
					}
				}
				bodyDiv.appendChild(rowDiv);
			}
		}			
	};
	
	grid.refreshGridData = function(rowIndex, gridObject, gridHeaderDiv){
		for(var i = rowIndex;i < 1;i++){
			var rowDiv = this.divCreation({class:"Row"});
			for(var j = 1;j <= gridObject.colLen;j++){
				var cellDiv = this.divCreation({class:"HeaderCell"});
				cellDiv.appendChild(document.createTextNode("Head-"+j));
				rowDiv.appendChild(cellDiv);
				if(j === gridObject.colLen)
					rowDiv.appendChild(this.divCreation({class:"emptyHeaderCell"}));
			}
			gridHeaderDiv.appendChild(rowDiv);
		}
		return gridHeaderDiv;
	};
		
	return grid;
});

myApp.controller("myController",function($scope, myGrid){
	
	$scope.prepareObject = function(rowKey,colKey){
		return colKey+': "Row-'+rowKey+'&Col-'+colKey+'"';
	};
	
	$scope.inpObj = {};
	$scope.gridObject = {};
	$scope.gridObject.rootDiv = "myGridId";
	$scope.gridObject.headerDivId = "headerDiv";
	$scope.gridObject.bodyDivId = "bodyDiv";
	$scope.gridObject.bodySubDivId = "bodySubDiv";
	$scope.gridObject.dataDisplayDiv = "dataDisplayDiv";
	$scope.gridObject.headerDataRows = 1;
	$scope.gridObject.gridBodyHeight = 374;
	$scope.gridObject.rowLen = 1;
	$scope.gridObject.colLen = 14;
	$scope.gridObject.cellWidth = 100;
	$scope.gridObject.cellHeight = 22;
	$scope.gridObject.gridData = null;
	
	$scope.prepareResponse = function(){
		var rowObject = [];		
		for(var i = 1;i <= $scope.gridObject.rowLen;i++){
			var colObject = {};
			for(var j = 1;j <= $scope.gridObject.colLen;j++){		
				colObject["H"+j] = "Row-"+i+"&Col-"+j;				
			}
			rowObject.push(colObject);			
		}
		return rowObject;
	};
	
	$scope.generateResponse = function(){
		if($scope.inpObj.tableRows != undefined && $scope.inpObj.tableRows != ""){
			$scope.gridObject.rowLen = parseInt($scope.inpObj.tableRows);
		}
		if($scope.inpObj.tableColumns != undefined && $scope.inpObj.tableColumns != ""){			
			if($scope.inpObj.tableColumns != $scope.gridObject.colLen){
				$scope.gridObject.colLen = parseInt($scope.inpObj.tableColumns);
				var hDiv = document.getElementById($scope.gridObject.rootDiv);
				if(hDiv != undefined && hDiv != null)
					hDiv.innerHTML = "";
				myGrid.tableHeader($scope.gridObject);
			}				
		}
		$scope.refreshGridData($scope.prepareResponse());
	};
	
	$scope.refreshGridData = function(data){
		$scope.gridObject.gridData = data;
		myGrid.tableBody($scope.gridObject);
	}
	
	myGrid.tableHeader($scope.gridObject);
});