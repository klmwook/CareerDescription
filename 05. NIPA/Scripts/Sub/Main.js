////////////////////전역 변수//////////////////////////
var _vSelectDate = new Date();
var obj = new Object();
var mymap;
////////////////////jquery event///////////////////////
$(function () {

    //로그인 하지 않고 들어왔을때
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        location.href = window.location.origin;
    }

    $("#header").removeClass("close");
    $('#lnb > li.sub_main > a').addClass("on");
    $('.h_type2 .icon_menu li:nth-child(1) > a').addClass("on");

    //차트 테스트 - 차트부터 하는 이유는 지도가 먼저 그려지고 차트 그리면 지도가 깨짐
    //fnApexChart(); 

    //SetMainMap();
    $("#cal_date").text(fnSetNowDate()); //현재 날짜 세팅
    fnSearchTotal();
});

//달력 왼쪽 클릭
$(document).on("click", "#btn_cal_left", function () {
    $("#cal_date").text(fnSetYearMonth("L"));
    fnSearchTotal();
});

//달력 오른쪽 클릭
$(document).on("click", "#btn_cal_right", function () {
    $("#cal_date").text(fnSetYearMonth("R"));
    fnSearchTotal();
});
/////////////////////function///////////////////////////////////
//년월 이전 다음 세팅하기
function fnSetYearMonth(vLR) {
    try {
        var vValue = Number($("#cal_date").text().slice(-2, $("#cal_date").text().length)-1);

        if (vLR == "L") {
            if (vValue == 0) {
                _vSelectDate = new Date((_vSelectDate.getFullYear() - 1), 11, 1);
            } else {
                _vSelectDate = new Date(_vSelectDate.getFullYear(), (vValue-1), 1);
            }
        }
        else if (vLR == "R") {
            if (vValue == 12) {
                _vSelectDate = new Date((_vSelectDate.getFullYear() + 1), 0, 1);
            } else {
                _vSelectDate = new Date(_vSelectDate.getFullYear(), (vValue+1), 1);
            }
        }

        var weekYear = _vSelectDate.getFullYear();
        var weekMonth = _vSelectDate.getMonth()+1;

        var result = weekYear + "." + _pad(weekMonth, "2");
        return result;
    }
    catch (err) {
        console.log("[Error - _fnSetYearMonth]" + err.message);
    }
}

$("#select_BOUND").change(function () {
    fnSearchTotal();
});

$(".btn_refresh").click(function () {
    fnSearchTotal();
});
//토탈 검색
function fnSearchTotal() {
    try {

        $("#sheet_graph1").empty();
        $("#sheet_graph2").empty();
        $("#sheet_graph3").empty();
        $("#sheet_graph4").empty();

        obj.EX_IM_TYPE = $("#select_BOUND option:selected").val();
        obj.DATE_YYYY = $("#cal_date").text().split(".")[0];
        obj.DATE_MM = $("#cal_date").text().split(".")[1];
        obj.PORT_CD = "";

        $.ajax({
            type: "POST",
            url: "/Sub/fnGetTotal",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(obj) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _fnMakeDashboard(JSON.parse(result));
                }
            }, error: function (xhr) {
                console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                console.log(xhr);
                return;
            }, beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스 바 

            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스 바 
            }
        });

    }
    catch (err) {
        console.log("[Error - fnSearchTotal]" + err.message);
    }
}

function _fnMakeDashboard(resultJson) {
    
    var PORT = resultJson.PORT;
    
    var TOTAL = resultJson.TOTAL;
    if (PORT.length > 0) {

        fnApexChart(TOTAL);

    } else {
        $("#LOC_TIT").html('');
        $("#SEA_BL_CNT").html("");
        $("#SEA_CON_CNT").html("");
        $("#AIR_AWB_CNT").html("");
        $("#AIR_CON_CNT").html("");

        //데이터가 없을 경우 차트 차트 초기화
        fnInitApexChart();

    }
    SetMainMap(PORT);
}

