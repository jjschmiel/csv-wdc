$(document).ready(function (datasource) {

	var indicator = $('#CSV').val();
	var datasource = "http://localhost:8889/" + indicator;
	var myConnector = tableau.makeConnector();
	
	$('#CSV').on('change keyup paste click', function() {
    indicator = $('#CSV').val();
	datasource = "http://localhost:8889/" + indicator;
	tableau.connectionData = datasource;
	});
	
	myConnector.getSchema = function (schemaCallback) {

		var source = tableau.connectionData;
		
		$.ajax({
			url: source,
			dataType: "text"
		}).done(successFunction);

		function successFunction(data) {
			var data = data.replace(/\"/g, "");
			var data = data.replace(/ /g, '');
			var allRows = data.split(/\r?\n|\r/);
			var cols = [];
			for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
				var rowCells = allRows[singleRow].split(',');
				for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
					if (singleRow === 0) {
						x = rowCells[rowCell];

						y = {
							id: x,
							alias: x,
							dataType: tableau.dataTypeEnum.string
						};
						cols.push(y);
					}
				}
			}
			console.log(cols);
			var tableInfo = {
				id: "WDCcsv",
				alias: "WDCcsv",
				columns: cols
			};

			schemaCallback([tableInfo]);
		}
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	myConnector.getData = function (table, doneCallback) {

		
		var source = tableau.connectionData;
		
		$.ajax({
			url: source,
			dataType: "text",
		}).done(successFunction);

		function successFunction(data) {
			var data = data.replace(/\"/g, "");
			var allRows = data.split(/\r?\n|\r/);
			var tableData = [];
			var cols = [];
			for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
				var rowCells = allRows[singleRow].split(',');
				for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
					if (singleRow === 0) {
						x = rowCells[rowCell];
						y = {
							id: x,
							alias: x,
							dataType: tableau.dataTypeEnum.string
						};
						cols.push(y);
					}
				}
				if (singleRow != 0) {
					x = rowCells;

					tableData.push(x);
				}
			}

			table.appendRows(tableData);
			doneCallback();
		}
	};

	tableau.registerConnector(myConnector);

	$(document).ready(function () {
		$("#submitButton").click(function () {
			indicator = $('#CSV').val();
			datasource = "http://localhost:8889/" + indicator;
			tableau.connectionData = datasource;
			tableau.connectionName = "WDCcsv";
			tableau.connectionData = datasource;
			tableau.submit();
		});
	});

	

});
