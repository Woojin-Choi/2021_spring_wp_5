const covidStatus = async (extraHeaders={}) => {
    const defaultUrl = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson'
    const query = 'pageNo=1&numOfRows=10'
    const res = await fetch(`http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=%2F7IOSPMoyPtgQMbjrMUuHMSuO2IjSAO2gxgrKYU8zb5hPcSqXo7Z%2BLiHtuglidhA65F9qotVT7b4rocoZLXmCg%3D%3D&&_type=json`, {
        method: 'GET',
        // headers: {Authorization: `Infuser ${AUTH_KEY}`}
    });

    const resT=await res.text();
    const parsed = JSON.parse(resT);
    const stat = parsed.response.body.items
    return stat
}