//년/월 세팅
function fnSetNowDate() {
    try {
        var weekDate = _vSelectDate.getTime() + (24 * 60 * 60 * 1000);
        _vSelectDate.setTime(weekDate);
        
        var weekYear = _vSelectDate.getFullYear();
        var weekMonth = _vSelectDate.getMonth();
        
        var result = weekYear + "." + _pad(weekMonth+1, "2");
        return result;
    }
    catch (err) {
        console.log("[Error - fnSetNowDate]" + err.message);
    }
}

//리플렛 클릭 이벤트 
function fnMarkerClick(e) {
    try {
        $("#sheet_graph1").empty();
        $("#sheet_graph2").empty();
        $("#sheet_graph3").empty();
        $("#sheet_graph4").empty();
        obj.PORT_CD = this.options.id;

        $.ajax({
            type: "POST",
            url: "/Sub/fnGetDashboard",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(obj) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    fnApexChart(JSON.parse(result).TOTAL);
                }
            }, error: function (xhr) {
                console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                console.log(xhr);
                return;
            }
        });
    }
    catch (err) {
        console.log("[Error - fnMarkerClick()]" + err.message);
    }
}


//////////////////////function makelist////////////////////////

/////////////////////////////API///////////////////////////////
//리플렛 지도 테스트
function SetMainMap(portJson) {
    try {
        if (_fnToNull(mymap) != "") {
            mymap.remove();
        }
        //leafet 맵 초기 설정
        var lat = 3.93410279753996; //위도
        var lng = 77.68336825871079; //경도

        var zoom = 4; //줌 레벨

        if (!matchMedia("screen and (min-width: 1025px)").matches) {
            zoom = 2;
        }

        mymap = L.map('main_map', {
            //center: [lat, lng],			
            center: [34.530444, 82.906259],	//중심 좌표
            zoom: zoom,
            zoomControl: false
        });

        //zoom 아래다가 두기
        L.control.zoom({
            position: 'bottomright'
        }).addTo(mymap);

        //배경 지도 그려주기        
        //L.tileLayer('http://mt0.google.com/vt/lyrs=m&hl=kr&x={x}&y={y}&z={z}', {
        //    attribution: 'Map data &copy; Copyright Google Maps<a target="_blank" href="https://maps.google.com/maps?ll=24.53279,56.62833&amp;z=13&amp;t=m&amp;hl=ko-KR&amp;gl=US&amp;mapclient=apiv3"></a>' //화면 오른쪽 하단 attributors
        //}).addTo(mymap);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; Copyright Google Maps<a target="_blank" href="https://maps.google.com/maps?ll=24.53279,56.62833&amp;z=13&amp;t=m&amp;hl=ko-KR&amp;gl=US&amp;mapclient=apiv3"></a>' //화면 오른쪽 하단 attributors
        }).addTo(mymap);

        /*
        lyrs=m : Standard Road Map
        lyrs=p : Terrain
        lyrs=r : Somehow Altered Road Map
        lyrs=s : Satellite Only
        lyrs=t : Terrain Only
        lyrs=y : Hybrid
        lyrs=h : Roads Only
        */

        //Marker 아이콘 
        var markerIcon = L.icon({
            iconUrl: '../Images/icn_marker01.png',
            iconSize: [16, 16]
        });

        var markerIcon_Small = L.icon({
            iconUrl: '../Images/icn_marker01.png',
            iconSize: [25, 25]
        });
        var markerIconAir = L.icon({
            iconUrl: '../Images/icn_marker02.png',
            iconSize: [16, 16]
        });

        var markerIcon_AirSmall = L.icon({
            iconUrl: '../Images/icn_marker02.png',
            iconSize: [25, 25]
        });
        //마커 찍어주는 로직 (배열로 감싸서 한번에 아이콘을 변경 시켜야 될 듯.)
        //var vMark_Port = L.marker([22.101306804651625, 124.02901472737389], { icon: makerIcon }).addTo(mymap);	//Port 좌표       
        var vArray = new Array();

        for (var i = 0; i < portJson.length; i++) {
            if (_fnToNull(portJson[i]["EX_IM_TYPE"]) == "E") {
                if (_fnToNull(portJson[i]["PORT"]).length == "3") {
                    vArray.push(L.marker([portJson[i]["POD_LAT"], portJson[i]["POD_LNG"]], { icon: markerIconAir, id: portJson[i]["PORT"] }).on("click", fnMarkerClick).addTo(mymap));
                } else {
                    vArray.push(L.marker([portJson[i]["POD_LAT"], portJson[i]["POD_LNG"]], { icon: markerIcon, id: portJson[i]["PORT"] }).on("click", fnMarkerClick).addTo(mymap));
                }
            } else {
                if (_fnToNull(portJson[i]["PORT"]).length == "3") {
                    vArray.push(L.marker([portJson[i]["POL_LAT"], portJson[i]["POL_LNG"]], { icon: markerIconAir, id: portJson[i]["PORT"] }).on("click", fnMarkerClick).addTo(mymap));
                } else {
                    vArray.push(L.marker([portJson[i]["POL_LAT"], portJson[i]["POL_LNG"]], { icon: markerIcon, id: portJson[i]["PORT"] }).on("click", fnMarkerClick).addTo(mymap));
                }
            }
        }
        //vArray[0] = L.marker([22.101306804651625, 124.02901472737389], { icon: markerIcon, id: '1번입니다.' }).on("click", fnMarkerClick).addTo(mymap); //id 뿐만 아니라 내가 원하는 key/value 값으로 넣으면 그대로 적용 됨.
        //vArray[1] = L.marker([20.27050314420896, 119.33763724918373], { icon: markerIcon, id: '2번입니다.' }).on("click", fnMarkerClick).addTo(mymap); //id 뿐만 아니라 내가 원하는 key/value 값으로 넣으면 그대로 적용 됨.
        //vArray[2] = L.marker([35.08001035359354, 128.81069125068532], { icon: markerIcon, id: '3번입니다.' }).on("click", fnMarkerClick).addTo(mymap); //id 뿐만 아니라 내가 원하는 key/value 값으로 넣으면 그대로 적용 됨.

        //일정 zoom을 땡겼을 경우 아이콘을 변경해주는 로직
        mymap.on('zoomend', function () {
            var currentZoom = mymap.getZoom();
            if (currentZoom <= 5) {
                for (var i = 0; i < vArray.length; i++) {
                    if (_fnToNull(vArray[i].options.id).length == "3") {
                        vArray[i].setIcon(markerIcon_Air);
                    } else {
                        vArray[i].setIcon(markerIcon);
                    }
                }
            } else {
                for (var i = 0; i < vArray.length; i++) {
                    if (_fnToNull(vArray[i].options.id).length == "3") {
                        vArray[i].setIcon(markerIcon_AirSmall);
                    } else {
                        vArray[i].setIcon(markerIcon_Small);
                    }
                }
            }
        });

        mymap.options.maxZoom = 8;
        mymap.options.minZoom = 2;

        //Marker에 클래스 넣기
        //L.DomUtil.addClass(vArray[0]._icon, 'className');
    }
    catch (err) {
        console.log("[Error - SetMainMap()]" + err.message);
    }
}

