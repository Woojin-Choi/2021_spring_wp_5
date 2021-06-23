const fetch = require('node-fetch');

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

const getVLocation = async () => {
  const AUTH_KEY = '/7IOSPMoyPtgQMbjrMUuHMSuO2IjSAO2gxgrKYU8zb5hPcSqXo7Z+LiHtuglidhA65F9qotVT7b4rocoZLXmCg==';
  const defaultUrl = 'https://api.odcloud.kr/api'
  const url = 'apnmOrg/v1/list'
  const query = 'page=1&perPage=500' // 전체결과가 약 15000개인데, 15000개 한번에 부르니까 정상적으로 호출은 되는데 결과가 잘 안나오네요 page를 나누아야할듯..
  const res = await fetch(`${defaultUrl}/${url}?${query}`, {
    method: 'GET',
    headers: {Authorization: `Infuser ${AUTH_KEY}`, accept: "application/json`"}
  });

  const info = await res.json()
  console.log(info.data)
  return info.data;
}


const getCovidStatus = async (extraHeaders={}) => {
  const y = new Date().getFullYear().toString()
  const m = new Date().getMonth()
  const d = new Date().getDate().toString()
  const date = m<9? y+'0'+(m+1).toString()+d : y+(m+1).toString()+d;
    const AUTH_KEY = '%2F7IOSPMoyPtgQMbjrMUuHMSuO2IjSAO2gxgrKYU8zb5hPcSqXo7Z%2BLiHtuglidhA65F9qotVT7b4rocoZLXmCg%3D%3D'
  const defaultUrl = 'https://snu-cors.herokuapp.com/http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson'
  const query = `serviceKey=${AUTH_KEY}&pageNo=1&numOfRows=30&startCreate_dt=${date}&endCreateDt=${date}&&_type=json`
  const res = await fetch(`${defaultUrl}?${query}`, {
    method: 'GET',
  });

  const str=await res.text();
  const parsed = JSON.parse(str);
  const stat = parsed.response.body.items.item
  return stat

  // 19개 지역
  // createDt: 생성일 deathCnt: 사망자 gubun: 지역, incDec: 전일대비 증감수, isolClearCnt: 격리해제수, isolIngCnt: 격리중환자수
  // localOccCnt: 지역발생수, overFlowCnt: 해외유입자 수 qurRate: 10만명당 발생률 seq: 해당 정보 고유번호 stdDay: 기준일
}

export {
  getVLocation,
  getCovidStatus
}