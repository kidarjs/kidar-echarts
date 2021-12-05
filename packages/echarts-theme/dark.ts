const KidarDarkTheme = {
  "color": [
    "#00f8fb", "#00fe65", "#fbd161", "#fc5051", "#f87d5a", "#7b2cff", "#92e1ff", "#2ca1ff", "#ff7ccc",
    '#09fdb2', '#00da01', '#ff964b', '#ff00ff', '#ff6347', '#4705b5', '#1890ff', '#f5616f', '#ea60ff'
  ],
  "backgroundColor": "#09234c",
  "textStyle": {},
  "title": {
    "textStyle": {
      "color": "#ffffff"
    },
    "subtextStyle": {
      "color": "#baacac"
    }
  },
  "lines": {
    "lineStyle": {
      width: 1, //线条宽度
      opacity: 0.1, //尾迹线条透明度
      curveness: .3 //尾迹线条曲直度
    }
  },
  "line": {
    "itemStyle": {
      "borderWidth": "4",
      "borderColor": "#0a2f5e"
    },
    "lineStyle": {
      "width": 1
    },
    "symbolSize": 12,
    "symbol": "circle",
    "smooth": true
  },
  "radar": {
    "itemStyle": {
      "borderWidth": "3"
    },
    "lineStyle": {
      "width": 2
    },
    "symbolSize": 4,
    "symbol": "emptyCircle",
    "smooth": true
  },
  "bar": {
    "itemStyle": {
      "barBorderWidth": "0",
      "barBorderColor": "rgba(255,255,255,0.83)"
    }
  },
  "pie": {
    "itemStyle": {
      "borderWidth": "1",
      "borderColor": "rgba(255,255,255,0.8)"
    }
  },
  "scatter": {
    "itemStyle": {
      "borderWidth": "0",
      "borderColor": "rgba(255,255,255,0.83)"
    }
  },
  "boxplot": {
    "itemStyle": {
      "borderWidth": "0",
      "borderColor": "rgba(255,255,255,0.83)"
    }
  },
  "parallel": {
    "itemStyle": {
      "borderWidth": "0",
      "borderColor": "rgba(255,255,255,0.83)"
    }
  },
  "sankey": {
    "itemStyle": {
      "borderWidth": "0",
      "borderColor": "rgba(255,255,255,0.83)"
    }
  },
  "funnel": {
    "itemStyle": {
      "borderWidth": "0",
      "borderColor": "rgba(255,255,255,0.83)"
    }
  },
  "gauge": {
    "itemStyle": {
      "borderWidth": "0",
      "borderColor": "rgba(255,255,255,0.83)"
    }
  },
  "candlestick": {
    "itemStyle": {
      "color": "#eb5454",
      "color0": "#47b262",
      "borderColor": "#eb5454",
      "borderColor0": "#47b262",
      "borderWidth": 1
    }
  },
  "graph": {
    itemStyle: {
      shadowBlur: 100
    },
    "lineStyle": {
      "width": 1,
    },
    "symbolSize": 4,
    "smooth": true,
    "color": [
      "#00f8fb", "#00fe65", "#fbd161", "#fc5051", "#f87d5a", "#7b2cff", "#92e1ff", "#2ca1ff", "#ea7ccc",
      '#09fdb2', '#00da01', '#b8860b', '#ff00ff', '#ff6347', '#4705b5', '#0780cf', '#f5616f', '#765005'
    ],
    "label": {
    }
  },
  "map": {
    "itemStyle": {
      "areaColor": "#eee",
      "borderColor": "#444",
      "borderWidth": 0.5
    },
    "label": {
      "color": "#000"
    },
    "emphasis": {
      "itemStyle": {
        "areaColor": "rgba(255,215,0,0.8)",
        "borderColor": "#444",
        "borderWidth": 1
      },
      "label": {
        "color": "rgb(100,0,0)"
      }
    }
  },
  "geo": {
    "itemStyle": {
      "areaColor": {
        type: 'radial',
        x: 0.5,
        y: 0.5,
        r: 0.8,
        colorStops: [{
          offset: 0,
          color: '#09234c' // 0% 处的颜色
        }, {
          offset: 1,
          color: '#274d68'  // 100% 处的颜色
        }],
        globalCoord: true // 缺省为 false
      },
      "borderColor": "#00f8fb",
      "borderWidth": 1
    },
    "label": {
      "color": "#000"
    },
    "emphasis": {
      "itemStyle": {
        "areaColor": "rgba(255,215,0,0.8)",
        "borderColor": "#444",
        "borderWidth": 1
      },
      "label": {
        "color": "rgb(100,0,0)"
      }
    }
  },
  "categoryAxis": {
    "axisLine": {
      "show": true,
      "lineStyle": {
        "color": "#6E7079"
      }
    },
    "axisTick": {
      "show": false,
      "lineStyle": {
        "color": "#6E7079"
      }
    },
    "axisLabel": {
      "show": true,
      "color": "#c7c7c7"
    },
    "splitLine": {
      "show": false,
      "lineStyle": {
        "color": [
          "#E0E6F1"
        ]
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": [
          "rgba(250,250,250,0.2)",
          "rgba(210,219,238,0.2)"
        ]
      }
    }
  },
  "valueAxis": {
    "axisLine": {
      "show": true,
      "lineStyle": {
        "color": "#6E7079"
      }
    },
    "axisTick": {
      "show": false,
      "lineStyle": {
        "color": "#6E7079"
      }
    },
    "axisLabel": {
      "show": true,
      "color": "#c7c7c7"
    },
    "splitLine": {
      "show": false,
      "lineStyle": {
        "color": [
          "#E0E6F1"
        ]
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": [
          "rgba(250,250,250,0.2)",
          "rgba(210,219,238,0.2)"
        ]
      }
    }
  },
  "logAxis": {
    "axisLine": {
      "show": true,
      "lineStyle": {
        "color": "#6E7079"
      }
    },
    "axisTick": {
      "show": false,
      "lineStyle": {
        "color": "#6E7079"
      }
    },
    "axisLabel": {
      "show": true,
      "color": "#c7c7c7"
    },
    "splitLine": {
      "show": false,
      "lineStyle": {
        "color": [
          "#E0E6F1"
        ]
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": [
          "rgba(250,250,250,0.2)",
          "rgba(210,219,238,0.2)"
        ]
      }
    }
  },
  "timeAxis": {
    "axisLine": {
      "show": true,
      "lineStyle": {
        "color": "#6E7079"
      }
    },
    "axisTick": {
      "show": true,
      "lineStyle": {
        "color": "#6E7079"
      }
    },
    "axisLabel": {
      "show": true,
      "color": "#c7c7c7"
    },
    "splitLine": {
      "show": false,
      "lineStyle": {
        "color": [
          "#E0E6F1"
        ]
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": [
          "rgba(250,250,250,0.2)",
          "rgba(210,219,238,0.2)"
        ]
      }
    }
  },
  "toolbox": {
    "iconStyle": {
      "borderColor": "#6e6d6d"
    },
    "emphasis": {
      "iconStyle": {
        "borderColor": "#c7c7c7"
      }
    }
  },
  "legend": {
    "textStyle": {
      "color": "#c7c7c7"
    },
    pageIconInactiveColor: "#666666",
    pageIconColor: "#ffffff"
  },
  "tooltip": {
    show: true,
    "axisPointer": {
      "lineStyle": {
        "color": "#ccc",
        "width": 1
      },
      "crossStyle": {
        "color": "#ccc",
        "width": 1
      }
    }
  },
  "timeline": {
    "lineStyle": {
      "color": "#96ebf0",
      "width": "2"
    },
    "itemStyle": {
      "color": "#bbdee0",
      "borderWidth": 1
    },
    "controlStyle": {
      "color": "#f7f7f7",
      "borderColor": "#85ebf7",
      "borderWidth": "1"
    },
    "checkpointStyle": {
      "color": "#30f2f2",
      "borderColor": "fff"
    },
    "label": {
      "color": "#c7c7c7"
    },
    "emphasis": {
      "itemStyle": {
        "color": "#FFF"
      },
      "controlStyle": {
        "color": "#f7f7f7",
        "borderColor": "#85ebf7",
        "borderWidth": "1"
      },
      "label": {
        "color": "#c7c7c7"
      }
    }
  },
  "visualMap": {
    "color": [
      "#166d8a",
      "#11a7d6",
      "#a6f1f6"
    ]
  },
  "dataZoom": {
    "handleSize": "undefined%",
    "textStyle": {}
  },
  "markPoint": {
    "label": {
      "color": "#ffffff"
    },
    "emphasis": {
      "label": {
        "color": "#ffffff"
      }
    }
  }
}

export { KidarDarkTheme as default }