//차트에 데이터가 없을 경우.
function fnInitApexChart()
{
    try {

        $("#LOC_TIT").html("ALL PORT");
        $("#SEA_BL_CNT").html("<span>0/</span> <br class='mo' />0건");
        $("#SEA_CON_CNT").html("<span>0/</span> <br class='mo' />0건");
        $("#AIR_AWB_CNT").html("<span>0/</span> <br class='mo' />0건");
        $("#AIR_CON_CNT").html("<span>0/</span> <br class='mo' />0건");

        var options = {
            series: [0], //퍼센트로 잡히니 정수로 넣어야될듯.
            chart: {
                width: 110,
                height: 140,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    startAngle: 0,//차트 시작 지점 총 360으로 시작과 끝을 해야된다.
                    endAngle: 360,//차트 끝 지점
                    hollow: {
                        margin: 0,
                        size: '75%',
                        background: '#fff',
                    },
                    track: { //안채워진 영역 색상
                        background: '#fff',
                        strokeWidth: '100%',
                        margin: 0, // margin is in pixels
                        dropShadow: {
                            enabled: true,
                            top: -3,
                            left: 0,
                            blur: 4,
                            opacity: 0.35
                        }
                    },
                    dataLabels: {
                        show: true,
                        textAnchor: 'start',
                        value: {
                            //formatter: function(val) { //값 형변환
                            //  return parseInt(val);
                            //},
                            offsetY: -10, //y좌표 영역을 수정 할 수 있음. (이걸로 중앙 정렬 만들었음)
                            color: '#111',
                            fontSize: '15px',
                            show: true,
                        }
                    }
                }
            },
            //colors: ['#7878dc'],
            fill: { //차트 색상 속성
                type: 'gradient',
                gradient: {
                    gradientToColors: ['#7878dc'],
                    stops: [0, 100]
                    //shade: 'dark',
                    //type: 'horizontal',
                    //shadeIntensity: 0.5,
                    //inverseColors: true,
                    //opacityFrom: 1,
                    //opacityTo: 1,
                }
            },
            //stroke: {
            //  lineCap: 'round'
            //},
            labels: [''],
        };

        var chart1 = new ApexCharts(document.querySelector("#sheet_graph1"), options);
        chart1.render();
        var chart2 = new ApexCharts(document.querySelector("#sheet_graph2"), options);
        chart2.render();
        var chart3 = new ApexCharts(document.querySelector("#sheet_graph3"), options);
        chart3.render();
        var chart4 = new ApexCharts(document.querySelector("#sheet_graph4"), options);
        chart4.render();
    }
    catch (err) {
        console.log("[Error - fnInitApexChart()]" + err.message);
    }
}


