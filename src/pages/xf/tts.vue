<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card title="语音合成">
      <a-form>
        <a-form-item name="vcn" label="发音人" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-select v-model:value="updateUIForm['vcn']" :options="options">
          </a-select>
        </a-form-item>
        <a-form-item name="content" label="内容" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-textarea v-model:value="updateUIForm['content']"></a-textarea>
        </a-form-item>
        <a-form-item name="speed" label="语速" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-slider v-model:value="updateUIForm['speed']" :min="1" :max="100" />
        </a-form-item>
        <a-form-item name="speed" label="音量" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-slider v-model:value="updateUIForm['volume']" :min="1" :max="100" />
        </a-form-item>
        <a-form-item name="speed" label="音高" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-slider v-model:value="updateUIForm['pitch']" :min="1" :max="100" />
        </a-form-item>
        <a-form-item name="content" label="试听" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <audio :src="dataurl" controls="controls"></audio>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 10, offset: 7 }">
          <a-button type="primary" @click="compound()">合成</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { tts, vcnList } from '@/services/xf';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'tts',
  components: { StandardTable },
  data() {
    return {
      updateUIForm: {
        vcn: 'xiaoyan',
        content: '',
        speed: 50,
        volume: 50,
        pitch: 50,
      },
      dataurl: '',
      options: []
    };
  },
  methods: {
    init() {
      const that = this;
      that.queryVcnList();
    },
    queryVcnList() {
      const that = this;
      vcnList({}).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        const data = r.data;
        that.options = [];
        for (let idx in data.list) {
          let item = data.list[idx];
          that.options.push({
            value: item,
            label: item,
          });
        }
      });
    },
    compound() {
      const that = this;
      tts({...that.updateUIForm}).then((res) => {
        const r = res.data;
        if (r.code != 200) {
          return;
        }
        that.$message.success('合成成功');
        const data = r.data;
        this.dataurl = 'data:audio/mp3;base64,' + data;
      });
    },
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState('setting', ['pageMinHeight']),
    desc() {
      return this.$t('description');
    }
  }
};
</script>
      
<style scoped lang="less">
@import "index";

.search {
  margin-bottom: 54px;
}

.operator {
  margin-bottom: 18px;
}
</style>