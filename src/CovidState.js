var request = require('request');

var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=EkII51Aa57jNC%2BejEcIubcSAmNBdF3XHByzXqdCLGpq%2BqYY2oH%2BO7ivCygsEESErf%2BkdRfT8k6zNBYscjBf9Xw%3D%3D&&_type=json';
var queryParams = '?' + encodeURIComponent('ServiceKey') + '=EkII51Aa57jNC%2BejEcIubcSAmNBdF3XHByzXqdCLGpq%2BqYY2oH%2BO7ivCygsEESErf%2BkdRfT8k6zNBYscjBf9Xw%3D%3D'; /* Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent('20200410'); /* */
queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent('20200410'); /* */

request({
    url: url + queryParams,
    method: 'GET'
}, function (error, response, body) {
    console.log('Status', response.statusCode);
    console.log('Headers', JSON.stringify(response.headers));
    console.log('Reponse received', body);
});