//차트 만들기
function fnApexChart(TotalJson) {
    try {
        $("#LOC_TIT").html(_fnToNull(TotalJson[1].PORT_NM));

        //$("#SEA_BL_CNT").html("<span>" + _fnGetNumber(TotalJson[1].PORT_DATA_CNT, "sum") + " /</span> <br class='mo' />" + _fnGetNumber(TotalJson[1].TOT_DATA_CNT, "sum") + " 건");
        //$("#SEA_CON_CNT").html("<span>" + _fnGetNumber(Math.ceil(TotalJson[1].PORT_DATA_RTON), "sum") + " /</span> <br class='mo' />" + _fnGetNumber(Math.ceil(TotalJson[1].TOT_DATA_RTON), "sum"));
        //$("#AIR_AWB_CNT").html("<span>" + _fnGetNumber(TotalJson[0].PORT_DATA_CNT, "sum") + " /</span> <br class='mo' />" + _fnGetNumber(TotalJson[0].TOT_DATA_CNT, "sum") + " 건");
        //$("#AIR_CON_CNT").html("<span>" + _fnGetNumber(Math.ceil(TotalJson[0].PORT_DATA_RTON), "sum") + " /</span> <br class='mo' />" + _fnGetNumber(Math.ceil(TotalJson[0].TOT_DATA_RTON), "sum"));

        $("#SEA_BL_CNT").html("<span>" + _fnGetNumber(TotalJson[0].PORT_DATA_CNT, "sum") + " /</span> <br class='mo' />" + _fnGetNumber(TotalJson[0].TOT_DATA_CNT, "sum") + " 건");
        $("#SEA_CON_CNT").html("<span>" + _fnGetNumber(Math.ceil(TotalJson[0].PORT_DATA_RTON), "sum") + " /</span> <br class='mo' />" + _fnGetNumber(Math.ceil(TotalJson[0].TOT_DATA_RTON), "sum"));
        $("#AIR_AWB_CNT").html("<span>" + _fnGetNumber(TotalJson[1].PORT_DATA_CNT, "sum") + " /</span> <br class='mo' />" + _fnGetNumber(TotalJson[1].TOT_DATA_CNT, "sum") + " 건");
        $("#AIR_CON_CNT").html("<span>" + _fnGetNumber(Math.ceil(TotalJson[1].PORT_DATA_RTON), "sum") + " /</span> <br class='mo' />" + _fnGetNumber(Math.ceil(TotalJson[1].TOT_DATA_RTON), "sum"));

        //var AvgBLCnt = Math.ceil(TotalJson[1].PORT_DATA_CNT / TotalJson[1].TOT_DATA_CNT * 100);
        //var AvgRtonCnt = Math.ceil(TotalJson[1].PORT_DATA_RTON / TotalJson[1].TOT_DATA_RTON * 100) ;
        //var AvgAWBCnt = Math.ceil(TotalJson[0].PORT_DATA_CNT / TotalJson[0].TOT_DATA_CNT * 100) ;
        //var AvgAirRtonCnt = Math.ceil(TotalJson[0].PORT_DATA_RTON / TotalJson[0].TOT_DATA_RTON * 100) ;

        var AvgAWBCnt = Math.ceil(TotalJson[1].PORT_DATA_CNT / TotalJson[1].TOT_DATA_CNT * 100);
        var AvgAirRtonCnt = Math.ceil(TotalJson[1].PORT_DATA_RTON / TotalJson[1].TOT_DATA_RTON * 100);
        var AvgBLCnt = Math.ceil(TotalJson[0].PORT_DATA_CNT / TotalJson[0].TOT_DATA_CNT * 100);
        var AvgRtonCnt = Math.ceil(TotalJson[0].PORT_DATA_RTON / TotalJson[0].TOT_DATA_RTON * 100);

        var options = {
          series: [AvgBLCnt], //퍼센트로 잡히니 정수로 넣어야될듯.
          chart: {
		  width:110,
          height: 140,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            startAngle: 0,//차트 시작 지점 총 360으로 시작과 끝을 해야된다.
            endAngle: 360,//차트 끝 지점
             hollow: {
              margin: 0,
              size: '75%',
              background: '#fff',
            },
            track: { //안채워진 영역 색상
              background: '#fff',
              strokeWidth: '100%',
              margin: 0, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: -3,
                left: 0,
                blur: 4,
                opacity: 0.35
              }
            },
            dataLabels: {
              show: true,
			  textAnchor: 'start',
              value: {
                //formatter: function(val) { //값 형변환
                //  return parseInt(val);
                //},
                offsetY: -10, //y좌표 영역을 수정 할 수 있음. (이걸로 중앙 정렬 만들었음)
                color: '#111',
                fontSize: '15px',
                show: true,
              }
            }
          }
        },
        //colors: ['#7878dc'],
        fill: { //차트 색상 속성
          type: 'gradient',
            gradient: {
            gradientToColors: ['#7878dc'],
            stops: [0, 100]
            //shade: 'dark',
            //type: 'horizontal',
            //shadeIntensity: 0.5,
            //inverseColors: true,
            //opacityFrom: 1,
            //opacityTo: 1,
          }
        },
        //stroke: {
        //  lineCap: 'round'
        //},
        labels: [''],
        };

        var chart1 = new ApexCharts(document.querySelector("#sheet_graph1"), options);
        chart1.render();


         options = {
             series: [AvgRtonCnt], //퍼센트로 잡히니 정수로 넣어야될듯.
            chart: {
                width: 110,
                height: 140,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    startAngle: 0,//차트 시작 지점 총 360으로 시작과 끝을 해야된다.
                    endAngle: 360,//차트 끝 지점
                    hollow: {
                        margin: 0,
                        size: '75%',
                        background: '#fff',
                    },
                    track: { //안채워진 영역 색상
                        background: '#fff',
                        strokeWidth: '100%',
                        margin: 0, // margin is in pixels
                        dropShadow: {
                            enabled: true,
                            top: -3,
                            left: 0,
                            blur: 4,
                            opacity: 0.35
                        }
                    },
                    dataLabels: {
                        show: true,
                        textAnchor: 'start',
                        value: {
                            //formatter: function(val) { //값 형변환
                            //  return parseInt(val);
                            //},
                            offsetY: -10, //y좌표 영역을 수정 할 수 있음. (이걸로 중앙 정렬 만들었음)
                            color: '#111',
                            fontSize: '15px',
                            show: true,
                        }
                    }
                }
            },
            //colors: ['#7878dc'],
            fill: { //차트 색상 속성
                type: 'gradient',
                gradient: {
                    gradientToColors: ['#7878dc'],
                    stops: [0, 100]
                    //shade: 'dark',
                    //type: 'horizontal',
                    //shadeIntensity: 0.5,
                    //inverseColors: true,
                    //opacityFrom: 1,
                    //opacityTo: 1,
                }
            },
            //stroke: {
            //  lineCap: 'round'
            //},
            labels: [''],
        };

        var chart2 = new ApexCharts(document.querySelector("#sheet_graph2"), options);
        chart2.render();


        options = {
            series: [AvgAWBCnt], //퍼센트로 잡히니 정수로 넣어야될듯.
            chart: {
                width: 110,
                height: 140,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    startAngle: 0,//차트 시작 지점 총 360으로 시작과 끝을 해야된다.
                    endAngle: 360,//차트 끝 지점
                    hollow: {
                        margin: 0,
                        size: '75%',
                        background: '#fff',
                    },
                    track: { //안채워진 영역 색상
                        background: '#fff',
                        strokeWidth: '100%',
                        margin: 0, // margin is in pixels
                        dropShadow: {
                            enabled: true,
                            top: -3,
                            left: 0,
                            blur: 4,
                            opacity: 0.35
                        }
                    },
                    dataLabels: {
                        show: true,
                        textAnchor: 'start',
                        value: {
                            //formatter: function(val) { //값 형변환
                            //  return parseInt(val);
                            //},
                            offsetY: -10, //y좌표 영역을 수정 할 수 있음. (이걸로 중앙 정렬 만들었음)
                            color: '#111',
                            fontSize: '15px',
                            show: true,
                        }
                    }
                }
            },
            //colors: ['#7878dc'],
            fill: { //차트 색상 속성
                type: 'gradient',
                gradient: {
                    gradientToColors: ['#7878dc'],
                    stops: [0, 100]
                    //shade: 'dark',
                    //type: 'horizontal',
                    //shadeIntensity: 0.5,
                    //inverseColors: true,
                    //opacityFrom: 1,
                    //opacityTo: 1,
                }
            },
            //stroke: {
            //  lineCap: 'round'
            //},
            labels: [''],
        };

        var chart3 = new ApexCharts(document.querySelector("#sheet_graph3"), options);
        chart3.render();


        options = {
            series: [AvgAirRtonCnt], //퍼센트로 잡히니 정수로 넣어야될듯.
            chart: {
                width: 110,
                height: 140,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    startAngle: 0,//차트 시작 지점 총 360으로 시작과 끝을 해야된다.
                    endAngle: 360,//차트 끝 지점
                    hollow: {
                        margin: 0,
                        size: '75%',
                        background: '#fff',
                    },
                    track: { //안채워진 영역 색상
                        background: '#fff',
                        strokeWidth: '100%',
                        margin: 0, // margin is in pixels
                        dropShadow: {
                            enabled: true,
                            top: -3,
                            left: 0,
                            blur: 4,
                            opacity: 0.35
                        }
                    },
                    dataLabels: {
                        show: true,
                        textAnchor: 'start',
                        value: {
                            //formatter: function(val) { //값 형변환
                            //  return parseInt(val);
                            //},
                            offsetY: -10, //y좌표 영역을 수정 할 수 있음. (이걸로 중앙 정렬 만들었음)
                            color: '#111',
                            fontSize: '15px',
                            show: true,
                        }
                    }
                }
            },
            //colors: ['#7878dc'],
            fill: { //차트 색상 속성
                type: 'gradient',
                gradient: {
                    gradientToColors: ['#7878dc'],
                    stops: [0, 100]
                    //shade: 'dark',
                    //type: 'horizontal',
                    //shadeIntensity: 0.5,
                    //inverseColors: true,
                    //opacityFrom: 1,
                    //opacityTo: 1,
                }
            },
            //stroke: {
            //  lineCap: 'round'
            //},
            labels: [''],
        };

        var chart4 = new ApexCharts(document.querySelector("#sheet_graph4"), options);
        chart4.render();
    }
    catch (err) {
        console.log("[Error - fnApexChart]" + err.message);
    }
}