<template>
  <div style="text-align: center;">
    <h3 class="title">Kidar-vue-echarts</h3>
    <div class="tools-bar">
      <button @click="switchType('pie')">pie</button>
      <button @click="switchType('line')">line</button>
      <button @click="switchType('dybar')">dybar（动态排序）</button>
      <button @click="switchType('map')">Map</button>
    </div>
    <ki-echarts-plus :type="type" :data="data" :is-dynamic="isDynamic" class="echarts-block" />
  </div>
</template>

<script>
import Mock from "mockjs";
import KiEchartsPlus from "@/index";

export default {
  components: { KiEchartsPlus },
  data () {
    return {
      type: "pie",
      data: [],
      isDynamic: false,
      setIntervalId: null
    };
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.data = Mock.mock({
        "data|20": [
          {
            name: "@province",
            value: "@natural(160, 100000)"
          }
        ]
      }).data;
    },
    dynamicLoadData () {
      this.setIntervalId = setInterval(() => {
        for (let i = 0; i < this.data.length; i++) {
          // this.$set(this.data, i, this.data)
        }
        this.data.forEach(item => {
          item.value += Mock.mock('@natural(60, 10000)')
        })
      }, 3000);
    },
    switchType (type) {
      this.isDynamic = type.startsWith('dy')
      if (this.isDynamic) {
        this.dynamicLoadData()
      } else {
        this.setIntervalId && clearInterval(this.setIntervalId)
      }
      this.type = type;
    },
  },
};
</script>

<style scoped>
  .tools-bar button {
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif, "微软雅黑";
    margin: 0 12px;
  }
  .echarts-block {
    width: 600px;
    height: 420px;
    margin: 0 auto;
  }
</style>