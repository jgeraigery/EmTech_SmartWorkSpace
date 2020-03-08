QRCodeGenerated = false;
function showReportQRCode() {
	tau.changePage("#timeSpentReportQRCode");
	if(!QRCodeGenerated)	{
		let MACAddress = tizen.systeminfo.getPropertyValue("WIFI_NETWORK", function(wifi){sendUserTimeSpentInfo(wifi.macAddress);});
		MACAddress = "31884d7164e4";	//For test
		$("#QRCode").qrcode({
			 text: 'https://workspacegurutimetrackingreport.azurewebsites.net?userID=' + MACAddress,
			 mode: 0,
			 fontname:'sans',
			 size: 200,
			 fontcolor:'#000'
		});	
	}
	QRCodeGenerated = true;
}