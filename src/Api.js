const fetch = require('node-fetch');
// const request = require('request');

// const getDefaultHeaders = () => {
//   const defaultHeaders = {
//     Authorization: `Infuser ${AUTH_KEY}`
//   }
//   if (localStorage.getItem(LOGIN_KEY))
//     defaultHeaders['Authorization'] = `Key ${localStorage.getItem(LOGIN_KEY)}`;
//   return defaultHeaders;
// }

// const post = async (url, body={}, extraHeaders={}) => {
//   const res = await fetch(`${defaultUrl}/${url}`, {
//     method: 'POST',
//     body: new URLSearchParams(body).toString(),
//     headers: {...getDefaultHeaders(), ...extraHeaders}
//   });
//   return await res.json();
// }
//
// const get = async (url, query={}, extraHeaders={}) => {
//   const res = await fetch(`${defaultUrl}/${url}?${query}`, {
//     method: 'GET',
//     headers: {...getDefaultHeaders(), ...extraHeaders}
//   });
//   return await res.json();
// }
//
// const del = async (url, query={}, extraHeaders={}) => {
//   const res = await fetch(`${defaultUrl}/${url}`, {
//     method: 'DELETE',
//     headers: {...getDefaultHeaders(), ...extraHeaders}
//   });
//   return await res.json();
// }

// const url = 'https://infuser.odcloud.kr/oas/docs?namespace=15077586/v1/centers'

// https://infuser.odcloud.kr/api/stages/28441/api-docs?1620976171039/apnmOrg/v1/list


// let queryParams =`?${encodeURIComponent('S')}`
// const requestUrl = `${url}`

// // https://api.odcloud.kr/api/15077586/v1/centers?page=1&perPage=10
// fetch('https://infuser.odcloud.kr/oas/docs?namespace=15077586/v1/centers',{
//   method: 'GET',
//   headers: {Authorization: `Infuser ${AUTH_KEY}`}
// }).then(_info => {console.log(_info)})

// fetch('https://api.odcloud.kr/api/apnmOrg/v1/list?page=1&perPage=100',{
//   method: 'GET',
//
// })
//     .then(res=>res.json())
//     .then(_info => {console.log(_info)})

const AUTH_KEY = '/7IOSPMoyPtgQMbjrMUuHMSuO2IjSAO2gxgrKYU8zb5hPcSqXo7Z+LiHtuglidhA65F9qotVT7b4rocoZLXmCg==';
const getVLocation = async () => {
  const defaultUrl = 'https://api.odcloud.kr/api'
  const url = 'apnmOrg/v1/list'
  const query = 'page=1&perPage=100' // 전체결과가 약 15000개인데, 15000개 한번에 부르니까 정상적으로 호출은 되는데 결과가 잘 안나오네요 page를 나누아야할듯..
  const res = await fetch(`${defaultUrl}/${url}?${query}`, {
    method: 'GET',
    headers: {Authorization: `Infuser ${AUTH_KEY}`, accept: "application/json`"}
  });

  const info = await res.json()
  return info.data;
}

const ServiceKey = '=EkII51Aa57jNC%2BejEcIubcSAmNBdF3XHByzXqdCLGpq%2BqYY2oH%2BO7ivCygsEESErf%2BkdRfT8k6zNBYscjBf9Xw%3D%3D'




var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson';
var queryParams = '?' + encodeURIComponent('ServiceKey') + ServiceKey; /* Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent('20200410'); /* */
queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent('20200410') + '&_type=json'; /* */

const getCovidStat = async () => {
  const res = await fetch(url+queryParams, {
    method: 'GET'
  });
  const stat = await res.json()
  return stat
}




// getVLocation();
// const getVLocation2 = async (extraHeaders={}) => {
//   const defaultUrl2 = 'https://infuser.odcloud.kr/oas/docs?namespace=15077586/v1'
//   const url = '/15077586/v1/centers'
//   const query = 'page=1&perPage=20000'
//   const res = await fetch(`${defaultUrl2}/${url}?${query}`, {
//     method: 'GET',
//     headers: {Authorization: `Infuser ${AUTH_KEY}`, accept: "application/json`"}
//   });
//   // console.log(await res.json());
//   return await res.json();
// }

// const getInfectedNum = async (extraHeaders={}) => {
//   const defaultUrl = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson'
//   const res = await fetch(`${defaultUrl}/`, {
//     method: 'GET',
//     headers: {Authorization: `Infuser ${AUTH_KEY}`, accept: "application/json`"}
//   });
//
//   const parser = new DOMParser();
//   const xml = parser.parseFromString(await res, "text/xml");
//
//   const resJson = xmlToJson(xml);
//
//   console.log(resJson);
//   return await res.json();
// }

// getInfectedNum();

// const xmlToJson = async (xml) => {
//   // Create the return object
//   let obj = {};
//
//   if (xml.nodeType === 1) { // element
//     // do attributes
//     if (xml.attributes.length > 0) {
//       obj["@attributes"] = {};
//       for (var j = 0; j < xml.attributes.length; j++) {
//         var attribute = xml.attributes.item(j);
//         obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
//       }
//     }
//   } else if (xml.nodeType === 3) { // text
//     obj = xml.nodeValue;
//   }
//   // do children
//
//   if (xml.hasChildNodes()) {
//     for(let i = 0; i < xml.childNodes.length; i++) {
//       let item = xml.childNodes.item(i);
//       let nodeName = item.nodeName;
//       if (typeof(obj[nodeName]) == "undefined") {
//         obj[nodeName] = xmlToJson(item);
//       } else {
//         if (typeof(obj[nodeName].push) == "undefined") {
//           let old = obj[nodeName];
//           obj[nodeName] = [];
//           obj[nodeName].push(old);
//         }
//         obj[nodeName].push(xmlToJson(item));
//       }
//     }
//   }
//   return obj;
// };



export {
  getVLocation,
  getCovidStat
}