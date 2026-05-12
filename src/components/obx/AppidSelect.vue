<template>
  <div>
    <a-select v-model="appId" placeholder="请选择" :options="list" @change="change">
    </a-select>
  </div>
</template>


<script>
import { request, METHOD } from '@/utils/request';
import { APPID_LIST } from '@/services/api';

export default {
  name: 'AppidSelect',
  props: {
    value: String
  },
  data() {
    return {
      list: [],
      appId: this.value
    };
  },
  methods: {
    change(value, option) {
      this.appId = value;
      this.$emit('newValue', this.appId);
    }
  },
  created() {
    const that = this;
    request(APPID_LIST, METHOD.GET, { current: 1, size: 1000000 }).then((res) => {
      const r = res.data;
      if (r.code !== 200) {
        return;
      }
      const data = r.data;
      that.list = [];
      that.list = [{
        value: '',
        label: '\u3000',
      }];
      for (var idx in data.records) {
        const item = data.records[idx];
        that.list.push({ key: item.appId, title: item.name + " | " + item.appId });
      }
    });
  },
  mounted() {
    
  },
  computed: {
  },
  model: {
    prop: 'value',
    event: 'newValue',
  },
  watch: {
    value(newValue, oldValue) {
      this.appId = newValue;
    }
  }
};
</script>

<style scoped lang="less"></style>