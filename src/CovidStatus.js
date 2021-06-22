const y = new Date().getFullYear().toString()
const m = new Date().getMonth()
const d = new Date().getDate().toString()
const date = m<9? y+'0'+(m+1).toString()+d : y+(m+1).toString()+d;
const covidStatus = async (extraHeaders={}) => {
    const defaultUrl = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson'
    const query = `serviceKey=${AUTH_KEY}&pageNo=1&numOfRows=30&startCreate_dt=${date}&endCreateDt=${date}&&_type=json`
    const res = await fetch(`${defaultUrl}?${query}`, {
        method: 'GET',
    });

    const str=await res.text();
    const parsed = JSON.parse(str);
    const stat = parsed.response.body.items.item
    return stat

    // 19개 지역
    // createDt: 생성일 deathCnt: 사망자 gubun: 지역, incDec: 전일대비 증감수, isolClearCnt: 격리해제수, isolIngCnt: 격리중환자수, localOccCnt: 지역발생수
    // overFlowCnt: 해외유입자 수 qurRate: 10만명당 발생률 seq: 해당 정보 고유번호 stdDay: 기준일
}

covidStatus ();