// import env from "react-dotenv";
const md5 = require('md5')
const storeInfoBaseURL = "https://mobile.jeffy.sg/api/entry/getstoreinfo/"
const baseUrl = "https://mmclabapi.poscorp.sg/";
export const url = {
	getStoreByDeviceNo: 'api/mobile/getStoreByDeviceNo',
	getMenu: 'api/mobile/getMenu',
	getProductsByStore: 'api/mobile/getProductByStore'
}


//
// console.log("Data", data)
// var allRequest = {"deviceNo":data.deviceID}
// headers.appKey = data.appKey
// headers.appSecret = data.appSecret
// headers['Tenant-Id'] = data.tenantID
// headers.deviceID = data.deviceID
// headers["Serial-Number"] = data.deviceID
// headers.sign = md5(headers.appKey + headers.appSecret + uri + allRequest + time)


export function generateRequiredHeaders (data, uri, allRequest) {
	// let allRequest = JSON.stringify({"deviceNo": data.deviceID})
	let time = Math.round(new Date().getTime() / 1000);
	let headers = {}
	headers['appKey'] = data.appKey
	headers['appSecret'] = data.appSecret
	headers['Tenant-Id'] = data.tenantID
	headers['Serial-Number'] = data.deviceID
	headers['time'] = time
	headers['sign'] = md5(data.appKey + data.appSecret + uri + JSON.stringify(allRequest)+ time)
	headers["Content-Type"] = "application/json"
	headers['Sale-Channel'] = "APP"
	headers['Update-Channel'] = "APP"
	return headers
}

export async function locateStore (storeID) {
	return fetch(storeInfoBaseURL + storeID)
		.then((s) => s.json()).catch((e) => e)
}




export async function getStoreInfo (storeCredentials) {
	let params = {deviceNo: storeCredentials.deviceID}
	let headers = generateRequiredHeaders(storeCredentials, url.getStoreByDeviceNo, params)
	return fetch(baseUrl + url.getStoreByDeviceNo, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(params)
	}).then((s) => s.json()).catch((e) => e);
}

export async function getMenu (storeCredentials, params) {
	let headers = generateRequiredHeaders(storeCredentials, url.getMenu, params)
	return fetch(baseUrl + url.getMenu, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(params)
	}).then((s) => s.json()).catch((e) => e);
}

export async function getProductsByStore (storeCredentials, params) {
	let headers = generateRequiredHeaders(storeCredentials, url.getProductsByStore, params)
	return fetch(baseUrl + url.getProductsByStore, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(params)
	}).then((s) => s.json()).catch((e) => e);
}

//
// export function getCategories () {
// 	return fetch(baseUrl).then(handleResponse).catch(handleError);
// }
//
// export function getProducts (course) {
// 	return fetch(baseUrl + (course.id || ""), {
// 		method: course.id ? "PUT" : "POST",
// 		headers: { "content-type": "application/json" },
// 		body: JSON.stringify(course)
// 	}).then(handleResponse).catch(handleError);
// }
//
// export function deleteCourse (courseId) {
// 	return fetch (baseUrl + courseId, {
// 		method: "DELETE"
// 	}).then(handleResponse).catch(handleError);
// }
