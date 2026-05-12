<template>
  <div>
    <a-select v-model="companyId" placeholder="请选择" :options="list" @change="change">
    </a-select>
  </div>
</template>


<script>
import { request, METHOD } from '@/utils/request';
import { OEM_COMPANY_LIST } from '@/services/api';

export default {
  name: 'CompanySelect',
  props: {
    value: String
  },
  data() {
    return {
      list: [],
      companyId: this.value
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
    request(OEM_COMPANY_LIST, METHOD.GET, { current: 1, size: 1000000 }).then((res) => {
      const r = res.data;
      if (r.code !== 200) {
        return;
      }
      const data = r.data;
      that.list = [{
        value: '',
        label: '\u3000',
      }];
      for (var idx in data.records) {
        const item = data.records[idx];
        that.list.push({ key: item.id, title: item.name + " | " + item.id });
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
      this.companyId = newValue;
    }
  }
};
</script>

<style scoped lang="less"></style>