QRCodeGenerated = false;
function showReportQRCode() {
	tau.changePage("#timeSpentReportQRCode");
	if(!QRCodeGenerated)	{
//		let MACAddress = tizen.systeminfo.getPropertyValue("WIFI_NETWORK", wifi => {
//			$("#QRCode").qrcode({
//				 text: 'https://workspacegurutimetrackingreport.azurewebsites.net?userID=' + wifi.macAddress,
//				 mode: 0,
//				 fontname:'sans',
//				 size: 200,
//				 fontcolor:'#000'
//			});	
//		});
		let MACAddress = "31884d7164e4";	//For test
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