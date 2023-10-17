////////////////////전역 변수//////////////////////////
var vTooltip = "";
////////////////////jquery event///////////////////////
$(function () {    

    //pc 버전 매출액
    var c3_barChart_item01_pc = c3.generate({
        bindto: "#finance_c3_item01_pc",
        size: {
            width: 450,
            height: 250
        },
        data: {
            columns: [
                ['data1', 0, 0, 0]
            ],
            type: 'bar'
        },
        grid: {
            x: {
                show: true
            },
            y: {
                show: true
            }
        },
        legend: {
            show: false
        },
        axis: {
            x: {
                type: 'category',
                categories: ['2017년', '2018년', '2019년']
            },
            y: {
                max: 350,
                min: 50,
                show: true
            }
        },
        color: {    //데이터별 Sorting 으로 색상 셋팅 필요 -> 순서 -> (참고 사이트 : https://stackoverflow.com/questions/27702383/c3js-row-data-custom-colors/27717955)
            pattern: ['#009954']
        },
        bar: {
            width: {
                ratio: 0.3
            }
        },
        tooltip: {
            format: {
                value: function (value, ratio, id, index) {
                    var vValue = String(value);
                    var format = vValue.substring(0, 3) + "억 ";

                    var vTooltip = index;

                    return format;
                }
            }
        }
    });

    setTimeout(function () {
        c3_barChart_item01_pc.load({
            columns: [
                ['data1', 317, 314, 272]
            ],
            axis: {
                x: {
                    type: 'category'
                },
                y: {
                    show: false
                }
            },
        });
    }, 500);

    //pc 버전 당기순이익
    var c3_barChart_item02_pc = c3.generate({
        bindto: "#finance_c3_item02_pc",
        size: {
            width: 450,
            height: 250
        },
        data: {
            columns: [
                ['data1', 0, 0, 0]
            ],
            names: {
                CNT: 'Total' //컬럼명 따라감.
            },
            type: 'bar'
        },
        grid: {
            x: {
                show: true
            },
            y: {
                show: true
            }
        },
        legend: {
            show: false
        },
        axis: {
            x: {
                type: 'category',
                categories: ['2017년', '2018년', '2019년']
            },
            y: {
                max: 20,
                min: 2,
                show: true
            }
        },
        color: {    //데이터별 Sorting 으로 색상 셋팅 필요 -> 순서 -> (참고 사이트 : https://stackoverflow.com/questions/27702383/c3js-row-data-custom-colors/27717955)
            pattern: ['#009954']
        },
        bar: {
            width: {
                ratio: 0.3
            }
        },
        tooltip: {
            format: {
                value: function (value, ratio, id, index) {
                    var vValue = String(value);
                    var format = vValue.substring(0, 2) + "억 ";
                    return format;
                }
            }
        }
    });

    setTimeout(function () {
        c3_barChart_item02_pc.load({
            columns: [
                ['data1', 16, 7, 16]
            ],
            keys: {
                x: 'year',
                value: ['cost']
            }
        });
    }, 1000);

    //모바일 매출액
    var c3_barChart_item01 = c3.generate({
        bindto: "#finance_c3_item01",
        size: {
            width: 250,
            height: 250
        },
        data: {
            columns: [
                ['data1', 0, 0, 0]
            ],
            type: 'bar'
        },
        grid: {
            x: {
                show: true
            },
            y: {
                show: true
            }
        },
        legend: {
            show: false
        },
        axis: {
            x: {
                type: 'category',
                categories: ['2017년', '2018년', '2019년']
            },
            y: {
                max: 300,
                min: 50,
                show: true
            }
        },
        color: {    //데이터별 Sorting 으로 색상 셋팅 필요 -> 순서 -> (참고 사이트 : https://stackoverflow.com/questions/27702383/c3js-row-data-custom-colors/27717955)
            pattern: ['#009954']
        },
        bar: {
            width: {
                ratio: 0.3
            }
        },
        tooltip: {
            format: {
                value: function (value, ratio, id, index) {
                    var vValue = String(value);
                    var format = vValue.substring(0, 3) + "억 ";                    

                    var vTooltip = index;

                    return format;
                }
            }
        }
    });

    setTimeout(function () {
        c3_barChart_item01.load({
            columns: [
                ['data1', 317, 314, 272]
            ],
            axis: {
                x: {
                    type: 'category'
                },
                y: {
                    show: false
                }
            },
        });
    }, 500);	

    //매출액 당기순이익
    var c3_barChart_item02 = c3.generate({
        bindto: "#finance_c3_item02",
        size: {
            width: 250,
            height: 250
        },
        data: {
            columns: [
                ['data1', 0, 0, 0]
            ],
            names: {
                CNT: 'Total' //컬럼명 따라감.
            },
            type: 'bar'
        },
        grid: {
            x: {
                show: true
            },
            y: {
                show: true
            }
        },
        legend: {
            show: false
        },
        axis: {
            x: {
                type: 'category',
                categories: ['2017년', '2018년', '2019년']
            },
            y: {
                max: 20,
                min: 2,
                show: true
            }
        },
        color: {    //데이터별 Sorting 으로 색상 셋팅 필요 -> 순서 -> (참고 사이트 : https://stackoverflow.com/questions/27702383/c3js-row-data-custom-colors/27717955)
            pattern: ['#009954']
        },
        bar: {
            width: {
                ratio: 0.3
            }
        },
        tooltip: {
            format: {
                value: function (value, ratio, id, index) {
                    var vValue = String(value);
                    var format = vValue.substring(0, 2) + "억 ";
                    return format;
                }
            }
        }
    });

    setTimeout(function () {
        c3_barChart_item02.load({
            columns: [
                ['data1', 16, 7, 16]
            ],
            keys: {
                x: 'year',
                value: ['cost']
            }
        });
    }, 1000);    
});

////////////////////////function///////////////////////

/////////////////function MakeList/////////////////////

////////////////////////API////////////////////////////

